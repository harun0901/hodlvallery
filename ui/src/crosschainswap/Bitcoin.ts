import {Currency, NativeCurrency, Token} from "@sushiswap/sdk";
import {WBTC} from "../constants";

export class Bitcoin extends NativeCurrency{
    constructor(chainId: number) {
        super(chainId, 8, 'BTC', 'Bitcoin')
    }


    get wrapped(): Token {
        return WBTC;
    }

    private static _btcCache: { [chainId: number]: Bitcoin } = {}
    public static onChain(chainId: number): Bitcoin {
        return this._btcCache[chainId] ?? (this._btcCache[chainId] = new Bitcoin(chainId))
    }

    public equals(other: Currency): boolean {
        return other.isNative && other.symbol ===this.symbol  && other.chainId === this.chainId
    }

}
export const nativeBitcoin = {
    1: new Bitcoin(1),
    3: new Bitcoin(3)
}
