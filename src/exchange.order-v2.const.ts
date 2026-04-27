// V2 Exchange constants
// Domain name is shared with V1; only the version changes.
export const PROTOCOL_NAME_V2 = 'Polymarket CTF Exchange';
export const PROTOCOL_VERSION_V2 = '2';

// V2 Order EIP-712 struct.
// Note: `expiration` is intentionally absent — it is an API-level field,
// not part of the on-chain EIP-712 signature.
export const ORDER_V2_STRUCTURE = [
    { name: 'salt', type: 'uint256' },
    { name: 'maker', type: 'address' },
    { name: 'signer', type: 'address' },
    { name: 'tokenId', type: 'uint256' },
    { name: 'makerAmount', type: 'uint256' },
    { name: 'takerAmount', type: 'uint256' },
    { name: 'side', type: 'uint8' },
    { name: 'signatureType', type: 'uint8' },
    { name: 'timestamp', type: 'uint256' },
    { name: 'metadata', type: 'bytes32' },
    { name: 'builder', type: 'bytes32' },
];
