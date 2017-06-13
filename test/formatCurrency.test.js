import test from 'ava';

import VI18N from '../src/vi18n';

let locale;

test.beforeEach((t) => {
	locale = new VI18N();
});

test('formats 100 to "€ 100,00"', (t) => {
	t.is(locale.formatCurrency(100), '€ 100,00');
});

test('formats 1000 to "€ 1.000,00"', (t) => {
	t.is(locale.formatCurrency(1000), '€ 1.000,00');
});

test('formats 100000 to "€ 1.000.000,00"', (t) => {
	t.is(locale.formatCurrency(1000000), '€ 1.000.000,00');
});

// default decimals and rounding
test('formats 1.1211 to "€ 1,12"', (t) => {
	t.is(locale.formatCurrency(1.1211), '€ 1,12');
});

test('formats 1.1293 to "€ 1,13"', (t) => {
	t.is(locale.formatCurrency(1.1293), '€ 1,13');
});

test('formats 1.1298 to "€ 1,13"', (t) => {
	t.is(locale.formatCurrency(1.1298), '€ 1,13');
});

// zero decimals option
const noDecimals = {
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
};

test('formats 1 to "€ 1"', (t) => {
	t.is(locale.formatCurrency(1, noDecimals), '€ 1');
});

test('formats 1.1211 to "€ 1"', (t) => {
	t.is(locale.formatCurrency(1.1211, noDecimals), '€ 1');
});

test('formats 1000 to "€ 1.000"', (t) => {
	t.is(locale.formatCurrency(1000, noDecimals), '€ 1.000');
});

// currency "false" option
test('formats 1.1298 to "1,13"', (t) => {
	t.is(locale.formatCurrency(1.1298, { currency: false }), '1,13');
});

// other currencies
const usd = {
	currency: 'USD',
};
const yen = {
	currency: 'JPY',
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
};

test('formats 100 US dollars to "US$ 100,00"', (t) => {
	t.is(locale.formatCurrency(100, usd), 'US$ 100,00');
});

test('formats 100 Japanese yen to "JP¥ 100"', (t) => {
	t.is(locale.formatCurrency(100, yen), 'JP¥ 100');
});
