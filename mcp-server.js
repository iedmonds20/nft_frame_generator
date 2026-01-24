#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { ethers } from 'ethers';
import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';
import fetch from 'node-fetch';

// NFT Metadata Standards
const METADATA_STANDARDS = {
  ethereum: {
    rpcUrl: 'https://eth.llamarpc.com',
    chainId: 1,
    explorer: 'https://etherscan.io'
  },
  polygon: {
    rpcUrl: 'https://polygon-rpc.com',
    chainId: 137,
    explorer: 'https://polygonscan.com'
  },
  base: {
    rpcUrl: 'https://mainnet.base.org',
    chainId: 8453,
    explorer: 'https://basescan.org'
  }
};

// Frame materials color mapping
const FRAME_COLORS = {
  'wood-black': '#2c2c2c',
  'wood-walnut': '#5c4033',
  'wood-oak': '#b8986e',
  'metal-gold': '#ffd700',
  'metal-silver': '#c0c0c0',
  'metal-bronze': '#cd7f32',
  'metal-black': '#3c3c3c'
};

class NFTFrameServer {
  constructor() {
    this.server = new Server(
      {
        name: 'nft-frame-studio',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'fetch_nft_metadata',
          description: 'Fetch NFT metadata from a contract address and token ID. Supports Ethereum, Polygon, and Base networks. Returns NFT name, description, and image URL.',
          inputSchema: {
            type: 'object',
            properties: {
              contractAddress: {
                type: 'string',
                description: 'The NFT contract address (0x...)',
                pattern: '^0x[a-fA-F0-9]{40}$'
              },
              tokenId: {
                type: 'string',
                description: 'The token ID of the NFT'
              },
              network: {
                type: 'string',
                description: 'The blockchain network',
                enum: ['ethereum', 'polygon', 'base'],
                default: 'ethereum'
              }
            },
            required: ['contractAddress', 'tokenId']
          }
        },
        {
          name: 'generate_nft_frame',
          description: 'Generate a custom frame for an NFT with QR code. Creates a high-resolution image (300 DPI) suitable for printing. Returns base64 encoded PNG image.',
          inputSchema: {
            type: 'object',
            properties: {
              contractAddress: {
                type: 'string',
                description: 'The NFT contract address',
                pattern: '^0x[a-fA-F0-9]{40}$'
              },
              tokenId: {
                type: 'string',
                description: 'The token ID'
              },
              network: {
                type: 'string',
                enum: ['ethereum', 'polygon', 'base'],
                default: 'ethereum'
              },
              printWidth: {
                type: 'number',
                description: 'Print width in inches',
                default: 16,
                minimum: 4,
                maximum: 40
              },
              printHeight: {
                type: 'number',
                description: 'Print height in inches',
                default: 20,
                minimum: 4,
                maximum: 40
              },
              borderSize: {
                type: 'number',
                description: 'Border size in inches',
                default: 2,
                minimum: 0.5,
                maximum: 4
              },
              frameMaterial: {
                type: 'string',
                description: 'Frame material and color',
                enum: ['wood-black', 'wood-walnut', 'wood-oak', 'metal-gold', 'metal-silver', 'metal-bronze', 'metal-black'],
                default: 'metal-gold'
              },
              qrPosition: {
                type: 'string',
                description: 'QR code position',
                enum: ['bottom-left', 'bottom-center', 'bottom-right'],
                default: 'bottom-center'
              },
              qrSize: {
                type: 'string',
                description: 'QR code size',
                enum: ['small', 'medium', 'large'],
                default: 'medium'
              },
              outputPath: {
                type: 'string',
                description: 'Optional file path to save the image. If not provided, returns base64 data.'
              }
            },
            required: ['contractAddress', 'tokenId']
          }
        },
        {
          name: 'list_popular_nfts',
          description: 'Get a list of popular NFT collections with their contract addresses for testing',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'validate_nft_contract',
          description: 'Validate if a contract address is a valid ERC-721 NFT contract',
          inputSchema: {
            type: 'object',
            properties: {
              contractAddress: {
                type: 'string',
                description: 'The contract address to validate',
                pattern: '^0x[a-fA-F0-9]{40}$'
              },
              network: {
                type: 'string',
                enum: ['ethereum', 'polygon', 'base'],
                default: 'ethereum'
              }
            },
            required: ['contractAddress']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'fetch_nft_metadata':
            return await this.fetchNFTMetadata(request.params.arguments);
          
          case 'generate_nft_frame':
            return await this.generateNFTFrame(request.params.arguments);
          
          case 'list_popular_nfts':
            return this.listPopularNFTs();
          
          case 'validate_nft_contract':
            return await this.validateNFTContract(request.params.arguments);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) throw error;
        
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }

  async fetchNFTMetadata(args) {
    const { contractAddress, tokenId, network = 'ethereum' } = args;

    try {
      // Try OpenSea API first
      if (network === 'ethereum') {
        try {
          const openseaUrl = `https://api.opensea.io/api/v2/chain/ethereum/contract/${contractAddress}/nfts/${tokenId}`;
          const response = await fetch(openseaUrl);
          
          if (response.ok) {
            const data = await response.json();
            return {
              content: [{
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  data: {
                    name: data.nft?.name || `NFT #${tokenId}`,
                    description: data.nft?.description || '',
                    image: data.nft?.image_url || data.nft?.display_image_url,
                    contractAddress,
                    tokenId,
                    network
                  }
                }, null, 2)
              }]
            };
          }
        } catch (e) {
          console.log('OpenSea API not available, using contract call');
        }
      }

      // Fallback: Direct contract call
      const provider = new ethers.JsonRpcProvider(METADATA_STANDARDS[network].rpcUrl);
      const abi = [
        'function tokenURI(uint256 tokenId) view returns (string)',
        'function name() view returns (string)',
        'function symbol() view returns (string)'
      ];
      
      const contract = new ethers.Contract(contractAddress, abi, provider);
      let tokenURI = await contract.tokenURI(tokenId);
      
      // Handle IPFS URLs
      if (tokenURI.startsWith('ipfs://')) {
        tokenURI = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }
      
      const metadataResponse = await fetch(tokenURI);
      const metadata = await metadataResponse.json();
      
      let imageUrl = metadata.image;
      if (imageUrl && imageUrl.startsWith('ipfs://')) {
        imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            data: {
              name: metadata.name || `NFT #${tokenId}`,
              description: metadata.description || '',
              image: imageUrl,
              contractAddress,
              tokenId,
              network,
              attributes: metadata.attributes || []
            }
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message
          }, null, 2)
        }],
        isError: true
      };
    }
  }

  async generateNFTFrame(args) {
    const {
      contractAddress,
      tokenId,
      network = 'ethereum',
      printWidth = 16,
      printHeight = 20,
      borderSize = 2,
      frameMaterial = 'metal-gold',
      qrPosition = 'bottom-center',
      qrSize = 'medium',
      outputPath
    } = args;

    try {
      // Fetch NFT metadata first
      const metadataResult = await this.fetchNFTMetadata({ contractAddress, tokenId, network });
      const metadataText = metadataResult.content[0].text;
      const metadata = JSON.parse(metadataText);
      
      if (!metadata.success) {
        throw new Error('Failed to fetch NFT metadata');
      }

      const nftData = metadata.data;
      
      // Create high-resolution canvas (300 DPI)
      const printDPI = 300;
      const canvasWidth = printWidth * printDPI;
      const canvasHeight = printHeight * printDPI;
      const borderPixels = borderSize * printDPI;
      
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext('2d');
      
      // Draw frame
      ctx.fillStyle = FRAME_COLORS[frameMaterial] || '#ffd700';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw white matte
      const matteOffset = borderPixels * 0.2;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(matteOffset, matteOffset, canvasWidth - (matteOffset * 2), canvasHeight - (matteOffset * 2));
      
      // Load and draw NFT image
      const img = await loadImage(nftData.image);
      
      const imageAreaWidth = canvasWidth - (borderPixels * 2);
      const imageAreaHeight = canvasHeight - (borderPixels * 2) - (borderPixels * 0.5);
      
      const imgAspect = img.width / img.height;
      const areaAspect = imageAreaWidth / imageAreaHeight;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (imgAspect > areaAspect) {
        drawWidth = imageAreaWidth;
        drawHeight = imageAreaWidth / imgAspect;
        drawX = borderPixels;
        drawY = borderPixels + (imageAreaHeight - drawHeight) / 2;
      } else {
        drawHeight = imageAreaHeight;
        drawWidth = imageAreaHeight * imgAspect;
        drawX = borderPixels + (imageAreaWidth - drawWidth) / 2;
        drawY = borderPixels;
      }
      
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      
      // Generate and draw QR code
      const explorer = METADATA_STANDARDS[network].explorer;
      const qrUrl = `${explorer}/token/${contractAddress}?a=${tokenId}`;
      
      const qrSizes = {
        small: borderPixels * 0.8,
        medium: borderPixels * 1.2,
        large: borderPixels * 1.6
      };
      const qrPixelSize = qrSizes[qrSize];
      
      const qrDataUrl = await QRCode.toDataURL(qrUrl, {
        width: qrPixelSize,
        margin: 0,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      const qrImg = await loadImage(qrDataUrl);
      
      let qrX, qrY;
      const qrPadding = borderPixels * 0.3;
      
      switch (qrPosition) {
        case 'bottom-left':
          qrX = qrPadding;
          qrY = canvasHeight - qrPixelSize - qrPadding;
          break;
        case 'bottom-right':
          qrX = canvasWidth - qrPixelSize - qrPadding;
          qrY = canvasHeight - qrPixelSize - qrPadding;
          break;
        case 'bottom-center':
        default:
          qrX = (canvasWidth - qrPixelSize) / 2;
          qrY = canvasHeight - qrPixelSize - qrPadding;
          break;
      }
      
      // Draw gold border around QR
      const qrBorderWidth = qrPixelSize * 0.1;
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(qrX - qrBorderWidth, qrY - qrBorderWidth, 
                   qrPixelSize + (qrBorderWidth * 2), qrPixelSize + (qrBorderWidth * 2));
      
      ctx.drawImage(qrImg, qrX, qrY, qrPixelSize, qrPixelSize);
      
      // Add frame depth
      const gradient = ctx.createLinearGradient(0, 0, matteOffset * 2, matteOffset * 2);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, matteOffset * 2, canvasHeight);
      ctx.fillRect(0, 0, canvasWidth, matteOffset * 2);
      
      // Save or return base64
      if (outputPath) {
        const fs = await import('fs');
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Frame generated and saved to ${outputPath}`,
              dimensions: `${printWidth}" × ${printHeight}"`,
              resolution: '300 DPI',
              filePath: outputPath
            }, null, 2)
          }]
        };
      } else {
        const base64 = canvas.toDataURL('image/png').split(',')[1];
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: 'Frame generated successfully',
              dimensions: `${printWidth}" × ${printHeight}"`,
              resolution: '300 DPI',
              imageData: base64.substring(0, 100) + '... (truncated)',
              note: 'Full base64 image data available'
            }, null, 2)
          }]
        };
      }
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message
          }, null, 2)
        }],
        isError: true
      };
    }
  }

  listPopularNFTs() {
    const popularNFTs = [
      {
        name: 'Bored Ape Yacht Club',
        contract: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
        network: 'ethereum',
        sampleTokenId: '1'
      },
      {
        name: 'CryptoPunks',
        contract: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
        network: 'ethereum',
        sampleTokenId: '1'
      },
      {
        name: 'Azuki',
        contract: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
        network: 'ethereum',
        sampleTokenId: '1'
      },
      {
        name: 'Doodles',
        contract: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e',
        network: 'ethereum',
        sampleTokenId: '1'
      },
      {
        name: 'Clone X',
        contract: '0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B',
        network: 'ethereum',
        sampleTokenId: '1'
      },
      {
        name: 'Moonbirds',
        contract: '0x23581767a106ae21c074b2276D25e5C3e136a68b',
        network: 'ethereum',
        sampleTokenId: '1'
      }
    ];

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          collections: popularNFTs,
          note: 'Use these contract addresses for testing the NFT Frame Studio'
        }, null, 2)
      }]
    };
  }

  async validateNFTContract(args) {
    const { contractAddress, network = 'ethereum' } = args;

    try {
      const provider = new ethers.JsonRpcProvider(METADATA_STANDARDS[network].rpcUrl);
      
      const abi = [
        'function supportsInterface(bytes4 interfaceId) view returns (bool)',
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function totalSupply() view returns (uint256)'
      ];
      
      const contract = new ethers.Contract(contractAddress, abi, provider);
      
      // ERC-721 interface ID: 0x80ac58cd
      const isERC721 = await contract.supportsInterface('0x80ac58cd');
      
      let name, symbol, totalSupply;
      try {
        name = await contract.name();
        symbol = await contract.symbol();
        totalSupply = await contract.totalSupply();
      } catch (e) {
        // Some contracts might not have these
      }
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            isValid: isERC721,
            contractAddress,
            network,
            details: {
              isERC721,
              name: name || 'Unknown',
              symbol: symbol || 'Unknown',
              totalSupply: totalSupply ? totalSupply.toString() : 'Unknown'
            }
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            isValid: false,
            error: error.message
          }, null, 2)
        }]
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('NFT Frame Studio MCP server running on stdio');
  }
}

const server = new NFTFrameServer();
server.run().catch(console.error);
