import test from 'ava';

import VI18N from '../src';

test('formats 15 past 3 and 45 seconds according to timezone"', (t) => {
	const date = new Date(Date.UTC(2016, 0, 7, 2, 15, 45));

	const nl = new VI18N();
	const uk = new VI18N('en-GB', { time: { timeZone: 'etc/UTC' } });

	t.is(nl.formatTime(date), '03:15:45');
	t.is(uk.formatTime(date), '02:15:45');
});
