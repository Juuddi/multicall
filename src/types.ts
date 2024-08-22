import { BigNumberish, JsonFragment, Interface } from 'quais'

/**
 * The call input interface. Contains the target address, the function name and the arguments to send in the call.
 *
 * Depending on if the interface is provided to the main `multiCall` function, the `interface` field may be omitted.
 */
export type CallInput = {
	target: string
	interface?: Interface | JsonFragment[]
	function: string
	args?: Array<any>
}


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

// export interface UniswapPairReserves {
// 	reserve0: BigNumberish
// 	reserve1: BigNumberish
// 	blockTimestampLast: number
// }

// export interface UniswapReservesData {
// 	[key: string]: UniswapPairReserves
// }
