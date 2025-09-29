import "dotenv/config";
import * as hl from "@nktkas/hyperliquid";
import { requireTestnet, assertUrlIsTestnet } from "./utils";

/**
 * Behavior:
 * - Refuses to run unless HL_IS_TESTNET=true
 * - If WALLET_PRIVATE_KEY is missing, script builds the payload and prints it (dry-run)
 * - If WALLET_PRIVATE_KEY is present but DRY_RUN=true (default), it will still not send by default.
 * - To actually send, set DRY_RUN=false in .env (and ensure the key is testnet-only).
 */

async function main() {
  requireTestnet();
  assertUrlIsTestnet(process.env.HL_API_BASE_URL ?? null);

  const pk = process.env.WALLET_PRIVATE_KEY?.trim();
  const dryRunEnv = process.env.DRY_RUN ?? "true";
  const dryRun = dryRunEnv !== "false";

  if (!pk) {
    console.warn("No WALLET_PRIVATE_KEY set — running in build-only mode (dry-run).");
  } else {
    console.warn("WALLET_PRIVATE_KEY provided. Ensure this is a testnet key.");
    if (dryRun) {
      console.warn("DRY_RUN is enabled. The order will NOT be broadcast. Set DRY_RUN=false to send (dangerous).");
    }
  }

  const transport = new hl.HttpTransport({
    isTestnet: true,
    baseUrl: process.env.HL_API_BASE_URL
  });

  // NOTE: The SDK in the upstream repo accepts different wallet integrations.
  // For safety here we prefer to build the request and only send if user explicitly opts in.
  const exchClient = new hl.ExchangeClient({
    transport,
    // If SDK supports passing raw private key, you can pass pk here. Many SDKs expect a wallet client object.
    wallet: pk ? pk : undefined
  });

  // --- Build demo order payload (adjust market id/price/size for the testnet market) ---
  const orderPayload = {
    orders: [
      {
        a: 0,              // market id (example) - replace with a real testnet market id
        b: true,           // buy
        p: "1000",         // price (example)
        s: "0.001",        // size (example)
        r: false,          // reduceOnly
        t: { limit: { tif: "Gtc" } }
      }
    ],
    grouping: "na"
  };

  console.log("Prepared order payload:");
  console.log(JSON.stringify(orderPayload, null, 2));

  if (!pk) {
    console.log("Dry-run: no key provided, not signing/sending.");
    process.exit(0);
  }

  if (dryRun) {
    console.log("Dry-run mode enabled: constructed payload but not broadcasting. Set DRY_RUN=false to actually send.");
    process.exit(0);
  }

  // Final safety: ensure transport flagged as testnet
  if ((transport as any).isTestnet !== true) {
    console.error("Transport is not flagged as testnet. Aborting.");
    process.exit(1);
  }

  try {
    console.log("Sending order to testnet...");
    const res = await exchClient.order(orderPayload);
    console.log("Order response:");
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("Send failed:", err);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });



