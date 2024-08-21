import { BigNumberish, JsonFragment, Interface } from 'quais'

export type CallInput = {
	target: string
	interface?: Interface | JsonFragment[]
	function: string
	args?: Array<any>
}

// export interface UniswapPairReserves {
// 	reserve0: BigNumberish
// 	reserve1: BigNumberish
// 	blockTimestampLast: number
// }

// export interface UniswapReservesData {
// 	[key: string]: UniswapPairReserves
// }

export interface TokenBalances {
	[key: string]: BigNumberish
}

export interface TokenBalanceAndAllowance {
	balance: BigNumberish
	allowance: BigNumberish
}

export interface TokenBalancesAndAllowances {
	[key: string]: TokenBalanceAndAllowance
}
