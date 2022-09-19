/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { doesNotThrow } from 'node:assert';
import { expect, describe, it, beforeEach } from 'vitest';
import { BASE_VALUES } from '../lib/commons.js';
import { defaultLocales } from '../lib/locales.js';
import { parseTime } from '../lib/parseTime.js';

beforeEach(() => {
	defaultLocales(true);
});

describe('Parse Time: String ==> Number', () => {
	it('GIVEN a string for seconds IT should parse the time', () => {
		expect(parseTime('1s')).toStrictEqual(BASE_VALUES.seconds);
		expect(parseTime('1 sec')).toStrictEqual(BASE_VALUES.seconds);
		expect(parseTime('1 second')).toStrictEqual(BASE_VALUES.seconds);

		expect(parseTime('1.5s')).toStrictEqual(BASE_VALUES.seconds * 1.5);
		expect(parseTime('1.5 sec')).toStrictEqual(BASE_VALUES.seconds * 1.5);
		expect(parseTime('1.5 secs')).toStrictEqual(BASE_VALUES.seconds * 1.5);
		expect(parseTime('1.5 second')).toStrictEqual(BASE_VALUES.seconds * 1.5);
		expect(parseTime('1.5 seconds')).toStrictEqual(BASE_VALUES.seconds * 1.5);
	});

	it('GIVEN a string for minutes IT should parse the time', () => {
		expect(parseTime('1m')).toStrictEqual(BASE_VALUES.minutes);
		expect(parseTime('1 min')).toStrictEqual(BASE_VALUES.minutes);
		expect(parseTime('1 minute')).toStrictEqual(BASE_VALUES.minutes);

		expect(parseTime('1.5m')).toStrictEqual(BASE_VALUES.minutes * 1.5);
		expect(parseTime('1.5 min')).toStrictEqual(BASE_VALUES.minutes * 1.5);
		expect(parseTime('1.5 mins')).toStrictEqual(BASE_VALUES.minutes * 1.5);
		expect(parseTime('1.5 minute')).toStrictEqual(BASE_VALUES.minutes * 1.5);
		expect(parseTime('1.5 minutes')).toStrictEqual(BASE_VALUES.minutes * 1.5);
	});

	it('GIVEN a string for hours IT should parse the time', () => {
		expect(parseTime('1h')).toStrictEqual(BASE_VALUES.hours);
		expect(parseTime('1 hr')).toStrictEqual(BASE_VALUES.hours);
		expect(parseTime('1 hour')).toStrictEqual(BASE_VALUES.hours);

		expect(parseTime('1.5h')).toStrictEqual(BASE_VALUES.hours * 1.5);
		expect(parseTime('1.5 hr')).toStrictEqual(BASE_VALUES.hours * 1.5);
		expect(parseTime('1.5 hrs')).toStrictEqual(BASE_VALUES.hours * 1.5);
		expect(parseTime('1.5 hour')).toStrictEqual(BASE_VALUES.hours * 1.5);
		expect(parseTime('1.5 hours')).toStrictEqual(BASE_VALUES.hours * 1.5);
	});

	it('GIVEN a string for days IT should parse the time', () => {
		expect(parseTime('1d')).toStrictEqual(BASE_VALUES.days);
		expect(parseTime('1 day')).toStrictEqual(BASE_VALUES.days);

		expect(parseTime('1.5d')).toStrictEqual(BASE_VALUES.days * 1.5);
		expect(parseTime('1.5 days')).toStrictEqual(BASE_VALUES.days * 1.5);
	});

	it('GIVEN a string for weeks IT should parse the time', () => {
		expect(parseTime('1w')).toStrictEqual(BASE_VALUES.weeks);
		expect(parseTime('1 wk')).toStrictEqual(BASE_VALUES.weeks);
		expect(parseTime('1 week')).toStrictEqual(BASE_VALUES.weeks);

		expect(parseTime('1.5w')).toStrictEqual(BASE_VALUES.weeks * 1.5);
		expect(parseTime('1.5 wk')).toStrictEqual(BASE_VALUES.weeks * 1.5);
		expect(parseTime('1.5 wks')).toStrictEqual(BASE_VALUES.weeks * 1.5);
		expect(parseTime('1.5 week')).toStrictEqual(BASE_VALUES.weeks * 1.5);
		expect(parseTime('1.5 weeks')).toStrictEqual(BASE_VALUES.weeks * 1.5);
	});

	it('GIVEN a string for months IT should parse the time', () => {
		expect(parseTime('1mo')).toStrictEqual(BASE_VALUES.months);
		expect(parseTime('1 month')).toStrictEqual(BASE_VALUES.months);

		expect(parseTime('1.5mo')).toStrictEqual(BASE_VALUES.months * 1.5);
		expect(parseTime('1.5 months')).toStrictEqual(BASE_VALUES.months * 1.5);
	});

	it('GIVEN a string for years IT should parse the time', () => {
		expect(parseTime('1y')).toStrictEqual(BASE_VALUES.years);
		expect(parseTime('1 yr')).toStrictEqual(BASE_VALUES.years);
		expect(parseTime('1 year')).toStrictEqual(BASE_VALUES.years);

		expect(parseTime('1.5y')).toStrictEqual(BASE_VALUES.years * 1.5);
		expect(parseTime('1.5 yr')).toStrictEqual(BASE_VALUES.years * 1.5);
		expect(parseTime('1.5 yrs')).toStrictEqual(BASE_VALUES.years * 1.5);
		expect(parseTime('1.5 year')).toStrictEqual(BASE_VALUES.years * 1.5);
		expect(parseTime('1.5 years')).toStrictEqual(BASE_VALUES.years * 1.5);
	});
});

