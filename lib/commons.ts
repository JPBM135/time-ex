/* eslint-disable typescript-sort-keys/interface */

export interface TimeStrings {
	milliseconds: string[];
	seconds: string[];
	minutes: string[];
	hours: string[];
	days: string[];
	weeks: string[];
	months: string[];
	years: string[];
}

// eslint-disable-next-line unicorn/no-unsafe-regex
export const REGEX = /(?<quantity>-?(?:\d+)?\.?\d+) *(?<unit>[a-z]+)?/;

export const SEPERATORS_REGEX = new RegExp([' ', '.', ',', '-'].map((char) => `\\${char}`).join('|'), 'g');

export const locales = new Map<string, TimeStrings>();

export enum BASE_VALUES {
	milliseconds = 1,
	seconds = 1_000,
	minutes = 60_000,
	hours = 3_600_000,
	days = 86_400_000,
	weeks = 604_800_000,
	months = 2_592_000_000,
	years = 31_536_000_000,
}
