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

		describe('getMonths()', function() {

			var months;

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
