import { AbiCoder, Interface, JsonFragment, Provider } from 'quais'

import { CallInput } from './types'
import { MultiCall as bytecode, MultiCallStrict as bytecodeStrict } from './bytecode.json'
import { isJsonFragmentArray } from './utils'

/**
 * Performs a multi-call on the Quai Network, allowing for multiple function calls to be batched together in a single transaction.
 *
 * @param {Provider} provider_ - The Quais provider to use for the multi-call.
 * @param {Interface | JsonFragment[] | CallInput[]} arg0 - The interface or ABI of the contract to call, or an array of call inputs.
 * @param {CallInput[] | boolean} [arg1] - An array of call inputs, or a boolean indicating whether to use strict mode.
 * @param {boolean} [arg2] - A boolean indicating whether to use strict mode.
 * @returns {Promise<[number, any[]]>} A promise that resolves to an array containing the block number of the multi-call and an array of results.
 */
export async function multiCall(
	provider_: Provider,
	arg0: Interface | JsonFragment[] | CallInput[],
	arg1?: CallInput[] | boolean,
	arg2?: boolean
): Promise<[number, any[]]> {
	// initialize provider
	const provider = provider_

	// initialize inputs and strict mode
	let inputs: CallInput[] = []
	let strict: boolean | undefined

	// organize provided call arguments depending on their type and number.
	if (arg0 instanceof Interface || isJsonFragmentArray(arg0)) {
		// 3 arguments are provided, _interface, inputs, and strict
		if (!Array.isArray(arg1)) {
			throw new Error(`Second param must be an array of call inputs if the first param is an interface.`)
		} else {
			inputs = arg1
			for (let input of inputs) {
				if (!input.interface) input.interface = arg0
			}
			strict = arg2
		}
	} else {
		// 2 arguments are provided, inputs (with interface included) and strict
		inputs = arg0
		strict = arg1 as boolean
	}

	// initialize targets, datas, and interfaces
	const targets: string[] = []
	const datas: string[] = []
	const interfaces: Interface[] = []

	// organize call inputs based on provided interface(s)
	for (let input of inputs) {
		let _interface: Interface
		if (!input.interface) {
			// ensure call input has an interface if one is not provided in the main `multiCall` function
			throw new Error(`Call input must include interface.`)
		} else if (input.interface instanceof Interface) {
			// if interface is already an ethers Interface object, use that object
			_interface = input.interface
		} else {
			// if interface is an ABI, convert it to an Quais Interface object
			_interface = new Interface(input.interface)
		}
		interfaces.push(_interface)

		const calldata = _interface.encodeFunctionData(input.function, input.args)
		datas.push(calldata)
		targets.push(input.target)
	}

	// encode call data
	const inputData = AbiCoder.defaultAbiCoder().encode(['address[]', 'bytes[]'], [targets, datas])

	// handle strict mode, manipulate inputData to configure null or error return
	const fulldata = (strict ? bytecodeStrict : bytecode).concat(inputData.slice(2))

	// simulate transaction call to get return data
	const encodedReturnData = await provider.call({ from: '0x0000000000000000000000000000000000000000', data: fulldata })

	// decode return data and construct results array
	const [blockNumber, returndatas] = AbiCoder.defaultAbiCoder().decode(['uint256', 'bytes[]'], encodedReturnData)
	const results: any[] = []
	for (let i = 0; i < inputs.length; i++) {
		const returndata = returndatas[i]
		let result: any
		if (!strict && returndata == '0x') {
			result = null
		} else {
			result = interfaces[i].decodeFunctionResult(inputs[i].function, returndata)
			if (Array.isArray(result) && result.length == 1) {
				result = result[0]
			}
		}
		results.push(result)
	}
	return [blockNumber, results]
}
