// Environment variable utilities with safety checks

export function requireTestnet() {
  const isTestnet = import.meta.env.VITE_HL_IS_TESTNET === "true";
  if (!isTestnet) {
    throw new Error("ERROR: VITE_HL_IS_TESTNET !== 'true'. This demo ONLY runs on testnet. Set VITE_HL_IS_TESTNET=true in .env.");
  }
}

export function assertUrlIsTestnet(url?: string | null) {
  if (!url) return;
  if (!/testnet/i.test(url)) {
    throw new Error(`ERROR: Provided URL does not look like a testnet URL: ${url}. To avoid accidental mainnet requests, the demo requires 'testnet' in custom URLs.`);
  }
}

export function getEnvConfig() {
  requireTestnet();
  
  const apiBaseUrl = import.meta.env.VITE_HL_API_BASE_URL;
  const wsUrl = import.meta.env.VITE_HL_WS_URL;
  
  assertUrlIsTestnet(apiBaseUrl);
  assertUrlIsTestnet(wsUrl);
  
  return {
    isTestnet: true,
    apiBaseUrl: apiBaseUrl || undefined, // Use default if not set
    wsUrl: wsUrl || undefined, // Use default if not set
    defaultPrivateKey: import.meta.env.VITE_WALLET_PRIVATE_KEY || '',
    defaultUserAddress: import.meta.env.VITE_TEST_USER_ADDRESS || '0x0000000000000000000000000000000000000000',
    defaultMarketId: import.meta.env.VITE_DEFAULT_MARKET_ID || '0',
    defaultPrice: import.meta.env.VITE_DEFAULT_PRICE || '1000',
    defaultSize: import.meta.env.VITE_DEFAULT_SIZE || '0.001'
  };
}



