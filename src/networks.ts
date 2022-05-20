export interface ClobContracts {
    Exchange: string;
    Executor: string;
    Collateral: string;
    Conditional: string;
}

export const MUMBAI_CONTRACTS : ClobContracts = {
    Exchange: "0xe8DaCEd3A06A59ADADF804771d10684A6E536ffd",
    Executor: "0xA15b04F6eb916f2e368Aeb17740a52b0379B8B6D",
    Collateral: "0x2E8DCfE708D44ae2e406a1c02DFE2Fa13012f961",
    Conditional: "0x7D8610E9567d2a6C9FBf66a5A13E9Ba8bb120d43"
}

export const MATIC_CONTRACTS: ClobContracts = {
    Exchange: "", // TODO 
    Executor: "",
    Collateral: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    Conditional: "",
}

export const getContracts = (chainID: number): ClobContracts => {
    switch (chainID) {
        case 137:
            return MATIC_CONTRACTS;
        case 80001:
            return MUMBAI_CONTRACTS;
        default:
            console.error(`Invalid chainID: ${chainID}`);
            throw new Error("Invalid network");
    }
};
