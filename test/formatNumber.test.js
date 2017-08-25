import test from 'ava';

import VI18N from '../';

let locale;

test.beforeEach((t) => {
	locale = new VI18N();
});

test('formats 100 to "100"', (t) => {
	t.is(locale.formatNumber(100), '100');
});

test('formats 1000 to "1.000"', (t) => {
	t.is(locale.formatNumber(1000), '1.000');
});

test('formats 1000000 to "1.000.000"', (t) => {
	t.is(locale.formatNumber(1000000), '1.000.000');
});

// default decimals and rounding
test('formats 1.1211 to "1,1211"', (t) => {
	t.is(locale.formatNumber(1.1211), '1,121');
});

test('formats 1.1293 to "1,1293"', (t) => {
	t.is(locale.formatNumber(1.1293), '1,129');
});

test('formats 1.1298 to "1,13"', (t) => {
	t.is(locale.formatNumber(1.1298), '1,13');
});

// two decimals option
const options = {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
};

test('formats 100 to "100,00"', (t) => {
	t.is(locale.formatNumber(100, options), '100,00');
});

test('formats 1.1211 to "1,12"', (t) => {
	t.is(locale.formatNumber(1.1211, options), '1,12');
});

test('formats 1.1293 to "1,13"', (t) => {
	t.is(locale.formatNumber(1.1293, options), '1,13');
});

test('formats 1.1298 to "1,13"', (t) => {
	t.is(locale.formatNumber(1.1298, options), '1,13');
});
