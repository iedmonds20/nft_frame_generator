# AI Provider Guide

## 🎉 Free AI Assistant - No Setup Required!

The AI Frame Assistant now works **out of the box** with **Hugging Face** - no API key needed!

## Available Providers

### 1. 🆓 Hugging Face (Recommended - FREE!)

**Best for:** Everyone! Works immediately without any setup.

**Features:**
- ✅ **No API key required** - Works right away
- ✅ **100% Free** - No credit card, no account needed
- ✅ **Open Source** - Uses Mistral-7B-Instruct model
- ✅ **Privacy Focused** - No personal data required

**How it works:**
- Uses Hugging Face's public inference API
- May be slower on first request (model loading)
- Has rate limits (usually sufficient for personal use)

**Optional Enhancement:**
Get your own free Hugging Face token for:
- Faster response times
- Higher rate limits
- Priority access

👉 Get free token: https://huggingface.co/settings/tokens

---

### 2. OpenAI (GPT-4)

**Best for:** Users who want the most advanced AI capabilities.

**Features:**
- Most intelligent responses
- Fast and reliable
- Requires paid API key

**Setup:**
1. Visit https://platform.openai.com/api-keys
2. Create an account and add payment method
3. Generate API key
4. Paste in the app's API configuration

**Cost:** ~$0.01-0.03 per request

---

### 3. Anthropic (Claude)

**Best for:** Users who want detailed, thoughtful responses.

**Features:**
- High quality responses
- Good at following instructions
- Requires API key

**Setup:**
1. Visit https://console.anthropic.com/
2. Create account and add credits
3. Generate API key
4. Paste in the app's API configuration

**Cost:** Similar to OpenAI

---

### 4. Local LLM (Ollama)

**Best for:** Privacy-conscious users with powerful computers.

**Features:**
- ✅ Completely private - runs on your computer
- ✅ No internet required
- ✅ No costs after setup
- Requires technical setup

**Setup:**
1. Install Ollama: https://ollama.ai
2. Run: `ollama pull llama2`
3. Set URL to `http://localhost:11434` in the app

**Requirements:** 
- 8GB+ RAM
- Modern CPU/GPU

---

## Quick Start

### For Most Users (No Setup):
1. Open the AI Frame Assistant section
2. Click "Configure API" 
3. Select "Hugging Face" (default)
4. Click "Save Configuration"
5. Start chatting!

### Example Prompts:
- "Make it elegant with a gold frame"
- "I want a large 16×20 print with a wooden frame"
- "Change to a modern black metal frame"
- "Make the QR code small and in the bottom left"

---

## Comparison Table

| Provider | Cost | Setup Time | Speed | Quality | Privacy |
|----------|------|------------|-------|---------|---------|
| **Hugging Face** | FREE | 0 min ⭐ | Medium | Good | High |
| OpenAI | Paid | 5 min | Fast | Excellent | Medium |
| Anthropic | Paid | 5 min | Fast | Excellent | Medium |
| Local (Ollama) | FREE | 15 min | Fast* | Good | Maximum |

*Depends on your hardware

---

## Security & Privacy

### All Providers:
- API keys are stored **only in your browser** (localStorage)
- Keys are **encrypted** before storage
- Keys are **never sent to our servers**
- Keys are **only sent to the AI provider** you choose

### Hugging Face (No Key):
- No personal information required
- Requests are anonymous
- Uses HTTPS encryption
- Public inference API (may be logged by HF for service improvement)

### Your Own API Keys:
- You control your data
- Subject to the provider's privacy policy
- Keys give access only to AI inference, not other services

---

## Troubleshooting

### "Model is loading, please try again"
**Cause:** Hugging Face model needs to warm up (first request)
**Solution:** Wait 10-20 seconds and try again

### "Rate limit exceeded"
**Cause:** Too many requests in a short time
**Solution:** 
- Wait 1 minute and try again
- Get your own Hugging Face token for higher limits

### "API key invalid"
**Cause:** Wrong or expired API key
**Solution:**
- Double-check the key for typos
- Generate a new key from the provider
- For Hugging Face: try without a key (demo mode)

### "Request timeout"
**Cause:** Slow internet or overloaded API
**Solution:**
- Check your internet connection
- Try again in a few moments
- Consider switching providers

---

## Getting Your Own Hugging Face Token (Optional)

1. **Sign up** at https://huggingface.co (free!)
2. Go to **Settings** → **Access Tokens**
3. Click **New Token**
4. Give it a name (e.g., "NFT Frame App")
5. Select **Read** permission
6. Click **Generate**
7. Copy the token (starts with `hf_...`)
8. Paste into the app's API Key field
9. Save configuration

**Benefits:**
- 🚀 Faster responses (no cold start)
- 📈 Higher rate limits
- ⚡ Priority API access

---

## Tips for Best Results

1. **Be specific:** "Make it a 16×20 gold frame" vs "change it"
2. **One change at a time:** Easier for AI to understand
3. **Use style keywords:** elegant, modern, classic, bold, minimal
4. **Reference dimensions:** "small QR code" or "2-inch border"
5. **Combine settings:** "wooden frame with cream mat and small QR code"

---

## Need Help?

- Check the chat messages for error details
- Try the quick prompt buttons to see examples
- Switch to Hugging Face if other providers have issues
- Manual controls are always available as fallback

Enjoy your AI-powered NFT framing! 🖼️✨
