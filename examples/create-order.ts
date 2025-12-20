import "dotenv/config";

import { createLimitOrder, signOrder } from "../src"; // если нужно, изменим путь

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`[clob-order-utils] Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

async function main() {
  const privateKey = requireEnv("PRIVATE_KEY");
  const exchangeAddress = requireEnv("EXCHANGE_ADDRESS");
  const chainIdRaw = requireEnv("CHAIN_ID");

  const chainId = Number(chainIdRaw);
  if (!Number.isFinite(chainId)) {
    console.error(
      `[clob-order-utils] Invalid CHAIN_ID, expected number, got: ${chainIdRaw}`,
    );
    process.exit(1);
  }

  const order = createLimitOrder({
    marketId: "MARKET_ID_HERE",
    outcome: 0,
    price: "0.5",
    size: "1",
    side: "buy",
    maker: exchangeAddress,
    chainId,
  });

  const signed = await signOrder(order, privateKey);
  console.log(JSON.stringify(signed, null, 2));
}

main().catch((err) => {
  console.error("[clob-order-utils] Unexpected error:", err);
  process.exit(1);
});
