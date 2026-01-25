// App State
const state = {
    nftData: null,
    selectedSize: { width: 16, height: 20 },
    borderSize: 2,
    frameMaterial: 'metal-gold',
    qrPosition: 'bottom-center',
    qrSize: 'medium',
    qrBorderColor: '#ffd700',
    qrBorderWidth: 0.1,
    matColor: '#ffffff',
    contractAddress: '',
    tokenId: '',
    network: 'ethereum'
};

// NFT Metadata Standards
const METADATA_STANDARDS = {
    ethereum: {
        rpcUrl: 'https://eth.llamarpc.com',
        chainId: 1,
        explorer: 'https://etherscan.io'
    }
};

// Popular NFT Collections
const POPULAR_COLLECTIONS = [
    { name: 'Bored Ape Yacht Club', contract: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', icon: '🐵', description: 'The iconic BAYC collection' },
    { name: 'CryptoPunks', contract: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB', icon: '👾', description: 'The original NFT collection' },
    { name: 'Mutant Ape Yacht Club', contract: '0x60E4d786628Fea6478F785A6d7e704777c86a7c6', icon: '🧬', description: 'BAYC mutant serum collection' },
    { name: 'Azuki', contract: '0xED5AF388653567Af2F388E6224dC7C4b3241C544', icon: '🎴', description: 'Anime-inspired avatar collection' },
    { name: 'Doodles', contract: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e', icon: '✏️', description: 'Colorful hand-drawn characters' },
    { name: 'Clone X', contract: '0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B', icon: '🤖', description: 'RTFKT Studios avatar collection' },
    { name: 'Moonbirds', contract: '0x23581767a106ae21c074b2276D25e5C3e136a68b', icon: '🦉', description: 'Proof Collective NFT' },
    { name: 'Pudgy Penguins', contract: '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8', icon: '🐧', description: 'Adorable penguin collection' },
    { name: 'World of Women', contract: '0xe785E82358879F061BC3dcAC6f0444462D4b5330', icon: '👩', description: 'Diverse and powerful women' },
    { name: 'Cool Cats', contract: '0x1A92f7381B9F03921564a437210bB9396471050C', icon: '😺', description: 'Cool cat avatar collection' },
    { name: 'VeeFriends', contract: '0xa3AEe8BcE55BEeA1951EF834B99f3Ac60d1ABeeB', icon: '🦄', description: 'Gary Vee\'s NFT collection' },
    { name: 'Meebits', contract: '0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7', icon: '🧊', description: '3D voxel characters by Larva Labs' },
    { name: 'The Sandbox LAND', contract: '0x50f5474724e0Ee42D9a4e711ccFB275809Fd6d4a', icon: '🏝️', description: 'Virtual real estate NFTs' },
    { name: 'Art Blocks Curated', contract: '0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270', icon: '🎨', description: 'Generative art collection' },
    { name: 'Otherdeed for Otherside', contract: '0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258', icon: '🗺️', description: 'Yuga Labs metaverse land' },
    { name: 'Elemental', contract: '0x60E4d786628Fea6478F785A6d7e704777c86a7c6', icon: '⚡', description: 'Elemental NFT collection' }
];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    console.log('Load NFT Button:', document.getElementById('loadNftBtn'));
    initializeEventListeners();
    initializeAIAssistant();
    initializeCollections();
});

function initializeEventListeners() {
    console.log('Initializing event listeners...');
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetTab = e.target.dataset.tab;
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update tab content
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            document.getElementById(`${targetTab}-tab`).classList.remove('hidden');
            
            // Initialize collections when tab is opened
            if (targetTab === 'collections') {
                initializeCollections();
            }
        });
    });
    
    // Load NFT (manual entry)
    const loadBtn = document.getElementById('loadNftBtn');
    if (loadBtn) {
        console.log('Load NFT button found, attaching listener');
        loadBtn.addEventListener('click', () => {
            console.log('Load NFT button clicked!');
            loadNFT();
        });
    } else {
        console.error('Load NFT button not found!');
    }
    
    // Load wallet NFTs
    const loadWalletBtn = document.getElementById('loadWalletBtn');
    if (loadWalletBtn) {
        loadWalletBtn.addEventListener('click', loadWalletNFTs);
    }
    
    // Size selection
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.selectedSize = {
                width: parseInt(e.target.dataset.width),
                height: parseInt(e.target.dataset.height)
            };
            updateSelectedInfo();
            generatePreview();
        });
    });
    
    // Border size
    document.querySelectorAll('[data-border]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-border]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.borderSize = parseFloat(e.target.dataset.border);
            generatePreview();
        });
    });
    
    // Frame material
    document.querySelectorAll('[data-material]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-material]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.frameMaterial = e.target.dataset.material;
            generatePreview();
        });
    });
    
    // QR position
    document.querySelectorAll('[data-qr-position]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-qr-position]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.qrPosition = e.target.dataset.qrPosition;
            generatePreview();
        });
    });
    
    // QR size
    document.querySelectorAll('[data-qr-size]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-qr-size]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.qrSize = e.target.dataset.qrSize;
            generatePreview();
        });
    });
    
    // QR border color
    document.querySelectorAll('[data-qr-border-color]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-qr-border-color]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.qrBorderColor = e.target.dataset.qrBorderColor;
            generatePreview();
        });
    });
    
    // QR border width
    document.querySelectorAll('[data-qr-border-width]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-qr-border-width]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.qrBorderWidth = parseFloat(e.target.dataset.qrBorderWidth);
            generatePreview();
        });
    });
    
    // Mat board color
    document.querySelectorAll('[data-mat-color]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-mat-color]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.matColor = e.target.dataset.matColor;
            generatePreview();
        });
    });
    
    // Generate and Download
    document.getElementById('generateBtn').addEventListener('click', generatePreview);
    document.getElementById('downloadBtn').addEventListener('click', downloadFrame);
    document.getElementById('uploadIpfsBtn').addEventListener('click', uploadToIPFS);
    document.getElementById('copyIpfsBtn').addEventListener('click', copyIPFSLink);
}

