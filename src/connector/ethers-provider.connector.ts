import { ProviderConnector } from './provider.connector';
import { JsonRpcSigner } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { EIP712TypedData } from '../model/eip712.model';
import { AbiItem } from '../model/abi.model';

export class EthersProviderConnector implements ProviderConnector {
    constructor(protected readonly ethersProvider: JsonRpcSigner) {}

    contractEncodeABI(
        abi: AbiItem[],
        _address: string | null,
        methodName: string,
        methodParams: unknown[]
    ): string {
        const contract = new ethers.utils.Interface(abi);
        return contract.encodeFunctionData(methodName, methodParams);
    }

    signTypedData(
        walletAddress: string,
        typedData: EIP712TypedData,
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        _typedDataHash: string
    ): Promise<string> {
        if (!this.ethersProvider.provider._isProvider) {
            throw new Error('Ethers provider is null');
        }
        return this.ethersProvider.provider.send('eth_signTypedData_v4', [
            walletAddress,
            JSON.stringify(typedData),
        ]);
    }

    ethCall(contractAddress: string, callData: string): Promise<string> {
        return this.ethersProvider.call({
            to: contractAddress,
            data: callData,
        });
    }

    decodeABIParameter<T>(type: string, hex: string): T {
        const coder = ethers.utils.defaultAbiCoder;
        return coder.decode([type], hex)[0];
    }
}
