import test from 'ava';
import sinon from 'sinon';

import VI18N from '../src';

let locale;

test.beforeEach((t) => {
	locale = new VI18N();
});

test('Constructor defaults to "nl-NL" locale with "EUR" as currency', (t) => {
	t.is(locale.locale, 'nl-NL');
	t.is(locale.currency, 'EUR');
});

test('Constructor checks "Intl" support', (t) => {
	sinon.spy(VI18N, 'isSupported');

	locale = new VI18N();

	t.true(VI18N.isSupported.calledOnce);
});

test('locale.getMonths()', (t) => {
	const months = locale.getMonths();

	t.true(Array.isArray(months));
	t.is(months.length, 12);
	t.regex(months[0], /jan/i);
	t.regex(months[11], /dec/i);
});

test('locale.getDays()', (t) => {
	const days = locale.getDays();

	t.true(Array.isArray(days));
	t.is(days.length, 7);
	t.regex(days[0], /zo/i);
	t.regex(days[6], /za/i);
});

test('locale.getDecimalSeparator()', (t) => {
	const separator = locale.getDecimalSeparator();

	t.is(typeof separator, 'string');
	t.is(separator, ',');
});

test('locale.getThousandSeparator()', (t) => {
	const separator = locale.getThousandSeparator();

	t.is(typeof separator, 'string');
	t.is(separator, '.');
});
