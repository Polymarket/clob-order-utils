import { ProviderConnector } from './connector/provider.connector';
import {
    CTFExchangeMethods,
    CTF_EXCHANGE_ABI,
} from './ctf-exchange.order.const';
import { Order } from './model/order.model';

export class CTFExchangeOrderFacade {
    constructor(
        public readonly contractAddress: string,
        public readonly providerConnector: ProviderConnector
    ) {}

    /**
     * Fills an order
     * @param order        - The order to be filled
     * @param fillAmount   - The amount to be filled, always in terms of the maker amount
     */
    fillOrder(order: Order, fillAmount: string): string {
        return this.getContractCallData(CTFExchangeMethods.fillOrder, [
            order,
            fillAmount,
        ]);
    }

    /**
     * Fills a set of orders
     * @param orders       - The order to be filled
     * @param fillAmounts  - The amounts to be filled, always in terms of the maker amount
     */
    fillOrders(orders: Order[], fillAmounts: string[]): string {
        return this.getContractCallData(CTFExchangeMethods.fillOrders, [
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
        takerOrder: Order,
        makerOrders: Order[],
        takerFillAmount: string,
        makerFillAmounts: string[]
    ): string {
        return this.getContractCallData(CTFExchangeMethods.matchOrders, [
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
    cancelOrder(order: Order): string {
        return this.getContractCallData(CTFExchangeMethods.cancelOrder, [
            order,
        ]);
    }

    /**
     * Cancels a set of orders
     * @param orders - The set of orders to be cancelled
     */
    cancelOrders(orders: Order[]): string {
        return this.getContractCallData(CTFExchangeMethods.cancelOrders, [
            orders,
        ]);
    }

    incrementNonce(): string {
        return this.getContractCallData(CTFExchangeMethods.incrementNonce, []);
    }

    isValidNonce(usr: string, nonce: string): string {
        return this.getContractCallData(CTFExchangeMethods.isValidNonce, [
            usr,
            nonce,
        ]);
    }

    getContractCallData(
        methodName: CTFExchangeMethods,
        methodParams: unknown[] = []
    ): string {
        return this.providerConnector.contractEncodeABI(
            CTF_EXCHANGE_ABI,
            this.contractAddress,
            methodName,
            methodParams
        );
    }
}
