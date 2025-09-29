import "dotenv/config";

export function requireTestnet() {
  const isTestnet = process.env.HL_IS_TESTNET === "true";
  if (!isTestnet) {
    console.error("ERROR: HL_IS_TESTNET !== 'true'. This demo ONLY runs on testnet. Set HL_IS_TESTNET=true in .env.");
    process.exit(1);
  }
}

export function assertUrlIsTestnet(url?: string | null) {
  if (!url) return;
  if (!/testnet/i.test(url)) {
    console.error(`ERROR: Provided URL does not look like a testnet URL: ${url}`);
    console.error("To avoid accidental mainnet requests, the demo requires 'testnet' in custom URLs.");
    process.exit(1);
  }
}



