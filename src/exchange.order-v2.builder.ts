import type { JsonRpcSigner } from '@ethersproject/providers';
import type { Wallet } from '@ethersproject/wallet';
import {
    EIP712_DOMAIN,
    PROTOCOL_NAME,
} from './exchange.order.const.ts';
import {
    PROTOCOL_VERSION_V2,
    ORDER_V2_STRUCTURE,
} from './exchange.order-v2.const.ts';
import type { EIP712TypedData } from './model/eip712.model.ts';
import { hashTypedData } from 'viem';
import type {
    OrderV2,
    OrderDataV2,
    OrderHashV2,
    OrderSignatureV2,
    SignedOrderV2,
} from './model/order-v2.model.ts';
import { SignatureType } from './model/signature-types.model.ts';
import { generateOrderSalt } from './utils.ts';

const BYTES32_ZERO = '0x0000000000000000000000000000000000000000000000000000000000000000';

export class ExchangeOrderBuilderV2 {
    constructor(
        private readonly contractAddress: string,
        private readonly chainId: number,
        private readonly signer: Wallet | JsonRpcSigner,
        private readonly generateSalt = generateOrderSalt,
    ) {}

    /**
     * Build an order object including the signature.
     * @param orderData
     * @returns a SignedOrderV2 object (order + signature)
     */
    async buildSignedOrder(orderData: OrderDataV2): Promise<SignedOrderV2> {
        const order = await this.buildOrder(orderData);
        const orderTypedData = this.buildOrderTypedData(order);
        const orderSignature = await this.buildOrderSignature(orderTypedData);

        return {
            ...order,
            signature: orderSignature,
        } as SignedOrderV2;
    }

    /**
     * Creates an OrderV2 object from order data.
     * @param orderData
     * @returns an OrderV2 object (not signed)
     */
    async buildOrder({
        maker,
        tokenId,
        makerAmount,
        takerAmount,
        side,
        signer,
        signatureType,
        timestamp,
        metadata,
        builder,
        expiration,
    }: OrderDataV2): Promise<OrderV2> {
        if (typeof signer == 'undefined' || !signer) {
            signer = maker;
        }

        const resolvedSignatureType = signatureType ?? SignatureType.EOA;

        // For POLY_DEPOSIT_WALLET, the order's signer field is the wallet
        // contract address, while the actual ECDSA signing is done by the EOA owner
        if (resolvedSignatureType !== SignatureType.POLY_DEPOSIT_WALLET) {
            const signerAddress = await this.signer.getAddress();
            if (signer !== signerAddress) {
                throw new Error('signer does not match');
            }
        }

        return {
            salt: this.generateSalt(),
            maker,
            signer,
            tokenId,
            makerAmount,
            takerAmount,
            side,
            signatureType: resolvedSignatureType,
            timestamp: timestamp ?? Date.now().toString(),
            metadata: metadata ?? BYTES32_ZERO,
            builder: builder ?? BYTES32_ZERO,
            expiration: expiration ?? '0',
        };
    }

    /**
     * Parses an OrderV2 object to EIP712 typed data
     * @param order
     * @returns a EIP712TypedData object
     */
    buildOrderTypedData(order: OrderV2): EIP712TypedData {
        return {
            primaryType: 'Order',
            types: {
                EIP712Domain: EIP712_DOMAIN,
                Order: ORDER_V2_STRUCTURE,
            },
            domain: {
                name: PROTOCOL_NAME,
                version: PROTOCOL_VERSION_V2,
                chainId: this.chainId,
                verifyingContract: this.contractAddress,
            },
            message: {
                salt: order.salt,
                maker: order.maker,
                signer: order.signer,
                tokenId: order.tokenId,
                makerAmount: order.makerAmount,
                takerAmount: order.takerAmount,
                side: order.side,
                signatureType: order.signatureType,
                timestamp: order.timestamp,
                metadata: order.metadata,
                builder: order.builder,
            },
        };
    }

    /**
     * Generates order's signature from a EIP712TypedData object + the signer address
     * @param typedData
     * @returns a OrderSignatureV2 string
     */
    buildOrderSignature(typedData: EIP712TypedData): Promise<OrderSignatureV2> {
        delete typedData.types.EIP712Domain;
        return this.signer._signTypedData(
            typedData.domain,
            typedData.types,
            typedData.message,
        );
    }

    /**
     * Generates the hash of the order from a EIP712TypedData object.
     * @param orderTypedData
     * @returns a OrderHashV2 string
     */
    buildOrderHash(orderTypedData: EIP712TypedData): OrderHashV2 {
        const digest = hashTypedData(orderTypedData);
        return digest;
    }
}
