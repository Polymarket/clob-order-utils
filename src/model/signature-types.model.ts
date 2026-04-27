export enum SignatureType {
    /**
     * ECDSA EIP712 signatures signed by EOAs
     */
    EOA,

    /**
     * EIP712 signatures signed by EOAs that own Polymarket Proxy wallets
     */
    POLY_PROXY,

    /**
     * EIP712 signatures signed by EOAs that own Polymarket Gnosis safes
     */
    POLY_GNOSIS_SAFE,

    /**
     * EIP712 signatures signed by EOAs that own Polymarket Deposit Wallets.
     * Validated on-chain via ERC-1271 isValidSignature() with ERC-7739 nested domain wrapping.
     */
    POLY_DEPOSIT_WALLET,
}
