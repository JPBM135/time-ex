/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { doesNotThrow } from 'node:assert';
import { throws, strictEqual, ok } from 'node:assert/strict';
import { BASE_VALUES } from '../commons.js';
import { parseTime } from '../parseTime.js';

describe('Parse Time: String ==> Number', () => {
	it('GIVEN a string for seconds IT should parse the time', () => {
		strictEqual(parseTime('1s'), BASE_VALUES.seconds);
		strictEqual(parseTime('1 sec'), BASE_VALUES.seconds);
		strictEqual(parseTime('1 second'), BASE_VALUES.seconds);

		strictEqual(parseTime('1.5s'), BASE_VALUES.seconds * 1.5);
		strictEqual(parseTime('1.5 sec'), BASE_VALUES.seconds * 1.5);
		strictEqual(parseTime('1.5 secs'), BASE_VALUES.seconds * 1.5);
		strictEqual(parseTime('1.5 second'), BASE_VALUES.seconds * 1.5);
		strictEqual(parseTime('1.5 seconds'), BASE_VALUES.seconds * 1.5);
	});

	it('GIVEN a string for minutes IT should parse the time', () => {
		strictEqual(parseTime('1m'), BASE_VALUES.minutes);
		strictEqual(parseTime('1 min'), BASE_VALUES.minutes);
		strictEqual(parseTime('1 minute'), BASE_VALUES.minutes);

		strictEqual(parseTime('1.5m'), BASE_VALUES.minutes * 1.5);
		strictEqual(parseTime('1.5 min'), BASE_VALUES.minutes * 1.5);
		strictEqual(parseTime('1.5 mins'), BASE_VALUES.minutes * 1.5);
		strictEqual(parseTime('1.5 minute'), BASE_VALUES.minutes * 1.5);
		strictEqual(parseTime('1.5 minutes'), BASE_VALUES.minutes * 1.5);
	});

	it('GIVEN a string for hours IT should parse the time', () => {
		strictEqual(parseTime('1h'), BASE_VALUES.hours);
		strictEqual(parseTime('1 hr'), BASE_VALUES.hours);
		strictEqual(parseTime('1 hour'), BASE_VALUES.hours);

		strictEqual(parseTime('1.5h'), BASE_VALUES.hours * 1.5);
		strictEqual(parseTime('1.5 hr'), BASE_VALUES.hours * 1.5);
		strictEqual(parseTime('1.5 hrs'), BASE_VALUES.hours * 1.5);
		strictEqual(parseTime('1.5 hour'), BASE_VALUES.hours * 1.5);
		strictEqual(parseTime('1.5 hours'), BASE_VALUES.hours * 1.5);
	});

	it('GIVEN a string for days IT should parse the time', () => {
		strictEqual(parseTime('1d'), BASE_VALUES.days);
		strictEqual(parseTime('1 day'), BASE_VALUES.days);

		strictEqual(parseTime('1.5d'), BASE_VALUES.days * 1.5);
		strictEqual(parseTime('1.5 days'), BASE_VALUES.days * 1.5);
	});

	it('GIVEN a string for weeks IT should parse the time', () => {
		strictEqual(parseTime('1w'), BASE_VALUES.weeks);
		strictEqual(parseTime('1 wk'), BASE_VALUES.weeks);
		strictEqual(parseTime('1 week'), BASE_VALUES.weeks);

		strictEqual(parseTime('1.5w'), BASE_VALUES.weeks * 1.5);
		strictEqual(parseTime('1.5 wk'), BASE_VALUES.weeks * 1.5);
		strictEqual(parseTime('1.5 wks'), BASE_VALUES.weeks * 1.5);
		strictEqual(parseTime('1.5 week'), BASE_VALUES.weeks * 1.5);
		strictEqual(parseTime('1.5 weeks'), BASE_VALUES.weeks * 1.5);
	});

	it('GIVEN a string for months IT should parse the time', () => {
		strictEqual(parseTime('1mo'), BASE_VALUES.months);
		strictEqual(parseTime('1 month'), BASE_VALUES.months);

		strictEqual(parseTime('1.5mo'), BASE_VALUES.months * 1.5);
		strictEqual(parseTime('1.5 months'), BASE_VALUES.months * 1.5);
	});

	it('GIVEN a string for years IT should parse the time', () => {
		strictEqual(parseTime('1y'), BASE_VALUES.years);
		strictEqual(parseTime('1 yr'), BASE_VALUES.years);
		strictEqual(parseTime('1 year'), BASE_VALUES.years);

		strictEqual(parseTime('1.5y'), BASE_VALUES.years * 1.5);
		strictEqual(parseTime('1.5 yr'), BASE_VALUES.years * 1.5);
		strictEqual(parseTime('1.5 yrs'), BASE_VALUES.years * 1.5);
		strictEqual(parseTime('1.5 year'), BASE_VALUES.years * 1.5);
		strictEqual(parseTime('1.5 years'), BASE_VALUES.years * 1.5);
	});
});

describe('Parse Time: Multiple Time Units', () => {
	it('GIVEN a string with multiple time units IT should parse the time', () => {
		strictEqual(parseTime('1s 1m'), BASE_VALUES.seconds + BASE_VALUES.minutes);
		strictEqual(parseTime('1s 1m 1h'), BASE_VALUES.seconds + BASE_VALUES.minutes + BASE_VALUES.hours);
	});

	it('GIVEN a string with multiple long time units IT should parse the time', () => {
		strictEqual(parseTime('1 second 1 minute'), BASE_VALUES.seconds + BASE_VALUES.minutes);
		strictEqual(parseTime('1 sec 1 min 2 hours'), BASE_VALUES.seconds + BASE_VALUES.minutes + BASE_VALUES.hours * 2);
	});
});

