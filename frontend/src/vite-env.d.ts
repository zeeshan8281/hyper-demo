/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HL_IS_TESTNET: string
  readonly VITE_HL_API_BASE_URL: string
  readonly VITE_HL_WS_URL: string
  readonly VITE_WALLET_PRIVATE_KEY: string
  readonly VITE_TEST_USER_ADDRESS: string
  readonly VITE_DEFAULT_MARKET_ID: string
  readonly VITE_DEFAULT_PRICE: string
  readonly VITE_DEFAULT_SIZE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}



