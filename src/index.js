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

const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

const isSupported = 'Intl' in root &&
	typeof Intl.NumberFormat === 'function' &&
	typeof Intl.DateTimeFormat === 'function' &&
	typeof Number.prototype.toLocaleString === 'function' &&
	typeof Date.prototype.toLocaleDateString === 'function' &&
	typeof Date.prototype.toLocaleTimeString === 'function';

/* istanbul ignore if */
class VI18N {
	constructor(locale = 'nl-NL', currency = 'EUR', { time = {}, number = {}, percent = {}, currency: currencyOptions = {} } = {}) {
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

		this.initialize(locale, currency, time, number, percent, currencyOptions);
	}

	// eslint-disable-next-line
	initialize(locale, currency, timeOptions, numberOptions, percentOptions, currencyOptions) {
		const {
			timeZone = 'Europe/Amsterdam',
			hour = '2-digit',
			minute = '2-digit',
			second = '2-digit',
		} = timeOptions;

		this.formatters.number = new Intl.NumberFormat(locale, Object.assign(
			{},
			{
				minimumFractionDigits: 0,
				maximumFractionDigits: 3,
			},
			numberOptions
		));

		this.formatters.currency = new Intl.NumberFormat(locale, Object.assign(
			{
				currency,
				style: 'currency',
			},
			currencyOptions
		));

		// TODO: check if percent needs numberOptions
		this.formatters.percent = new Intl.NumberFormat(locale, Object.assign(
			{ style: 'percent' },
			percentOptions,
		));
		this.formatters.date = new Intl.DateTimeFormat(locale, {
			timeZone,
		});

		const {
			year,
			month,
			day,
		} = this.formatters.date.resolvedOptions();

		this.formatters.time = new Intl.DateTimeFormat(locale, {
			timeZone,
			hour,
			minute,
			second,
		});

		this.formatters.dateTime = new Intl.DateTimeFormat(locale, {
			timeZone,
			year,
			month,
			day,
			hour,
			minute,
			second,
		});
	}

	// Format a number to a locale string
	// For more information about the options see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
	formatNumber(number) {
		return this.formatters.number.format(number);
	}

	// Format a number to a locale currency string
	// For more information about the options see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
	formatCurrency(number) {
		return this.formatters.currency.format(number);
	}

	formatPercent(number) {
		return this.formatters.percent.format(number);
	}

	// Format a date object to a locale string
	// For more information about the options see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
	formatDate(date, options) {
		return isObject(options)
			? date.toLocaleDateString(this.locale, options)
			: this.formatters.date.format(date);
	}

	formatTime(date) {
		return this.formatters.time.format(date);
	}

	formatDateTime(date, options) {
		return isObject(options)
			? date.toLocaleDateString(this.locale, options)
			: this.formatters.dateTime.format(date);
	}

	// Assume it is always one character
	// https://en.wikipedia.org/wiki/Decimal_mark
	// TODO: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat/formatToParts#Browser_compatibility
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

	static isSupported() {
		return isSupported;
	}
}

module.exports = VI18N;
