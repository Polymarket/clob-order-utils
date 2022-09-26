import { getContracts } from '../../src/networks';
import { expect } from 'chai';

describe('getContracts', () => {
    it('mumbai', () => {
        const contracts = getContracts(80001);
        expect(contracts).not.null;
        expect(contracts).not.undefined;

        expect(contracts.Exchange).equal(
            '0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E'
        );
        expect(contracts.Collateral).equal(
            '0x2E8DCfE708D44ae2e406a1c02DFE2Fa13012f961'
        );
        expect(contracts.Conditional).equal(
            '0x7D8610E9567d2a6C9FBf66a5A13E9Ba8bb120d43'
        );
    });

    it('polygon', () => {
        const contracts = getContracts(137);
        expect(contracts).not.null;
        expect(contracts).not.undefined;

        expect(contracts.Exchange).equal(
            '0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E'
        );
        expect(contracts.Collateral).equal(
            '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
        );
        expect(contracts.Conditional).equal(
            '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045'
        );
    });

    it('wrong chain', () => {
        try {
            const contracts = getContracts(1);
            expect(contracts).null;
            expect(contracts).undefined;
        } catch (e: any) {
            expect(e).not.null;
            expect(e).not.undefined;
            expect(e.toString()).equal('Error: Invalid network');
        }
    });
});
