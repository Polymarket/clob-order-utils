import { expect } from "chai";
import { ethers, Wallet } from "ethers";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { getContracts } from "../../src/networks";
import { EthersProviderConnector } from "../../src/connector/ethers-provider.connector";
import { getSignerFromWallet } from "../../src/connector/provider-overload";
import { ExchangeOrderBuilder } from "../../src/exchange.order.builder";
import { generateOrderSalt } from "../../src/utils";
import { Order, OrderData } from "../../src/model/order.model";
import { Side } from "../../src/model/order-side.model";

dotenvConfig({ path: resolve(__dirname, "../../.env") });

describe("exchange order builder", () => {
  let wallet: Wallet;
  let exchangeOrderBuilder: ExchangeOrderBuilder;

  beforeEach(async () => {
    const chainId = 80001;
    const contracts = getContracts(chainId);

    const provider = new ethers.providers.StaticJsonRpcProvider(
      "https://rpc-mumbai.matic.today"
    );

    // publicly known private key
    const privateKey =
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    wallet = new ethers.Wallet(privateKey).connect(provider);

    const jsonRpcSigner = getSignerFromWallet(wallet, chainId, provider);
    const connector = new EthersProviderConnector(jsonRpcSigner);

    exchangeOrderBuilder = new ExchangeOrderBuilder(
      contracts.Exchange,
      chainId,
      connector,
      generateOrderSalt
    );
  });

  describe("buildOrder", () => {
    it("random salt", () => {
      const order = exchangeOrderBuilder.buildOrder({
        makerAddress: "0x0000000000000000000000000000000000000000",
        makerAssetId: "1234",
        makerAmount: "100000000",
        takerAmount: "50000000",
        side: Side.BUY,
        feeRateBps: "100",
        nonce: "0",
      } as OrderData);

      expect(order).not.null;
      expect(order).not.undefined;
    });

    it("specific salt", () => {
      (exchangeOrderBuilder as any)["generateSalt"] = () => {
        return "479249096354";
      };

      const order = exchangeOrderBuilder.buildOrder({
        makerAddress: "0x0000000000000000000000000000000000000000",
        makerAssetId: "1234",
        makerAmount: "100000000",
        takerAmount: "50000000",
        side: Side.BUY,
        feeRateBps: "100",
        nonce: "0",
      } as OrderData);

      expect(order).not.null;
      expect(order).not.undefined;

      expect(order).deep.equal({
        salt: "479249096354",
        maker: "0x0000000000000000000000000000000000000000",
        signer: "0x0000000000000000000000000000000000000000",
        tokenId: "1234",
        makerAmount: "100000000",
        takerAmount: "50000000",
        side: 0,
        expiration: "0",
        nonce: "0",
        feeRateBps: "100",
        signatureType: 0,
      } as Order);
    });
  });

  describe("buildLimitOrderTypedData", () => {
    it("random salt", () => {
      const order = exchangeOrderBuilder.buildOrder({
        makerAddress: "0x0000000000000000000000000000000000000000",
        makerAssetId: "1234",
        makerAmount: "100000000",
        takerAmount: "50000000",
        side: Side.BUY,
        feeRateBps: "100",
        nonce: "0",
      } as OrderData);

      expect(order).not.null;
      expect(order).not.undefined;

      const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
      expect(orderTypedData).not.null;
      expect(orderTypedData).not.undefined;
    });

    it("specific salt", () => {
      (exchangeOrderBuilder as any)["generateSalt"] = () => {
        return "479249096354";
      };

      const order = exchangeOrderBuilder.buildOrder({
        makerAddress: "0x0000000000000000000000000000000000000000",
        makerAssetId: "1234",
        makerAmount: "100000000",
        takerAmount: "50000000",
        side: Side.BUY,
        feeRateBps: "100",
        nonce: "0",
      } as OrderData);

      expect(order).not.null;
      expect(order).not.undefined;

      const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
      expect(orderTypedData).not.null;
      expect(orderTypedData).not.undefined;

      expect(orderTypedData).deep.equal({
        primaryType: "Order",
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          Order: [
            { name: "salt", type: "uint256" },
            { name: "maker", type: "address" },
            { name: "signer", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "makerAmount", type: "uint256" },
            { name: "takerAmount", type: "uint256" },
            { name: "side", type: "uint256" },
            { name: "expiration", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "feeRateBps", type: "uint256" },
            { name: "signatureType", type: "uint256" },
          ],
        },
        domain: {
          name: "Polymarket CTF Exchange",
          version: "1",
          chainId: 80001,
          verifyingContract: "0x0000000000000000000000000000000000000000",
        },
        message: {
          salt: "479249096354",
          maker: "0x0000000000000000000000000000000000000000",
          signer: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: 0,
          expiration: "0",
          nonce: "0",
          feeRateBps: "100",
          signatureType: 0,
        },
      });
    });
  });

  describe("buildOrderSignature", async () => {
    it("random salt", async () => {
      const order = exchangeOrderBuilder.buildOrder({
        makerAddress: "0x0000000000000000000000000000000000000000",
        makerAssetId: "1234",
        makerAmount: "100000000",
        takerAmount: "50000000",
        side: Side.BUY,
        feeRateBps: "100",
        nonce: "0",
      } as OrderData);

      expect(order).not.null;
      expect(order).not.undefined;

      const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
      expect(orderTypedData).not.null;
      expect(orderTypedData).not.undefined;

      const orderSignature = await exchangeOrderBuilder.buildOrderSignature(
        wallet.address,
        orderTypedData
      );
      expect(orderSignature).not.null;
      expect(orderSignature).not.undefined;
    });

    it("specific salt", async () => {
      (exchangeOrderBuilder as any)["generateSalt"] = () => {
        return "479249096354";
      };

      const order = exchangeOrderBuilder.buildOrder({
        makerAddress: "0x0000000000000000000000000000000000000000",
        makerAssetId: "1234",
        makerAmount: "100000000",
        takerAmount: "50000000",
        side: Side.BUY,
        feeRateBps: "100",
        nonce: "0",
      } as OrderData);

      expect(order).not.null;
      expect(order).not.undefined;

      const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
      expect(orderTypedData).not.null;
      expect(orderTypedData).not.undefined;

      const orderSignature = await exchangeOrderBuilder.buildOrderSignature(
        wallet.address,
        orderTypedData
      );
      expect(orderSignature).not.null;
      expect(orderSignature).not.undefined;

      expect(orderSignature).deep.equal(
        "0x5d03542357197128ce932d72eae5d9545b74b0795a13e2c69def8eff77f7d01e26944b8288cf0136dfd05f1e9065731e2d4fea4014ce1b615f085bdfe7ded9d31b"
      );
    });
  });

  describe("buildOrderHash", () => {
    it("random salt", () => {
      const order = exchangeOrderBuilder.buildOrder({
        makerAddress: "0x0000000000000000000000000000000000000000",
        makerAssetId: "1234",
        makerAmount: "100000000",
        takerAmount: "50000000",
        side: Side.BUY,
        feeRateBps: "100",
        nonce: "0",
      } as OrderData);

      expect(order).not.null;
      expect(order).not.undefined;

      const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
      expect(orderTypedData).not.null;
      expect(orderTypedData).not.undefined;

      const orderHash = exchangeOrderBuilder.buildOrderHash(orderTypedData);
      expect(orderHash).not.null;
      expect(orderHash).not.undefined;
    });

    it("specific salt", () => {
      (exchangeOrderBuilder as any)["generateSalt"] = () => {
        return "479249096354";
      };

      const order = exchangeOrderBuilder.buildOrder({
        makerAddress: "0x0000000000000000000000000000000000000000",
        makerAssetId: "1234",
        makerAmount: "100000000",
        takerAmount: "50000000",
        side: Side.BUY,
        feeRateBps: "100",
        nonce: "0",
      } as OrderData);

      expect(order).not.null;
      expect(order).not.undefined;

      const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
      expect(orderTypedData).not.null;
      expect(orderTypedData).not.undefined;

      const orderHash = exchangeOrderBuilder.buildOrderHash(orderTypedData);
      expect(orderHash).not.null;
      expect(orderHash).not.undefined;

      expect(orderHash).deep.equal(
        "0x83529202accecadbac50de705225f9c31455a7c8f32ddc908d75e6794b1c93d3"
      );
    });
  });

  describe("buildSignedOrder", async () => {
    it("random salt", async () => {
      const signedOrder = await exchangeOrderBuilder.buildSignedOrder(
        wallet.address,
        {
          makerAddress: "0x0000000000000000000000000000000000000000",
          makerAssetId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData
      );
      expect(signedOrder).not.null;
      expect(signedOrder).not.undefined;
    });

    it("specific salt", async () => {
      (exchangeOrderBuilder as any)["generateSalt"] = () => {
        return "479249096354";
      };

      const signedOrder = await exchangeOrderBuilder.buildSignedOrder(
        wallet.address,
        {
          makerAddress: "0x0000000000000000000000000000000000000000",
          makerAssetId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData
      );
      expect(signedOrder).not.null;
      expect(signedOrder).not.undefined;

      expect(signedOrder).deep.equal({
        salt: "479249096354",
        maker: "0x0000000000000000000000000000000000000000",
        signer: "0x0000000000000000000000000000000000000000",
        tokenId: "1234",
        makerAmount: "100000000",
        takerAmount: "50000000",
        side: 0,
        expiration: "0",
        nonce: "0",
        feeRateBps: "100",
        signatureType: 0,
        signature:
          "0x5d03542357197128ce932d72eae5d9545b74b0795a13e2c69def8eff77f7d01e26944b8288cf0136dfd05f1e9065731e2d4fea4014ce1b615f085bdfe7ded9d31b",
      });
    });
  });
});
