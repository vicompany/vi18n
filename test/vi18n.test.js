import test from 'ava';
import sinon from 'sinon';

import VI18N from '../src/vi18n';

test.beforeEach((t) => {
	t.context.locale = new VI18N();
});

test('Constructor defaults to "nl-NL" locale with "EUR" as currency', (t) => {
	const { locale } = t.context;

	t.is(locale.locale, 'nl-NL');
	t.is(locale.currency, 'EUR');
});

test('Constructor checks "Intl" support', (t) => {
	sinon.spy(VI18N, 'isSupported');

	// eslint-disable-next-line
	const locale = new VI18N();

	t.true(VI18N.isSupported.calledOnce);
});

test('VI18N.getLocale() returns locale instances', (t) => {
	const nl = new VI18N();
	const en = new VI18N('en-GB', 'GPB');

	t.is(VI18N.getLocale('nl-NL'), nl);
	t.is(VI18N.getLocale('en-GB'), en);
});

test('locale.getMonths()', (t) => {
	const { locale } = t.context;
	const months = locale.getMonths();

	t.true(Array.isArray(months));
	t.is(months.length, 12);
	t.regex(months[0], /jan/i);
	t.regex(months[11], /dec/i);
});

test('locale.getDays()', (t) => {
	const { locale } = t.context;
	const days = locale.getDays();

	t.true(Array.isArray(days));
	t.is(days.length, 7);
	t.regex(days[0], /zo/i);
	t.regex(days[6], /za/i);
});

test('getDecimalSeparator()', (t) => {
	const { locale } = t.context;
	const separator = locale.getDecimalSeparator();

	t.is(typeof separator, 'string');
	t.is(separator, ',');
});

test('getThousandSeparator()', (t) => {
	const { locale } = t.context;
	const separator = locale.getThousandSeparator();

	t.is(typeof separator, 'string');
	t.is(separator, '.');
});