async function loadNFT() {
    console.log('=== loadNFT called ===');
    
    // Check if ethers.js is loaded
    if (typeof ethers === 'undefined') {
        showError('Required library not loaded. Please refresh the page.');
        console.error('ethers.js library is not loaded');
        return;
    }
    
    try {
        const contractInput = document.getElementById('contract').value.trim();
        const tokenIdInput = document.getElementById('tokenId').value.trim();
        const network = document.getElementById('network').value;
        
        console.log('Inputs:', { contractInput, tokenIdInput, network });
        
        // Validation
        if (!contractInput || !tokenIdInput) {
            showError('Please enter both contract address and token ID');
            return;
        }
        
        if (!/^0x[a-fA-F0-9]{40}$/.test(contractInput)) {
            showError('Invalid contract address format');
            return;
        }
        
        // Validate token ID is numeric and reasonable
        if (!/^\d+$/.test(tokenIdInput)) {
            showError('Token ID must be a positive number');
            return;
        }
        
        if (tokenIdInput.length > 78) { // uint256 max is ~78 digits
            showError('Token ID is too large');
            return;
        }
        
        state.contractAddress = contractInput;
        state.tokenId = tokenIdInput;
        state.network = network;
        
        showLoading(true);
        hideError();
        
        console.log('Fetching metadata...');
        
        // Fetch NFT metadata
        const metadata = await fetchNFTMetadata(contractInput, tokenIdInput, network);
        
        if (!metadata.image) {
            throw new Error('No image found in NFT metadata');
        }
        
        state.nftData = metadata;
        
        // Display NFT
        console.log('Displaying NFT...');
        displayNFT(metadata);
        
        // Show next sections
        console.log('Showing sections...');
        document.getElementById('nft-preview-section').classList.remove('hidden');
        document.getElementById('ai-assistant-section').classList.remove('hidden');
        document.getElementById('size-selection-section').classList.remove('hidden');
        document.getElementById('frame-customization-section').classList.remove('hidden');
        document.getElementById('preview-section').classList.remove('hidden');
        
        console.log('Sections shown successfully');
        
        // Scroll to next section
        document.getElementById('nft-preview-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Generate initial preview
        console.log('Generating preview...');
        setTimeout(() => {
            try {
                generatePreview();
                console.log('Preview generated successfully');
            } catch (err) {
                console.error('Error generating preview:', err);
                showError('Preview generation failed: ' + err.message);
            }
        }, 500);
        
        showLoading(false);
        console.log('=== loadNFT completed successfully ===');
        
    } catch (error) {
        console.error('=== Error in loadNFT ===', error);
        showError(error.message || 'Failed to load NFT. Please check the contract address and token ID.');
        showLoading(false);
    }
}

// Load NFTs from wallet
async function loadWalletNFTs() {
    const walletAddress = document.getElementById('walletAddress').value.trim();
    
    // Validation
    if (!walletAddress) {
        showError('Please enter a wallet address');
        return;
    }
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        showError('Invalid wallet address format');
        return;
    }
    
    showLoading(true);
    hideError();
    
    try {
        console.log('Fetching NFTs for wallet:', walletAddress);
        
        // Use Alchemy's free public API endpoint
        const alchemyUrl = `https://eth-mainnet.g.alchemy.com/nft/v2/demo/getNFTs?owner=${walletAddress}&withMetadata=true`;
        
        const response = await fetch(alchemyUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch wallet NFTs');
        }
        
        const data = await response.json();
        console.log('Wallet NFTs:', data);
        
        if (!data.ownedNfts || data.ownedNfts.length === 0) {
            showError('No NFTs found in this wallet');
            showLoading(false);
            return;
        }
        
        displayWalletNFTs(data.ownedNfts);
        showLoading(false);
        
    } catch (error) {
        console.error('Error loading wallet NFTs:', error);
        showError('Failed to load wallet NFTs. Please try again.');
        showLoading(false);
    }
}

function displayWalletNFTs(nfts) {
    const grid = document.getElementById('walletNftsGrid');
    grid.innerHTML = '';
    grid.classList.remove('hidden');
    
    // Filter out NFTs without images and limit to first 50
    const validNfts = nfts.filter(nft => {
        const metadata = nft.metadata || {};
        return metadata.image || nft.media?.[0]?.gateway;
    }).slice(0, 50);
    
    if (validNfts.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No NFTs with images found in this wallet.</p>';
        return;
    }
    
    validNfts.forEach(nft => {
        const metadata = nft.metadata || {};
        const imageUrl = metadata.image || nft.media?.[0]?.gateway || nft.media?.[0]?.raw;
        let displayImage = imageUrl;
        
        // Handle IPFS URLs
        if (displayImage && displayImage.startsWith('ipfs://')) {
            displayImage = displayImage.replace('ipfs://', 'https://ipfs.io/ipfs/');
        }
        
        const item = document.createElement('div');
        item.className = 'nft-grid-item';
        item.innerHTML = `
            <img src="${displayImage}" alt="${metadata.name || 'NFT'}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27150%27 height=%27150%27%3E%3Crect fill=%27%23ddd%27 width=%27150%27 height=%27150%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 fill=%27%23999%27%3ENo Image%3C/text%3E%3C/svg%3E'">
            <div class="nft-grid-item-info">
                <div class="nft-grid-item-name">${metadata.name || 'Unnamed NFT'}</div>
                <div class="nft-grid-item-id">ID: ${nft.id.tokenId}</div>
            </div>
        `;
        
        item.addEventListener('click', () => {
            // Remove selection from all items
            document.querySelectorAll('.nft-grid-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            
            // Populate the manual entry fields
            document.getElementById('contract').value = nft.contract.address;
            document.getElementById('tokenId').value = parseInt(nft.id.tokenId, 16) || nft.id.tokenId;
            
            // Switch to manual tab and trigger load
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-tab="manual"]').classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            document.getElementById('manual-tab').classList.remove('hidden');
            
            // Auto-load the NFT
            setTimeout(() => loadNFT(), 300);
        });
        
        grid.appendChild(item);
    });
}

// Initialize collections tab
function initializeCollections() {
    displayCollections(POPULAR_COLLECTIONS);
    
    // Search functionality
    const searchInput = document.getElementById('collectionSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = POPULAR_COLLECTIONS.filter(collection =>
                collection.name.toLowerCase().includes(query) ||
                collection.description.toLowerCase().includes(query)
            );
            displayCollections(filtered);
        });
    }
    
    // Load collection NFT button
    const loadCollectionNftBtn = document.getElementById('loadCollectionNftBtn');
    if (loadCollectionNftBtn) {
        loadCollectionNftBtn.addEventListener('click', loadCollectionNFT);
    }
}

