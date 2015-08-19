define([
	'vi18n'
],
function(VI18N) {

	'use strict';

	describe('VI18N internationalization library', function() {

		describe('VI18N.create()', function() {

			var factory;

			it('should have a static "create" factory method', function() {
				expect(VI18N.create).toEqual(jasmine.any(Function));
			});

			it('should return a promise', function() {
				factory = VI18N.create();

				expect(factory).toEqual(jasmine.any(Promise));
				expect(factory.then).toBeDefined();
			});

			it('should check and polyfill native browser support', function(done) {

				spyOn(VI18N, 'polyfill').and.callThrough();
				spyOn(VI18N, 'isSupported').and.callThrough();

				VI18N
					.create()
					.then(function(instance) {

						expect(VI18N.polyfill).toHaveBeenCalled();
						expect(VI18N.isSupported).toHaveBeenCalled();

					}, function(error) {
						expect(error).toBeUndefined();
						// fail(error);
					})
					.then(done);
			});

			it('should eventually return an instance with Dutch defaults', function(done) {

				VI18N
					.create()
					.then(function(instance) {

						expect(instance).toBeDefined();
						expect(instance.getLocale()).toBe('nl-NL');
						expect(instance.getCurrency()).toBe('EUR');

						done();
					});
			});

		});

		describe('VI18N.get()', function() {

			it('should have a static "get" method to retrieve locale instances', function(done) {

				VI18N
					.create('nl-NL')
					.then(function(instance) {

						expect(VI18N.get).toEqual(jasmine.any(Function));
						expect(VI18N.get('nl-NL')).toEqual(instance);

						done();
					});
			});

		});

		describe('formatters', function() {

			var locale;

			beforeEach(function(done) {
				VI18N
					.create('nl-NL')
					.then(function(instance) {
						locale = instance;
						done();
					});
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

			/*xdescribe('format to other locales', function() {

				it('should support fy_NL locale', function() {
					expect(VI18N.hasLocaleSupport('fy-NL')).toBe(true);
				});

				it('should format 7 january 2016 to "1/7/2016" for the en-US locale', function() {
					expect(locale.formatDate(date, 'en-US')).toBe('1/7/2016');
				});

			});*/

		});

	});

});
