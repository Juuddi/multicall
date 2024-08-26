// import { BigNumberish, AbiCoder } from 'quais'
// import { toProvider } from './utils'

// import { UniswapReservesData } from './types'

// import { UniswapReservesGetter } from './bytecode.json'

// export async function getReserves(provider_: any, pairs: string[]): Promise<[number, UniswapReservesData]> {
// 	const provider = toProvider(provider_)
// 	const inputData = AbiCoder.encode(['address[]'], [pairs])
// 	const bytecode = UniswapReservesGetter.concat(inputData.slice(2))
// 	const encodedReturnData = await provider.call({ from: '0x0000000000000000000000000000000000000000', data: bytecode })
// 	const [blockNumber, decodedReturnData] = AbiCoder.decode(['uint256', 'bytes32[]'], encodedReturnData)

// 	const allReserves: UniswapReservesData = {}
// 	for (let i = 0; i < pairs.length; i++) {
// 		const decodedData = Buffer.from(decodedReturnData[i].slice(2), 'hex')
// 		const r0_bytes = decodedData.slice(0, 14)
// 		const r1_bytes = decodedData.slice(14, 28)
// 		const t_bytes = decodedData.slice(28)
// 		const pair = pairs[i]
// 		allReserves[pair] = {
// 			reserve0: BigNumberish.from(r0_bytes),
// 			reserve1: BigNumber.from(r1_bytes),
// 			blockTimestampLast: BigNumber.from(t_bytes).toNumber(),
// 		}
// 	}
// 	return [blockNumber, allReserves]
// }
