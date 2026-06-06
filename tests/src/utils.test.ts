import { generateOrderSalt } from '../../src/utils.ts';
import { expect } from 'chai';

describe('generateOrderSalt', () => {
    it('gets a salt', () => {
        const salt = generateOrderSalt();
        expect(salt).not.null;
        expect(salt).not.undefined;
        expect(salt).not.empty;
    });

    it('gets new salt each time', () => {
        for (let i = 0; i < 100; i++) {
            expect(generateOrderSalt()).not.equal(generateOrderSalt());
        }

        const salts: string[] = [];

        for (let i = 0; i < 100; i++) {
            salts.push(generateOrderSalt());
        }
        salts.forEach((s1: string, i1) => {
            salts.forEach((s2: string, i2) => {
                if (i1 != i2) {
                    expect(s1).not.equal(s2);
                }
            });
        });
    });

    it('produces a non-negative integer string', () => {
        for (let i = 0; i < 100; i++) {
            const salt = generateOrderSalt();
            expect(salt).to.match(/^[0-9]+$/);
            expect(BigInt(salt) >= 0n).to.be.true;
        }
    });

    it('stays within 53 bits so the salt round-trips through JSON number parsing', () => {
        const max = (1n << 53n) - 1n;
        for (let i = 0; i < 1000; i++) {
            expect(BigInt(generateOrderSalt()) <= max).to.be.true;
        }
    });

    it('does not call Math.random — regression for #22', () => {
        const originalRandom = Math.random;
        Math.random = () => {
            throw new Error('SHOULD_NOT_BE_CALLED');
        };
        try {
            // Pre-fix implementation reads Math.random and would bubble the throw.
            // Post-fix implementation uses globalThis.crypto.getRandomValues
            // and must complete without touching Math.random.
            expect(() => generateOrderSalt()).to.not.throw();
        } finally {
            Math.random = originalRandom;
        }
    });
});