function displayCollections(collections) {
    const grid = document.getElementById('collectionsGrid');
    grid.innerHTML = '';
    
    if (collections.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No collections found matching your search.</p>';
        return;
    }
    
    collections.forEach(collection => {
        const card = document.createElement('div');
        card.className = 'collection-card';
        card.innerHTML = `
            <div class="collection-icon">${collection.icon}</div>
            <div class="collection-name">${collection.name}</div>
            <div class="collection-description">${collection.description}</div>
        `;
        
        card.addEventListener('click', () => {
            // Remove selection from all cards
            document.querySelectorAll('.collection-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Show the token ID input section
            const section = document.getElementById('collectionNftsSection');
            section.classList.remove('hidden');
            document.getElementById('collectionNftsTitle').textContent = `Enter Token ID for ${collection.name}`;
            
            // Store selected collection
            section.dataset.contract = collection.contract;
        });
        
        grid.appendChild(card);
    });
}

function loadCollectionNFT() {
    const section = document.getElementById('collectionNftsSection');
    const contract = section.dataset.contract;
    const tokenId = document.getElementById('tokenIdSearch').value.trim();
    
    if (!contract) {
        showError('Please select a collection first');
        return;
    }
    
    if (!tokenId) {
        showError('Please enter a token ID');
        return;
    }
    
    // Populate manual entry fields
    document.getElementById('contract').value = contract;
    document.getElementById('tokenId').value = tokenId;
    
    // Switch to manual tab
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-tab="manual"]').classList.add('active');
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    document.getElementById('manual-tab').classList.remove('hidden');
    
    // Auto-load the NFT
    setTimeout(() => loadNFT(), 300);
}

async function fetchNFTMetadata(contractAddress, tokenId, network) {
    try {
        // Try OpenSea API first (no key needed for basic calls)
        const openseaUrl = `https://api.opensea.io/api/v2/chain/ethereum/contract/${contractAddress}/nfts/${tokenId}`;
        
        try {
            console.log('Trying OpenSea API...');
            const openseaResponse = await fetch(openseaUrl, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (openseaResponse.ok) {
                const data = await openseaResponse.json();
                console.log('OpenSea data:', data);
                if (data.nft && (data.nft.image_url || data.nft.display_image_url)) {
                    return {
                        name: data.nft?.name || `NFT #${tokenId}`,
                        description: data.nft?.description || '',
                        image: data.nft?.image_url || data.nft?.display_image_url,
                        contractAddress,
                        tokenId
                    };
                }
            }
            console.log('OpenSea API returned status:', openseaResponse.status);
        } catch (e) {
            console.log('OpenSea API error:', e.message);
        }
        
        // Fallback: Try to read directly from contract using ethers.js
        console.log('Trying direct blockchain call...');
        const provider = new ethers.providers.JsonRpcProvider(METADATA_STANDARDS[network].rpcUrl);
        
        // ERC-721 ABI for tokenURI
        const abi = [
            'function tokenURI(uint256 tokenId) view returns (string)',
            'function name() view returns (string)',
            'function symbol() view returns (string)'
        ];
        
        const contract = new ethers.Contract(contractAddress, abi, provider);
        
        let tokenURI;
        try {
            tokenURI = await contract.tokenURI(tokenId);
            console.log('Token URI:', tokenURI);
        } catch (error) {
            console.error('Contract call error:', error);
            throw new Error('Unable to fetch NFT metadata. The contract may not be ERC-721 compliant or the token ID may not exist.');
        }
        
        // Handle IPFS URLs
        if (tokenURI.startsWith('ipfs://')) {
            tokenURI = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
        }
        
        // Fetch metadata from tokenURI
        console.log('Fetching metadata from:', tokenURI);
        const metadataResponse = await fetch(tokenURI);
        if (!metadataResponse.ok) {
            throw new Error(`Failed to fetch metadata from ${tokenURI}: ${metadataResponse.status}`);
        }
        const metadata = await metadataResponse.json();
        console.log('Metadata:', metadata);
        
        let imageUrl = metadata.image;
        if (imageUrl && imageUrl.startsWith('ipfs://')) {
            imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
        }
        
        if (!imageUrl) {
            throw new Error('No image found in NFT metadata');
        }
        
        return {
            name: metadata.name || `NFT #${tokenId}`,
            description: metadata.description || '',
            image: imageUrl,
            contractAddress,
            tokenId
        };
        
    } catch (error) {
        console.error('Error fetching NFT metadata:', error);
        if (error.message.includes('fetch')) {
            throw new Error('Network error: Unable to connect to blockchain or metadata service. Please check your internet connection.');
        }
        throw error;
    }
}

function displayNFT(metadata) {
    document.getElementById('nftImage').src = metadata.image;
    document.getElementById('nftName').textContent = metadata.name;
    document.getElementById('nftDescription').textContent = metadata.description || 'No description available';
}

function updateSelectedInfo() {
    const info = document.getElementById('selectedSize');
    info.textContent = `Selected: ${state.selectedSize.width}" × ${state.selectedSize.height}"`;
}

async function generatePreview() {
    if (!state.nftData) return;
    
    const canvas = document.getElementById('previewCanvas');
    const ctx = canvas.getContext('2d');
    
    // Calculate dimensions (preview at lower resolution, 72 DPI)
    const previewDPI = 72;
    const previewWidth = state.selectedSize.width * previewDPI;
    const previewHeight = state.selectedSize.height * previewDPI;
    const borderPixels = state.borderSize * previewDPI;
    
    // Set canvas size
    canvas.width = previewWidth;
    canvas.height = previewHeight;
    
    // Load NFT image with enhanced error handling
    let img;
    try {
        img = await loadImage(state.nftData.image);
    } catch (error) {
        console.error('Failed to load NFT image:', error);
        showError('Failed to load NFT image. The image may be blocked by CORS or unavailable.');
        return;
    }
    
    // Draw frame with enhanced rendering
    drawEnhancedFrame(ctx, previewWidth, previewHeight, borderPixels, state.frameMaterial);
    
    // Draw customizable matte/mat board
    const matteOffset = borderPixels * 0.2;
    ctx.fillStyle = state.matColor;
    ctx.fillRect(matteOffset, matteOffset, previewWidth - (matteOffset * 2), previewHeight - (matteOffset * 2));
    
    // Add shadow on mat board for depth
    const matShadowGradient = ctx.createLinearGradient(matteOffset, matteOffset, matteOffset + 20, matteOffset + 20);
    matShadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
    matShadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = matShadowGradient;
    ctx.fillRect(matteOffset, matteOffset, previewWidth - (matteOffset * 2), previewHeight - (matteOffset * 2));
    
    // Calculate image dimensions (maintaining aspect ratio)
    const imageAreaWidth = previewWidth - (borderPixels * 2);
    const imageAreaHeight = previewHeight - (borderPixels * 2) - (borderPixels * 0.5); // Leave space for QR
    
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
    
    // Draw NFT image
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    
    // Generate and draw QR code
    await drawQRCode(ctx, previewWidth, previewHeight, borderPixels);
    
    // Add subtle frame depth/shadow effect
    addFrameDepth(ctx, previewWidth, previewHeight, matteOffset);
    
    // Show download button and IPFS upload button
    document.getElementById('downloadBtn').classList.remove('hidden');
    document.getElementById('uploadIpfsBtn').classList.remove('hidden');
    document.getElementById('print-recommendations-section').classList.remove('hidden');
    
    // Update pricing estimates
    updatePricingEstimates();
}

function updatePricingEstimates() {
    const size = `${state.selectedSize.width}" × ${state.selectedSize.height}"`;
    document.getElementById('priceSize').textContent = size;
    
    // Calculate pricing based on size (in square inches)
    const squareInches = state.selectedSize.width * state.selectedSize.height;
    
    // Base pricing formulas (approximate industry standards)
    const printfulBase = 15 + (squareInches * 0.08);
    const mpixBase = 20 + (squareInches * 0.10);
    const nationsBase = 12 + (squareInches * 0.06);
    const canvaspopBase = 25 + (squareInches * 0.12);
    const shutterflyBase = 10 + (squareInches * 0.05);
    
    // Frame costs (add to print cost)
    const frameBaseCost = 30 + (squareInches * 0.15);
    
    const priceData = [
        { site: 'Printful', print: printfulBase, framed: printfulBase + frameBaseCost },
        { site: 'Mpix', print: mpixBase, framed: mpixBase + frameBaseCost + 10 }, // Premium framing
        { site: 'Nations Photo', print: nationsBase, framed: nationsBase + frameBaseCost - 10 },
        { site: 'Canvaspop', print: canvaspopBase, framed: canvaspopBase + frameBaseCost },
        { site: 'Shutterfly', print: shutterflyBase, framed: shutterflyBase + frameBaseCost - 5 }
    ];
    
    const priceGrid = document.getElementById('priceGrid');
    priceGrid.innerHTML = priceData.map(item => `
        <div class="price-item">
            <div class="site-name">${item.site}</div>
            <div class="price">$${Math.round(item.print)}</div>
            <div class="price-note">Print only</div>
            <div style="margin-top: 0.5rem; opacity: 0.8; font-size: 0.875rem;">$${Math.round(item.framed)} framed</div>
        </div>
    `).join('');
}

function drawEnhancedFrame(ctx, width, height, borderSize, material) {
    const baseColor = getFrameColor(material);
    
    // Draw base frame
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);
    
    // Add wood grain texture for wood materials
    if (material.startsWith('wood-')) {
        drawWoodGrain(ctx, width, height, borderSize, material);
    }
    
    // Add beveled edge effect with highlights and shadows
    const bevelSize = borderSize * 0.15;
    
    // Outer shadow (3D depth)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = borderSize * 0.1;
    ctx.shadowOffsetX = borderSize * 0.05;
    ctx.shadowOffsetY = borderSize * 0.05;
    
    // Top and left highlights (light from top-left)
    const highlightGradient = ctx.createLinearGradient(0, 0, bevelSize * 2, bevelSize * 2);
    if (material.startsWith('wood-')) {
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    } else {
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }
    
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = highlightGradient;
    // Top highlight
    ctx.fillRect(0, 0, width, bevelSize * 2);
    // Left highlight
    ctx.fillRect(0, 0, bevelSize * 2, height);
    
    // Bottom and right shadows (shadow from bottom-right)
    const shadowGradient = ctx.createLinearGradient(width - bevelSize * 2, height - bevelSize * 2, width, height);
    shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    
    ctx.fillStyle = shadowGradient;
    // Bottom shadow
    ctx.fillRect(0, height - bevelSize * 2, width, bevelSize * 2);
    // Right shadow
    ctx.fillRect(width - bevelSize * 2, 0, bevelSize * 2, height);
}

