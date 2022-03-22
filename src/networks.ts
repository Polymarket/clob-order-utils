export interface ClobContracts {
    Exchange: string;
    Executor: string;
    Collateral: string;
    Conditional: string;
}

export const MUMBAI_CONTRACTS : ClobContracts = {
    Exchange: "0x3AA27F87CA17822f305A9788e7b9f5ea43A531FF",
    Executor: "0x1199443D6806dE23a9C976193F07A381542F81df",
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
