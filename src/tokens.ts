import { AbiCoder, Provider } from 'quais'

import { TokenBalances, TokenBalancesAndAllowances } from './types'
import { MultiTokenBalanceAndAllowanceGetter, MultiTokenBalanceGetter } from './bytecode.json'

/**
 * Retrieves the balances of a list of tokens for a given account.
 *
 * @param {Provider} provider_ - The provider to use for the request.
 * @param {string[]} tokens - The list of token addresses to retrieve balances for.
 * @param {string} account - The account address to retrieve balances for.
 * @return {[number, TokenBalances]} An array containing the block number and a dictionary of token balances.
 */
export async function getBalances(provider_: Provider, tokens: string[], account: string): Promise<[number, TokenBalances]> {
	const provider = provider_
	const inputData = AbiCoder.defaultAbiCoder().encode(['address[]', 'address'], [tokens, account])
	const bytecode = MultiTokenBalanceGetter.concat(inputData.slice(2))
	const encodedReturnData = await provider.call({ from: '0x005f644097F8f0E9f996Dca4F4F23aBB6C1Cc8b3', data: bytecode })
	const [blockNumber, decodedReturnData] = AbiCoder.defaultAbiCoder().decode(['uint256', 'uint256[]'], encodedReturnData)
	const balances: TokenBalances = {}
	for (let i = 0; i < tokens.length; i++) {
		balances[tokens[i]] = decodedReturnData[i]
	}
	return [blockNumber, balances]
}

/**
 * Retrieves the balances and allowances of a list of tokens for a given owner and spender.
 *
 * @param {Provider} provider_ - The provider to use for the request.
 * @param {string[]} tokens - The list of token addresses to retrieve balances and allowances for.
 * @param {string} owner - The owner address to retrieve balances and allowances for.
 * @param {string} spender - The spender address to retrieve allowances for.
 * @return {[number, TokenBalancesAndAllowances]} An array containing the block number and a dictionary of token balances and allowances.
 */
export async function getBalancesAndAllowances(
	provider_: Provider,
	tokens: string[],
	owner: string,
	spender: string
): Promise<[number, TokenBalancesAndAllowances]> {
	const provider = provider_
	const inputData = AbiCoder.defaultAbiCoder().encode(['address[]', 'address', 'address'], [tokens, owner, spender])
	const bytecode = MultiTokenBalanceAndAllowanceGetter.concat(inputData.slice(2))
	const encodedReturnData = await provider.call({ from: '0x005f644097F8f0E9f996Dca4F4F23aBB6C1Cc8b3', data: bytecode })
	const [blockNumber, decodedReturnData] = AbiCoder.defaultAbiCoder().decode(['uint256', 'uint256[2][]'], encodedReturnData)
	const balancesAndAllowances: TokenBalancesAndAllowances = {}
	for (let i = 0; i < tokens.length; i++) {
		const [balance, allowance] = decodedReturnData[i]
		balancesAndAllowances[tokens[i]] = { balance, allowance }
	}
	return [blockNumber, balancesAndAllowances]
}