function drawWoodGrain(ctx, width, height, borderSize, material) {
    // Create realistic wood grain texture
    const grainDensity = 100;
    const grainVariation = material === 'wood-oak' ? 0.3 : 0.2;
    
    ctx.globalAlpha = 0.15;
    
    // Draw vertical grain lines
    for (let i = 0; i < grainDensity; i++) {
        const x = (i / grainDensity) * width;
        const variation = Math.random() * grainVariation;
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        
        // Create wavy grain pattern
        for (let y = 0; y < height; y += 5) {
            const wave = Math.sin(y * 0.05 + i * 0.1) * 2;
            ctx.lineTo(x + wave, y);
        }
        
        ctx.strokeStyle = `rgba(0, 0, 0, ${0.1 + variation})`;
        ctx.lineWidth = Math.random() < 0.3 ? 2 : 1;
        ctx.stroke();
    }
    
    // Add knots for more realism
    const numKnots = Math.floor((width * height) / 50000);
    for (let i = 0; i < numKnots; i++) {
        const knotX = Math.random() * width;
        const knotY = Math.random() * height;
        const knotSize = 10 + Math.random() * 20;
        
        const knotGradient = ctx.createRadialGradient(knotX, knotY, 0, knotX, knotY, knotSize);
        knotGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
        knotGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = knotGradient;
        ctx.beginPath();
        ctx.arc(knotX, knotY, knotSize, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.globalAlpha = 1.0;
}

function getFrameColor(material) {
    const colors = {
        'wood-black': '#2c2c2c',
        'wood-walnut': '#5c4033',
        'wood-oak': '#b8986e',
        'metal-gold': '#ffd700',
        'metal-silver': '#c0c0c0',
        'metal-bronze': '#cd7f32',
        'metal-black': '#3c3c3c'
    };
    return colors[material] || '#ffd700';
}

async function drawQRCode(ctx, canvasWidth, canvasHeight, borderPixels) {
    // Create QR code URL (linking to NFT)
    const explorer = METADATA_STANDARDS[state.network].explorer;
    const qrUrl = `${explorer}/token/${state.contractAddress}?a=${state.tokenId}`;
    
    // QR code size based on selection
    const qrSizes = {
        small: borderPixels * 0.8,
        medium: borderPixels * 1.2,
        large: borderPixels * 1.6
    };
    const qrSize = qrSizes[state.qrSize];
    
    // Generate QR code on temporary canvas
    const qrCanvas = document.createElement('canvas');
    const qrContainer = document.createElement('div');
    qrContainer.style.display = 'none';
    document.body.appendChild(qrContainer);
    
    const qr = new QRCode(qrContainer, {
        text: qrUrl,
        width: qrSize,
        height: qrSize,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Wait for QR code to generate
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const qrImg = qrContainer.querySelector('img');
    if (qrImg) {
        // Calculate QR position with more spacing (increased from 0.3 to 0.6 for better separation)
        let qrX, qrY;
        const qrPadding = borderPixels * 0.6; // Increased spacing from frame border and NFT
        
        switch (state.qrPosition) {
            case 'bottom-left':
                qrX = qrPadding;
                qrY = canvasHeight - qrSize - qrPadding;
                break;
            case 'bottom-right':
                qrX = canvasWidth - qrSize - qrPadding;
                qrY = canvasHeight - qrSize - qrPadding;
                break;
            case 'bottom-center':
            default:
                qrX = (canvasWidth - qrSize) / 2;
                qrY = canvasHeight - qrSize - qrPadding;
                break;
        }
        
        // Draw customizable border around QR
        const qrBorderWidth = qrSize * state.qrBorderWidth;
        ctx.fillStyle = state.qrBorderColor;
        ctx.fillRect(qrX - qrBorderWidth, qrY - qrBorderWidth, 
                     qrSize + (qrBorderWidth * 2), qrSize + (qrBorderWidth * 2));
        
        // Draw QR code
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
    }
    
    document.body.removeChild(qrContainer);
}

function addFrameDepth(ctx, width, height, offset) {
    // Add inner shadow for depth
    const gradient = ctx.createLinearGradient(0, 0, offset * 2, offset * 2);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, offset * 2, height);
    ctx.fillRect(0, 0, width, offset * 2);
}

async function downloadFrame() {
    if (!state.nftData) return;
    
    // Create high-resolution canvas (300 DPI for printing)
    const printDPI = 300;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const printWidth = state.selectedSize.width * printDPI;
    const printHeight = state.selectedSize.height * printDPI;
    const borderPixels = state.borderSize * printDPI;
    
    canvas.width = printWidth;
    canvas.height = printHeight;
    
    // Load NFT image
    const img = await loadImage(state.nftData.image);
    
    // Draw frame (same logic as preview but at higher resolution)
    ctx.fillStyle = getFrameColor(state.frameMaterial);
    ctx.fillRect(0, 0, printWidth, printHeight);
    
    const matteOffset = borderPixels * 0.2;
    ctx.fillStyle = state.matColor;
    ctx.fillRect(matteOffset, matteOffset, printWidth - (matteOffset * 2), printHeight - (matteOffset * 2));
    
    const imageAreaWidth = printWidth - (borderPixels * 2);
    const imageAreaHeight = printHeight - (borderPixels * 2) - (borderPixels * 0.5);
    
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
    
    // Draw QR code at high resolution
    await drawQRCodeHighRes(ctx, printWidth, printHeight, borderPixels);
    
    addFrameDepth(ctx, printWidth, printHeight, matteOffset);
    
    // Download
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nft-frame-${state.contractAddress.slice(0, 8)}-${state.tokenId}-${state.selectedSize.width}x${state.selectedSize.height}.png`;
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
}

async function drawQRCodeHighRes(ctx, canvasWidth, canvasHeight, borderPixels) {
    const explorer = METADATA_STANDARDS[state.network].explorer;
    const qrUrl = `${explorer}/token/${state.contractAddress}?a=${state.tokenId}`;
    
    const qrSizes = {
        small: borderPixels * 0.8,
        medium: borderPixels * 1.2,
        large: borderPixels * 1.6
    };
    const qrSize = qrSizes[state.qrSize];
    
    const qrContainer = document.createElement('div');
    qrContainer.style.display = 'none';
    document.body.appendChild(qrContainer);
    
    const qr = new QRCode(qrContainer, {
        text: qrUrl,
        width: qrSize,
        height: qrSize,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const qrImg = qrContainer.querySelector('img');
    if (qrImg) {
        let qrX, qrY;
        const qrPadding = borderPixels * 0.6; // Increased spacing to match preview
        
        switch (state.qrPosition) {
            case 'bottom-left':
                qrX = qrPadding;
                qrY = canvasHeight - qrSize - qrPadding;
                break;
            case 'bottom-right':
                qrX = canvasWidth - qrSize - qrPadding;
                qrY = canvasHeight - qrSize - qrPadding;
                break;
            case 'bottom-center':
            default:
                qrX = (canvasWidth - qrSize) / 2;
                qrY = canvasHeight - qrSize - qrPadding;
                break;
        }
        
        const qrBorderWidth = qrSize * state.qrBorderWidth;
        ctx.fillStyle = state.qrBorderColor;
        ctx.fillRect(qrX - qrBorderWidth, qrY - qrBorderWidth, 
                     qrSize + (qrBorderWidth * 2), qrSize + (qrBorderWidth * 2));
        
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
    }
    
    document.body.removeChild(qrContainer);
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        console.log('Loading image from:', src);
        
        const tryLoadImage = (imageUrl, useCORS = true) => {
            return new Promise((res, rej) => {
                const img = new Image();
                if (useCORS) {
                    img.crossOrigin = 'anonymous';
                }
                
                img.onload = () => {
                    console.log('Image loaded successfully:', imageUrl);
                    res(img);
                };
                
                img.onerror = (error) => {
                    console.error('Image load error:', imageUrl, error);
                    rej(error);
                };
                
                img.src = imageUrl;
            });
        };
        
        // Normalize IPFS URLs
        let normalizedSrc = src;
        if (src.startsWith('ipfs://')) {
            normalizedSrc = src.replace('ipfs://', 'https://ipfs.io/ipfs/');
        }
        
        // Try multiple loading strategies
        const loadStrategies = [
            // Strategy 1: Direct load with CORS
            () => tryLoadImage(normalizedSrc, true),
            
            // Strategy 2: Direct load without CORS
            () => tryLoadImage(normalizedSrc, false),
            
            // Strategy 3: Use alternative IPFS gateway
            () => {
                if (normalizedSrc.includes('ipfs.io')) {
                    const ipfsHash = normalizedSrc.split('/ipfs/')[1];
                    return tryLoadImage(`https://cloudflare-ipfs.com/ipfs/${ipfsHash}`, true);
                }
                return Promise.reject(new Error('Not IPFS'));
            },
            
            // Strategy 4: Use another IPFS gateway
            () => {
                if (normalizedSrc.includes('ipfs.io')) {
                    const ipfsHash = normalizedSrc.split('/ipfs/')[1];
                    return tryLoadImage(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`, true);
                }
                return Promise.reject(new Error('Not IPFS'));
            },
            
            // Strategy 5: CORS proxy
            () => tryLoadImage(`https://corsproxy.io/?${encodeURIComponent(normalizedSrc)}`, false)
        ];
        
        // Try each strategy in sequence
        const tryNext = async (index) => {
            if (index >= loadStrategies.length) {
                reject(new Error('All image loading strategies failed'));
                return;
            }
            
            try {
                const img = await loadStrategies[index]();
                resolve(img);
            } catch (error) {
                console.log(`Strategy ${index + 1} failed, trying next...`);
                tryNext(index + 1);
            }
        };
        
        tryNext(0);
    });
}

function showLoading(show) {
    document.getElementById('loading').classList.toggle('hidden', !show);
}

function showError(message) {
    const errorEl = document.getElementById('error');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
}

function hideError() {
    document.getElementById('error').classList.add('hidden');
}

// ==================== AI ASSISTANT FUNCTIONALITY ====================

// Simple encryption for API keys (basic obfuscation - not cryptographically secure but better than plain text)
function encodeKey(key) {
    if (!key) return '';
    return btoa(key.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ (i % 256))).join(''));
}

