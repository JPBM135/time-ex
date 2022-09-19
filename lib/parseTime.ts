import { locales, type TimeStrings, REGEX, BASE_VALUES } from './commons.js';
import { errorOrNull } from './utils.js';

export interface ParseTimeOptions {
	customStrings?: Partial<TimeStrings>;
	fromNow?: boolean;
	locale?: string;
	throwError?: boolean;
}

export function parseTime(timeString: number | string, options: ParseTimeOptions & { throwError: true }): number;
export function parseTime(timeString: number | string, options?: ParseTimeOptions): number | null;
export function parseTime(timeString: number | string, options?: any): number | null {
	let locale = locales.get(options?.locale ?? 'en-US')!;
	if (options?.customStrings) {
		locale = { ...locale, ...options.customStrings };
	}

	if (!locale) {
		throw new Error(`Locale ${options?.locale ?? 'en-US'} is not registered.`);
	}

	let time = 0;

	if (Number(timeString) || typeof timeString === 'number') {
		if (Number.isNaN(timeString)) {
			return errorOrNull(
				new TypeError(`Expected timeString to be a valid number, received ${timeString}`),
				options?.throwError ?? false,
			);
		}

		if (!Number.isFinite(Number(timeString))) {
			return errorOrNull(
				new RangeError(`Expected timeString to be a finite number, received ${timeString}`),
				options?.throwError ?? false,
			);
		}

		return Number(timeString) + (options?.fromNow ? Date.now() : 0);
	}

	const matches = [...(timeString as string).toLowerCase().matchAll(new RegExp(REGEX, 'g'))];
	for (const match of matches) {
		// @ts-expect-error: The regex is guaranteed to have these groups.
		const { quantity, unit } = match.groups;

		if (unit) {
			const unitName = Object.keys(locale!).find((key) => locale[key as keyof TimeStrings].includes(unit));
			if (!unitName) {
				return errorOrNull(
					new Error(`Unknown unit ${unit} on locale ${options?.locale ?? 'en-US'}.`),
					options?.throwError ?? false,
				);
			}

			const unitValue = BASE_VALUES[unitName as keyof typeof BASE_VALUES];
			time += Number(quantity) * unitValue + (options?.fromNow ? Date.now() : 0);
			continue;
		}

		time += Number(quantity) + (options?.fromNow ? Date.now() : 0);
	}

	return time;
}
