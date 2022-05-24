import {AbiItem} from './model/abi.model';
import LimitOrderProtocolABISource from './abi/PolyLimitOrderProtocol.json';
import ERC1155ABISource from './abi/ERC1155ABI.json';
import ERC20ABISource from './abi/ERC20ABI.json';

export const PROTOCOL_NAME = 'Polymarket Limit Order Protocol';

export const PROTOCOL_VERSION = '1';

export const ZX = '0x';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const CALL_RESULTS_PREFIX = 'CALL_RESULTS_';

export const LIMIT_ORDER_PROTOCOL_ABI: AbiItem[] = LimitOrderProtocolABISource;

export const ERC1155_ABI: AbiItem[] = ERC1155ABISource;

export const ERC20_ABI: AbiItem[] = ERC20ABISource;

export const EIP712_DOMAIN = [
    {name: 'name', type: 'string'},
    {name: 'version', type: 'string'},
    {name: 'chainId', type: 'uint256'},
    {name: 'verifyingContract', type: 'address'},
];

export const ORDER_STRUCTURE = [
    {name: 'salt', type: 'uint256'},
    {name: 'makerAsset', type: 'address'},
    {name: 'takerAsset', type: 'address'},
    {name: 'makerAssetData', type: 'bytes'},
    {name: 'takerAssetData', type: 'bytes'},
    {name: 'getMakerAmount', type: 'bytes'},
    {name: 'getTakerAmount', type: 'bytes'},
    {name: 'predicate', type: 'bytes'},
    {name: 'signer', type: 'address'},
    {name: 'sigType', type: 'uint256'},
];

