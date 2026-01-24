# NFT Frame Studio 🖼️

A mobile-optimized web application that allows you to create beautiful, customizable frames for your NFTs with embedded QR codes.

## Features

- **NFT Loading**: Enter any ERC-721 NFT contract address and token ID to load the NFT
- **Multiple Print Sizes**: Standard print sizes from 4"×6" up to 40"×20"
- **Customizable Frames**: 
  - Border sizes from 0.5" to 4"
  - Multiple materials (wood and metal finishes)
  - Various colors: Black, Walnut, Oak, Gold, Silver, Bronze
- **QR Code Integration**: 
  - Automatically generates QR codes linking to the NFT on Etherscan
  - Gold-colored border for premium look
  - Adjustable size and position
- **High-Resolution Export**: Downloads at 300 DPI for professional printing
- **Mobile Optimized**: Fully responsive design that works great on phones and tablets

## How to Use

1. **Open the Application**
   - Simply open `index.html` in any modern web browser
   - No installation or server required!

2. **Load Your NFT**
   - Select the network (currently Ethereum ERC-721)
   - Enter the NFT contract address (starts with 0x...)
   - Enter the token ID
   - Click "Load NFT"

3. **Customize Your Frame**
   - Select your desired print size
   - Choose border thickness
   - Pick frame material and color
   - Position and size the QR code

4. **Download**
   - Click "Generate Frame" to see the preview
   - Click "Download High-Res Image" to get the print-ready file (300 DPI)

## Technical Details

- **Frontend Only**: Pure HTML, CSS, and JavaScript - no backend needed
- **Libraries Used**:
  - Ethers.js for blockchain interactions
  - QRCode.js for QR code generation
- **APIs**:
  - OpenSea API (fallback available)
  - Public Ethereum RPC endpoints
- **Image Processing**: HTML5 Canvas for real-time rendering

## Examples of NFT Contracts

Try these popular NFT collections:
- **Bored Ape Yacht Club**: `0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`
- **CryptoPunks**: `0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB`
- **Azuki**: `0xED5AF388653567Af2F388E6224dC7C4b3241C544`

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Structure

```
nft-framing-app/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── app.js              # Application logic and NFT fetching
└── README.md           # This file
```

## Future Enhancements

- [ ] Support for Polygon, Base, and other chains
- [ ] Multiple NFT comparison views
- [ ] Save/load custom presets
- [ ] Social sharing features
- [ ] Print ordering integration
- [ ] SVG frame options for vector graphics

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please create an issue on the repository.

---

Created with ❤️ for NFT collectors
