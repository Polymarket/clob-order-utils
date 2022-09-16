import { expect } from "chai";
import { ethers, Wallet } from "ethers";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { getContracts } from "../../src/networks";
import { EthersProviderConnector } from "../../src/connector/ethers-provider.connector";
import { getSignerFromWallet } from "../../src/connector/provider-overload";
import { CTFExchangeOrderFacade } from "../../src/ctf-exchange.order.facade";
import { CTFExchangeOrderBuilder } from "../../src/ctf-exchange.order.builder";
import { generateOrderSalt } from "../../src/utils";
import { OrderData } from "../../src/model/order.model";
import { Side } from "../../src/model/order-side.model";
import { ZX } from "../../src/ctf-exchange.order.const";

dotenvConfig({ path: resolve(__dirname, "../../.env") });

describe("ctf exchange order facade", () => {
  let wallet: Wallet;
  let cTFExchangeOrderFacade: CTFExchangeOrderFacade;
  let cTFExchangeOrderBuilder: CTFExchangeOrderBuilder;

  beforeEach(async () => {
    const chainId = 80001;
    const contracts = getContracts(chainId);

    const provider = new ethers.providers.StaticJsonRpcProvider(
      `${process.env.RPC_URL}`
    );

    wallet = new ethers.Wallet(`${process.env.PK}`).connect(provider);

    const jsonRpcSigner = getSignerFromWallet(wallet, chainId, provider);
    const connector = new EthersProviderConnector(jsonRpcSigner);

    cTFExchangeOrderFacade = new CTFExchangeOrderFacade(
      contracts.CTFExchange,
      connector
    );

    cTFExchangeOrderBuilder = new CTFExchangeOrderBuilder(
      contracts.CTFExchange,
      chainId,
      connector,
      generateOrderSalt
    );
  });

  describe("fillOrder", async () => {
    it("random salt", async () => {
      const signedOrder = await cTFExchangeOrderBuilder.buildSignedOrder(
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

      const fillOrderContractCallData = cTFExchangeOrderFacade.fillOrder(
        signedOrder,
        "100000000"
      );

      expect(fillOrderContractCallData).not.null;
      expect(fillOrderContractCallData).not.undefined;
      expect(fillOrderContractCallData).not.empty;
    });

    it("specific salt", async () => {
      (cTFExchangeOrderBuilder as any)["generateSalt"] = () => {
        return "224417520696";
      };

      const signedOrder = await cTFExchangeOrderBuilder.buildSignedOrder(
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

      const fillOrderContractCallData = cTFExchangeOrderFacade.fillOrder(
        signedOrder,
        "100000000"
      );

      expect(fillOrderContractCallData).not.null;
      expect(fillOrderContractCallData).not.undefined;
      expect(fillOrderContractCallData).not.empty;

      // pre-calculated using https://abi.hashex.org/
      const preCalculated =
        "8b5ea65500000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000005f5e1000000000000000000000000000000000000000000000000000000003440539c380000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004d20000000000000000000000000000000000000000000000000000000005f5e1000000000000000000000000000000000000000000000000000000000002faf0800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000041a52ff1c86ab9b6798ea4fe7b51bffbd0d34a65620dc3bf409e837a218c68545019f8e1e0d59f2d5653fa8efe6badf328541ddfb3c37795f9bb26cbc85e5ef4161b00000000000000000000000000000000000000000000000000000000000000";
      expect(ZX + preCalculated).equal(fillOrderContractCallData);
    });
  });

  describe("fillOrders", async () => {
    it("random salt", async () => {
      const signedOrder_1 = await cTFExchangeOrderBuilder.buildSignedOrder(
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
      expect(signedOrder_1).not.null;
      expect(signedOrder_1).not.undefined;

      const signedOrder_2 = await cTFExchangeOrderBuilder.buildSignedOrder(
        wallet.address,
        {
          makerAddress: "0x0000000000000000000000000000000000000001",
          makerAssetId: "1234",
          makerAmount: "50000000",
          takerAmount: "25000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData
      );
      expect(signedOrder_1).not.null;
      expect(signedOrder_1).not.undefined;

      const fillOrdersContractCallData = cTFExchangeOrderFacade.fillOrders(
        [signedOrder_1, signedOrder_2],
        ["100000000", "50000000"]
      );

      expect(fillOrdersContractCallData).not.null;
      expect(fillOrdersContractCallData).not.undefined;
      expect(fillOrdersContractCallData).not.empty;
    });

    it("specific salt", async () => {
      (cTFExchangeOrderBuilder as any)["generateSalt"] = () => {
        return "1161141619767";
      };
      const signedOrder_1 = await cTFExchangeOrderBuilder.buildSignedOrder(
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
      expect(signedOrder_1).not.null;
      expect(signedOrder_1).not.undefined;

      (cTFExchangeOrderBuilder as any)["generateSalt"] = () => {
        return "647831347297";
      };

      const signedOrder_2 = await cTFExchangeOrderBuilder.buildSignedOrder(
        wallet.address,
        {
          makerAddress: "0x0000000000000000000000000000000000000001",
          makerAssetId: "1234",
          makerAmount: "50000000",
          takerAmount: "25000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData
      );
      expect(signedOrder_1).not.null;
      expect(signedOrder_1).not.undefined;

      const fillOrdersContractCallData = cTFExchangeOrderFacade.fillOrders(
        [signedOrder_1, signedOrder_2],
        ["100000000", "50000000"]
      );

      expect(fillOrdersContractCallData).not.null;
      expect(fillOrdersContractCallData).not.undefined;
      expect(fillOrdersContractCallData).not.empty;

      const preCalculated =
        "7b39878a000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000004a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000002400000000000000000000000000000000000000000000000000000010e596f0c370000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004d20000000000000000000000000000000000000000000000000000000005f5e1000000000000000000000000000000000000000000000000000000000002faf0800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000041d4b4cd9efc2f1768a8f00c4bb50124398ea6cfa8e6575a3e66c6c3c01a5fb6c32699857507864bbebc864aa93b6d4b97daba0a9bca0f8467af37fe16d441489e1b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000096d5c1e0610000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000004d20000000000000000000000000000000000000000000000000000000002faf08000000000000000000000000000000000000000000000000000000000017d7840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000004179ab65c1ef6dfef13c259c224486adf43ccb115c290779c75ef7714013e204964a124662c5153de2533fda2ee478bc893c372e4cb753930dfb4dca0baaa82e1f1c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000005f5e1000000000000000000000000000000000000000000000000000000000002faf080";
      expect(ZX + preCalculated).equal(fillOrdersContractCallData);
    });
  });

  describe("matchOrders", async () => {
    it("random salt", async () => {
      const takerOrder = await cTFExchangeOrderBuilder.buildSignedOrder(
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
      expect(takerOrder).not.null;
      expect(takerOrder).not.undefined;

      const makerOrder_1 = await cTFExchangeOrderBuilder.buildSignedOrder(
        wallet.address,
        {
          makerAddress: "0x0000000000000000000000000000000000000001",
          makerAssetId: "1234",
          makerAmount: "50000000",
          takerAmount: "25000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData
      );
      expect(makerOrder_1).not.null;
      expect(makerOrder_1).not.undefined;

      const makerOrder_2 = await cTFExchangeOrderBuilder.buildSignedOrder(
        wallet.address,
        {
          makerAddress: "0x0000000000000000000000000000000000000002",
          makerAssetId: "1234",
          makerAmount: "50000000",
          takerAmount: "25000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData
      );
      expect(makerOrder_2).not.null;
      expect(makerOrder_2).not.undefined;

      const matchOrdersContractCallData = cTFExchangeOrderFacade.matchOrders(
        takerOrder,
        [makerOrder_1, makerOrder_2],
        "100000000",
        ["50000000", "50000000"]
      );

      expect(matchOrdersContractCallData).not.null;
      expect(matchOrdersContractCallData).not.undefined;
      expect(matchOrdersContractCallData).not.empty;
    });

    it("specific salt", async () => {
      (cTFExchangeOrderBuilder as any)["generateSalt"] = () => {
        return "992714752899";
      };
      const takerOrder = await cTFExchangeOrderBuilder.buildSignedOrder(
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
      expect(takerOrder).not.null;
      expect(takerOrder).not.undefined;

      (cTFExchangeOrderBuilder as any)["generateSalt"] = () => {
        return "1513723728864";
      };
      const makerOrder_1 = await cTFExchangeOrderBuilder.buildSignedOrder(
        wallet.address,
        {
          makerAddress: "0x0000000000000000000000000000000000000001",
          makerAssetId: "1234",
          makerAmount: "50000000",
          takerAmount: "25000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData
      );
      expect(makerOrder_1).not.null;
      expect(makerOrder_1).not.undefined;

      (cTFExchangeOrderBuilder as any)["generateSalt"] = () => {
        return "1635110361894";
      };
      const makerOrder_2 = await cTFExchangeOrderBuilder.buildSignedOrder(
        wallet.address,
        {
          makerAddress: "0x0000000000000000000000000000000000000002",
          makerAssetId: "1234",
          makerAmount: "50000000",
          takerAmount: "25000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData
      );
      expect(makerOrder_2).not.null;
      expect(makerOrder_2).not.undefined;

      const matchOrdersContractCallData = cTFExchangeOrderFacade.matchOrders(
        takerOrder,
        [makerOrder_1, makerOrder_2],
        "100000000",
        ["50000000", "50000000"]
      );

      expect(matchOrdersContractCallData).not.null;
      expect(matchOrdersContractCallData).not.undefined;
      expect(matchOrdersContractCallData).not.empty;

      const preCalculated =
        "f472558b000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000005f5e10000000000000000000000000000000000000000000000000000000000000006e0000000000000000000000000000000000000000000000000000000e7226903830000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004d20000000000000000000000000000000000000000000000000000000005f5e1000000000000000000000000000000000000000000000000000000000002faf0800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000041080faec4c83de71199ca75770bd14b32438683d619d50ba4482e109c5544401a026cc869fe74071e4963b72ba240ed24943e9f3455c0b0d6e8f30486ae0cf55a1b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000002400000000000000000000000000000000000000000000000000000016070f713e00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000004d20000000000000000000000000000000000000000000000000000000002faf08000000000000000000000000000000000000000000000000000000000017d7840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000004116451bcb5b5007a77a4cf308f981308fe7943e4780e1aed5e82c7fd0332a6d297a265e03e8bebc6a28eb7cb6ed4058abba1761d13a970ede3994d9da6117d4da1c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000017cb42c1b260000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000004d20000000000000000000000000000000000000000000000000000000002faf08000000000000000000000000000000000000000000000000000000000017d7840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000004174c8a0573eb66f55fe6926fa3944c54bb09aeb780df28c37ac32e967bd87187d004f60b27ebadb7eb5aa38448831a9a820261f44d04dafb61c59abf68d8aa7121b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000002faf0800000000000000000000000000000000000000000000000000000000002faf080";
      expect(ZX + preCalculated).equal(matchOrdersContractCallData);
    });
  });

  describe("cancelOrder", async () => {
    it("random salt", async () => {
      const signedOrder = await cTFExchangeOrderBuilder.buildSignedOrder(
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

      const cancelOrderContractCallData =
        cTFExchangeOrderFacade.cancelOrder(signedOrder);

      expect(cancelOrderContractCallData).not.null;
      expect(cancelOrderContractCallData).not.undefined;
      expect(cancelOrderContractCallData).not.empty;
    });

    it("specific salt", async () => {
      (cTFExchangeOrderBuilder as any)["generateSalt"] = () => {
        return "880436405805";
      };

      const signedOrder = await cTFExchangeOrderBuilder.buildSignedOrder(
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

      const cancelOrderContractCallData =
        cTFExchangeOrderFacade.cancelOrder(signedOrder);

      expect(cancelOrderContractCallData).not.null;
      expect(cancelOrderContractCallData).not.undefined;
      expect(cancelOrderContractCallData).not.empty;

      const preCalculated =
        "0a9002c20000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000ccfe19662d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004d20000000000000000000000000000000000000000000000000000000005f5e1000000000000000000000000000000000000000000000000000000000002faf0800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000041d4bb8b0a7a5f4ed1aafd4ea8ca957eaa4338b87f6aed656a536da1fd35bbe4604e1937c23fb37fcbfa8e4d5c1a172bd0142e7f814d0d439c6a095b148c1b3bee1c00000000000000000000000000000000000000000000000000000000000000";
      expect(ZX + preCalculated).equal(cancelOrderContractCallData);
    });
  });

  describe("cancelOrders", async () => {
    it("random salt", async () => {
      const signedOrder = await cTFExchangeOrderBuilder.buildSignedOrder(
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

      const cancelOrdersContractCallData = cTFExchangeOrderFacade.cancelOrders([
        signedOrder,
      ]);

      expect(cancelOrdersContractCallData).not.null;
      expect(cancelOrdersContractCallData).not.undefined;
      expect(cancelOrdersContractCallData).not.empty;
    });

    it("specific salt", async () => {
      (cTFExchangeOrderBuilder as any)["generateSalt"] = () => {
        return "880436405805";
      };

      const signedOrder = await cTFExchangeOrderBuilder.buildSignedOrder(
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

      const cancelOrdersContractCallData = cTFExchangeOrderFacade.cancelOrders([
        signedOrder,
      ]);

      expect(cancelOrdersContractCallData).not.null;
      expect(cancelOrdersContractCallData).not.undefined;
      expect(cancelOrdersContractCallData).not.empty;

      const preCalculated =
        "62afc5ac000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000ccfe19662d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004d20000000000000000000000000000000000000000000000000000000005f5e1000000000000000000000000000000000000000000000000000000000002faf0800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000041d4bb8b0a7a5f4ed1aafd4ea8ca957eaa4338b87f6aed656a536da1fd35bbe4604e1937c23fb37fcbfa8e4d5c1a172bd0142e7f814d0d439c6a095b148c1b3bee1c00000000000000000000000000000000000000000000000000000000000000";
      expect(ZX + preCalculated).equal(cancelOrdersContractCallData);
    });
  });

  it("incrementNonce", () => {
    const incrementNonceContractData = cTFExchangeOrderFacade.incrementNonce();

    expect(incrementNonceContractData).not.null;
    expect(incrementNonceContractData).not.undefined;
    expect(incrementNonceContractData).not.empty;

    const preCalculated = "627cdcb9";
    expect(ZX + preCalculated).equal(incrementNonceContractData);
  });

  it("isValidNonce", () => {
    const isValidNonceContractData = cTFExchangeOrderFacade.isValidNonce(
      "0x0000000000000000000000000000000000000000",
      "100"
    );

    expect(isValidNonceContractData).not.null;
    expect(isValidNonceContractData).not.undefined;
    expect(isValidNonceContractData).not.empty;

    const preCalculated =
      "0647ee2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064";
    expect(ZX + preCalculated).equal(isValidNonceContractData);
  });
});