describe('Parse Time: Original MS tests', () => {
	it('should preserve ms', () => {
		strictEqual(parseTime('100'), 100);
	});

	it('should convert from m to ms', () => {
		strictEqual(parseTime('1m'), 60_000);
	});

	it('should convert from h to ms', () => {
		strictEqual(parseTime('1h'), 3_600_000);
	});

	it('should convert d to ms', () => {
		strictEqual(parseTime('2d'), 172_800_000);
	});

	it('should convert w to ms', () => {
		strictEqual(parseTime('3w'), 1_814_400_000);
	});

	it('should convert s to ms', () => {
		strictEqual(parseTime('1s'), 1_000);
	});

	it('should convert ms to ms', () => {
		strictEqual(parseTime('100ms'), 100);
	});

	it('should work with decimals', () => {
		strictEqual(parseTime('1.5h'), 5_400_000);
	});

	it('should work with multiple spaces', () => {
		strictEqual(parseTime('1   s'), 1_000);
	});

	it('should be case-insensitive', () => {
		strictEqual(parseTime('1.5H'), 5_400_000);
	});

	it('should work with numbers starting with .', () => {
		strictEqual(parseTime('.5ms'), 0.5);
	});

	it('should work with negative integers', () => {
		strictEqual(parseTime('-100ms'), -100);
	});

	it('should work with negative decimals', () => {
		strictEqual(parseTime('-1.5h'), -5_400_000);
		strictEqual(parseTime('-10.5h'), -37_800_000);
	});

	it('should work with negative decimals starting with "."', () => {
		strictEqual(parseTime('-.5h'), -1_800_000);
	});

	it('should convert milliseconds to ms', () => {
		strictEqual(parseTime('53 milliseconds'), 53);
	});

	it('should convert msecs to ms', () => {
		strictEqual(parseTime('17 msecs'), 17);
	});

	it('should convert sec to ms', () => {
		strictEqual(parseTime('1 sec'), 1_000);
	});

	it('should convert from min to ms', () => {
		strictEqual(parseTime('1 min'), 60_000);
	});

	it('should convert from hr to ms', () => {
		strictEqual(parseTime('1 hr'), 3_600_000);
	});

	it('should convert days to ms', () => {
		strictEqual(parseTime('2 days'), 172_800_000);
	});

	it('should work with decimals', () => {
		strictEqual(parseTime('1.5 hours'), 5_400_000);
	});

	it('should work with negative integers', () => {
		strictEqual(parseTime('-100 milliseconds'), -100);
	});

	it('should work with negative decimals', () => {
		strictEqual(parseTime('-1.5 hours'), -5_400_000);
	});

	it('should work with negative decimals starting with "."', () => {
		strictEqual(parseTime('-.5 hr'), -1_800_000);
	});
});

describe('Parse Time: Number ==> Number', () => {
	it('GIVEN a number for milliseconds IT should parse the time', () => {
		strictEqual(parseTime(1_000), 1_000);
		strictEqual(parseTime(1_500), 1_500);
	});

	it('GIVEN a invalid number with the throwError: true IT should throw', () => {
		throws(() => parseTime(Number.NaN, { throwError: true }));
		throws(() => parseTime(Number.NaN, { throwError: true }));
	});

	it('GIVEN a invalid number with the throwError: false IT should return null', () => {
		strictEqual(parseTime(Number.NaN), null);
		strictEqual(parseTime(Number.NaN), null);
	});
});

describe('Parse Time: options', () => {
	it('GIVEN the parse options with the fromNow: true IT should return values with Now() added to it', () => {
		const now = Date.now();
		ok(parseTime('1m', { fromNow: true, throwError: true }) >= now + BASE_VALUES.minutes);
		ok(parseTime('1 hour', { fromNow: true, throwError: true }) >= now + BASE_VALUES.hours);
	});

	it('GIVEN the parse options with locale pt-BR the IT should work', () => {
		doesNotThrow(() => parseTime('1m', { locale: 'pt-BR', throwError: true }));

		strictEqual(parseTime('1m', { locale: 'pt-BR' }), BASE_VALUES.minutes);
		strictEqual(parseTime('1 minuto', { locale: 'pt-BR' }), BASE_VALUES.minutes);
		strictEqual(parseTime('1 minuto 1 segundo', { locale: 'pt-BR' }), BASE_VALUES.minutes + BASE_VALUES.seconds);
	});

	it('GIVEN the parse options with an unknown locale the IT should throw', () => {
		throws(() => parseTime('1m', { locale: 'test' }));
	});

	it('GIVEN the parse options with the customStrings IT should work', () => {
		strictEqual(parseTime('1 milisegundo', { customStrings: { milliseconds: ['milisegundo'] } }), 1);
		strictEqual(parseTime('1 segundo', { customStrings: { seconds: ['segundo'] } }), BASE_VALUES.seconds);
		strictEqual(parseTime('1 minuto', { customStrings: { minutes: ['minuto'] } }), BASE_VALUES.minutes);
		strictEqual(parseTime('1 hora', { customStrings: { hours: ['hora'] } }), BASE_VALUES.hours);
		strictEqual(parseTime('1 dia', { customStrings: { days: ['dia'] } }), BASE_VALUES.days);
		strictEqual(parseTime('1 semana', { customStrings: { weeks: ['semana'] } }), BASE_VALUES.weeks);
		strictEqual(parseTime('1 mes', { customStrings: { months: ['mes'] } }), BASE_VALUES.months);
		strictEqual(parseTime('1 ano', { customStrings: { years: ['ano'] } }), BASE_VALUES.years);
	});
});
