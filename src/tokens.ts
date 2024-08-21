import { BigNumberish, AbiCoder, Provider } from 'quais'

import { TokenBalances, TokenBalancesAndAllowances } from './types'
import { MultiTokenBalanceAndAllowanceGetter, MultiTokenBalanceGetter } from './bytecode.json'

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
