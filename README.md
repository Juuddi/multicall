# @quais/multicall

Solidity contract and typescript library for static multi-calls.

The MultiCall.sol contract executes multiple calls inside its constructor and returns the result as an ABI encoded bytes array. When the initialization code is sent to the 0 address as an `quai_call` operation, the code is not deployed and the returndata that would have been deployed if it was sent with `quai_sendTransaction` is returned. This enables simple multi-call functionality for on-chain queries without needing to deploy an aggregator contract.

The class defines a generic function `multiCall` that takes an [quais `Interface` object](https://docs.qu.ai/sdk/content/classes/Interface#interface) or an array of [JSON ABI Fragments](https://docs.qu.ai/sdk/content/interfaces/JsonFragment) as inputs along with the address, function names and arguments to call. The class then decodes the returndata and returns the results as an array.

There are also three more specific contracts in this library that can simplify common use-cases while using less bytecode.
These are:

- Querying the balance of a single address for many ERC20 tokens
- Querying the balance of a single account and the allowance that account has provided to a specific address for many ERC20 tokens

All multicalls return the block number the data was pulled from.

## Install

> npm install --save @quais/multicall

# Examples

## General Usage

If we have this example contract:

```
contract TokenMap {
  struct TokenData {
    uint256 balance;
    uint8 decimals;
  }

  mapping(address => TokenData) internal _tokenDatas;

  function getTokenData(address token) external view returns (TokenData memory) {
    return _tokenDatas[token];
  }
}
```

We can execute a multi-call with this javascript code:

```js
const MultiCall = require('@indexed-finance/multicall')
const { abi } = require('./artifacts/TokenMap.json')

async function getMultiCallResults(provider, tokenMapAddress, tokens) {
	const multi = new MultiCall(provider)
	const inputs = []
	for (let token of tokens) {
		inputs.push({ target: tokenMapAddress, function: 'getTokenData', args: [token] })
	}
	const tokenDatas = await multi.multiCall(abi, inputs)
	return tokenDatas
}
// Result: [number, Array<{ balance: BigNumber, decimals: number }>]
// The first value is the block number the data was pulled from
```

## Querying Token Balances

```js
// Check the balance of the null address for some ERC20 tokens
const multi = new MultiCall(provider)
const tokens = [
	'0x00312BBd02dB610F6EdC61c0FCE4d1Ec6971651f', // some ERC20 token
	'0x00580E633d6d42928F7754444444aa78312C3dcA', // some ERC20 token
	'0x006f3A5dE5fdE66168e2C11f482A5716FBf97f45', // some ERC20 token
]
const account = '0x0000000000000000000000000000000000000000'
const [blockNumber, balances] = await multi.getBalances(tokens, account)

const balance1 = balances['0x00312BBd02dB610F6EdC61c0FCE4d1Ec6971651f']
const balance2 = balances['0x00580E633d6d42928F7754444444aa78312C3dcA']
const balance3 = balances['0x006f3A5dE5fdE66168e2C11f482A5716FBf97f45']
```

## Querying Token Balances and Allowances

```js
// Check the balance of an account for some ERC20 tokens
// and the allowance the account has given to the another EOA

const multi = new MultiCall(provider)

const tokens = [
	'0x00312BBd02dB610F6EdC61c0FCE4d1Ec6971651f', // some ERC20 token
	'0x00580E633d6d42928F7754444444aa78312C3dcA', // some ERC20 token
]

const owner = '0x0063Cb948Dc92d8B7637ECDfCC7e33580A6c046b'
const spender = '0x00735E9B2c731Fd3eCC8129a3653ACb99dF969cC'

const [blockNumber, balancesAndAllowances] = await multi.getBalancesAndAllowances(tokens, owner, spender)

const { balance: balance1, allowance: allowance1 } = balancesAndAllowances['0x00312BBd02dB610F6EdC61c0FCE4d1Ec6971651f']

const { balance: balance2, allowance: allowance2 } = balancesAndAllowances['0x00580E633d6d42928F7754444444aa78312C3dcA']
```

# API

## `MultiCall`

To create a `MultiCall` object, give a quais provider in the constructor, e.g. `new MultiCall(provider)`

```ts
// Usage 1
multiCall(inputs: CallInput[], strict?: boolean): Promise<[number, any[]]>;

// Usage 2
multiCall(_interface: Interface | JsonFragment[], inputs: CallInput[], strict?: boolean): Promise<[number, any[]]>;
```

### `MultiCall.multiCall`

The `MultiCall` class has a `multiCall` function which has two primary input configurations:

1. An array of `CallInput` objects including the `interface` property, and an optional `strict` boolean

   - Useful for calling multiple different contracts with unique interfaces

2. An [Interface](https://docs.qu.ai/sdk/content/classes/Interface#interface) object, an array of `CallInput` objects without the `interface` property, and an optional `strict` boolean

   - Useful for calling different functions on the same contract or multiple different contracts with the same interface

#### Parameters

**`Interface`**

A Quais [Interface](https://docs.qu.ai/sdk/content/classes/Interface#interface) object or an array of [JSON ABI Fragments](https://docs.qu.ai/sdk/content/interfaces/JsonFragment).

**`CallInput`**

Each `CallInput` has:

- `interface` - ABI array or quais [Interface](https://docs.qu.ai/sdk/content/classes/Interface#interface) object
- `target` - address of the contract to call
- `function` - name of the function to call, or function signature if the function is overloaded
- `args` - array of parameters to send in the call

The interface can be provided as the first parameter and left out of the call input objects if all the calls target the same contract.

The multi-call will then bundle all of these calls into the constructor arguments for the `MultiCall` contract, which will call each of the functions and return an array with each call's returndata.

**`Strict`**

If a call reverts, the default behavior for the contract is to return an empty `bytes` for that call. However, you may provide a `strict` boolean field as an input parameter to `multiCall` which will instead revert the entire call.

#### Response

The result will be a promise which resolves to an array with two values: the first is a `number` which is the block number the data was from, and the second is an array with the decoded return data from each call. The data will be decoded by the quais interface using whatever return types are defined in the ABI. If `strict: true` is not given, the result of any call that reverted will be `null`.

### `MultiCall.getBalances`

The `MultiCall` class has a `getBalances` function which can query the balance of a single account for many tokens.

```ts
getBalances(tokens: string[], account: string);
```

#### Parameters

**`tokens`**

An array of token addresses.

```ts
const tokens = ['0x00312BBd02dB610F6EdC61c0FCE4d1Ec6971651f', '0x00580E633d6d42928F7754444444aa78312C3dcA']
```

**`account`**

The address of the account to query balances for.

```ts
const account = '0x00735E9B2c731Fd3eCC8129a3653ACb99dF969cC'
```

#### Response

The response from this function is a promise that resolves to an array with two values: the first is a `number` which is the block number the data was from, and the second is an object with the token addresses as keys and `BigNumber` as values.

```ts
// response type
Promise<
	[
		number, // block number
		{
			[token: string]: BigNumber
		}
	]
>
```

### `MultiCall.getBalancesAndAllowances`

The `MultiCall` class has a `getBalancesAndAllowances` function which can query the balance of a single account for many tokens and the allowance the account has provided to a specific address for those tokens.

```ts
getBalancesAndAllowances(tokens: string[], owner: string, spender: string)
```

#### Parameters

**`tokens`**

An array of token addresses.

```ts
const tokens = ['0x00312BBd02dB610F6EdC61c0FCE4d1Ec6971651f', '0x00580E633d6d42928F7754444444aa78312C3dcA']
```

**`owner`**

The address of the account whose balances and allowances are being queried.

```ts
const owner = '0x0063Cb948Dc92d8B7637ECDfCC7e33580A6c046b'
```

**`spender`**

The address of the spender for the allowance queries.

```ts
const spender = '0x00735E9B2c731Fd3eCC8129a3653ACb99dF969cC'
```

#### Response

The response from this function is a promise that resolves to an array with two values: the first is a `number` which is the block number the data was from, and the second is an object with the token addresses as keys and a `TokenBalanceAndAllowance` type as values.

```ts
// response type
Promise<
	[
		number, // block number
		{
			[token: string]: {
				balance: BigNumber // balance of `owner`
				allowance: BigNumber // amount `owner` has approved `spender` to spend
			}
		}
	]
>
```
