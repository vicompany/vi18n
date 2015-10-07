define([
	'vi18n'
],
function(VI18N) {

	'use strict';

	describe('formatPercent', function() {

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

		it('should format 0.01 to "1%"', function() {
			expect(this.locale.formatPercent(0.01)).toBe('1%');
		});

		it('should format 0.1 to "10%"', function() {
			expect(this.locale.formatPercent(0.1)).toBe('10%');
		});

		it('should format 1 to "100%"', function() {
			expect(this.locale.formatPercent(1)).toBe('100%');
		});

		describe('default decimals and rounding', function() {

			it('should format 0.123 to "12%"', function() {
				expect(this.locale.formatPercent(0.123)).toBe('12%');
			});

			it('should format 0.1234 to "12%"', function() {
				expect(this.locale.formatPercent(0.1234)).toBe('12%');
			});

			it('should format 0.156 to "16%"', function() {
				expect(this.locale.formatPercent(0.156)).toBe('16%');
			});

		});

		describe('two decimals option', function() {

			var options = {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			};

			it('should format 0.123 to "12,30%"', function() {
				expect(this.locale.formatPercent(0.123, options)).toBe('12,30%');
			});

			it('should format 0.1234 to "12,34%"', function() {
				expect(this.locale.formatPercent(0.1234, options)).toBe('12,34%');
			});

			it('should format 0.156 to "15,60%"', function() {
				expect(this.locale.formatPercent(0.156, options)).toBe('15,60%');
			});

			it('should format 0.1567 to "15,67%"', function() {
				expect(this.locale.formatPercent(0.1567, options)).toBe('15,67%');
			});

			it('should format 0.15678 to "15,68%"', function() {
				expect(this.locale.formatPercent(0.15678, options)).toBe('15,68%');
			});

		});

	});

});
