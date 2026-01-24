# Testing Guide for NFT Frame Studio

## How to Debug Issues

### Open Browser Developer Console
1. Press **F12** in your browser
2. Click the **Console** tab
3. Look for any red error messages

### Test the Load NFT Feature

Use these test NFT contracts:

**Bored Ape Yacht Club**
- Contract: `0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`
- Token ID: `1`

**Azuki**
- Contract: `0xED5AF388653567Af2F388E6224dC7C4b3241C544`
- Token ID: `1`

**Doodles**
- Contract: `0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e`
- Token ID: `100`

### Common Issues & Solutions

#### Issue: "Can't get past Load NFT section"

**Check Console Logs:**
- Open F12 Developer Console
- Click "Load NFT" button
- Look for these console messages:
  - `loadNFT called`
  - `Inputs: {...}`
  - `Fetching metadata...`
  - `Metadata received: {...}`
  - `Shown: nft-preview-section`

**Possible Causes:**

1. **Network/CORS Issues**
   - OpenSea API might be rate-limited
   - RPC endpoint might be down
   - **Solution**: Wait a few minutes and try again

2. **Invalid Contract Address**
   - Must start with `0x`
   - Must be 42 characters long
   - **Solution**: Copy/paste from examples above

3. **JavaScript Error**
   - Check console for red error messages
   - **Solution**: Share the error message for help

4. **Ethers.js Loading Issue**
   - Check if ethers library loaded
   - Type `ethers` in console - should show an object
   - **Solution**: Refresh page or check internet connection

#### Issue: "Button doesn't do anything"

**Test if button is connected:**
1. Open Console (F12)
2. Type: `document.getElementById('loadNftBtn')`
3. Should show: `<button id="loadNftBtn">...</button>`
4. Type: `document.getElementById('loadNftBtn').click()`
5. Should see console logs

**If button not found:**
- Refresh the page
- Clear browser cache (Ctrl+Shift+Delete)

#### Issue: "Loading forever"

**Causes:**
- Network timeout
- API rate limit
- CORS blocking

**Solution:**
- Wait 30 seconds for timeout
- Try a different NFT
- Check internet connection

### Debugging Steps

1. **Open index.html in browser**
2. **Press F12 for Developer Tools**
3. **Go to Console tab**
4. **Enter test data:**
   - Contract: `0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`
   - Token ID: `1`
5. **Click Load NFT**
6. **Watch console for messages**

### Expected Console Output (Success):
```
loadNFT called
Inputs: {contractInput: "0xBC4...", tokenIdInput: "1", network: "ethereum"}
Fetching metadata...
Metadata received: {name: "...", image: "...", ...}
Showing sections...
Shown: nft-preview-section
Shown: ai-assistant-section
Shown: size-selection-section
Shown: frame-customization-section
Shown: preview-section
Generating preview...
```

### Manual Test Script

Open Console and paste:
```javascript
// Test if loadNFT function exists
console.log('loadNFT function:', typeof loadNFT);

// Test if button exists
console.log('Button:', document.getElementById('loadNftBtn'));

// Test if inputs exist
console.log('Contract input:', document.getElementById('contract'));
console.log('Token ID input:', document.getElementById('tokenId'));

// Manually set values and call
document.getElementById('contract').value = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';
document.getElementById('tokenId').value = '1';
loadNFT();
```

## Still Having Issues?

Share these details:
1. Browser name and version
2. Any error messages in console (F12)
3. Which test NFT you tried
4. Screenshot of the issue

## Quick Fixes

### Refresh doesn't work
- Clear cache: Ctrl+Shift+Delete
- Hard refresh: Ctrl+F5
- Try incognito/private mode

### API Rate Limits
- Wait 5-10 minutes
- Try a different NFT collection
- Use the test.html page to verify functionality

### Can't configure AI
- Click "⚙️ Configure API" button
- Select provider
- Enter API key
- Click "Save Configuration"
- Look for success message in chat
