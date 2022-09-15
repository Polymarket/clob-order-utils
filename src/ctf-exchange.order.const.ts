import { AbiItem } from './model/abi.model';
import CTFExchangeABISource from './abi/CTFExchange.json';

// Contract's constants.
export const PROTOCOL_NAME = 'Polymarket CTF Exchange';
export const PROTOCOL_VERSION = '1';
export const ZX = '0x';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const CALL_RESULTS_PREFIX = 'CALL_RESULTS_';

// ABIs
export const CTF_EXCHANGE_ABI: AbiItem[] = CTFExchangeABISource;

// EIP712 Objects
export const EIP712_DOMAIN = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
];

export const ORDER_STRUCTURE = [
    { name: 'salt', type: 'uint256' },
    { name: 'maker', type: 'address' },
    { name: 'signer', type: 'address' },
    { name: 'tokenId', type: 'uint256' },
    { name: 'makerAmount', type: 'uint256' },
    { name: 'takerAmount', type: 'uint256' },
    { name: 'side', type: 'uint256' },
    { name: 'expiration', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'feeRateBps', type: 'uint256' },
    { name: 'signatureType', type: 'uint256' },
];

// Contract's methods
export enum CTFExchangeMethods {
    fillOrder = 'fillOrder',
    fillOrders = 'fillOrders',
    matchOrders = 'matchOrders',
    cancelOrder = 'cancelOrder',
    cancelOrders = 'cancelOrders',
    incrementNonce = 'incrementNonce',
    isValidNonce = 'isValidNonce',
}
