export function generateOrderSalt(): string {
    const bytes = new Uint8Array(8);
    globalThis.crypto.getRandomValues(bytes);

    const value = BigInt(
        '0x' + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(''),
    );

    // Cap at 2^53 - 1 so the salt round-trips losslessly through JSON number
    // parsing on the wire side. Matches the ts-sdk implementation in
    // packages/client/src/actions/orders/orders.ts.
    return (value & ((1n << 53n) - 1n)).toString();
}
