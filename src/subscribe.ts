import "dotenv/config";
import * as hl from "@nktkas/hyperliquid";
import { requireTestnet, assertUrlIsTestnet } from "./utils";

async function main() {
  requireTestnet();
  assertUrlIsTestnet(process.env.HL_WS_URL ?? null);

  const wsTransport = new hl.WebSocketTransport({
    url: process.env.HL_WS_URL,
    isTestnet: true,
    reconnect: { maxRetries: 5 }
  });

  const subsClient = new hl.SubscriptionClient({ transport: wsTransport });

  console.log("Subscribing to all market mid updates (testnet)...");
  const subscription = await subsClient.allMids((event: any) => {
    console.log("Event:", JSON.stringify(event, null, 2));
  });

  // Keep alive for 30s then unsubscribe (easy demo)
  setTimeout(async () => {
    console.log("Unsubscribing and closing WS...");
    try {
      await subscription.unsubscribe();
      await wsTransport.close();
    } catch (e) {
      // ignore
    }
    process.exit(0);
  }, 30_000);
}

main().catch((e) => { console.error(e); process.exit(1); });