function decodeKey(encoded) {
    if (!encoded) return '';
    try {
        return atob(encoded).split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ (i % 256))).join('');
    } catch {
        return encoded; // Return as-is if not encoded (for backward compatibility)
    }
}

// Rate limiting for API calls
const rateLimiter = {
    calls: [],
    maxCalls: 10,
    timeWindow: 60000, // 1 minute
    
    canMakeCall() {
        const now = Date.now();
        this.calls = this.calls.filter(time => now - time < this.timeWindow);
        return this.calls.length < this.maxCalls;
    },
    
    recordCall() {
        this.calls.push(Date.now());
    }
};

// Demo mode for Hugging Face - users should get their own free token
// Get your free token at https://huggingface.co/settings/tokens
// This demo uses a public model endpoint that may have rate limits
const HF_DEMO_MODE = true;

// Default token (obfuscated) - users can override with their own
// Note: This is NOT secure - obfuscation only deters casual viewers
// For production, use serverless functions (Netlify/Vercel)
function getDefaultToken() {
    const parts = ['hf_', 'sdTT', 'ZhHX', 'heYc', 'lujL', 'siio', 'oQUS', 'fMrr', 'YcYO', 'dZ'];
    return parts.join('');
}

let aiConfig = {
    provider: localStorage.getItem('ai_provider') || 'huggingface',
    apiKey: decodeKey(localStorage.getItem('ai_api_key_enc')) || '',
    localUrl: localStorage.getItem('ai_local_url') || 'http://localhost:11434'
};

// Ensure default provider is set if not already in localStorage
if (!localStorage.getItem('ai_provider')) {
    localStorage.setItem('ai_provider', 'huggingface');
    console.log('Set default AI provider to Hugging Face');
}

console.log('AI Config initialized:', aiConfig.provider);

function initializeAIAssistant() {
    // Configure API button
    const configureBtn = document.getElementById('configureApiBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', toggleApiConfig);
    }
    
    // Save config button
    const saveBtn = document.getElementById('saveApiConfigBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveApiConfig);
    }
    
    // Send chat button
    const sendBtn = document.getElementById('sendChatBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendChatMessage);
    }
    
    // API provider change
    const apiProvider = document.getElementById('apiProvider');
    if (apiProvider) {
        apiProvider.addEventListener('change', updateApiConfigVisibility);
    }
    
    // Quick prompt buttons
    document.querySelectorAll('.quick-prompt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const prompt = btn.dataset.prompt;
            if (prompt) {
                document.getElementById('chatInput').value = prompt;
                sendChatMessage();
            }
        });
    });
    
    // Chat input enter key
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }
}

function toggleApiConfig() {
    const panel = document.getElementById('apiConfigPanel');
    if (!panel) return;
    
    panel.classList.toggle('hidden');
    
    // Load saved config
    const providerEl = document.getElementById('apiProvider');
    const keyEl = document.getElementById('apiKey');
    const urlEl = document.getElementById('localUrl');
    
    if (providerEl) providerEl.value = aiConfig.provider;
    if (keyEl) keyEl.value = aiConfig.apiKey;
    if (urlEl) urlEl.value = aiConfig.localUrl;
    
    updateApiConfigVisibility();
}

function saveApiConfig() {
    const providerEl = document.getElementById('apiProvider');
    const keyEl = document.getElementById('apiKey');
    const urlEl = document.getElementById('localUrl');
    
    if (providerEl) aiConfig.provider = providerEl.value;
    if (keyEl) aiConfig.apiKey = keyEl.value;
    if (urlEl) aiConfig.localUrl = urlEl.value;
    
    console.log('Saving AI config - Provider:', aiConfig.provider, 'Has Key:', !!aiConfig.apiKey);
    
    // Save to localStorage with encryption for API key
    localStorage.setItem('ai_api_key_enc', encodeKey(aiConfig.apiKey));
    localStorage.setItem('ai_local_url', aiConfig.localUrl);
    localStorage.setItem('ai_provider', aiConfig.provider);
    
    // Remove old unencrypted key if it exists
    localStorage.removeItem('ai_api_key');
    
    addChatMessage('assistant', 'Configuration saved! You can now use AI assistance.');
    
    const panel = document.getElementById('apiConfigPanel');
    if (panel) panel.classList.add('hidden');
}

function updateApiConfigVisibility() {
    const providerEl = document.getElementById('apiProvider');
    const apiKeyGroup = document.getElementById('apiKeyGroup');
    const localUrlGroup = document.getElementById('localUrlGroup');
    const apiKeyOptional = document.getElementById('apiKeyOptional');
    const apiKeyInput = document.getElementById('apiKey');
    const apiKeyHelp = document.getElementById('apiKeyHelp');
    
    if (!providerEl || !apiKeyGroup || !localUrlGroup) return;
    
    const provider = providerEl.value;
    
    if (provider === 'local') {
        apiKeyGroup.classList.add('hidden');
        localUrlGroup.classList.remove('hidden');
        if (apiKeyOptional) apiKeyOptional.style.display = 'none';
    } else if (provider === 'huggingface') {
        apiKeyGroup.classList.remove('hidden');
        localUrlGroup.classList.add('hidden');
        if (apiKeyOptional) apiKeyOptional.style.display = 'inline';
        if (apiKeyInput) apiKeyInput.placeholder = '(Optional - default provided)';
        if (apiKeyHelp) apiKeyHelp.innerHTML = '✓ <strong>Works instantly!</strong> Or add your own token for higher rate limits: <a href="https://huggingface.co/settings/tokens" target="_blank" style="color: var(--primary-color);">Get free token</a>';
    } else {
        apiKeyGroup.classList.remove('hidden');
        localUrlGroup.classList.add('hidden');
        if (apiKeyOptional) apiKeyOptional.style.display = 'none';
        if (apiKeyInput) apiKeyInput.placeholder = 'sk-...';
        if (apiKeyHelp) apiKeyHelp.textContent = 'Your key is stored locally and never sent to our servers';
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Rate limiting check
    if (!rateLimiter.canMakeCall()) {
        addChatMessage('error', 'Rate limit exceeded. Please wait a minute before making more AI requests.');
        return;
    }
    
    // Check if API is configured
    // OpenAI and Anthropic require user's own API keys
    // Hugging Face has a default token but users can provide their own
    console.log('Checking API config - Provider:', aiConfig.provider, 'Has Key:', !!aiConfig.apiKey);
    
    const requiresApiKey = aiConfig.provider === 'openai' || aiConfig.provider === 'anthropic';
    console.log('Requires API key:', requiresApiKey);
    
    if (requiresApiKey && !aiConfig.apiKey) {
        console.error('API key required but not provided for provider:', aiConfig.provider);
        addChatMessage('error', 'Please configure your API key first by clicking the "Configure API" button above.');
        return;
    }
    
    console.log('API check passed, proceeding with AI request');
    
    // Record API call for rate limiting
    rateLimiter.recordCall();
    
    // Add user message to chat
    addChatMessage('user', message);
    input.value = '';
    
    // Show loading
    setLoading(true);
    
    try {
        const response = await callLLM(message);
        
        // Parse and apply changes
        const changes = parseAIResponse(response);
        applyFrameChanges(changes);
        
        // Add AI response
        addChatMessage('assistant', response);
        
        // Regenerate preview
        if (state.nftData) {
            generatePreview();
        }
    } catch (error) {
        addChatMessage('error', `Error: ${error.message}`);
    } finally {
        setLoading(false);
    }
}

function addChatMessage(type, content) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    
    const prefix = type === 'user' ? '<strong>You:</strong> ' : 
                   type === 'assistant' ? '<strong>AI Assistant:</strong> ' : 
                   '<strong>Error:</strong> ';
    
    // Sanitize content to prevent XSS
    const sanitizedContent = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '<br>');
    messageDiv.innerHTML = prefix + sanitizedContent;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function setLoading(loading) {
    document.getElementById('sendBtnText').classList.toggle('hidden', loading);
    document.getElementById('sendBtnLoader').classList.toggle('hidden', !loading);
    document.getElementById('sendChatBtn').disabled = loading;
}

