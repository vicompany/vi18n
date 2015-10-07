define([
	'vi18n'
],
function(VI18N) {

	'use strict';

	describe('formatDate()', function() {

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

		describe('formatDate()', function() {

			var date = new Date(Date.UTC(2016, 0, 7, 2, 15, 45));

			it('should format 7 january 2016 to "7-1-2016"', function() {
				expect(this.locale.formatDate(date)).toBe('7-1-2016');
			});

		});

	});

});
