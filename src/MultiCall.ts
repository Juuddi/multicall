import { Interface, JsonFragment, Provider } from 'quais'

import { CallInput, TokenBalances, TokenBalancesAndAllowances } from './types'
// import { toProvider } from './utils'
import { multiCall } from './generic'
import { getBalances, getBalancesAndAllowances } from './tokens'
// import { getReserves } from "./uniswap";

export class MultiCall {
	private provider: Provider
	constructor(provider: any) {
		this.provider = provider
	}

	public async multiCall(_interface: Interface | JsonFragment[], inputs: CallInput[], strict?: boolean): Promise<[number, any[]]>
	public async multiCall(inputs: CallInput[], strict?: boolean): Promise<[number, any[]]>
	public async multiCall(
		arg0: Interface | JsonFragment[] | CallInput[],
		arg1?: CallInput[] | boolean,
		arg2?: boolean
	): Promise<[number, any[]]> {
		return multiCall(this.provider, arg0, arg1, arg2)
	}

	public async getBalances(tokens: string[], account: string): Promise<[number, TokenBalances]> {
		return getBalances(this.provider, tokens, account)
	}

	public async getBalancesAndAllowances(tokens: string[], owner: string, spender: string): Promise<[number, TokenBalancesAndAllowances]> {
		return getBalancesAndAllowances(this.provider, tokens, owner, spender)
	}

	// public async getReserves(pairs: string[]): Promise<[number, UniswapReservesData]> {
	//   return getReserves(this.provider, pairs);
	// }
}
