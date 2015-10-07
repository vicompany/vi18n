define([
	'vi18n'
],
function(VI18N) {

	'use strict';

	describe('formatCurrency()', function() {

		beforeEach(function(done) {
			var self = this;

			if (VI18N.isSupported()) {

				this.locale = new VI18N('nl-NL', 'EUR');

				return done();
			}

			// PhantomJS (Webkit), as used by grunt-contrib-jasmine, doesn't support the Internationalization API
			require([
				'intl',
				'text!locale-data/nl-NL.json',
				'text!locale-data/en-GB.json'
			], function(Intl, dataNl, dataGb) {

				// Parse and add the data
				Intl.__addLocaleData(JSON.parse(dataNl));
				Intl.__addLocaleData(JSON.parse(dataGb));

				self.locale = new VI18N('nl-NL', 'EUR');

				done();
			});

		});

		it('should format 100 to "€ 100,00"', function() {
			expect(this.locale.formatCurrency(100)).toBe('€ 100,00');
		});

		it('should format 1000 to "€ 1.000,00"', function() {
			expect(this.locale.formatCurrency(1000)).toBe('€ 1.000,00');
		});

		it('should format 100000 to "€ 1.000.000,00"', function() {
			expect(this.locale.formatCurrency(1000000)).toBe('€ 1.000.000,00');
		});

		describe('default decimals and rounding', function() {

			it('should format 1.1211 to "€ 1,12"', function() {
				expect(this.locale.formatCurrency(1.1211)).toBe('€ 1,12');
			});

			it('should format 1.1293 to "€ 1,13"', function() {
				expect(this.locale.formatCurrency(1.1293)).toBe('€ 1,13');
			});

			it('should format 1.1298 to "€ 1,13"', function() {
				expect(this.locale.formatCurrency(1.1298)).toBe('€ 1,13');
			});

		});

		describe('zero decimals option', function() {

			var options = {
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			};

			it('should format 1 to "€ 1"', function() {
				expect(this.locale.formatCurrency(1, options)).toBe('€ 1');
			});

			it('should format 1.1211 to "€ 1"', function() {
				expect(this.locale.formatCurrency(1.1211, options)).toBe('€ 1');
			});

			it('should format 1000 to "€ 1.000"', function() {
				expect(this.locale.formatCurrency(1000, options)).toBe('€ 1.000');
			});

		});

		describe('currency "false" option', function() {

			var options = {
				currency: false
			};

			it('should format 1.1298 to "1,13"', function() {
				expect(this.locale.formatCurrency(1.1298, options)).toBe('1,13');
			});

		});

		describe('other currencies', function() {

			var usd = {
					currency: 'USD'
				},
				yen = {
					currency: 'JPY',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				};

			it('should format 100 US dollars to "US$ 100,00"', function() {
				expect(this.locale.formatCurrency(100, usd)).toBe('US$ 100,00');
			});

			it('should format 100 Japanese yen to "JP¥ 100"', function() {
				expect(this.locale.formatCurrency(100, yen)).toBe('JP¥ 100');
			});

		});

	});

});
