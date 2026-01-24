// Test script for NFT Frame Studio MCP Server
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Popular NFT contracts for testing
const TEST_NFTS = [
  {
    name: 'Bored Ape Yacht Club',
    contract: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    tokenId: '1',
    network: 'ethereum'
  },
  {
    name: 'Azuki',
    contract: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
    tokenId: '1',
    network: 'ethereum'
  },
  {
    name: 'Doodles',
    contract: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e',
    tokenId: '100',
    network: 'ethereum'
  }
];

async function sendMCPRequest(toolName, args) {
  return new Promise((resolve, reject) => {
    const server = spawn('node', [join(__dirname, 'mcp-server.js')]);
    
    let responseData = '';
    let errorData = '';
    
    server.stdout.on('data', (data) => {
      responseData += data.toString();
    });
    
    server.stderr.on('data', (data) => {
      errorData += data.toString();
      // Filter out server startup messages
      if (!data.toString().includes('MCP server running')) {
        console.error('Server stderr:', data.toString());
      }
    });
    
    server.on('close', (code) => {
      if (code !== 0 && code !== null) {
        reject(new Error(`Server exited with code ${code}\n${errorData}`));
      } else {
        try {
          const lines = responseData.split('\n').filter(line => line.trim());
          const lastLine = lines[lines.length - 1];
          if (lastLine) {
            resolve(JSON.parse(lastLine));
          } else {
            resolve({ content: [{ type: 'text', text: responseData }] });
          }
        } catch (e) {
          resolve({ content: [{ type: 'text', text: responseData }] });
        }
      }
    });
    
    // Send MCP request
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      }
    };
    
    server.stdin.write(JSON.stringify(request) + '\n');
    server.stdin.end();
    
    // Timeout after 30 seconds
    setTimeout(() => {
      server.kill();
      reject(new Error('Request timeout'));
    }, 30000);
  });
}

async function testFetchMetadata() {
  console.log('\n=== Testing NFT Metadata Fetching ===\n');
  
  for (const nft of TEST_NFTS) {
    console.log(`Testing: ${nft.name}`);
    console.log(`Contract: ${nft.contract}`);
    console.log(`Token ID: ${nft.tokenId}`);
    
    try {
      const result = await sendMCPRequest('fetch_nft_metadata', {
        contractAddress: nft.contract,
        tokenId: nft.tokenId,
        network: nft.network
      });
      
      const data = JSON.parse(result.content[0].text);
      
      if (data.success) {
        console.log('✓ Success!');
        console.log(`  Name: ${data.data.name}`);
        console.log(`  Image: ${data.data.image?.substring(0, 50)}...`);
        console.log(`  Description: ${data.data.description?.substring(0, 100)}...`);
      } else {
        console.log('✗ Failed:', data.error);
      }
    } catch (error) {
      console.log('✗ Error:', error.message);
    }
    
    console.log('---');
  }
}

async function testValidateContract() {
  console.log('\n=== Testing Contract Validation ===\n');
  
  for (const nft of TEST_NFTS.slice(0, 2)) {
    console.log(`Validating: ${nft.name}`);
    console.log(`Contract: ${nft.contract}`);
    
    try {
      const result = await sendMCPRequest('validate_nft_contract', {
        contractAddress: nft.contract,
        network: nft.network
      });
      
      const data = JSON.parse(result.content[0].text);
      
      if (data.success && data.isValid) {
        console.log('✓ Valid ERC-721 contract');
        console.log(`  Name: ${data.details.name}`);
        console.log(`  Symbol: ${data.details.symbol}`);
        console.log(`  Total Supply: ${data.details.totalSupply}`);
      } else {
        console.log('✗ Invalid or failed:', data.error);
      }
    } catch (error) {
      console.log('✗ Error:', error.message);
    }
    
    console.log('---');
  }
}

async function testListPopularNFTs() {
  console.log('\n=== Testing List Popular NFTs ===\n');
  
  try {
    const result = await sendMCPRequest('list_popular_nfts', {});
    const data = JSON.parse(result.content[0].text);
    
    if (data.success) {
      console.log('✓ Retrieved popular NFT collections:');
      data.collections.forEach(nft => {
        console.log(`  - ${nft.name}: ${nft.contract}`);
      });
    } else {
      console.log('✗ Failed:', data.error);
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
}

async function testGenerateFrame() {
  console.log('\n=== Testing Frame Generation ===\n');
  
  const testNFT = TEST_NFTS[0];
  console.log(`Generating frame for: ${testNFT.name}`);
  console.log(`Token ID: ${testNFT.tokenId}`);
  
  try {
    const outputPath = join(__dirname, 'test-frame-output.png');
    
    const result = await sendMCPRequest('generate_nft_frame', {
      contractAddress: testNFT.contract,
      tokenId: testNFT.tokenId,
      network: testNFT.network,
      printWidth: 8,
      printHeight: 10,
      borderSize: 1,
      frameMaterial: 'metal-gold',
      qrPosition: 'bottom-center',
      qrSize: 'medium',
      outputPath: outputPath
    });
    
    const data = JSON.parse(result.content[0].text);
    
    if (data.success) {
      console.log('✓ Frame generated successfully!');
      console.log(`  Dimensions: ${data.dimensions}`);
      console.log(`  Resolution: ${data.resolution}`);
      console.log(`  Saved to: ${data.filePath}`);
    } else {
      console.log('✗ Failed:', data.error);
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  NFT Frame Studio MCP Server Test Suite   ║');
  console.log('╚════════════════════════════════════════════╝');
  
  try {
    await testListPopularNFTs();
    await testValidateContract();
    await testFetchMetadata();
    await testGenerateFrame();
    
    console.log('\n=== All Tests Complete ===\n');
  } catch (error) {
    console.error('Test suite error:', error);
  }
}

runAllTests();
