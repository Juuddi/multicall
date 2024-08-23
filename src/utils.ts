import { JsonFragment } from 'quais'

/**
 * Checks if the input is a JSON fragment array.
 *
 * @param {any} input - the input to be checked
 * @return {boolean} true if the input is a JSON fragment array, false otherwise
 */
export function isJsonFragmentArray(input: any): input is JsonFragment[] {
	if (!Array.isArray(input)) return false
	const inputKeys = Object.keys(input[0])
	if (!inputKeys.includes('target') && !inputKeys.includes('function')) return true
	return false
}
