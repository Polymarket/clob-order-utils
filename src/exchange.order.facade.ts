import { ProviderConnector } from './connector/provider.connector';
import { ExchangeMethods, EXCHANGE_ABI } from './exchange.order.const';
import { SignedOrder } from './model/order.model';

export class ExchangeOrderFacade {
    constructor(
        public readonly contractAddress: string,
        public readonly providerConnector: ProviderConnector
    ) {}

    /**
     * Fills an order
     * @param order        - The order to be filled
     * @param fillAmount   - The amount to be filled, always in terms of the maker amount
     */
    fillOrder(order: SignedOrder, fillAmount: string): string {
        return this.getContractCallData(ExchangeMethods.fillOrder, [
            order,
            fillAmount,
        ]);
    }

    /**
     * Fills a set of orders
     * @param orders       - The order to be filled
     * @param fillAmounts  - The amounts to be filled, always in terms of the maker amount
     */
    fillOrders(orders: SignedOrder[], fillAmounts: string[]): string {
        return this.getContractCallData(ExchangeMethods.fillOrders, [
            orders,
            fillAmounts,
        ]);
    }

    /**
     * Matches a taker order against a list of maker orders
     * @param takerOrder       - The active order to be matched
     * @param makerOrders      - The array of maker orders to be matched against the active order
     * @param takerFillAmount  - The amount to fill on the taker order,
     *                           always in terms of the maker amount
     * @param makerFillAmounts - The array of amounts to fill on the maker orders,
     *                           always in terms of the maker amount
     */
    matchOrders(
        takerOrder: SignedOrder,
        makerOrders: SignedOrder[],
        takerFillAmount: string,
        makerFillAmounts: string[]
    ): string {
        return this.getContractCallData(ExchangeMethods.matchOrders, [
            takerOrder,
            makerOrders,
            takerFillAmount,
            makerFillAmounts,
        ]);
    }

    /**
     * Cancels an order
     * An order can only be cancelled by its maker, the address which holds funds for the order
     * @oaran order - The order to be cancelled
     */
    cancelOrder(order: SignedOrder): string {
        return this.getContractCallData(ExchangeMethods.cancelOrder, [order]);
    }

    /**
     * Cancels a set of orders
     * @param orders - The set of orders to be cancelled
     */
    cancelOrders(orders: SignedOrder[]): string {
        return this.getContractCallData(ExchangeMethods.cancelOrders, [orders]);
    }

    incrementNonce(): string {
        return this.getContractCallData(ExchangeMethods.incrementNonce, []);
    }

    isValidNonce(usr: string, nonce: string): string {
        return this.getContractCallData(ExchangeMethods.isValidNonce, [
            usr,
            nonce,
        ]);
    }

    getContractCallData(
        methodName: ExchangeMethods,
        methodParams: unknown[] = []
    ): string {
        return this.providerConnector.contractEncodeABI(
            EXCHANGE_ABI,
            this.contractAddress,
            methodName,
            methodParams
        );
    }
}
