import "dotenv/config";

const cmd = process.argv[2] ?? process.env.CMD ?? "info";

if (cmd === "info") {
  await import("./info");
} else if (cmd === "order") {
  await import("./placeOrder");
} else if (cmd === "subs") {
  await import("./subscribe");
} else {
  console.log("usage: npm run dev -- (info|order|subs)");
}



