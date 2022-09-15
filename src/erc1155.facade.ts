import {
    ERC1155_ABI,
    LIMIT_ORDER_PROTOCOL_ABI,
} from './limit-order-protocol.const';
import { ProviderConnector } from './connector/provider.connector';
import { IERC1155Interface } from './model/ierc1155';

export enum Erc1155Methods {
    transferFrom = 'func_733NCGU',
    balanceOf = 'balanceOf',
}

export class Erc1155Facade {
    constructor(private readonly providerConnector: ProviderConnector) {}

    transferFrom(
        makerAssetAddress: string | null,
        fromAddress: string,
        toAddress: string,
        id: string,
        value: string
    ): string {
        return this.providerConnector.contractEncodeABI(
            LIMIT_ORDER_PROTOCOL_ABI,
            null,
            Erc1155Methods.transferFrom,
            [
                fromAddress,
                toAddress,
                value,
                <IERC1155Interface>(<unknown>makerAssetAddress),
                id,
                0x0,
            ]
        );
    }

    balanceOf(tokenAddress: string, walletAddress: string, id: number): string {
        return this.providerConnector.contractEncodeABI(
            ERC1155_ABI,
            tokenAddress,
            Erc1155Methods.balanceOf,
            [walletAddress, id]
        );
    }
}
