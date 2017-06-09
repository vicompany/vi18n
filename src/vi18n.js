const root = (() => {
	if (typeof window !== 'undefined') {
		// Browser window
		return window;
	}

	if (typeof self !== 'undefined') {
		// Web Worker
		return self;
	}

	// Other environments (in node global === this)
	return this; // eslint-disable-line
})();

const locales = {};

const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

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
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
		this.formatters.percent = new Intl.NumberFormat(locale, {
			style: 'percent',
			maximumFractionDigits: 0,
		});
		this.formatters.date = new Intl.DateTimeFormat(locale);
	}

	// Format a number to a locale string
	// For more information about the options see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
	formatNumber(number, options) {
		const Formatter = this.formatters.number.constructor;

		return isObject(options)
			? new Formatter(this.locale, options).format(number)
			: this.formatters.number.format(number);
	}

	// Format a number to a locale currency string
	// For more information about the options see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
	formatCurrency(number, options) {
		if (isObject(options)) {
			// Set decimal defaults
			options.minimumFractionDigits = typeof options.minimumFractionDigits === 'number' ? options.minimumFractionDigits : 2;
			options.maximumFractionDigits = typeof options.maximumFractionDigits === 'number' ? options.maximumFractionDigits : 2;

			// Hide currency symbol
			if (options.currency === false) {
				delete options.currency;

				return this.formatNumber(number, options);
			}

			options.style = 'currency';
			options.currency = options.currency || this.currency;

			const Formatter = this.formatters.currency.constructor;

			return new Formatter(this.locale, options).format(number);
		}

		return this.formatters.currency.format(number);
	}

	formatPercent(number, options) {
		if (isObject(options)) {
			const Formatter = this.formatters.percent.constructor;

			options.style = 'percent';

			return new Formatter(this.locale, options).format(number);
		}

		return this.formatters.percent.format(number);
	}

	// Format a date object to a locale string
	// For more information about the options see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
	formatDate(date, options) {
		const Formatter = this.formatters.date.constructor;

		return isObject(options)
			? new Formatter(this.locale, options).format(date)
			: this.formatters.date.format(date);
	}

	formatTime(date) {
		return this.formatDate(date, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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

	// TODO: also check methods and locales
	static isSupported() {
		return 'Intl' in root;
	}
}

module.exports = VI18N;
