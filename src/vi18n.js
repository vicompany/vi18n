define(function() {

	'use strict';

	var instances = {};

	function VI18N(locale, currency) {
		locale = locale || 'nl-NL';
		currency = currency || 'EUR';

		this.locale = locale;
		this.currency = currency;
		this.formatters = {};
	}

	VI18N.prototype = {

		constructor: VI18N,

		initialize: function() {
			var locale = this.getLocale(),
				currency =  this.getCurrency();

			this.formatters.number = new window.Intl.NumberFormat(locale);
			this.formatters.currency = new window.Intl.NumberFormat(locale, { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
			this.formatters.date = new window.Intl.DateTimeFormat(locale);

			return this;
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

		// Format a data object to a locale string
		// For more information see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
		formatDate: function(date, options) {
			return typeof options === 'object' ? new this.formatters.date.constructor(this.getLocale(), options).format(date) : this.formatters.date.format(date);
		},

		formatTime: function(date) {
			return this.formatDate(date, { hour: '2-digit', minute: '2-digit',	second: '2-digit' });
		}

	};

	// Static methods
	VI18N.create = function create(options) {
		var locale = options.locale,
			currency = options.currency,
			callback = options.callback,
			instance;

		if (typeof callback !== 'function') {
			throw new Error('Callback should be defined');
		}

		instance = new VI18N(locale, currency);

		instances[instance.getLocale()] = instance;

		VI18N.polyfill(instance, callback);
	};

	VI18N.polyfill = function polyfill(instance, callback) {

		if (VI18N.isSupported()) {
			return callback(null, instance.initialize());
		}

		// When not natively suppported, load the polyfill with locale data and resolve
		require([
			'intl',
			'text!../bower_components/intl/locale-data/json/' + instance.getLocale() + '.json'
		], function(Intl, json) {

			if (!json) {
				return callback(new Error('Could not load locale JSON data'));
			}

			// Parse and add the data
			Intl.__addLocaleData(JSON.parse(json));

			callback(null, instance.initialize());

		}, function(error) {

			callback(error);
		});

	};

	VI18N.get = function get(locale) {
		return instances[locale];
	};

	VI18N.isSupported = function isSupported() {
		return 'Intl' in window;
	};

	return VI18N;

});
