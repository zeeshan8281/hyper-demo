# hyperdemo — Hyperliquid Testnet Demo

Minimal demo showing basic Hyperliquid TypeScript SDK usage:
- Info queries (HTTP)
- Place order (HTTP) — dry-run by default
- Subscriptions (WebSocket)

## Quick start

1. Copy `env.example` -> `.env` and set:
   - `HL_IS_TESTNET=true` (required)
   - optionally `HL_API_BASE_URL` or `HL_WS_URL` (must contain 'testnet')
   - optionally `WALLET_PRIVATE_KEY` (testnet only)

2. Install:
   ```bash
   npm install
   ```

3. Run:
   - Info: `npm run info`
   - Subs: `npm run subs`
   - Place order (dry-run by default): `npm run order`

Notes:
- The code will abort if `HL_IS_TESTNET !== 'true'`.
- Custom URLs must include `testnet` (simple guard).
- Do NOT use mainnet keys here.



