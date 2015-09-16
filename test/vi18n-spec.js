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

			describe('formatNumber()', function() {

				it('should format 100 to "100"', function() {
					expect(locale.formatNumber(100)).toBe('100');
				});

				it('should format 1000 to "1.000"', function() {
					expect(locale.formatNumber(1000)).toBe('1.000');
				});

				it('should format 1000000 to "1.000.000"', function() {
					expect(locale.formatNumber(1000000)).toBe('1.000.000');
				});

				describe('default decimals and rounding', function() {

					it('should format 1.1211 to "1,1211"', function() {
						expect(locale.formatNumber(1.1211)).toBe('1,121');
					});

					it('should format 1.1293 to "1,1293"', function() {
						expect(locale.formatNumber(1.1293)).toBe('1,129');
					});

					it('should format 1.1298 to "1,13"', function() {
						expect(locale.formatNumber(1.1298)).toBe('1,13');
					});

				});

				describe('two decimals option', function() {

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

			describe('formatPercent()', function() {

				it('should format 0.01 to "1%"', function() {
					expect(locale.formatPercent(0.01)).toBe('1%');
				});

				it('should format 0.1 to "10%"', function() {
					expect(locale.formatPercent(0.1)).toBe('10%');
				});

				it('should format 1 to "100%"', function() {
					expect(locale.formatPercent(1)).toBe('100%');
				});

				describe('default decimals and rounding', function() {

					it('should format 0.123 to "12%"', function() {
						expect(locale.formatPercent(0.123)).toBe('12%');
					});

					it('should format 0.1234 to "12%"', function() {
						expect(locale.formatPercent(0.1234)).toBe('12%');
					});

					it('should format 0.156 to "16%"', function() {
						expect(locale.formatPercent(0.156)).toBe('16%');
					});

				});

				describe('two decimals option', function() {

					var options = {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					};

					it('should format 0.123 to "12,30%"', function() {
						expect(locale.formatPercent(0.123, options)).toBe('12,30%');
					});

					it('should format 0.1234 to "12,34%"', function() {
						expect(locale.formatPercent(0.1234, options)).toBe('12,34%');
					});

					it('should format 0.156 to "15,60%"', function() {
						expect(locale.formatPercent(0.156, options)).toBe('15,60%');
					});

					it('should format 0.1567 to "15,67%"', function() {
						expect(locale.formatPercent(0.1567, options)).toBe('15,67%');
					});

					it('should format 0.15678 to "15,68%"', function() {
						expect(locale.formatPercent(0.15678, options)).toBe('15,68%');
					});

				});

			});

			describe('formatCurrency()', function() {

				it('should format 100 to "€ 100,00"', function() {
					expect(locale.formatCurrency(100)).toBe('€ 100,00');
				});

				it('should format 1000 to "€ 1.000,00"', function() {
					expect(locale.formatCurrency(1000)).toBe('€ 1.000,00');
				});

				it('should format 100000 to "€ 1.000.000,00"', function() {
					expect(locale.formatCurrency(1000000)).toBe('€ 1.000.000,00');
				});

				describe('default decimals and rounding', function() {

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

				describe('zero decimals option', function() {

					var options = {
						minimumFractionDigits: 0,
						maximumFractionDigits: 0
					};

					it('should format 1 to "€ 1"', function() {
						expect(locale.formatCurrency(1, options)).toBe('€ 1');
					});

					it('should format 1.1211 to "€ 1"', function() {
						expect(locale.formatCurrency(1.1211, options)).toBe('€ 1');
					});

					it('should format 1000 to "€ 1.000"', function() {
						expect(locale.formatCurrency(1000, options)).toBe('€ 1.000');
					});

				});

				describe('currency "false" option', function() {

					var options = {
						currency: false
					};

					it('should format 1.1298 to "1,13"', function() {
						expect(locale.formatCurrency(1.1298, options)).toBe('1,13');
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
						expect(locale.formatCurrency(100, usd)).toBe('US$ 100,00');
					});

					it('should format 100 Japanese yen to "JP¥ 100"', function() {
						expect(locale.formatCurrency(100, yen)).toBe('JP¥ 100');
					});

				});

			});

			describe('formatDate()', function() {

				var date = new Date(Date.UTC(2016, 0, 7, 2, 15, 45));

				it('should format 7 january 2016 to "7-1-2016"', function() {
					expect(locale.formatDate(date)).toBe('7-1-2016');
				});

			});

			describe('formatTime()', function() {

				var date = new Date(Date.UTC(2016, 0, 7, 2, 15, 45));

				// Bug in the Intl polyfill: https://github.com/andyearnshaw/Intl.js/issues/128
				xit('should format 15 past 3 and 45 seconds to "3:15:45"', function() {
					expect(locale.formatTime(date)).toBe('3:15:45');
				});

			});

		});

		describe('getMonths()', function() {

			var locale,
				months;

			beforeEach(function() {
				locale = new VI18N('nl-NL', 'EUR');
			});

			it('should be defined', function() {
				expect(locale.getMonths).toEqual(jasmine.any(Function));
			});

			it('should return an array with 12 months', function() {

				months = locale.getMonths();

				expect(months).toEqual(jasmine.any(Array));
				expect(months.length).toBe(12);
			});

			it('should have january as first month', function() {
				expect(months[0]).toMatch(/jan/i);
			});

			it('should have december as last month', function() {
				expect(months[11]).toMatch(/dec/i);
			});

		});

		describe('getDays()', function() {

			var locale,
				days;

			beforeEach(function() {
				locale = new VI18N('nl-NL', 'EUR');
			});

			it('should be defined', function() {
				expect(locale.getMonths).toEqual(jasmine.any(Function));
			});

			it('should return an array with 7 days', function() {

				days = locale.getDays();

				expect(days).toEqual(jasmine.any(Array));
				expect(days.length).toBe(7);
			});

			it('should have sunday as first day', function() {
				expect(days[0]).toMatch(/zo/i);
			});

			it('should have saturday as last day', function() {
				expect(days[6]).toMatch(/za/i);
			});

		});

		describe('getDecimalSeparator()', function() {

			var locale,
				separator;

			beforeEach(function() {
				locale = new VI18N('nl-NL', 'EUR');
			});

			it('should be defined', function() {
				expect(locale.getDecimalSeparator).toEqual(jasmine.any(Function));
			});

			it('should return a string', function() {
				separator = locale.getDecimalSeparator();

				expect(separator).toEqual(jasmine.any(String));
				expect(separator).toBe(',');
			});

		});

		describe('getThousandSeparator()', function() {

			var locale,
				separator;

			beforeEach(function() {
				locale = new VI18N('nl-NL', 'EUR');
			});

			it('should be defined', function() {
				expect(locale.getThousandSeparator).toEqual(jasmine.any(Function));
			});

			it('should return a string', function() {
				separator = locale.getThousandSeparator();

				expect(separator).toEqual(jasmine.any(String));
				expect(separator).toBe('.');
			});

		});

	});

});
