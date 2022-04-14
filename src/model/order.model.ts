import { SignatureType } from "../signature-types";
import { EIP712Object } from "./eip712.model";

export type LimitOrderSignature = string;

export type LimitOrderHash = string;

export interface LimitOrderData {
    exchangeAddress: string;
    makerAddress: string;
    takerAddress?: string; // Optional, by default = ZERO_ADDRESS
    makerAssetAddress: string;
    makerAssetID?: string;
    takerAssetAddress: string;
    takerAssetID?: string;
    makerAmount: string;
    takerAmount: string;
    signer?: string // Address performing the signing
    sigType?: SignatureType; // Signature scheme being used
    expiry?: number;
    nonce?: number;
    predicate?: string;
    permit?: string;
    interaction?: string;
}

export interface LimitOrder extends EIP712Object {
    salt: string;
    makerAsset: string;
    takerAsset: string;
    makerAssetData: string;
    takerAssetData: string;
    getMakerAmount: string;
    getTakerAmount: string;
    predicate: string;
    permit: string;
    interaction: string;
    signer: string;
    sigType: SignatureType;
}

export type MarketOrderSignature = string;

export type MarketOrderHash = string;

export interface MarketOrderData {
    exchangeAddress: string;
    makerAddress: string;
    takerAddress?: string; // Optional, by default = ZERO_ADDRESS
    makerAssetAddress: string;
    makerAssetID?: string;
    takerAssetAddress: string;
    takerAssetID?: string;
    makerAmount: string;
    signer?: string;
    sigType?: SignatureType;
}

export interface MarketOrder extends EIP712Object {
    salt: string;
    maker: string;
    makerAsset: string;
    makerAmount: string;
    makerAssetID: string;
    takerAsset: string;
    takerAssetID: string;
    signer: string;
    sigType: SignatureType;
}

export type OrderType = string;


// Standard LimitOrder object to be used as the entry point in the CLOB
export interface LimitOrderAndSignature {
    order: LimitOrder;
    signature: LimitOrderSignature;
    orderType: OrderType;
}

// Standard MarketOrder object to be used as entry points for Market orders in the CLOB
export interface MarketOrderAndSignature {
    order: MarketOrder;
    signature: MarketOrderSignature;
    orderType: OrderType;
    minAmountReceived?: number; // Optional slippage protection field
}

export enum LimitOrderProtocolMethods {
    getMakerAmount = "getMakerAmount",
    getTakerAmount = "getTakerAmount",
    fillOrder = "fillOrder",
    cancelOrder = "cancelOrder",
    nonce = "nonce",
    advanceNonce = "advanceNonce",
    increaseNonce = "increaseNonce",
    and = "and",
    or = "or",
    eq = "eq",
    lt = "lt",
    gt = "gt",
    timestampBelow = "timestampBelow",
    nonceEquals = "nonceEquals",
    remaining = "remaining",
    transferFrom = "transferFrom",
    checkPredicate = "checkPredicate",
    remainingsRaw = "remainingsRaw",
    simulateCalls = "simulateCalls",
    DOMAIN_SEPARATOR = "DOMAIN_SEPARATOR",
    batchFillOrders = "batchFillOrders",
}
