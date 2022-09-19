import { ok } from 'node:assert';
import { deepEqual, throws, doesNotThrow, strictEqual, notEqual } from 'node:assert/strict';
import { BASE_VALUES, locales } from '../commons.js';
import { defaultLocales, registerLocale } from '../locales.js';
import { parseTime } from '../parseTime.js';
import { errorOrNull, pluralize } from '../utils.js';

beforeEach(() => {
	defaultLocales(true);
});

describe('Pluralize:', () => {
	it('GIVEN an array IT should pluralize using the default index', () => {
		deepEqual(pluralize(['s', 'sec', 'second']), ['s', 'sec', 'secs', 'second', 'seconds']);
	});
	it('GIVEN an array IT should pluralize using the given index', () => {
		deepEqual(pluralize(['s', 'sec', 'second'], 0), ['s', 'ss', 'sec', 'secs', 'second', 'seconds']);
		deepEqual(pluralize(['s', 'sec', 'second'], 2), ['s', 'sec', 'second', 'seconds']);
	});
});

describe('ErrorOrNull:', () => {
	it('GIVEN a error with true IT should throw the error', () => {
		throws(() => errorOrNull(new Error('test'), true));
	});
	it('GIVEN a error with false IT should return null', () => {
		doesNotThrow(() => errorOrNull(new Error('test'), false));
		strictEqual(errorOrNull(new Error('test'), false), null);
	});
});

describe('Locales:', () => {
	it('GIVEN the locales IT should have en-US', () => {
		notEqual(locales.get('en-US'), undefined);

		deepEqual(
			// eslint-disable-next-line @typescript-eslint/require-array-sort-compare
			Object.keys(locales.get('en-US')!).sort(),
			// eslint-disable-next-line @typescript-eslint/require-array-sort-compare
			['milliseconds', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'].sort(),
		);
	});

	it('GIVEN the en-us locale IT should exist and have the correct keys', () => {
		notEqual(locales.get('en-US'), undefined);

		deepEqual(
			// eslint-disable-next-line @typescript-eslint/require-array-sort-compare
			Object.keys(locales.get('en-US')!).sort(),
			// eslint-disable-next-line @typescript-eslint/require-array-sort-compare
			['milliseconds', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'].sort(),
		);
	});

	it('GIVEN the en-us locale IT should have the correct lengths', () => {
		const enUs = locales.get('en-US')!;

		strictEqual(enUs.seconds.length, 5);
		strictEqual(enUs.minutes.length, 5);
		strictEqual(enUs.hours.length, 5);
		strictEqual(enUs.days.length, 3);
		strictEqual(enUs.weeks.length, 5);
		strictEqual(enUs.months.length, 3);
		strictEqual(enUs.years.length, 5);
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

		notEqual(locales.get('en-GB'), undefined);

		deepEqual(enGb, locales.get('en-GB'));

		strictEqual(locales.size, localesBefore + 1);
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

		throws(() => registerLocale('en-US', enUs, false));
		doesNotThrow(() => registerLocale('en-US', enUs, true));

		notEqual(locales.get('en-US'), undefined);

		deepEqual(enUs, locales.get('en-US'));
	});

	it('REGISTERING a invalid locale with missing keys IT should throw', () => {
		throws(() =>
			// @ts-expect-error: Testing invalid locale
			registerLocale('en-GB', {
				seconds: ['s', 'sec', 'second'],
			}),
		);

		throws(() =>
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
		);
	});

	it('REGISTERING a invalid locale with empty arrays IT should throw', () => {
		throws(() =>
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
		);

		throws(() =>
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
		);
	});
});

describe('Base Values:', () => {
	it('GIVEN the base values IT should have the correct number values', () => {
		strictEqual(BASE_VALUES.seconds, 1_000);
		strictEqual(BASE_VALUES.minutes, 60 * 1_000);
		strictEqual(BASE_VALUES.hours, 60 * 60 * 1_000);
		strictEqual(BASE_VALUES.days, 24 * 60 * 60 * 1_000);
		strictEqual(BASE_VALUES.weeks, 7 * 24 * 60 * 60 * 1_000);
		strictEqual(BASE_VALUES.months, 30 * 24 * 60 * 60 * 1_000);
		strictEqual(BASE_VALUES.years, 365 * 24 * 60 * 60 * 1_000);
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

		ok(end - start < 100, `Should be less than 100ms, received: ${(end - start).toFixed(3)}ms`);
	});
});
