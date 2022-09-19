import { expect, describe, it, beforeEach } from 'vitest';
import { BASE_VALUES, locales, REGEX } from '../lib/commons.js';
import { defaultLocales, registerLocale } from '../lib/locales.js';
import { parseTime } from '../lib/parseTime.js';
import { errorOrNull, pluralize } from '../lib/utils.js';

beforeEach(() => {
	defaultLocales(true);
});

describe('Regex:', () => {
	it('GIVEN a valid time IT should match', () => {
		const time = '1d 2h 3m 4s 5ms';
		const match = time.match(new RegExp(REGEX, 'g'));
		expect(match).toStrictEqual(['1d', '2h', '3m', '4s', '5ms']);
	});

	it('GIVEN a valid time with a space IT should match', () => {
		const time = '1 d 2 h 3 m 4 s 5 ms';
		const match = time.match(new RegExp(REGEX, 'g'));
		expect(match).toStrictEqual(['1 d', '2 h', '3 m', '4 s', '5 ms']);
	});

	it('GIVEN a valid time with a dot IT should match', () => {
		const time = '1.5 d 2.5 h 3.5 m 4.5 s 5.5 ms';
		const match = time.match(new RegExp(REGEX, 'g'));
		expect(match).toStrictEqual(['1.5 d', '2.5 h', '3.5 m', '4.5 s', '5.5 ms']);
	});

	it('GIVEN a valid time IT should have the quantity and unit group', () => {
		expect('1 day'.match(REGEX)?.groups).toEqual({
			quantity: '1',
			unit: 'day',
		});

		expect('1.5 days'.match(REGEX)?.groups).toEqual({
			quantity: '1.5',
			unit: 'days',
		});
	});
});

describe('Pluralize:', () => {
	it('GIVEN an array IT should pluralize using the default index', () => {
		expect(pluralize(['s', 'sec', 'second'])).toStrictEqual(['s', 'sec', 'secs', 'second', 'seconds']);
	});
	it('GIVEN an array IT should pluralize using the given index', () => {
		expect(pluralize(['s', 'sec', 'second'], 0)).toStrictEqual(['s', 'ss', 'sec', 'secs', 'second', 'seconds']);
		expect(pluralize(['s', 'sec', 'second'], 2)).toStrictEqual(['s', 'sec', 'second', 'seconds']);
	});
});

describe('ErrorOrNull:', () => {
	it('GIVEN a error with true IT should throw the error', () => {
		expect(() => errorOrNull(new Error('test'), true)).toThrowError();
	});
	it('GIVEN a error with false IT should return null', () => {
		expect(() => errorOrNull(new Error('test'), false)).not.toThrowError();
		expect(errorOrNull(new Error('test'), false)).toStrictEqual(null);
	});
});

