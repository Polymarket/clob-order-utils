/* eslint lines-between-class-members: 0 */

import {
    EIP712_DOMAIN,
    PROTOCOL_VERSION,
    PROTOCOL_NAME,
    ZX,
} from './limit-order-protocol.const';
import {
    MarketOrderSignature,
    MarketOrderHash,
    MarketOrder,
    MarketOrderData,
} from './model/order.model';
import { EIP712TypedData, MessageTypes } from './model/eip712.model';
import { TypedDataUtils, TypedMessage } from 'eth-sig-util';
import { ProviderConnector } from './connector/provider.connector';
import { generateOrderSalt } from './utils';
import { MARKET_ORDER_STRUCTURE } from './market-order.const';
import { SignatureType } from './signature-types';

// TODO(REC): this changes
export class MarketOrderBuilder {
    constructor(
        private readonly contractAddress: string,
        private readonly chainId: number,
        private readonly providerConnector: ProviderConnector,
        private readonly generateSalt = generateOrderSalt
    ) {}

    buildOrderSignature(
        walletAddress: string,
        typedData: EIP712TypedData
    ): Promise<MarketOrderSignature> {
        const dataHash = TypedDataUtils.hashStruct(
            typedData.primaryType,
            typedData.message,
            typedData.types,
            true
        ).toString('hex');

        return this.providerConnector.signTypedData(
            walletAddress,
            typedData,
            dataHash
        );
    }

    buildOrderHash(orderTypedData: EIP712TypedData): MarketOrderHash {
        const message = orderTypedData as TypedMessage<MessageTypes>;

        return ZX + TypedDataUtils.sign(message).toString('hex');
    }

    buildOrderTypedData(order: MarketOrder): EIP712TypedData {
        return {
            primaryType: 'MarketOrder',
            types: {
                EIP712Domain: EIP712_DOMAIN,
                MarketOrder: MARKET_ORDER_STRUCTURE,
            },
            domain: {
                name: PROTOCOL_NAME,
                version: PROTOCOL_VERSION,
                chainId: this.chainId,
                verifyingContract: this.contractAddress,
            },
            message: this.normalizeTokenIDs(order),
        };
    }

    /* eslint-disable max-lines-per-function */
    buildMarketOrder({
        makerAssetAddress,
        makerAssetID,
        takerAssetAddress,
        takerAssetID,
        makerAddress,
        makerAmount,
        signer,
        sigType,
    }: MarketOrderData): MarketOrder {
        const makerTokenID: string =
            makerAssetID !== undefined ? makerAssetID : '-1';
        const takerTokenID: string =
            takerAssetID !== undefined ? takerAssetID : '-1';

        if (signer == undefined) {
            signer = makerAddress;
        }

        if (sigType == undefined) {
            // Default to EOA 712 sig type
            sigType = SignatureType.EOA;
        }

        return {
            salt: this.generateSalt(),
            signer,
            maker: makerAddress,
            makerAsset: makerAssetAddress,
            makerAmount,
            makerAssetID: makerTokenID,
            takerAsset: takerAssetAddress,
            takerAssetID: takerTokenID,
            sigType,
        };
    }

    private normalizeTokenIDs(order: MarketOrder): MarketOrder {
        // Convert tokenIDs to 0, if -1 to adhere to unsigned int in solidity
        return {
            salt: order.salt,
            signer: order.signer,
            maker: order.maker,
            makerAsset: order.makerAsset,
            makerAmount: order.makerAmount,
            makerAssetID: order.makerAssetID == '-1' ? '0' : order.makerAssetID,
            takerAsset: order.takerAsset,
            takerAssetID: order.takerAssetID == '-1' ? '0' : order.takerAssetID,
            sigType: order.sigType,
        };
    }
}