async function callLLM(userMessage) {
    const systemPrompt = `You are an AI assistant helping users customize their NFT frames. 

Current frame settings:
- Print Size: ${state.selectedSize.width}" × ${state.selectedSize.height}"
- Border Size: ${state.borderSize}"
- Frame Material: ${state.frameMaterial}
- Mat Board Color: ${state.matColor}
- QR Position: ${state.qrPosition}
- QR Size: ${state.qrSize}
- QR Border Color: ${state.qrBorderColor}
- QR Border Width: ${state.qrBorderWidth}

Available options:
- Print Sizes: 4×6, 5×7, 8×10, 11×14, 12×16, 16×20, 18×24, 24×36, 30×40, 40×20, 20×40 (inches)
- Border Sizes: 0.5, 1, 2, 3, 4 (inches)
- Frame Materials: wood-black, wood-walnut, wood-oak, metal-gold, metal-silver, metal-bronze, metal-black
- Mat Colors: #ffffff (white), #f5f5dc (cream), #000000 (black), #2c2c2c (charcoal), #8b4513 (brown), #4169e1 (royal blue), #dc143c (crimson)
- QR Positions: bottom-left, bottom-center, bottom-right
- QR Sizes: small, medium, large
- QR Border Colors: #ffd700 (gold), #c0c0c0 (silver), #000000 (black), #ffffff (white), #cd7f32 (bronze), #ff0000 (red), #0000ff (blue)
- QR Border Widths: 0.05 (thin), 0.1 (standard), 0.15 (medium), 0.2 (thick)

When the user asks to change settings, respond with a JSON object containing the changes, followed by a friendly explanation.

Format: 
CHANGES: {"printWidth": 16, "printHeight": 20, "borderSize": 2, "frameMaterial": "metal-gold"}
RESPONSE: I've updated your frame to...

Be conversational and helpful. If a style like "elegant" or "modern" is requested, choose appropriate settings.`;

    if (aiConfig.provider === 'huggingface') {
        return await callHuggingFace(systemPrompt, userMessage);
    } else if (aiConfig.provider === 'openai') {
        return await callOpenAI(systemPrompt, userMessage);
    } else if (aiConfig.provider === 'anthropic') {
        return await callAnthropic(systemPrompt, userMessage);
    } else if (aiConfig.provider === 'local') {
        return await callOllama(systemPrompt, userMessage);
    }
}

async function callHuggingFace(systemPrompt, userMessage) {
    // Use user's token if provided, otherwise use default demo token
    const apiKey = aiConfig.apiKey || getDefaultToken();
    
    console.log('Using Hugging Face with', aiConfig.apiKey ? 'custom token' : 'default token');
    
    // Using Mistral-7B-Instruct model - fast, capable, and free
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'mistralai/Mistral-7B-Instruct-v0.2',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 500,
            temperature: 0.7,
            stream: false
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        if (response.status === 503) {
            throw new Error('Model is loading, please try again in a few seconds...');
        }
        if (response.status === 401) {
            throw new Error('Invalid Hugging Face token. Please check your token at https://huggingface.co/settings/tokens');
        }
        throw new Error(error.error || 'Hugging Face API error');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

async function callOpenAI(systemPrompt, userMessage) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${aiConfig.apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.7
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

async function callAnthropic(systemPrompt, userMessage) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': aiConfig.apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: systemPrompt,
            messages: [
                { role: 'user', content: userMessage }
            ]
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Anthropic API error');
    }
    
    const data = await response.json();
    return data.content[0].text;
}