describe('Locales:', () => {
	it('GIVEN the locales IT should have en-US', () => {
		expect(locales.get('en-US')).toBeTruthy();
	});

	it('GIVEN the en-us locale IT should have the correct keys', () => {
		expect(
			// eslint-disable-next-line @typescript-eslint/require-array-sort-compare
			Object.keys(locales.get('en-US')!).sort(),
		).toStrictEqual(
			// eslint-disable-next-line @typescript-eslint/require-array-sort-compare
			['milliseconds', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'].sort(),
		);
	});

	it('GIVEN the en-us locale IT should have the correct lengths', () => {
		const enUs = locales.get('en-US')!;

		expect(enUs.seconds.length).toStrictEqual(5);
		expect(enUs.minutes.length).toStrictEqual(5);
		expect(enUs.hours.length).toStrictEqual(5);
		expect(enUs.days.length).toStrictEqual(3);
		expect(enUs.weeks.length).toStrictEqual(5);
		expect(enUs.months.length).toStrictEqual(3);
		expect(enUs.years.length).toStrictEqual(5);
	});

	it('REGISTERING a new locale IT should be added to the locales map', () => {
		const localesBefore = locales.size;
		const enGb = {
			milliseconds: pluralize(['ms', 'msec', 'millisecond']),
			seconds: pluralize(['s', 'sec', 'second']),
			minutes: pluralize(['m', 'min', 'minute']),
			hours: pluralize(['h', 'hr', 'hour']),
			days: pluralize(['d', 'day']),
			weeks: pluralize(['w', 'wk', 'week']),
			months: pluralize(['mo', 'month']),
			years: pluralize(['y', 'yr', 'year']),
		};

		registerLocale('en-GB', enGb);

		expect(locales.get('en-GB')).toBeTruthy();

		expect(enGb).toStrictEqual(locales.get('en-GB'));

		expect(locales.size).toStrictEqual(localesBefore + 1);
	});

	it('REGISTERING a new locale with overwrite IT should overwrite the existing locale', () => {
		const enUs = {
			milliseconds: pluralize(['ms', 'msec', 'millisecond']),
			seconds: pluralize(['s', 'sec', 'second']),
			minutes: pluralize(['m', 'min', 'minute']),
			hours: pluralize(['h', 'hr', 'hour']),
			days: pluralize(['d', 'day']),
			weeks: pluralize(['w', 'wk', 'week']),
			months: pluralize(['mo', 'month']),
			years: pluralize(['y', 'yr', 'year']),
		};

		expect(() => registerLocale('en-US', enUs, false)).toThrowError();
		expect(() => registerLocale('en-US', enUs, true)).not.toThrowError();

		expect(locales.get('en-US')).toBeTruthy();

		expect(enUs).toStrictEqual(locales.get('en-US'));
	});

	it('REGISTERING a invalid locale with missing keys IT should throw', () => {
		expect(() =>
			// @ts-expect-error: Testing invalid locale
			registerLocale('en-GB', {
				seconds: ['s', 'sec', 'second'],
			}),
		).toThrowError();

		expect(() =>
			registerLocale('en-GB', {
				seconds: ['s', 'sec', 'second'],
				minutes: ['m', 'min', 'minute'],
				hours: ['h', 'hr', 'hour'],
				days: ['d', 'day'],
				weeks: ['w', 'wk', 'week'],
				months: ['mo', 'month'],
				// @ts-expect-error: Testing invalid locale
				years: undefined,
			}),
		).toThrowError();
	});

	it('REGISTERING a invalid locale with empty arrays IT should throw', () => {
		expect(() =>
			registerLocale('en-GB', {
				milliseconds: [],
				seconds: [],
				minutes: [],
				hours: [],
				days: [],
				weeks: [],
				months: [],
				years: [],
			}),
		).toThrowError();

		expect(() =>
			registerLocale('en-GB', {
				milliseconds: ['ms', 'msec', 'millisecond'],
				seconds: ['s', 'sec', 'second'],
				minutes: ['m', 'min', 'minute'],
				hours: ['h', 'hr', 'hour'],
				days: ['d', 'day'],
				weeks: ['w', 'wk', 'week'],
				months: ['mo', 'month'],
				years: [],
			}),
		).toThrowError();
	});

	it('REGISTERING a invalid locale with non arrays IT should throw', () => {
		expect(() =>
			registerLocale('en-GB', {
				// @ts-expect-error: Testing invalid locale
				milliseconds: 'ms',
				// @ts-expect-error: Testing invalid locale
				seconds: 's',
				// @ts-expect-error: Testing invalid locale
				minutes: 'm',
				// @ts-expect-error: Testing invalid locale
				hours: 'h',
				// @ts-expect-error: Testing invalid locale
				days: 'd',
				// @ts-expect-error: Testing invalid locale
				weeks: 'w',
				// @ts-expect-error: Testing invalid locale
				months: 'mo',
				// @ts-expect-error: Testing invalid locale
				years: 'y',
			}),
		).toThrowError();

		expect(() =>
			registerLocale('en-GB', {
				milliseconds: ['ms', 'msec', 'millisecond'],
				seconds: ['s', 'sec', 'second'],
				minutes: ['m', 'min', 'minute'],
				hours: ['h', 'hr', 'hour'],
				days: ['d', 'day'],
				weeks: ['w', 'wk', 'week'],
				months: ['mo', 'month'],
				// @ts-expect-error: Testing invalid locale
				years: 'y',
			}),
		).toThrowError();
	});
});

describe('Base Values:', () => {
	it('GIVEN the base values IT should have the correct number values', () => {
		expect(BASE_VALUES.seconds).toStrictEqual(1_000);
		expect(BASE_VALUES.minutes).toStrictEqual(60 * 1_000);
		expect(BASE_VALUES.hours).toStrictEqual(60 * 60 * 1_000);
		expect(BASE_VALUES.days).toStrictEqual(24 * 60 * 60 * 1_000);
		expect(BASE_VALUES.weeks).toStrictEqual(7 * 24 * 60 * 60 * 1_000);
		expect(BASE_VALUES.months).toStrictEqual(30 * 24 * 60 * 60 * 1_000);
		expect(BASE_VALUES.years).toStrictEqual(365 * 24 * 60 * 60 * 1_000);
	});
});

describe('Performance:', () => {
	it('GIVEN a large number of dates IT should be fast', () => {
		const dates = Array.from({ length: 1_000 }, () => {
			return `${Math.floor(Math.random() * 1_000)} ${
				['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'][Math.floor(Math.random() * 7)]
			}`;
		});
		const start = Date.now();

		for (const date of dates) parseTime(date);

		const end = Date.now();

		expect(end - start).toBeLessThan(100);
	});
});
