import { EIP712Object } from './eip712.model';
import { Side } from './order-side.model';
import { SignatureType } from './signature-types.model';

export type OrderSignature = string;

export type OrderHash = string;

export interface OrderData {
    /**
     * Maker of the order, i.e the source of funds for the order
     */
    makerAddress: string;

    /**
     * If BUY, this is the tokenId of the asset to be bought
     */
    makerAssetId: string;

    /**
     * If SELL, this is the tokenId of the asset to be sold
     */
    takerAssetId: string;

    /**
     * Maker amount, i.e the max amount of tokens to be sold
     */
    makerAmount: string;

    /**
     * Taker amount, i.e the minimum amount of tokens to be received
     */
    takerAmount: string;

    /**
     * The side of the order, BUY or SELL
     */
    side: Side;

    /**
     * Fee rate, in basis points, charged to the order maker, charged on proceeds
     */
    feeRateBps: string;

    /**
     * Nonce used for onchain cancellations
     */
    nonce: string;

    /**
     * Signer of the order. Optional, if it is not present the signer is the maker of the order.
     */
    signer?: string;

    /**
     * Timestamp after which the order is expired.
     * Optional, if it is not present the value is '0' (no expiration)
     */
    expiration?: string;

    /**
     * Signature type used by the Order. Default value 'EOA'
     */
    signatureType?: SignatureType;
}

export interface Order extends EIP712Object {
    /**
     *  Unique salt to ensure entropy
     */
    salt: string;

    /**
     * Maker of the order, i.e the source of funds for the order
     */
    maker: string;

    /**
     * Signer of the order
     */
    signer: string;

    /**
     * Token Id of the CTF ERC1155 asset to be bought or sold.
     * If BUY, this is the tokenId of the asset to be bought, i.e the makerAssetId
     * If SELL, this is the tokenId of the asset to be sold, i.e the  takerAssetId
     */
    tokenId: string;

    /**
     * Maker amount, i.e the max amount of tokens to be sold
     */
    makerAmount: string;

    /**
     * Taker amount, i.e the minimum amount of tokens to be received
     */
    takerAmount: string;

    /**
     * The side of the order, BUY or SELL
     */
    side: Side;

    /**
     * Timestamp after which the order is expired
     */
    expiration: string;

    /**
     * Nonce used for onchain cancellations
     */
    nonce: string;

    /**
     * Fee rate, in basis points, charged to the order maker, charged on proceeds
     */
    feeRateBps: string;

    /**
     * Signature type used by the Order
     */
    signatureType: SignatureType;
}

export interface SignedOrder extends Order {
    /**
     * The order signature
     */
    signature: OrderSignature;
}
