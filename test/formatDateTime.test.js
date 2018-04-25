import test from 'ava';

import VI18N from '../src';

test('formats 15 past 3 and 45 seconds to "3:15:45"', (t) => {
	const date = new Date(Date.UTC(2016, 0, 7, 2, 15, 45));
	const nl = new VI18N();
	const uk = new VI18N('en-GB', 'GBP', { timeZone: 'Etc/GMT' });
	const us = new VI18N('us-US', 'USD', { timeZone: 'America/New_York' });

	t.is(nl.formatDateTime(date), '7-1-2016 03:15:45');
	t.is(uk.formatDateTime(date), '07/01/2016, 02:15:45');
	t.is(us.formatDateTime(date), '6-1-2016 21:15:45');
});
