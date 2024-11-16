# TriggerAgent 🚀

Personal AI Assistant functioning inside Trigger.

### 🌟 Key Features

- **🤑 Token Management**: Create and manage ERC-20 tokens with ease.
- **🌟 NFT Deployment**: Deploy and mint NFTs autonomously.
- **💸 Asset Transfers**: Transfer assets between addresses without manual intervention.
- **📈 Balance Checks**: Keep tabs on wallet balances on the fly.
- **⛽ ETH Faucet Requests**: Automatically request testnet ETH when needed.

### 1️⃣ Prerequisites
- Python 3.7+
- `pip install cdp-sdk`
- `pip install openai`
- `pip install git+ssh://git@github.com/openai/swarm.git`
- `pip install python-dotenv`

### API Configuration
Add your secrets to Replit's Secret Manager or set them as environment variables:
- `CDP_API_KEY_NAME`: Your CDP API key name.
- `CDP_PRIVATE_KEY`: Your CDP private key.
- `OPENAI_API_KEY`: Your OpenAI API key.

### Running the Agent

```bash
python run.py
```