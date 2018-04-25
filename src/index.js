/* istanbul ignore next */
const root = (function() {
	if (typeof window !== 'undefined') {
		// Browser window
		return window;
	}

	if (typeof self !== 'undefined') {
		// Web Worker
		return self;
	}

	if (typeof global !== 'undefined') {
		// Node
		return global;
	}

	// Other environments
	return this; // eslint-disable-line no-invalid-this
}());

const locales = {};

const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

const isSupported = 'Intl' in root &&
	typeof Intl.NumberFormat === 'function' &&
	typeof Intl.DateTimeFormat === 'function' &&
	typeof Number.prototype.toLocaleString === 'function' &&
	typeof Date.prototype.toLocaleDateString === 'function' &&
	typeof Date.prototype.toLocaleTimeString === 'function';

/* istanbul ignore if */
class VI18N {
	constructor(locale = 'nl-NL', currency = 'EUR') {
		// Fail fast when the Internationalization API isn't supported
		if (!VI18N.isSupported()) {
			throw new Error('Internationalization API not supported, did you forget to include a polyfill?');
		}

		this.locale = locale;
		this.currency = currency;
		this.formatters = {};
		this.months = {};
		this.days = {};
		this.decimalSeparator = null;
		this.thousandSeparator = null;

		// Keep track of this instance
		locales[locale] = this;

		this.initialize(locale, currency);
	}

	initialize(locale, currency) {
		this.formatters.number = new Intl.NumberFormat(locale);
		this.formatters.currency = new Intl.NumberFormat(locale, {
			style: 'currency',
			currency,
		});
		this.formatters.percent = new Intl.NumberFormat(locale, {
			style: 'percent',
		});
		this.formatters.date = new Intl.DateTimeFormat(locale);

		const { year, month, day } = this.formatters.date.resolvedOptions();

		this.formatters.dateTime = new Intl.DateTimeFormat(locale, {
			timeZone: 'Europe/Amsterdam',
			year,
			month,
			day,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	}

	// Format a number to a locale string
	// For more information about the options see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
	formatNumber(number, options) {
		return isObject(options)
			? number.toLocaleString(this.locale, options)
			: this.formatters.number.format(number);
	}

	// Format a number to a locale currency string
	// For more information about the options see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
	formatCurrency(number, options) {
		if (isObject(options)) {
			const { style = 'currency', currency = this.currency } = options;

			Object.assign(options, { style, currency });

			return number.toLocaleString(this.locale, options);
		}

		return this.formatters.currency.format(number);
	}

	formatPercent(number, options) {
		if (isObject(options)) {
			options.style = 'percent';

			return number.toLocaleString(this.locale, options);
		}

		return this.formatters.percent.format(number);
	}

	// Format a date object to a locale string
	// For more information about the options see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
	formatDate(date, options) {
		return isObject(options)
			? date.toLocaleDateString(this.locale, options)
			: this.formatters.date.format(date);
	}

	formatTime(date, options = {}) {
		return date.toLocaleTimeString(this.locale, options);
	}

	formatDateTime(date, options) {
		return isObject(options)
			? date.toLocaleDateString(this.locale, options)
			: this.formatters.dateTime.format(date);
	}

	// Assume it is always one character
	// https://en.wikipedia.org/wiki/Decimal_mark
	getDecimalSeparator() {
		return this.decimalSeparator || (this.decimalSeparator = this.formatNumber(1.1).charAt(1)); // eslint-disable-line max-len
	}

	getThousandSeparator() {
		return this.thousandSeparator || (this.thousandSeparator = (() => {
			const separator = this.formatNumber(1000).charAt(1);

			// When the separator is not a number (e.g. the decimal point in '1.000')
			// return the separator, otherwise return an empty string
			return isNaN(parseInt(separator, 10)) ? separator : '';
		})());
	}

	getMonths(type = 'long') {
		return this.months[type] || (this.months[type] = (() => {
			const date = new Date(Date.UTC(2015, 0, 1));
			const months = [];

			for (let i = 0; i < 12; i++) {
				date.setMonth(i);
				months[i] = this.formatDate(date, { month: type });
			}

			return months;
		})());
	}

	getDays(type = 'long') {
		return this.days[type] || (this.days[type] = (() => {
			const date = new Date(Date.UTC(1978, 0, 1)); // https://en.wikipedia.org/wiki/Common_year_starting_on_Sunday
			const days = [];

			for (let i = 1; i <= 7; i++) {
				date.setUTCDate(i);
				days.push(this.formatDate(date, { weekday: type }));
			}

			return days;
		})());
	}

	static getLocale(locale) {
		return locales[locale];
	}

	static isSupported() {
		return isSupported;
	}
}

module.exports = VI18N;
