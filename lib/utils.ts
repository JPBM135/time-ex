import type { TimeStrings } from './commons.js';

export function pluralize(array: string[], startingIndex = 1): string[] {
	const result = array.slice(0, startingIndex);
	for (const item of array.slice(startingIndex)) {
		result.push(item);
		result.push(`${item}s`);
	}

	return result;
}

export function errorOrNull(error: Error | RangeError | TypeError, shouldThrow: boolean): null {
	if (shouldThrow) throw error;
	return null;
}

export function validateTimeStrings(strings: TimeStrings): void {
	const keys = ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'] as (keyof TimeStrings)[];

	const missingKeys = keys.filter((key) => !strings[key]);

	if (missingKeys.length) {
		throw new Error('Missing keys: ' + missingKeys.join(', '));
	}

	for (const [key, value] of Object.entries(strings)) {
		if (!Array.isArray(value)) {
			throw new TypeError(`Expected ${key} to be an array, got ${typeof value}.`);
		}

		if (value.length === 0) {
			throw new Error(`Expected ${key} to be a non-empty array.`);
		}
	}
}