async function callOllama(systemPrompt, userMessage) {
    const response = await fetch(`${aiConfig.localUrl}/api/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama2',
            prompt: `${systemPrompt}\n\nUser: ${userMessage}\nAssistant:`,
            stream: false
        })
    });
    
    if (!response.ok) {
        throw new Error('Ollama connection error. Make sure Ollama is running.');
    }
    
    const data = await response.json();
    return data.response;
}

function parseAIResponse(response) {
    const changes = {};
    
    // Try to extract JSON from response
    const jsonMatch = response.match(/CHANGES:\s*({[^}]+})/);
    if (jsonMatch) {
        try {
            const parsed = JSON.parse(jsonMatch[1]);
            Object.assign(changes, parsed);
        } catch (e) {
            console.error('Failed to parse JSON:', e);
        }
    }
    
    // Fallback: parse from natural language
    const text = response.toLowerCase();
    
    // Print size
    const sizeMatch = text.match(/(\d+)\s*[x×]\s*(\d+)/);
    if (sizeMatch) {
        changes.printWidth = parseInt(sizeMatch[1]);
        changes.printHeight = parseInt(sizeMatch[2]);
    }
    
    // Border size
    const borderMatch = text.match(/border.*?(\d+\.?\d*)\s*inch/);
    if (borderMatch) {
        changes.borderSize = parseFloat(borderMatch[1]);
    }
    
    // Frame material
    if (text.includes('gold')) changes.frameMaterial = 'metal-gold';
    if (text.includes('silver')) changes.frameMaterial = 'metal-silver';
    if (text.includes('bronze')) changes.frameMaterial = 'metal-bronze';
    if (text.includes('black metal')) changes.frameMaterial = 'metal-black';
    if (text.includes('black wood') || text.includes('wood-black')) changes.frameMaterial = 'wood-black';
    if (text.includes('walnut')) changes.frameMaterial = 'wood-walnut';
    if (text.includes('oak')) changes.frameMaterial = 'wood-oak';
    
    // Mat color
    if (text.includes('white mat') || text.includes('mat.*white')) changes.matColor = '#ffffff';
    if (text.includes('cream')) changes.matColor = '#f5f5dc';
    if (text.includes('black mat') || text.includes('mat.*black')) changes.matColor = '#000000';
    if (text.includes('charcoal')) changes.matColor = '#2c2c2c';
    if (text.includes('brown')) changes.matColor = '#8b4513';
    if (text.includes('blue')) changes.matColor = '#4169e1';
    if (text.includes('crimson') || text.includes('red mat')) changes.matColor = '#dc143c';
    
    // QR settings
    if (text.includes('qr.*bottom left') || text.includes('bottom left.*qr')) changes.qrPosition = 'bottom-left';
    if (text.includes('qr.*bottom right') || text.includes('bottom right.*qr')) changes.qrPosition = 'bottom-right';
    if (text.includes('qr.*center') || text.includes('center.*qr')) changes.qrPosition = 'bottom-center';
    
    if (text.includes('qr.*small') || text.includes('small.*qr')) changes.qrSize = 'small';
    if (text.includes('qr.*large') || text.includes('large.*qr')) changes.qrSize = 'large';
    
    if (text.includes('qr.*gold') || text.includes('gold.*qr')) changes.qrBorderColor = '#ffd700';
    if (text.includes('qr.*silver') || text.includes('silver.*qr')) changes.qrBorderColor = '#c0c0c0';
    if (text.includes('qr.*white') || text.includes('white.*qr')) changes.qrBorderColor = '#ffffff';
    
    // Style presets
    if (text.includes('elegant') || text.includes('classic')) {
        changes.frameMaterial = 'metal-gold';
        changes.matColor = '#ffffff';
        changes.qrBorderColor = '#ffd700';
    }
    
    if (text.includes('modern') || text.includes('minimalist')) {
        changes.frameMaterial = 'metal-black';
        changes.matColor = '#ffffff';
        changes.qrBorderColor = '#000000';
    }
    
    if (text.includes('vintage') || text.includes('gallery')) {
        changes.frameMaterial = 'wood-walnut';
        changes.matColor = '#f5f5dc';
        changes.qrBorderColor = '#cd7f32';
    }
    
    if (text.includes('bold') || text.includes('vibrant')) {
        changes.frameMaterial = 'metal-gold';
        changes.matColor = '#4169e1';
        changes.qrBorderColor = '#ff0000';
    }
    
    return changes;
}

function applyFrameChanges(changes) {
    let applied = [];
    
    if (changes.printWidth && changes.printHeight) {
        state.selectedSize = { width: changes.printWidth, height: changes.printHeight };
        updateSelectedInfo();
        applied.push(`size to ${changes.printWidth}"×${changes.printHeight}"`);
    }
    
    if (changes.borderSize !== undefined) {
        state.borderSize = changes.borderSize;
        applied.push(`border to ${changes.borderSize}"`);
    }
    
    if (changes.frameMaterial) {
        state.frameMaterial = changes.frameMaterial;
        applied.push(`frame material to ${changes.frameMaterial}`);
    }
    
    if (changes.matColor) {
        state.matColor = changes.matColor;
        applied.push('mat board color');
    }
    
    if (changes.qrPosition) {
        state.qrPosition = changes.qrPosition;
        applied.push(`QR position to ${changes.qrPosition}`);
    }
    
    if (changes.qrSize) {
        state.qrSize = changes.qrSize;
        applied.push(`QR size to ${changes.qrSize}`);
    }
    
    if (changes.qrBorderColor) {
        state.qrBorderColor = changes.qrBorderColor;
        applied.push('QR border color');
    }
    
    if (changes.qrBorderWidth !== undefined) {
        state.qrBorderWidth = changes.qrBorderWidth;
        applied.push('QR border width');
    }
    
    generatePreview();
    return applied;
}

// IPFS Upload Functionality
async function uploadToIPFS() {
    const uploadBtn = document.getElementById('uploadIpfsBtn');
    const ipfsResult = document.getElementById('ipfsResult');
    const canvas = document.getElementById('previewCanvas');
    
    if (!canvas) {
        showError('Please generate a frame preview first');
        return;
    }
    
    try {
        // Show loading state
        uploadBtn.textContent = '⏳ Uploading...';
        uploadBtn.disabled = true;
        ipfsResult.classList.add('hidden');
        
        // Convert canvas to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
        
        // Create form data
        const formData = new FormData();
        formData.append('file', blob, 'nft-frame.png');
        
        // Upload to web3.storage (free IPFS pinning service)
        // Using public gateway - for production, users should get their own API key from web3.storage
        const response = await fetch('https://api.web3.storage/upload', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDg5QjBGRjYxNjc2MThiNDRkQzlFNjkzNmFBMWQ3NjExNjFjNjU1MzUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzA0MjU2NzQwNjAsIm5hbWUiOiJORlQgRnJhbWUgR2VuZXJhdG9yIn0.xQK8VXx_5lMr4MQ4xB_hQfQqGZLQ8YzXQMxZGQGYH8o'
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Upload failed: ' + response.statusText);
        }
        
        const data = await response.json();
        const ipfsUrl = `https://w3s.link/ipfs/${data.cid}`;
        
        // Show result
        document.getElementById('ipfsLink').href = ipfsUrl;
        document.getElementById('ipfsLink').textContent = ipfsUrl;
        ipfsResult.classList.remove('hidden');
        
        uploadBtn.textContent = '✅ Uploaded!';
        setTimeout(() => {
            uploadBtn.textContent = '📤 Upload to IPFS';
            uploadBtn.disabled = false;
        }, 3000);
        
    } catch (error) {
        console.error('IPFS upload error:', error);
        showError('Failed to upload to IPFS: ' + error.message);
        uploadBtn.textContent = '📤 Upload to IPFS';
        uploadBtn.disabled = false;
    }
}

function copyIPFSLink() {
    const ipfsLink = document.getElementById('ipfsLink').textContent;
    const copyBtn = document.getElementById('copyIpfsBtn');
    
    navigator.clipboard.writeText(ipfsLink).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showError('Failed to copy link');
    });
}
