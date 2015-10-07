define([
	'vi18n'
],
function(VI18N) {

	'use strict';

	describe('formatNumber', function() {

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

		it('should format 100 to "100"', function() {
			expect(this.locale.formatNumber(100)).toBe('100');
		});

		it('should format 1000 to "1.000"', function() {
			expect(this.locale.formatNumber(1000)).toBe('1.000');
		});

		it('should format 1000000 to "1.000.000"', function() {
			expect(this.locale.formatNumber(1000000)).toBe('1.000.000');
		});

		describe('default decimals and rounding', function() {

			it('should format 1.1211 to "1,1211"', function() {
				expect(this.locale.formatNumber(1.1211)).toBe('1,121');
			});

			it('should format 1.1293 to "1,1293"', function() {
				expect(this.locale.formatNumber(1.1293)).toBe('1,129');
			});

			it('should format 1.1298 to "1,13"', function() {
				expect(this.locale.formatNumber(1.1298)).toBe('1,13');
			});

		});

		describe('two decimals option', function() {

			var options = {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			};

			it('should format 100 to "100,00"', function() {
				expect(this.locale.formatNumber(100, options)).toBe('100,00');
			});

			it('should format 1.1211 to "1,12"', function() {
				expect(this.locale.formatNumber(1.1211, options)).toBe('1,12');
			});

			it('should format 1.1293 to "1,13"', function() {
				expect(this.locale.formatNumber(1.1293, options)).toBe('1,13');
			});

			it('should format 1.1298 to "1,13"', function() {
				expect(this.locale.formatNumber(1.1298, options)).toBe('1,13');
			});

		});

	});

});