describe('Parse Time: Multiple Time Units', () => {
	it('GIVEN a string with multiple time units IT should parse the time', () => {
		expect(parseTime('1s 1m')).toStrictEqual(BASE_VALUES.seconds + BASE_VALUES.minutes);
		expect(parseTime('1s 1m 1h')).toStrictEqual(BASE_VALUES.seconds + BASE_VALUES.minutes + BASE_VALUES.hours);
	});

	it('GIVEN a string with multiple long time units IT should parse the time', () => {
		expect(parseTime('1 second 1 minute')).toStrictEqual(BASE_VALUES.seconds + BASE_VALUES.minutes);
		expect(parseTime('1 sec 1 min 2 hours')).toStrictEqual(
			BASE_VALUES.seconds + BASE_VALUES.minutes + BASE_VALUES.hours * 2,
		);
	});
});

describe('Parse Time: Original MS tests', () => {
	it('should preserve ms', () => {
		expect(parseTime('100')).toStrictEqual(100);
	});

	it('should convert from m to ms', () => {
		expect(parseTime('1m')).toStrictEqual(60_000);
	});

	it('should convert from h to ms', () => {
		expect(parseTime('1h')).toStrictEqual(3_600_000);
	});

	it('should convert d to ms', () => {
		expect(parseTime('2d')).toStrictEqual(172_800_000);
	});

	it('should convert w to ms', () => {
		expect(parseTime('3w')).toStrictEqual(1_814_400_000);
	});

	it('should convert s to ms', () => {
		expect(parseTime('1s')).toStrictEqual(1_000);
	});

	it('should convert ms to ms', () => {
		expect(parseTime('100ms')).toStrictEqual(100);
	});

	it('should work with decimals', () => {
		expect(parseTime('1.5h')).toStrictEqual(5_400_000);
	});

	it('should work with multiple spaces', () => {
		expect(parseTime('1   s')).toStrictEqual(1_000);
	});

	it('should be case-insensitive', () => {
		expect(parseTime('1.5H')).toStrictEqual(5_400_000);
	});

	it('should work with numbers starting with .', () => {
		expect(parseTime('.5ms')).toStrictEqual(0.5);
	});

	it('should work with negative integers', () => {
		expect(parseTime('-100ms')).toStrictEqual(-100);
	});

	it('should work with negative decimals', () => {
		expect(parseTime('-1.5h')).toStrictEqual(-5_400_000);
		expect(parseTime('-10.5h')).toStrictEqual(-37_800_000);
	});

	it('should work with negative decimals starting with "."', () => {
		expect(parseTime('-.5h')).toStrictEqual(-1_800_000);
	});

	it('should convert milliseconds to ms', () => {
		expect(parseTime('53 milliseconds')).toStrictEqual(53);
	});

	it('should convert msecs to ms', () => {
		expect(parseTime('17 msecs')).toStrictEqual(17);
	});

	it('should convert sec to ms', () => {
		expect(parseTime('1 sec')).toStrictEqual(1_000);
	});

	it('should convert from min to ms', () => {
		expect(parseTime('1 min')).toStrictEqual(60_000);
	});

	it('should convert from hr to ms', () => {
		expect(parseTime('1 hr')).toStrictEqual(3_600_000);
	});

	it('should convert days to ms', () => {
		expect(parseTime('2 days')).toStrictEqual(172_800_000);
	});

	it('should work with decimals', () => {
		expect(parseTime('1.5 hours')).toStrictEqual(5_400_000);
	});

	it('should work with negative integers', () => {
		expect(parseTime('-100 milliseconds')).toStrictEqual(-100);
	});

	it('should work with negative decimals', () => {
		expect(parseTime('-1.5 hours')).toStrictEqual(-5_400_000);
	});

	it('should work with negative decimals starting with "."', () => {
		expect(parseTime('-.5 hr')).toStrictEqual(-1_800_000);
	});
});

