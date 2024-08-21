import { Interface, JsonFragment, Provider, BrowserProvider } from 'quais'

// export function toProvider(provider: any): Provider {
// 	if (Object.keys(provider).includes('currentProvider')) {
// 		return new BrowserProvider(provider.currentProvider)
// 	} else {
// 		return provider
// 	}
// }

export function isJsonFragmentArray(input: any): input is JsonFragment[] {
	if (!Array.isArray(input)) return false
	const inputKeys = Object.keys(input[0])
	if (!inputKeys.includes('target') && !inputKeys.includes('function')) return true
	return false
}

export function isInterface(input: any): input is Interface {
	return input._isInterface
}
