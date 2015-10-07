define([
	'vi18n'
],
function(VI18N) {

	'use strict';

	describe('VI18N', function() {

		beforeEach(function(done) {
			var self = this;

			if (VI18N.isSupported()) {

				this.locale = new VI18N();

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

				self.locale = new VI18N();

				done();
			});

		});

		describe('VI18N', function() {

			beforeEach(function() {
				spyOn(VI18N, 'isSupported').and.callThrough();

				this.locale = new VI18N();
			});

			it('should check browser support for Intl', function() {
				expect(VI18N.isSupported).toHaveBeenCalled();
			});

			it('should return an instance with the Dutch locale as default', function() {
				expect(this.locale.getLocale()).toBe('nl-NL');
				expect(this.locale.getCurrency()).toBe('EUR');
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

		describe('getLocale', function() {

			it('should be defined', function() {
				expect(this.locale.getLocale).toEqual(jasmine.any(Function));
			});

		});

		describe('formatters', function() {

			/*beforeEach(function() {
				this.locale = new VI18N('nl-NL', 'EUR');
			});*/

			describe('formatDate()', function() {

				var date = new Date(Date.UTC(2016, 0, 7, 2, 15, 45));

				it('should format 7 january 2016 to "7-1-2016"', function() {
					expect(this.locale.formatDate(date)).toBe('7-1-2016');
				});

			});

			describe('formatTime()', function() {

				var date = new Date(Date.UTC(2016, 0, 7, 2, 15, 45));

				// Bug in the Intl polyfill: https://github.com/andyearnshaw/Intl.js/issues/128
				xit('should format 15 past 3 and 45 seconds to "3:15:45"', function() {
					expect(this.locale.formatTime(date)).toBe('3:15:45');
				});

			});

		});

		describe('getMonths()', function() {

			var months;

			/*beforeEach(function() {
				this.locale = new VI18N('nl-NL', 'EUR');
			});*/

			it('should be defined', function() {
				expect(this.locale.getMonths).toEqual(jasmine.any(Function));
			});

			it('should return an array with 12 months', function() {

				months = this.locale.getMonths();

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

			var days;

			/*beforeEach(function() {
				this.locale = new VI18N('nl-NL', 'EUR');
			});*/

			it('should be defined', function() {
				expect(this.locale.getMonths).toEqual(jasmine.any(Function));
			});

			it('should return an array with 7 days', function() {

				days = this.locale.getDays();

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

			var separator;

			/*beforeEach(function() {
				this.locale = new VI18N('nl-NL', 'EUR');
			});*/

			it('should be defined', function() {
				expect(this.locale.getDecimalSeparator).toEqual(jasmine.any(Function));
			});

			it('should return a string', function() {
				separator = this.locale.getDecimalSeparator();

				expect(separator).toEqual(jasmine.any(String));
				expect(separator).toBe(',');
			});

		});

		describe('getThousandSeparator()', function() {

			var separator;

			/*beforeEach(function() {
				this.locale = new VI18N('nl-NL', 'EUR');
			});*/

			it('should be defined', function() {
				expect(this.locale.getThousandSeparator).toEqual(jasmine.any(Function));
			});

			it('should return a string', function() {
				separator = this.locale.getThousandSeparator();

				expect(separator).toEqual(jasmine.any(String));
				expect(separator).toBe('.');
			});

		});

	});

});
