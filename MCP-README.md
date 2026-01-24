# NFT Frame Studio - MCP Server

This directory contains both the web application and the MCP (Model Context Protocol) server for NFT Frame Studio.

## Web Application

The web application allows users to create custom frames for their NFTs through a browser interface.

### Files
- `index.html` - Main application interface
- `styles.css` - Mobile-optimized styling
- `app.js` - Client-side logic

### Usage
Simply open `index.html` in a web browser.

## MCP Server

The MCP server provides programmatic access to NFT framing functionality for AI assistants and automation tools.

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure your MCP client to use this server:

**For Claude Desktop** (add to `claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "nft-frame-studio": {
      "command": "node",
      "args": ["C:\\Users\\messe\\nft-framing-app\\mcp-server.js"]
    }
  }
}
```

**For VSCode Copilot** (add to MCP settings):
```json
{
  "mcp-servers": {
    "nft-frame-studio": {
      "command": "node",
      "args": ["C:\\Users\\messe\\nft-framing-app\\mcp-server.js"]
    }
  }
}
```

### Available Tools

#### 1. `fetch_nft_metadata`
Fetch NFT metadata from blockchain contracts.

**Parameters:**
- `contractAddress` (required): NFT contract address
- `tokenId` (required): Token ID
- `network` (optional): 'ethereum', 'polygon', or 'base' (default: 'ethereum')

**Example:**
```javascript
{
  "contractAddress": "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
  "tokenId": "1",
  "network": "ethereum"
}
```

#### 2. `generate_nft_frame`
Generate a custom framed NFT with QR code at 300 DPI.

**Parameters:**
- `contractAddress` (required): NFT contract address
- `tokenId` (required): Token ID
- `network` (optional): Blockchain network
- `printWidth` (optional): Width in inches (4-40, default: 16)
- `printHeight` (optional): Height in inches (4-40, default: 20)
- `borderSize` (optional): Border size in inches (0.5-4, default: 2)
- `frameMaterial` (optional): Frame type
  - Options: 'wood-black', 'wood-walnut', 'wood-oak', 'metal-gold', 'metal-silver', 'metal-bronze', 'metal-black'
  - Default: 'metal-gold'
- `qrPosition` (optional): QR code position
  - Options: 'bottom-left', 'bottom-center', 'bottom-right'
  - Default: 'bottom-center'
- `qrSize` (optional): QR code size ('small', 'medium', 'large', default: 'medium')
- `outputPath` (optional): File path to save image

**Example:**
```javascript
{
  "contractAddress": "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
  "tokenId": "1",
  "printWidth": 16,
  "printHeight": 20,
  "borderSize": 2,
  "frameMaterial": "metal-gold",
  "qrPosition": "bottom-center",
  "qrSize": "medium",
  "outputPath": "output/my-nft-frame.png"
}
```

#### 3. `list_popular_nfts`
Get a list of popular NFT collections for testing.

**Parameters:** None

#### 4. `validate_nft_contract`
Validate if a contract is ERC-721 compliant.

**Parameters:**
- `contractAddress` (required): Contract address to validate
- `network` (optional): Blockchain network (default: 'ethereum')

### Testing

Run the test suite to verify all functionality:

```bash
npm test
```

This will test:
- Fetching metadata from popular NFT collections
- Validating contract addresses
- Generating frames with different configurations
- Listing popular NFTs

### Example MCP Conversation

Once configured, you can interact with the server through your AI assistant:

```
User: "Fetch metadata for Bored Ape #1"
Assistant: [Uses fetch_nft_metadata tool]

User: "Create a 16x20 gold frame with the QR code at the bottom"
Assistant: [Uses generate_nft_frame tool]

User: "What are some popular NFT collections I can try?"
Assistant: [Uses list_popular_nfts tool]
```

## Supported Networks

- **Ethereum**: Full support with OpenSea API fallback
- **Polygon**: Contract-based fetching
- **Base**: Contract-based fetching

## Technical Details

### Image Generation
- **Resolution**: 300 DPI for print quality
- **Format**: PNG with transparency support
- **Canvas**: Node.js canvas library for server-side rendering
- **QR Codes**: qrcode library for blockchain verification links

### NFT Metadata
- Primary: OpenSea API
- Fallback: Direct contract calls via ethers.js
- IPFS support: Automatic gateway resolution

### Frame Features
- White matte board effect
- Multiple material options
- Aspect-ratio preserving image scaling
- Gold-bordered QR codes linking to blockchain explorer
- Subtle depth/shadow effects

## Troubleshooting

### "Cannot find module" errors
Run `npm install` to install all dependencies.

### RPC connection issues
The server uses public RPC endpoints. If you experience issues, you may want to use your own RPC providers (Infura, Alchemy, etc.).

### Image loading failures
Some IPFS gateways may be slow. The server will timeout after 30 seconds.

### Canvas installation on Windows
If canvas installation fails, you may need to install Windows Build Tools:
```bash
npm install --global windows-build-tools
```

## License

MIT License - Free for personal and commercial use.

## Support

For issues or questions about the MCP server, check:
- MCP SDK documentation: https://github.com/modelcontextprotocol
- Ethers.js documentation: https://docs.ethers.org/
