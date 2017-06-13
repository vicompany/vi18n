import test from 'ava';

import VI18N from '../src/vi18n';

test('formats 15 past 3 and 45 seconds to "3:15:45"', (t) => {
	const date = new Date(Date.UTC(2016, 0, 7, 2, 15, 45));
	const locale = new VI18N();

	t.is(locale.formatTime(date), '03:15:45');
});
