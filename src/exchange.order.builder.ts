import {
    SignTypedDataVersion,
    TypedDataUtils,
    TypedMessage,
} from '@metamask/eth-sig-util';
import { ProviderConnector } from './connector/provider.connector';
import {
    EIP712_DOMAIN,
    ORDER_STRUCTURE,
    PROTOCOL_NAME,
    PROTOCOL_VERSION,
    ZX,
} from './exchange.order.const';
import { EIP712TypedData, MessageTypes } from './model/eip712.model';
import {
    Order,
    OrderData,
    OrderHash,
    OrderSignature,
    SignedOrder,
} from './model/order.model';
import { SignatureType } from './model/signature-types.model';
import { generateOrderSalt } from './utils';

export class ExchangeOrderBuilder {
    constructor(
        private readonly contractAddress: string,
        private readonly chainId: number,
        private readonly providerConnector: ProviderConnector,
        private readonly generateSalt = generateOrderSalt
    ) {}

    /**
     * build an order object including the signature.
     * @param walletAddress
     * @param orderData
     * @returns a SignedOrder object (order + signature)
     */
    async buildSignedOrder(
        walletAddress: string,
        orderData: OrderData
    ): Promise<SignedOrder> {
        const order = this.buildOrder(orderData);
        const orderTypedData = this.buildOrderTypedData(order);
        const orderSignature = await this.buildOrderSignature(
            walletAddress,
            orderTypedData
        );

        return {
            ...order,
            signature: orderSignature,
        } as SignedOrder;
    }

    /**
     * Creates an Order object from order data.
     * @param OrderData
     * @returns a Order object (not signed)
     */
    buildOrder({
        makerAddress,
        makerAssetId,
        takerAssetId,
        makerAmount,
        takerAmount,
        side,
        feeRateBps,
        nonce,
        signer,
        expiration,
        signatureType,
    }: OrderData): Order {
        if (typeof signer == 'undefined' || !signer) {
            signer = makerAddress;
        }

        let tokenId = '';
        if (typeof takerAssetId != 'undefined' && takerAssetId) {
            tokenId = takerAssetId;
        } else {
            tokenId = makerAssetId;
        }

        if (typeof expiration == 'undefined' || !expiration) {
            expiration = '0';
        }

        if (typeof signatureType == 'undefined' || !signatureType) {
            // Default to EOA 712 sig type
            signatureType = SignatureType.EOA;
        }

        return {
            salt: this.generateSalt(),
            maker: makerAddress,
            signer: signer,
            tokenId: tokenId,
            makerAmount: makerAmount,
            takerAmount: takerAmount,
            side: side,
            expiration: expiration,
            nonce: nonce,
            feeRateBps: feeRateBps,
            signatureType: signatureType,
        };
    }

    /**
     * Parses an Order object to EIP712 typed data
     * @param order
     * @returns a EIP712TypedData object
     */
    buildOrderTypedData(order: Order): EIP712TypedData {
        return {
            primaryType: 'Order',
            types: {
                EIP712Domain: EIP712_DOMAIN,
                Order: ORDER_STRUCTURE,
            },
            domain: {
                name: PROTOCOL_NAME,
                version: PROTOCOL_VERSION,
                chainId: this.chainId,
                verifyingContract: this.contractAddress,
            },
            message: order,
        };
    }

    /**
     * Generates order's signature from a EIP712TypedData object + the signer address
     * @param walletAddress
     * @param typedData
     * @returns a OrderSignature that is an string
     */
    buildOrderSignature(
        walletAddress: string,
        typedData: EIP712TypedData
    ): Promise<OrderSignature> {
        const dataHash = TypedDataUtils.hashStruct(
            typedData.primaryType,
            typedData.message,
            typedData.types,
            SignTypedDataVersion.V4
        ).toString('hex');

        return this.providerConnector.signTypedData(
            walletAddress,
            typedData,
            dataHash
        );
    }

    /**
     * Generates the hash of the order from a EIP712TypedData object.
     * @param orderTypedData
     * @returns a OrderHash that is an string
     */
    buildOrderHash(orderTypedData: EIP712TypedData): OrderHash {
        const message = orderTypedData as unknown as TypedMessage<MessageTypes>;

        return (
            ZX +
            TypedDataUtils.eip712Hash(
                message,
                SignTypedDataVersion.V4
            ).toString('hex')
        );
    }
}