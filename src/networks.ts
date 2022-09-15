export interface ClobContracts {
    Exchange: string;
    Executor: string;
    Collateral: string;
    Conditional: string;
}
// TODO(REC): this changes

export const MUMBAI_CONTRACTS: ClobContracts = {
    Exchange: '0xA5caFCC00E8D8E9121CC18B2DF279Eab5dE43bC5',
    Executor: '0xb2a29463Df393a4CAef36541544715e6B48b80B7',
    Collateral: '0x2E8DCfE708D44ae2e406a1c02DFE2Fa13012f961',
    Conditional: '0x7D8610E9567d2a6C9FBf66a5A13E9Ba8bb120d43',
};

export const MATIC_CONTRACTS: ClobContracts = {
    Exchange: '0xA5caFCC00E8D8E9121CC18B2DF279Eab5dE43bC5',
    Executor: '0xb2a29463Df393a4CAef36541544715e6B48b80B7',
    Collateral: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    Conditional: '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045',
};

export const getContracts = (chainID: number): ClobContracts => {
    switch (chainID) {
        case 137:
            return MATIC_CONTRACTS;
        case 80001:
            return MUMBAI_CONTRACTS;
        default:
            console.error(`Invalid chainID: ${chainID}`);
            throw new Error('Invalid network');
    }
};
