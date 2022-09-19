import { locales, type TimeStrings } from './commons.js';
import { pluralize, validateTimeStrings } from './utils.js';

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

const ptBr = {
	milliseconds: pluralize(['ms', 'msec', 'milissegundo']),
	seconds: pluralize(['s', 'seg', 'segundo']),
	minutes: pluralize(['m', 'min', 'minuto']),
	hours: pluralize(['h', 'hr', 'hora']),
	days: pluralize(['d', 'dia']),
	weeks: pluralize(['s', 'sem', 'semana']),
	months: pluralize(['m', 'mes']),
	years: pluralize(['a', 'ano']),
};

const es = {
	milliseconds: pluralize(['ms', 'mseg', 'milisegundo']),
	seconds: pluralize(['s', 'seg', 'segundo']),
	minutes: pluralize(['m', 'min', 'minuto']),
	hours: pluralize(['h', 'hr', 'hora']),
	days: pluralize(['d', 'dia']),
	weeks: pluralize(['s', 'sem', 'semana']),
	months: pluralize(['m', 'mes']),
	years: pluralize(['a', 'ano']),
};

export function defaultLocales(clean = false) {
	if (clean) {
		locales.clear();
	}

	locales.set('en-US', enUs);
	locales.set('pt-BR', ptBr);
	locales.set('es', es);
}

export function registerLocale(locale: string, strings: TimeStrings, overwrite = false): typeof locales {
	if (locales.has(locale) && !overwrite) {
		throw new Error(`Locale ${locale} is already registered.`);
	}

	validateTimeStrings(strings);

	return locales.set(locale, strings);
}
