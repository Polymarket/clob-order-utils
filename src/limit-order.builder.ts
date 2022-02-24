/* eslint lines-between-class-members: 0 */

import {
    EIP712_DOMAIN,
    ORDER_STRUCTURE,
    PROTOCOL_VERSION,
    ZERO_ADDRESS,
    PROTOCOL_NAME,
    LIMIT_ORDER_PROTOCOL_ABI,
    ZX,
} from './limit-order-protocol.const';
import {
    LimitOrder,
    LimitOrderProtocolMethods,
    LimitOrderData,
    LimitOrderHash,
    LimitOrderSignature,
} from './model/order.model';
import { EIP712TypedData, MessageTypes } from './model/eip712.model';
import { TypedDataUtils, TypedMessage } from 'eth-sig-util';
import { ProviderConnector } from './connector/provider.connector';
import { Erc1155Facade } from './erc1155.facade';
import { Erc20Facade } from './erc20.facade';
import { LimitOrderProtocolFacade } from './limit-order-protocol.facade';
import { LimitOrderPredicateBuilder } from './limit-order-predicate.builder';
import { generateOrderSalt } from './utils';
import { SignatureType } from './signature-types';


export class LimitOrderBuilder {
    private readonly erc1155Facade: Erc1155Facade;
    private readonly erc20Facade: Erc20Facade;
    private readonly limitOrderPredicateBuilder: LimitOrderPredicateBuilder;

    constructor(
        private readonly contractAddress: string,
        private readonly chainId: number,
        private readonly providerConnector: ProviderConnector,
        private readonly generateSalt = generateOrderSalt
    ) {
        this.erc1155Facade = new Erc1155Facade(this.providerConnector);
        this.erc20Facade = new Erc20Facade(this.providerConnector);
        const limitOrderProtocolFacade = new LimitOrderProtocolFacade(
            contractAddress,
            providerConnector
        );
        this.limitOrderPredicateBuilder = new LimitOrderPredicateBuilder(
            limitOrderProtocolFacade
        );
    }

    buildOrderSignature(
        walletAddress: string,
        typedData: EIP712TypedData):
        Promise<LimitOrderSignature> {
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

    buildLimitOrderHash(orderTypedData: EIP712TypedData): LimitOrderHash {
        const message = orderTypedData as TypedMessage<MessageTypes>;

        return ZX + TypedDataUtils.sign(message).toString('hex');
    }

    buildLimitOrderTypedData(order: LimitOrder): EIP712TypedData {
        return {
            primaryType: 'LimitOrder',
            types: {
                EIP712Domain: EIP712_DOMAIN,
                LimitOrder: ORDER_STRUCTURE,
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

    /* eslint-disable max-lines-per-function */
    buildLimitOrder({
        exchangeAddress,
        makerAssetAddress,
        makerAssetID,
        takerAssetAddress,
        takerAssetID,
        makerAddress,
        takerAddress = ZERO_ADDRESS,
        makerAmount,
        takerAmount,
        expiry,
        nonce,
        signer,
        sigType,
        predicate = ZX,
        permit = ZX,
        interaction = ZX,
    }: LimitOrderData): LimitOrder {
        let makerAssetData;
        let makerAsset;
        if (makerAssetID != undefined) {
            makerAsset = exchangeAddress;
            makerAssetData = this.erc1155Facade.transferFrom(
                makerAssetAddress,
                makerAddress,
                takerAddress,
                makerAssetID,
                makerAmount
            );
        } else {
            makerAsset = makerAssetAddress;
            makerAssetData = this.erc20Facade.transferFrom(
                makerAssetAddress,
                makerAddress,
                takerAddress,
                makerAmount
            );
        }

        let takerAssetData;
        let takerAsset;
        if (takerAssetID != undefined) {
            takerAsset = exchangeAddress;
            takerAssetData = this.erc1155Facade.transferFrom(
                takerAssetAddress,
                takerAddress,
                makerAddress,
                takerAssetID,
                takerAmount
            );
        } else {
            takerAsset = takerAssetAddress;
            takerAssetData = this.erc20Facade.transferFrom(
                takerAssetAddress,
                takerAddress,
                makerAddress,
                takerAmount
            );
        }

        const {and, timestampBelow, nonceEquals} =
            this.limitOrderPredicateBuilder;

        if (expiry != undefined && nonce != undefined) {
            predicate = and(
                timestampBelow(expiry),
                nonceEquals(makerAddress, nonce), 
            );
        }

        if(signer == undefined) { 
            signer = makerAddress;
        }
        
        if(sigType == undefined) {
            // Default to EOA 712 sig type
            sigType = SignatureType.EOA;
        }

        return {
            salt: this.generateSalt(),
            makerAsset,
            takerAsset,
            makerAssetData,
            takerAssetData,
            getMakerAmount: this.getAmountData(
                LimitOrderProtocolMethods.getMakerAmount,
                makerAmount,
                takerAmount
            ),
            getTakerAmount: this.getAmountData(
                LimitOrderProtocolMethods.getTakerAmount,
                makerAmount,
                takerAmount
            ),
            predicate,
            permit,
            interaction,
            signer,
            sigType
        };
    }
    /* eslint-enable max-lines-per-function */

    // Get nonce from contract (nonce method) and put it to predicate on order creating
    private getAmountData(
        methodName: LimitOrderProtocolMethods,
        makerAmount: string,
        takerAmount: string,
        swapTakerAmount = '0'
    ): string {
        return this.getContractCallData(methodName, [
            makerAmount,
            takerAmount,
            swapTakerAmount,
        ]).substr(0, 2 + 68 * 2);
    }

    private getContractCallData(
        methodName: LimitOrderProtocolMethods,
        methodParams: unknown[] = []
    ): string {
        return this.providerConnector.contractEncodeABI(
            LIMIT_ORDER_PROTOCOL_ABI,
            this.contractAddress,
            methodName,
            methodParams
        );
    }
}
