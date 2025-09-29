# Hyperliquid Frontend Demo

Interactive React frontend demonstrating Hyperliquid TypeScript SDK features with real testnet data.

## Features

- **Info Queries**: Fetch real open orders from Hyperliquid testnet
- **Order Placement**: Place real orders with dry-run safety
- **Live Data**: Real-time WebSocket subscriptions to market updates

## Setup

1. **Copy environment file**:
   ```bash
   cp env.example .env
   ```

2. **Configure environment variables** in `.env`:
   ```bash
   # REQUIRED: Must be 'true' to run (safety gate)
   VITE_HL_IS_TESTNET=true
   
   # Optional: Custom API endpoints (must contain 'testnet')
   VITE_HL_API_BASE_URL=https://api.testnet.hyperliquid.xyz
   VITE_HL_WS_URL=wss://api.testnet.hyperliquid.xyz
   
   # Optional: Default testnet private key (ONLY testnet keys!)
   VITE_WALLET_PRIVATE_KEY=
   
   # Optional: Default values for forms
   VITE_TEST_USER_ADDRESS=0x0000000000000000000000000000000000000000
   VITE_DEFAULT_MARKET_ID=0
   VITE_DEFAULT_PRICE=1000
   VITE_DEFAULT_SIZE=0.001
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open browser**: Navigate to `http://localhost:3000`

## Safety Features

- ✅ **Testnet-only**: App refuses to run unless `VITE_HL_IS_TESTNET=true`
- ✅ **URL validation**: Custom URLs must contain 'testnet'
- ✅ **Dry-run by default**: Orders are dry-run unless explicitly enabled
- ✅ **Environment isolation**: Sensitive data stored in `.env` files
- ✅ **Error handling**: Clear error messages for configuration issues

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_HL_IS_TESTNET` | ✅ | Must be 'true' (safety gate) |
| `VITE_HL_API_BASE_URL` | ❌ | Custom HTTP API endpoint |
| `VITE_HL_WS_URL` | ❌ | Custom WebSocket endpoint |
| `VITE_WALLET_PRIVATE_KEY` | ❌ | Default testnet private key |
| `VITE_TEST_USER_ADDRESS` | ❌ | Default address for info queries |
| `VITE_DEFAULT_MARKET_ID` | ❌ | Default market ID for orders |
| `VITE_DEFAULT_PRICE` | ❌ | Default price for orders |
| `VITE_DEFAULT_SIZE` | ❌ | Default size for orders |

## Usage

1. **Info Queries**: Enter a testnet address and fetch open orders
2. **Order Placement**: Configure order parameters and place orders (dry-run by default)
3. **Live Data**: Connect to WebSocket for real-time market updates

## Security Notes

- ⚠️ **NEVER** use mainnet private keys
- ⚠️ **NEVER** set `VITE_HL_IS_TESTNET=false`
- ⚠️ **ALWAYS** verify URLs contain 'testnet'
- ⚠️ **KEEP** `.env` files secure and never commit them



