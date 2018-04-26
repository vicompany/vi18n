import test from 'ava';

import VI18N from '../src';

test('formats 7 january 2016 to "7-1-2016"', (t) => {
	const date = new Date(Date.UTC(2016, 0, 7, 2, 15, 45));
	const nl = new VI18N();
	const uk = new VI18N('en-GB');
	const ch = new VI18N('de-ch');

	t.is(nl.formatDate(date), '7-1-2016');
	t.is(uk.formatDate(date), '07/01/2016');
	t.is(ch.formatDate(date), '7.1.2016');
});
