define(function() {

	'use strict';

	var locales = {};

	function VI18N(locale, currency) {
		// Fail fast when the Internationalization API isn't supported
		if (!VI18N.isSupported()) {
			throw new Error('window.Intl not supported, did you forget to include a polyfill?');
		}

		locale = locale || 'nl-NL';
		currency = currency || 'EUR';

		this.locale = locale;
		this.currency = currency;
		this.formatters = {};
		this.months = {};
		this.days = {};

		// Keep track of this instance
		locales[locale] = this;

		this.initialize();
	}

	VI18N.prototype = {

		constructor: VI18N,

		initialize: function() {
			var locale = this.getLocale(),
				currency =  this.getCurrency();

			this.formatters.number = new window.Intl.NumberFormat(locale);
			this.formatters.currency = new window.Intl.NumberFormat(locale, { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
			this.formatters.percent = new window.Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 });
			this.formatters.date = new window.Intl.DateTimeFormat(locale);
		},

		getLocale: function() {
			return this.locale;
		},

		getCurrency: function() {
			return this.currency;
		},

		// Format a number to a locale string
		// For more information see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
		formatNumber: function(number, options) {
			return typeof options === 'object' ? new this.formatters.number.constructor(this.getLocale(), options).format(number) : this.formatters.number.format(number);
		},

		// Format a number to a locale currency string
		// For more information see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
		formatCurrency: function(number, currency) {
			if (currency && typeof currency === 'string') {
				return new this.formatters.currency.constructor(this.getLocale(), { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
			} else if (currency === false) {
				return this.formatNumber(number, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
			}

			return this.formatters.currency.format(number);
		},

		formatPercent: function(number, options) {
			if (typeof options === 'object') {
				options.style = 'percent';

				return new this.formatters.percent.constructor(this.getLocale(), options).format(number);
			}

			return this.formatters.percent.format(number);
		},

		// Format a date object to a locale string
		// For more information see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
		formatDate: function(date, options) {
			return typeof options === 'object' ? new this.formatters.date.constructor(this.getLocale(), options).format(date) : this.formatters.date.format(date);
		},

		formatTime: function(date) {
			return this.formatDate(date, { hour: '2-digit', minute: '2-digit',	second: '2-digit' });
		},

		getMonths: function(type) {
			type = type || 'long';

			return this.months[type] || (this.months[type] = (function(locale) {
						var date = new Date(Date.UTC(2015, 0, 1)),
							months = [],
							i = 0;

						for (; i < 12; i++) {
							date.setMonth(i);
							months[i] = locale.formatDate(date, { month: type });
						}

						return months;

					})(this)

				);
		},

		getDays: function(type) {
			type = type || 'long';

			return this.days[type] || (this.days[type] = (function(locale) {
						var date = new Date(Date.UTC(1978, 0, 1)), // https://en.wikipedia.org/wiki/Common_year_starting_on_Sunday
							days = [],
							i = 1;

						for (; i <= 7; i++) {
							date.setUTCDate(i);
							days.push(locale.formatDate(date, { weekday: type }));
						}

						return days;

					})(this)

				);
		}

	};

	VI18N.get = function(locale) {
		return locales[locale];
	};

	VI18N.isSupported = function() {
		return 'Intl' in window;
	};

	return VI18N;

});
