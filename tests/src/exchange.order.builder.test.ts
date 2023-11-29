import { expect } from 'chai';
import { Wallet } from '@ethersproject/wallet';
import { ExchangeOrderBuilder } from '../../src/exchange.order.builder';
import { generateOrderSalt } from '../../src/utils';
import { Order, OrderData } from '../../src/model/order.model';
import { Side } from '../../src/model/order-side.model';

describe('order builder', () => {
    describe('CTFexchange', () => {
        let wallet: Wallet;
        let exchangeOrderBuilder: ExchangeOrderBuilder;

        beforeEach(async () => {
            const chainId = 80001;

            // exchange address
            const exchangeAddress =
                '0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E';

            // publicly known private key
            const privateKey =
                '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
            wallet = new Wallet(privateKey);

            exchangeOrderBuilder = new ExchangeOrderBuilder(
                exchangeAddress,
                chainId,
                wallet,
                generateOrderSalt
            );
        });

        describe('buildOrder', () => {
            it('random salt', async () => {
                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                expect(order.salt).not.empty;
                expect(order.maker).equal(wallet.address);
                expect(order.signer).equal(wallet.address);
                expect(order.taker).equal(
                    '0x0000000000000000000000000000000000000000'
                );
                expect(order.tokenId).equal('1234');
                expect(order.makerAmount).equal('100000000');
                expect(order.takerAmount).equal('50000000');
                expect(order.side).equal(0);
                expect(order.expiration).equal('0');
                expect(order.nonce).equal('0');
                expect(order.feeRateBps).equal('100');
                expect(order.signatureType).equal(0);
            });

            it('specific salt', async () => {
                (exchangeOrderBuilder as any)['generateSalt'] = () => {
                    return '479249096354';
                };

                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                expect(order).deep.equal({
                    salt: '479249096354',
                    maker: wallet.address,
                    signer: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    expiration: '0',
                    nonce: '0',
                    feeRateBps: '100',
                    side: 0,
                    signatureType: 0,
                } as Order);
            });
        });

        describe('buildLimitOrderTypedData', async () => {
            it('random salt', async () => {
                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                const orderTypedData =
                    exchangeOrderBuilder.buildOrderTypedData(order);
                expect(orderTypedData).not.null;
                expect(orderTypedData).not.undefined;

                expect(orderTypedData).deep.equal({
                    primaryType: 'Order',
                    types: {
                        EIP712Domain: [
                            { name: 'name', type: 'string' },
                            { name: 'version', type: 'string' },
                            { name: 'chainId', type: 'uint256' },
                            { name: 'verifyingContract', type: 'address' },
                        ],
                        Order: [
                            { name: 'salt', type: 'uint256' },
                            { name: 'maker', type: 'address' },
                            { name: 'signer', type: 'address' },
                            { name: 'taker', type: 'address' },
                            { name: 'tokenId', type: 'uint256' },
                            { name: 'makerAmount', type: 'uint256' },
                            { name: 'takerAmount', type: 'uint256' },
                            { name: 'expiration', type: 'uint256' },
                            { name: 'nonce', type: 'uint256' },
                            { name: 'feeRateBps', type: 'uint256' },
                            { name: 'side', type: 'uint8' },
                            { name: 'signatureType', type: 'uint8' },
                        ],
                    },
                    domain: {
                        name: 'Polymarket CTF Exchange',
                        version: '1',
                        chainId: 80001,
                        verifyingContract:
                            '0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E',
                    },
                    message: {
                        salt: orderTypedData.message.salt,
                        maker: wallet.address,
                        signer: wallet.address,
                        taker: '0x0000000000000000000000000000000000000000',
                        tokenId: '1234',
                        makerAmount: '100000000',
                        takerAmount: '50000000',
                        expiration: '0',
                        nonce: '0',
                        feeRateBps: '100',
                        side: 0,
                        signatureType: 0,
                    },
                });
            });

            it('specific salt', async () => {
                (exchangeOrderBuilder as any)['generateSalt'] = () => {
                    return '479249096354';
                };

                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                const orderTypedData =
                    exchangeOrderBuilder.buildOrderTypedData(order);
                expect(orderTypedData).not.null;
                expect(orderTypedData).not.undefined;

                expect(orderTypedData).deep.equal({
                    primaryType: 'Order',
                    types: {
                        EIP712Domain: [
                            { name: 'name', type: 'string' },
                            { name: 'version', type: 'string' },
                            { name: 'chainId', type: 'uint256' },
                            { name: 'verifyingContract', type: 'address' },
                        ],
                        Order: [
                            { name: 'salt', type: 'uint256' },
                            { name: 'maker', type: 'address' },
                            { name: 'signer', type: 'address' },
                            { name: 'taker', type: 'address' },
                            { name: 'tokenId', type: 'uint256' },
                            { name: 'makerAmount', type: 'uint256' },
                            { name: 'takerAmount', type: 'uint256' },
                            { name: 'expiration', type: 'uint256' },
                            { name: 'nonce', type: 'uint256' },
                            { name: 'feeRateBps', type: 'uint256' },
                            { name: 'side', type: 'uint8' },
                            { name: 'signatureType', type: 'uint8' },
                        ],
                    },
                    domain: {
                        name: 'Polymarket CTF Exchange',
                        version: '1',
                        chainId: 80001,
                        verifyingContract:
                            '0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E',
                    },
                    message: {
                        salt: '479249096354',
                        maker: wallet.address,
                        signer: wallet.address,
                        taker: '0x0000000000000000000000000000000000000000',
                        tokenId: '1234',
                        makerAmount: '100000000',
                        takerAmount: '50000000',
                        expiration: '0',
                        nonce: '0',
                        feeRateBps: '100',
                        side: 0,
                        signatureType: 0,
                    },
                });
            });
        });

        describe('buildOrderSignature', async () => {
            it('random salt', async () => {
                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                const orderTypedData =
                    exchangeOrderBuilder.buildOrderTypedData(order);
                expect(orderTypedData).not.null;
                expect(orderTypedData).not.undefined;

                const orderSignature =
                    await exchangeOrderBuilder.buildOrderSignature(
                        orderTypedData
                    );
                expect(orderSignature).not.null;
                expect(orderSignature).not.undefined;
                expect(orderSignature).not.empty;
            });

            it('specific salt', async () => {
                (exchangeOrderBuilder as any)['generateSalt'] = () => {
                    return '479249096354';
                };

                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                const orderTypedData =
                    exchangeOrderBuilder.buildOrderTypedData(order);
                expect(orderTypedData).not.null;
                expect(orderTypedData).not.undefined;

                const orderSignature =
                    await exchangeOrderBuilder.buildOrderSignature(
                        orderTypedData
                    );
                expect(orderSignature).not.null;
                expect(orderSignature).not.undefined;
                expect(orderSignature).not.empty;

                expect(orderSignature).deep.equal(
                    // eslint-disable-next-line max-len
                    '0x3874d2cfe79c0e82577f4f76ec58d950522ee5923a6f08441927d382c8178a5a2190fd4d5c49705e94d75999a58ec843f94a432e87ebc15cdb2186d315b3cc201b'
                );
            });
        });

        describe('buildOrderHash', async () => {
            it('random salt', async () => {
                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                const orderTypedData =
                    exchangeOrderBuilder.buildOrderTypedData(order);
                expect(orderTypedData).not.null;
                expect(orderTypedData).not.undefined;

                const orderHash =
                    exchangeOrderBuilder.buildOrderHash(orderTypedData);
                expect(orderHash).not.null;
                expect(orderHash).not.undefined;
            });

            it('specific salt', async () => {
                (exchangeOrderBuilder as any)['generateSalt'] = () => {
                    return '479249096354';
                };

                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                const orderTypedData =
                    exchangeOrderBuilder.buildOrderTypedData(order);
                expect(orderTypedData).not.null;
                expect(orderTypedData).not.undefined;

                const orderHash =
                    exchangeOrderBuilder.buildOrderHash(orderTypedData);
                expect(orderHash).not.null;
                expect(orderHash).not.undefined;

                expect(orderHash).deep.equal(
                    '0xbf58957703791db2ab057528d03d1cff5375d9a475b14a9073bb7d892398dc96'
                );
            });
        });

        describe('buildSignedOrder', async () => {
            it('random salt', async () => {
                const signedOrder = await exchangeOrderBuilder.buildSignedOrder(
                    {
                        maker: wallet.address,
                        taker: '0x0000000000000000000000000000000000000000',
                        tokenId: '1234',
                        makerAmount: '100000000',
                        takerAmount: '50000000',
                        side: Side.BUY,
                        feeRateBps: '100',
                        nonce: '0',
                    } as OrderData
                );
                expect(signedOrder).not.null;
                expect(signedOrder).not.undefined;

                expect(signedOrder.salt).not.empty;
                expect(signedOrder.maker).equal(wallet.address);
                expect(signedOrder.signer).equal(wallet.address);
                expect(signedOrder.taker).equal(
                    '0x0000000000000000000000000000000000000000'
                );
                expect(signedOrder.tokenId).equal('1234');
                expect(signedOrder.makerAmount).equal('100000000');
                expect(signedOrder.takerAmount).equal('50000000');
                expect(signedOrder.side).equal(0);
                expect(signedOrder.expiration).equal('0');
                expect(signedOrder.nonce).equal('0');
                expect(signedOrder.feeRateBps).equal('100');
                expect(signedOrder.signatureType).equal(0);
                expect(signedOrder.signature).not.empty;
            });

            it('specific salt', async () => {
                (exchangeOrderBuilder as any)['generateSalt'] = () => {
                    return '479249096354';
                };

                const signedOrder = await exchangeOrderBuilder.buildSignedOrder(
                    {
                        maker: wallet.address,
                        taker: '0x0000000000000000000000000000000000000000',
                        tokenId: '1234',
                        makerAmount: '100000000',
                        takerAmount: '50000000',
                        side: Side.BUY,
                        feeRateBps: '100',
                        nonce: '0',
                    } as OrderData
                );
                expect(signedOrder).not.null;
                expect(signedOrder).not.undefined;

                expect(signedOrder).deep.equal({
                    salt: '479249096354',
                    maker: wallet.address,
                    signer: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: 0,
                    expiration: '0',
                    nonce: '0',
                    feeRateBps: '100',
                    signatureType: 0,
                    signature:
                        // eslint-disable-next-line max-len
                        '0x3874d2cfe79c0e82577f4f76ec58d950522ee5923a6f08441927d382c8178a5a2190fd4d5c49705e94d75999a58ec843f94a432e87ebc15cdb2186d315b3cc201b',
                });
            });
        });
    });

    describe('Neg Risk CTFExchange', () => {
        let wallet: Wallet;
        let exchangeOrderBuilder: ExchangeOrderBuilder;

        beforeEach(async () => {
            const chainId = 80001;

            // exchange address
            const negRiskExchangeAddress =
                '0xC5d563A36AE78145C45a50134d48A1215220f80a';

            // publicly known private key
            const privateKey =
                '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
            wallet = new Wallet(privateKey);

            exchangeOrderBuilder = new ExchangeOrderBuilder(
                negRiskExchangeAddress,
                chainId,
                wallet,
                generateOrderSalt
            );
        });

        describe('buildOrder', () => {
            it('random salt', async () => {
                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                expect(order.salt).not.empty;
                expect(order.maker).equal(wallet.address);
                expect(order.signer).equal(wallet.address);
                expect(order.taker).equal(
                    '0x0000000000000000000000000000000000000000'
                );
                expect(order.tokenId).equal('1234');
                expect(order.makerAmount).equal('100000000');
                expect(order.takerAmount).equal('50000000');
                expect(order.side).equal(0);
                expect(order.expiration).equal('0');
                expect(order.nonce).equal('0');
                expect(order.feeRateBps).equal('100');
                expect(order.signatureType).equal(0);
            });

            it('specific salt', async () => {
                (exchangeOrderBuilder as any)['generateSalt'] = () => {
                    return '479249096354';
                };

                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                expect(order).deep.equal({
                    salt: '479249096354',
                    maker: wallet.address,
                    signer: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    expiration: '0',
                    nonce: '0',
                    feeRateBps: '100',
                    side: 0,
                    signatureType: 0,
                } as Order);
            });
        });

        describe('buildLimitOrderTypedData', async () => {
            it('random salt', async () => {
                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                const orderTypedData =
                    exchangeOrderBuilder.buildOrderTypedData(order);
                expect(orderTypedData).not.null;
                expect(orderTypedData).not.undefined;

                expect(orderTypedData).deep.equal({
                    primaryType: 'Order',
                    types: {
                        EIP712Domain: [
                            { name: 'name', type: 'string' },
                            { name: 'version', type: 'string' },
                            { name: 'chainId', type: 'uint256' },
                            { name: 'verifyingContract', type: 'address' },
                        ],
                        Order: [
                            { name: 'salt', type: 'uint256' },
                            { name: 'maker', type: 'address' },
                            { name: 'signer', type: 'address' },
                            { name: 'taker', type: 'address' },
                            { name: 'tokenId', type: 'uint256' },
                            { name: 'makerAmount', type: 'uint256' },
                            { name: 'takerAmount', type: 'uint256' },
                            { name: 'expiration', type: 'uint256' },
                            { name: 'nonce', type: 'uint256' },
                            { name: 'feeRateBps', type: 'uint256' },
                            { name: 'side', type: 'uint8' },
                            { name: 'signatureType', type: 'uint8' },
                        ],
                    },
                    domain: {
                        name: 'Polymarket CTF Exchange',
                        version: '1',
                        chainId: 80001,
                        verifyingContract:
                            '0xC5d563A36AE78145C45a50134d48A1215220f80a',
                    },
                    message: {
                        salt: orderTypedData.message.salt,
                        maker: wallet.address,
                        signer: wallet.address,
                        taker: '0x0000000000000000000000000000000000000000',
                        tokenId: '1234',
                        makerAmount: '100000000',
                        takerAmount: '50000000',
                        expiration: '0',
                        nonce: '0',
                        feeRateBps: '100',
                        side: 0,
                        signatureType: 0,
                    },
                });
            });

            it('specific salt', async () => {
                (exchangeOrderBuilder as any)['generateSalt'] = () => {
                    return '479249096354';
                };

                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                const orderTypedData =
                    exchangeOrderBuilder.buildOrderTypedData(order);
                expect(orderTypedData).not.null;
                expect(orderTypedData).not.undefined;

                expect(orderTypedData).deep.equal({
                    primaryType: 'Order',
                    types: {
                        EIP712Domain: [
                            { name: 'name', type: 'string' },
                            { name: 'version', type: 'string' },
                            { name: 'chainId', type: 'uint256' },
                            { name: 'verifyingContract', type: 'address' },
                        ],
                        Order: [
                            { name: 'salt', type: 'uint256' },
                            { name: 'maker', type: 'address' },
                            { name: 'signer', type: 'address' },
                            { name: 'taker', type: 'address' },
                            { name: 'tokenId', type: 'uint256' },
                            { name: 'makerAmount', type: 'uint256' },
                            { name: 'takerAmount', type: 'uint256' },
                            { name: 'expiration', type: 'uint256' },
                            { name: 'nonce', type: 'uint256' },
                            { name: 'feeRateBps', type: 'uint256' },
                            { name: 'side', type: 'uint8' },
                            { name: 'signatureType', type: 'uint8' },
                        ],
                    },
                    domain: {
                        name: 'Polymarket CTF Exchange',
                        version: '1',
                        chainId: 80001,
                        verifyingContract:
                            '0xC5d563A36AE78145C45a50134d48A1215220f80a',
                    },
                    message: {
                        salt: '479249096354',
                        maker: wallet.address,
                        signer: wallet.address,
                        taker: '0x0000000000000000000000000000000000000000',
                        tokenId: '1234',
                        makerAmount: '100000000',
                        takerAmount: '50000000',
                        expiration: '0',
                        nonce: '0',
                        feeRateBps: '100',
                        side: 0,
                        signatureType: 0,
                    },
                });
            });
        });

        describe('buildOrderSignature', async () => {
            it('random salt', async () => {
                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                const orderTypedData =
                    exchangeOrderBuilder.buildOrderTypedData(order);
                expect(orderTypedData).not.null;
                expect(orderTypedData).not.undefined;

                const orderSignature =
                    await exchangeOrderBuilder.buildOrderSignature(
                        orderTypedData
                    );
                expect(orderSignature).not.null;
                expect(orderSignature).not.undefined;
                expect(orderSignature).not.empty;
            });

            it('specific salt', async () => {
                (exchangeOrderBuilder as any)['generateSalt'] = () => {
                    return '479249096354';
                };

                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                const orderTypedData =
                    exchangeOrderBuilder.buildOrderTypedData(order);
                expect(orderTypedData).not.null;
                expect(orderTypedData).not.undefined;

                const orderSignature =
                    await exchangeOrderBuilder.buildOrderSignature(
                        orderTypedData
                    );
                expect(orderSignature).not.null;
                expect(orderSignature).not.undefined;
                expect(orderSignature).not.empty;

                expect(orderSignature).deep.equal(
                    // eslint-disable-next-line max-len
                    '0x92bb74d70a3c82cff3a9ccf10c9c547bb4ec71cff8cbb6cb308ca975162df7ba65837d5b57f50568fbd6bba9f2b919089268ace609cc33935b0bb5483e1092c31c'
                );
            });
        });

        describe('buildOrderHash', async () => {
            it('random salt', async () => {
                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                const orderTypedData =
                    exchangeOrderBuilder.buildOrderTypedData(order);
                expect(orderTypedData).not.null;
                expect(orderTypedData).not.undefined;

                const orderHash =
                    exchangeOrderBuilder.buildOrderHash(orderTypedData);
                expect(orderHash).not.null;
                expect(orderHash).not.undefined;
            });

            it('specific salt', async () => {
                (exchangeOrderBuilder as any)['generateSalt'] = () => {
                    return '479249096354';
                };

                const order = await exchangeOrderBuilder.buildOrder({
                    maker: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: Side.BUY,
                    feeRateBps: '100',
                    nonce: '0',
                } as OrderData);

                expect(order).not.null;
                expect(order).not.undefined;

                const orderTypedData =
                    exchangeOrderBuilder.buildOrderTypedData(order);
                expect(orderTypedData).not.null;
                expect(orderTypedData).not.undefined;

                const orderHash =
                    exchangeOrderBuilder.buildOrderHash(orderTypedData);
                expect(orderHash).not.null;
                expect(orderHash).not.undefined;

                expect(orderHash).deep.equal(
                    '0xdcf7c472379a0d50cff6cb72ac72bb4d42b20b9fa4ed56dd01b9f0398d17e773'
                );
            });
        });

        describe('buildSignedOrder', async () => {
            it('random salt', async () => {
                const signedOrder = await exchangeOrderBuilder.buildSignedOrder(
                    {
                        maker: wallet.address,
                        taker: '0x0000000000000000000000000000000000000000',
                        tokenId: '1234',
                        makerAmount: '100000000',
                        takerAmount: '50000000',
                        side: Side.BUY,
                        feeRateBps: '100',
                        nonce: '0',
                    } as OrderData
                );
                expect(signedOrder).not.null;
                expect(signedOrder).not.undefined;

                expect(signedOrder.salt).not.empty;
                expect(signedOrder.maker).equal(wallet.address);
                expect(signedOrder.signer).equal(wallet.address);
                expect(signedOrder.taker).equal(
                    '0x0000000000000000000000000000000000000000'
                );
                expect(signedOrder.tokenId).equal('1234');
                expect(signedOrder.makerAmount).equal('100000000');
                expect(signedOrder.takerAmount).equal('50000000');
                expect(signedOrder.side).equal(0);
                expect(signedOrder.expiration).equal('0');
                expect(signedOrder.nonce).equal('0');
                expect(signedOrder.feeRateBps).equal('100');
                expect(signedOrder.signatureType).equal(0);
                expect(signedOrder.signature).not.empty;
            });

            it('specific salt', async () => {
                (exchangeOrderBuilder as any)['generateSalt'] = () => {
                    return '479249096354';
                };

                const signedOrder = await exchangeOrderBuilder.buildSignedOrder(
                    {
                        maker: wallet.address,
                        taker: '0x0000000000000000000000000000000000000000',
                        tokenId: '1234',
                        makerAmount: '100000000',
                        takerAmount: '50000000',
                        side: Side.BUY,
                        feeRateBps: '100',
                        nonce: '0',
                    } as OrderData
                );
                expect(signedOrder).not.null;
                expect(signedOrder).not.undefined;

                expect(signedOrder).deep.equal({
                    salt: '479249096354',
                    maker: wallet.address,
                    signer: wallet.address,
                    taker: '0x0000000000000000000000000000000000000000',
                    tokenId: '1234',
                    makerAmount: '100000000',
                    takerAmount: '50000000',
                    side: 0,
                    expiration: '0',
                    nonce: '0',
                    feeRateBps: '100',
                    signatureType: 0,
                    signature:
                        // eslint-disable-next-line max-len
                        '0x92bb74d70a3c82cff3a9ccf10c9c547bb4ec71cff8cbb6cb308ca975162df7ba65837d5b57f50568fbd6bba9f2b919089268ace609cc33935b0bb5483e1092c31c',
                });
            });
        });
    });
});
