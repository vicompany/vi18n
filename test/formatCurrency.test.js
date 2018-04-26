import test from 'ava';

import VI18N from '../src';


test('formats 100 to "€ 100,00"', (t) => {
	const locale = new VI18N('nl-NL');

	t.is(locale.formatCurrency(100), '€ 100,00');
});

test('formats 1000 to "€ 1.000,00"', (t) => {
	const locale = new VI18N('nl-NL');

	t.is(locale.formatCurrency(1000), '€ 1.000,00');
});

test('formats 100000 to "€ 1.000.000,00"', (t) => {
	const locale = new VI18N('nl-NL');

	t.is(locale.formatCurrency(1000000), '€ 1.000.000,00');
});

// default decimals and rounding
test('formats 1.1211 to "€ 1,12"', (t) => {
	const locale = new VI18N('nl-NL');

	t.is(locale.formatCurrency(1.1211), '€ 1,12');
});

test('formats 1.1293 to "€ 1,13"', (t) => {
	const locale = new VI18N('nl-NL');

	t.is(locale.formatCurrency(1.1293), '€ 1,13');
});

test('formats 1.1298 to "€ 1,13"', (t) => {
	const locale = new VI18N('nl-NL');

	t.is(locale.formatCurrency(1.1298), '€ 1,13');
});


test('formats 1 to "€ 1"', (t) => {
	const locale = new VI18N('nl-NL', { currency: { minimumFractionDigits: 0, maximumFractionDigits: 0 } });

	t.is(locale.formatCurrency(1), '€ 1');
});

test('formats 1.1211 to "€ 1"', (t) => {
	const locale = new VI18N('nl-NL', { currency: { minimumFractionDigits: 0, maximumFractionDigits: 0 } });

	t.is(locale.formatCurrency(1.1211), '€ 1');
});

test('formats 1000 to "€ 1.000"', (t) => {
	const locale = new VI18N('nl-NL', { currency: { minimumFractionDigits: 0, maximumFractionDigits: 0 } });

	t.is(locale.formatCurrency(1000), '€ 1.000');
});

// other currencies
test('formats 100 US dollars to "US$ 100,00"', (t) => {
	const locale = new VI18N('us-US', { currency: { currency: 'USD' } });

	t.is(locale.formatCurrency(100), 'US$ 100,00');
});

test('formats 100 Japanese yen to "¥ 100"', (t) => {
	const locale = new VI18N('ja', { currency: { currency: 'JPY' } });

	t.is(locale.formatCurrency(100), '￥100');
});
