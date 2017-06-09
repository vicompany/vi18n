(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['module'], factory);
	} else if (typeof exports !== "undefined") {
		factory(module);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod);
		global.VI18N = mod.exports;
	}
})(this, function (module) {
	'use strict';

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var root = function () {
		if (typeof window !== 'undefined') {
			// Browser window
			return window;
		}

		if (typeof self !== 'undefined') {
			// Web Worker
			return self;
		}

		// Other environments (in node global === this)
		return undefined; // eslint-disable-line
	}();

	var locales = {};

	var isObject = function isObject(obj) {
		return Object.prototype.toString.call(obj) === '[object Object]';
	};

	var VI18N = function () {
		function VI18N() {
			var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'nl-NL';
			var currency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EUR';

			_classCallCheck(this, VI18N);

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

		_createClass(VI18N, [{
			key: 'initialize',
			value: function initialize(locale, currency) {
				this.formatters.number = new Intl.NumberFormat(locale);
				this.formatters.currency = new Intl.NumberFormat(locale, {
					style: 'currency',
					currency: currency,
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				});
				this.formatters.percent = new Intl.NumberFormat(locale, {
					style: 'percent',
					maximumFractionDigits: 0
				});
				this.formatters.date = new Intl.DateTimeFormat(locale);
			}
		}, {
			key: 'formatNumber',
			value: function formatNumber(number, options) {
				var Formatter = this.formatters.number.constructor;

				return isObject(options) ? new Formatter(this.locale, options).format(number) : this.formatters.number.format(number);
			}
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

					var Formatter = this.formatters.currency.constructor;

					return new Formatter(this.locale, options).format(number);
				}

				return this.formatters.currency.format(number);
			}
		}, {
			key: 'formatPercent',
			value: function formatPercent(number, options) {
				if (isObject(options)) {
					var Formatter = this.formatters.percent.constructor;

					options.style = 'percent';

					return new Formatter(this.locale, options).format(number);
				}

				return this.formatters.percent.format(number);
			}
		}, {
			key: 'formatDate',
			value: function formatDate(date, options) {
				var Formatter = this.formatters.date.constructor;

				return isObject(options) ? new Formatter(this.locale, options).format(date) : this.formatters.date.format(date);
			}
		}, {
			key: 'formatTime',
			value: function formatTime(date) {
				return this.formatDate(date, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
			}
		}, {
			key: 'getDecimalSeparator',
			value: function getDecimalSeparator() {
				return this.decimalSeparator || (this.decimalSeparator = this.formatNumber(1.1).charAt(1)); // eslint-disable-line max-len
			}
		}, {
			key: 'getThousandSeparator',
			value: function getThousandSeparator() {
				var _this = this;

				return this.thousandSeparator || (this.thousandSeparator = function () {
					var separator = _this.formatNumber(1000).charAt(1);

					// When the separator is not a number (e.g. the decimal point in '1.000')
					// return the separator, otherwise return an empty string
					return isNaN(parseInt(separator, 10)) ? separator : '';
				}());
			}
		}, {
			key: 'getMonths',
			value: function getMonths() {
				var _this2 = this;

				var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'long';

				return this.months[type] || (this.months[type] = function () {
					var date = new Date(Date.UTC(2015, 0, 1));
					var months = [];

					for (var i = 0; i < 12; i++) {
						date.setMonth(i);
						months[i] = _this2.formatDate(date, { month: type });
					}

					return months;
				}());
			}
		}, {
			key: 'getDays',
			value: function getDays() {
				var _this3 = this;

				var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'long';

				return this.days[type] || (this.days[type] = function () {
					var date = new Date(Date.UTC(1978, 0, 1)); // https://en.wikipedia.org/wiki/Common_year_starting_on_Sunday
					var days = [];

					for (var i = 1; i <= 7; i++) {
						date.setUTCDate(i);
						days.push(_this3.formatDate(date, { weekday: type }));
					}

					return days;
				}());
			}
		}], [{
			key: 'getLocale',
			value: function getLocale(locale) {
				return locales[locale];
			}
		}, {
			key: 'isSupported',
			value: function isSupported() {
				return 'Intl' in root;
			}
		}]);

		return VI18N;
	}();

	module.exports = VI18N;
});