import test from 'ava';

import VI18N from '../src';

test('formats 15 past 3 and 45 seconds according to timezone"', (t) => {
	const date = new Date(Date.UTC(2016, 0, 7, 2, 15, 45));

	const nl = new VI18N();
	const uk = new VI18N('en-GB', 'GBP', { time: { timeZone: 'etc/UTC' } });
	const us = new VI18N('us-US', 'USD', { time: { timeZone: 'America/New_York' } });

	t.is(nl.formatTime(date), '03:15:45');
	t.is(uk.formatTime(date), '02:15:45');
	t.is(us.formatTime(date), '21:15:45');
});
