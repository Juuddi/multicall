import { Interface, JsonFragment, Provider } from 'quais'

import { CallInput, TokenBalances, TokenBalancesAndAllowances } from './types'
import { multiCall } from './generic'
import { getBalances, getBalancesAndAllowances } from './tokens'
// import { getReserves } from "./uniswap";


export class MultiCall {
  /**
	 * The Quais provider instance used to interact with Quai.
	 * @type {Provider}
	 * @private
	 */
	private provider: Provider
	
  /**
	 * Creates an instance of MultiCall.
	 * @param {any} provider - The provider instance.
	 */
  constructor(provider: any) {
		this.provider = provider
	}

	/**
	 * Performs a multi-call operation using the provided interface and inputs.
	 *
	 * @param {Interface | JsonFragment[]} _interface - The interface or JSON fragments to use for the multi-call operation.
	 * @param {CallInput[]} inputs - The call inputs to use for the multi-call operation. Inclusion of interfaces are optional.
	 * @param {boolean} [strict] - Optional boolean value indicating whether to use strict mode.
	 * @return {Promise<[number, any[]]>} A promise that resolves to an array containing the block number and the results of the multi-call operation.
	 */
	public async multiCall(_interface: Interface | JsonFragment[], inputs: CallInput[], strict?: boolean): Promise<[number, any[]]>

	/**
	 * Performs a multi-call operation using the provided interface and inputs. Handles the for the previous overload.
	 *
	 * @param {CallInput[]} inputs - The call inputs to use for the multi-call operation with Interfaces included.
	 * @param {boolean} strict - Optional boolean value indicating whether to use strict mode.
	 * @return {Promise<[number, any[]]>} A promise that resolves to an array containing the block number and the results of the multi-call operation.
	 */
	public async multiCall(inputs: CallInput[], strict?: boolean): Promise<[number, any[]]>

	/**
	 * Performs a multi-call operation using the provided interface and inputs. Handles the for the previous two overloads.
	 *
	 * @param {Interface | JsonFragment[] | CallInput[]} arg0 - The interface, JSON fragments, or call inputs to use for the multi-call operation.
	 * @param {CallInput[] | boolean} [arg1] - Optional call inputs or a boolean value indicating whether to use strict mode.
	 * @param {boolean} [arg2] - Optional boolean value indicating whether to use strict mode.
	 * @return {Promise<[number, any[]]>} A promise that resolves to an array containing the block number and the results of the multi-call operation.
	 */
	public async multiCall(
		arg0: Interface | JsonFragment[] | CallInput[],
		arg1?: CallInput[] | boolean,
		arg2?: boolean
	): Promise<[number, any[]]> {
		return multiCall(this.provider, arg0, arg1, arg2)
	}

	/**
	 * Retrieves the balances of a list of ERC20 tokens for a given account. Assumes that all calls target ERC20 token contracts with the balanceOf method
	 *
	 * @param {string[]} tokens - An array of token addresses.
	 * @param {string} account - The address of the account to retrieve balances for.
	 * @return {Promise<[number, TokenBalances]>} A promise that resolves to an array containing the block number and an object with token balances.
	 */
	public async getBalances(tokens: string[], account: string): Promise<[number, TokenBalances]> {
		return getBalances(this.provider, tokens, account)
	}

	/**
	 * Retrieves the balances and allowances of a list of ERC20 tokens for a given account and spender.
	 *
	 * @param {string[]} tokens - An array of token addresses.
	 * @param {string} owner - The address of the account to retrieve balances for.
	 * @param {string} spender - The address of the account to retrieve allowances for.
	 * @return {Promise<[number, TokenBalancesAndAllowances]>} A promise that resolves to an array containing the block number and an object with token balances and allowances.
	 */
	public async getBalancesAndAllowances(tokens: string[], owner: string, spender: string): Promise<[number, TokenBalancesAndAllowances]> {
		return getBalancesAndAllowances(this.provider, tokens, owner, spender)
	}

	// public async getReserves(pairs: string[]): Promise<[number, UniswapReservesData]> {
	//   return getReserves(this.provider, pairs);
	// }
}