describe('Parse Time: Number ==> Number', () => {
	it('GIVEN a number for milliseconds IT should parse the time', () => {
		expect(parseTime(1_000)).toStrictEqual(1_000);
		expect(parseTime(1_500)).toStrictEqual(1_500);
	});

	it('GIVEN a invalid number with the throwError: true IT should throw', () => {
		expect(() => parseTime(Number.NaN, { throwError: true })).toThrowError();
		expect(() => parseTime(Number.NaN, { throwError: true })).toThrowError();
	});

	it('GIVEN a invalid number with the throwError: false IT should return null', () => {
		expect(parseTime(Number.NaN)).toStrictEqual(null);
		expect(parseTime(Number.NaN)).toStrictEqual(null);
	});
});

describe('Parse Time: options', () => {
	it('GIVEN the parse options with the fromNow: true IT should return values with Now() added to it', () => {
		const now = Date.now();
		expect(parseTime('1m', { fromNow: true, throwError: true })).toBeGreaterThanOrEqual(now + BASE_VALUES.minutes);
		expect(parseTime('1 hour', { fromNow: true, throwError: true })).toBeGreaterThanOrEqual(now + BASE_VALUES.hours);
	});

	it('GIVEN the parse options with locale pt-BR the IT should work', () => {
		expect(() => parseTime('1m', { locale: 'pt-BR', throwError: true })).not.toThrowError();

		expect(parseTime('1m', { locale: 'pt-BR' })).toStrictEqual(BASE_VALUES.minutes);
		expect(parseTime('1 minuto', { locale: 'pt-BR' })).toStrictEqual(BASE_VALUES.minutes);
		expect(parseTime('1 minuto 1 segundo', { locale: 'pt-BR' })).toStrictEqual(
			BASE_VALUES.minutes + BASE_VALUES.seconds,
		);
	});

	it('GIVEN the parse options with an unknown locale the IT should throw', () => {
		expect(() => parseTime('1m', { locale: 'test' })).toThrowError();
	});

	it('GIVEN the parse options with the customStrings IT should work', () => {
		expect(parseTime('1 milisegundo', { customStrings: { milliseconds: ['milisegundo'] } })).toStrictEqual(1);
		expect(parseTime('1 segundo', { customStrings: { seconds: ['segundo'] } })).toStrictEqual(BASE_VALUES.seconds);
		expect(parseTime('1 minuto', { customStrings: { minutes: ['minuto'] } })).toStrictEqual(BASE_VALUES.minutes);
		expect(parseTime('1 hora', { customStrings: { hours: ['hora'] } })).toStrictEqual(BASE_VALUES.hours);
		expect(parseTime('1 dia', { customStrings: { days: ['dia'] } })).toStrictEqual(BASE_VALUES.days);
		expect(parseTime('1 semana', { customStrings: { weeks: ['semana'] } })).toStrictEqual(BASE_VALUES.weeks);
		expect(parseTime('1 mes', { customStrings: { months: ['mes'] } })).toStrictEqual(BASE_VALUES.months);
		expect(parseTime('1 ano', { customStrings: { years: ['ano'] } })).toStrictEqual(BASE_VALUES.years);
	});
});
