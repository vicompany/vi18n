(function (global, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['exports', 'module'], factory);
	} else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
		factory(exports, module);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, mod);
		global.vi18n = mod.exports;
	}
})(this, function (exports, module) {
	'use strict';

	// istanbul ignore next

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	// istanbul ignore next

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var locales = {},
	    isObject = function isObject(obj) {
		// http://stackoverflow.com/a/4320789
		return Object.prototype.toString.call(obj) === '[object Object]';
	};

	var VI18N = (function () {
		function VI18N() {
			var locale = arguments.length <= 0 || arguments[0] === undefined ? 'nl-NL' : arguments[0];
			var currency = arguments.length <= 1 || arguments[1] === undefined ? 'EUR' : arguments[1];

			_classCallCheck(this, VI18N);

			// Fail fast when the Internationalization API isn't supported
			if (!VI18N.isSupported()) {
				throw new Error('Internationalization API (window.Intl) not supported, did you forget to include a polyfill?');
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

		_createClass(VI18N, [{
			key: 'initialize',
			value: function initialize(locale, currency) {
				this.formatters.number = new window.Intl.NumberFormat(locale);
				this.formatters.currency = new window.Intl.NumberFormat(locale, { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
				this.formatters.percent = new window.Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 });
				this.formatters.date = new window.Intl.DateTimeFormat(locale);
			}

			// Format a number to a locale string
			// For more information about the options see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
		}, {
			key: 'formatNumber',
			value: function formatNumber(number, options) {
				return isObject(options) ? new this.formatters.number.constructor(this.locale, options).format(number) : this.formatters.number.format(number);
			}

			// Format a number to a locale currency string
			// For more information about the options see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
		}, {
			key: 'formatCurrency',
			value: function formatCurrency(number, options) {
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

					return new this.formatters.currency.constructor(this.locale, options).format(number);
				}

				return this.formatters.currency.format(number);
			}
		}, {
			key: 'formatPercent',
			value: function formatPercent(number, options) {
				if (isObject(options)) {
					options.style = 'percent';

					return new this.formatters.percent.constructor(this.locale, options).format(number);
				}

				return this.formatters.percent.format(number);
			}

			// Format a date object to a locale string
			// For more information about the options see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
		}, {
			key: 'formatDate',
			value: function formatDate(date, options) {
				return isObject(options) ? new this.formatters.date.constructor(this.locale, options).format(date) : this.formatters.date.format(date);
			}
		}, {
			key: 'formatTime',
			value: function formatTime(date) {
				return this.formatDate(date, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
			}

			// Assume it is always one character
			// https://en.wikipedia.org/wiki/Decimal_mark
		}, {
			key: 'getDecimalSeparator',
			value: function getDecimalSeparator() {
				return this.decimalSeparator || (this.decimalSeparator = this.formatNumber(1.1).charAt(1));
			}
		}, {
			key: 'getThousandSeparator',
			value: function getThousandSeparator() {
				return this.thousandSeparator || (this.thousandSeparator = (function (locale) {
					var separator = locale.formatNumber(1000).charAt(1);

					// When the separator is not a number (e.g. the decimal point in '1.000')
					// return the separator, otherwise return an empty string
					return isNaN(parseInt(separator, 10)) ? separator : '';
				})(this));
			}
		}, {
			key: 'getMonths',
			value: function getMonths() {
				var type = arguments.length <= 0 || arguments[0] === undefined ? 'long' : arguments[0];

				return this.months[type] || (this.months[type] = (function (locale) {
					var date = new Date(Date.UTC(2015, 0, 1)),
					    months = [],
					    i = 0;

					for (; i < 12; i++) {
						date.setMonth(i);
						months[i] = locale.formatDate(date, { month: type });
					}

					return months;
				})(this));
			}
		}, {
			key: 'getDays',
			value: function getDays() {
				var type = arguments.length <= 0 || arguments[0] === undefined ? 'long' : arguments[0];

				return this.days[type] || (this.days[type] = (function (locale) {
					var date = new Date(Date.UTC(1978, 0, 1)),
					    // https://en.wikipedia.org/wiki/Common_year_starting_on_Sunday
					days = [],
					    i = 1;

					for (; i <= 7; i++) {
						date.setUTCDate(i);
						days.push(locale.formatDate(date, { weekday: type }));
					}

					return days;
				})(this));
			}
		}], [{
			key: 'getLocale',
			value: function getLocale(locale) {
				return locales[locale];
			}
		}, {
			key: 'isSupported',
			value: function isSupported() {
				return 'Intl' in window;
			}
		}]);

		return VI18N;
	})();

	module.exports = VI18N;
});
