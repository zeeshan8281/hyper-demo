import "dotenv/config";
import * as hl from "@nktkas/hyperliquid";
import { requireTestnet, assertUrlIsTestnet } from "./utils";

async function main() {
  requireTestnet();
  assertUrlIsTestnet(process.env.HL_API_BASE_URL ?? null);

  const transport = new hl.HttpTransport({
    isTestnet: true,
    baseUrl: process.env.HL_API_BASE_URL
  });

  const infoClient = new hl.InfoClient({ transport });

  const userAddr = process.env.TEST_USER_ADDRESS ?? "0x0000000000000000000000000000000000000000";
  try {
    console.log("Fetching open orders for:", userAddr);
    const openOrders = await infoClient.openOrders({ user: userAddr });
    console.log(JSON.stringify(openOrders ?? {}, null, 2));
  } catch (err) {
    console.error("Info query failed:", err);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });



