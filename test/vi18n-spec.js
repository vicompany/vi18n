define([
	'vi18n'
],
function(VI18N) {

	'use strict';

	describe('VI18N internationalization library', function() {

		beforeEach(function(done) {

			if (VI18N.isSupported()) {
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

				done();
			});

		});

		describe('constructor', function() {
			var locale;

			beforeEach(function() {
				spyOn(VI18N, 'isSupported').and.callThrough();

				locale = new VI18N();
			});

			// TODO: error thrown on not supported
			it('should check browser support for Intl', function() {
				expect(VI18N.isSupported).toHaveBeenCalled();
			});

			it('should return an instance with the Dutch locale as default', function() {
				expect(locale.getLocale()).toBe('nl-NL');
				expect(locale.getCurrency()).toBe('EUR');
			});

		});

		describe('VI18N.get()', function() {

			it('should be defined', function() {
				expect(VI18N.get).toEqual(jasmine.any(Function));
			});

			it('should return locale instances', function() {
				var en = new VI18N('en-GB', 'GPB'),
					nl = new VI18N();

				expect(VI18N.get('nl-NL')).toEqual(nl);
				expect(VI18N.get('en-GB')).toEqual(en);
			});

		});

		describe('formatters', function() {

			var locale;

			beforeEach(function() {
				locale = new VI18N('nl-NL', 'EUR');
			});

			describe('number', function() {

				it('should format 100 to "100"', function() {
					expect(locale.formatNumber(100)).toBe('100');
				});

				it('should format 1000 to "1.000"', function() {
					expect(locale.formatNumber(1000)).toBe('1.000');
				});

				it('should format 1000000 to "1.000.000"', function() {
					expect(locale.formatNumber(1000000)).toBe('1.000.000');
				});

				describe('decimals default', function() {

					it('should format 1.1211 to "1,1211"', function() {
						expect(locale.formatNumber(1.1211)).toBe('1,121');
					});

					it('should format 1.1293 to "1,1293"', function() {
						expect(locale.formatNumber(1.1293)).toBe('1,129');
					});

					it('should format 1.1298 to "1,123"', function() {
						expect(locale.formatNumber(1.1298)).toBe('1,13');
					});

				});

				describe('2 decimals option', function() {

					var options = {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					};

					it('should format 100 to "100,00"', function() {
						expect(locale.formatNumber(100, options)).toBe('100,00');
					});

					it('should format 1.1211 to "1,12"', function() {
						expect(locale.formatNumber(1.1211, options)).toBe('1,12');
					});

					it('should format 1.1293 to "1,13"', function() {
						expect(locale.formatNumber(1.1293, options)).toBe('1,13');
					});

					it('should format 1.1298 to "1,13"', function() {
						expect(locale.formatNumber(1.1298, options)).toBe('1,13');
					});

				});

			});

			describe('currency', function() {

				it('should format 100 to "€ 100,00"', function() {
					expect(locale.formatCurrency(100)).toBe('€ 100,00');
				});

				it('should format 1000 to "€ 1.000,00"', function() {
					expect(locale.formatCurrency(1000)).toBe('€ 1.000,00');
				});

				it('should format 100000 to "€ 1.000.000,00"', function() {
					expect(locale.formatCurrency(1000000)).toBe('€ 1.000.000,00');
				});

				describe('decimals rounding', function() {

					it('should format 1.1211 to "€ 1,12"', function() {
						expect(locale.formatCurrency(1.1211)).toBe('€ 1,12');
					});

					it('should format 1.1293 to "€ 1,13"', function() {
						expect(locale.formatCurrency(1.1293)).toBe('€ 1,13');
					});

					it('should format 1.1298 to "€ 1,13"', function() {
						expect(locale.formatCurrency(1.1298)).toBe('€ 1,13');
					});

				});

				describe('without currency symbol', function() {

					it('should format 1.1298 to "1,13"', function() {
						expect(locale.formatCurrency(1.1298, false)).toBe('1,13');
					});

				});

				describe('other currency symbols', function() {

					it('should format 100 US dollars to "US$ 100,00"', function() {
						expect(locale.formatCurrency(100, 'USD')).toBe('US$ 100,00');
					});

					it('should format 100 Japanese yen to "JP¥ 100,00"', function() {
						expect(locale.formatCurrency(100, 'JPY')).toBe('JP¥ 100,00');
					});

				});

			});

			describe('date and time', function() {

				var date = new Date(Date.UTC(2016, 0, 7, 2, 15, 45));

				it('should format 7 january 2016 to "7-1-2016"', function() {
					expect(locale.formatDate(date)).toBe('7-1-2016');
				});

				xit('should format 15 past 3 and 45 seconds to "3:15:45"', function() {
					expect(locale.formatTime(date)).toBe('3:15:45');
				});

			});

		});

	});

});
