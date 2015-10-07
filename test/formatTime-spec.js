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

		describe('formatTime()', function() {

			var date = new Date(Date.UTC(2016, 0, 7, 2, 15, 45));

			// Bug in the Intl polyfill: https://github.com/andyearnshaw/Intl.js/issues/128
			xit('should format 15 past 3 and 45 seconds to "3:15:45"', function() {
				expect(this.locale.formatTime(date)).toBe('03:15:45');
			});

		});

	});

});
