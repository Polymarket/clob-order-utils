export interface Contracts {
    CTFExchange: string;
    Collateral: string;
    Conditional: string;
}

const MUMBAI_CONTRACTS: Contracts = {
    CTFExchange: '0x0000000000000000000000000000000000000000', // TODO: Complete me
    Collateral: '0x2E8DCfE708D44ae2e406a1c02DFE2Fa13012f961',
    Conditional: '0x7D8610E9567d2a6C9FBf66a5A13E9Ba8bb120d43',
};

const MATIC_CONTRACTS: Contracts = {
    CTFExchange: '0x0000000000000000000000000000000000000000', // TODO: Complete me
    Collateral: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    Conditional: '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045',
};

export const COLLATERAL_TOKEN_DECIMALS = 6;
export const CONDITIONAL_TOKEN_DECIMALS = 6;

export const getContracts = (chainID: number): Contracts => {
    switch (chainID) {
        case 137:
            return MATIC_CONTRACTS;
        case 80001:
            return MUMBAI_CONTRACTS;
        default:
            throw new Error('Invalid network');
    }
};
