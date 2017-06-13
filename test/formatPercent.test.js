import test from 'ava';

import VI18N from '../src/vi18n';

let locale;

test.beforeEach((t) => {
	locale = new VI18N();
});

test('should format 0.01 to "1%"', (t) => {
	t.is(locale.formatPercent(0.01), '1%');
});

test('should format 0.1 to "10%"', (t) => {
	t.is(locale.formatPercent(0.1), '10%');
});

test('should format 1 to "100%"', (t) => {
	t.is(locale.formatPercent(1), '100%');
});

// default decimals and rounding'
test('should format 0.123 to "12%"', (t) => {
	t.is(locale.formatPercent(0.123), '12%');
});

test('should format 0.1234 to "12%"', (t) => {
	t.is(locale.formatPercent(0.1234), '12%');
});

test('should format 0.156 to "16%"', (t) => {
	t.is(locale.formatPercent(0.156), '16%');
});

// two decimals option
const options = {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
};

test('should format 0.123 to "12,30%"', (t) => {
	t.is(locale.formatPercent(0.123, options), '12,30%');
});

test('should format 0.1234 to "12,34%"', (t) => {
	t.is(locale.formatPercent(0.1234, options), '12,34%');
});

test('should format 0.156 to "15,60%"', (t) => {
	t.is(locale.formatPercent(0.156, options), '15,60%');
});

test('should format 0.1567 to "15,67%"', (t) => {
	t.is(locale.formatPercent(0.1567, options), '15,67%');
});

test('should format 0.15678 to "15,68%"', (t) => {
	t.is(locale.formatPercent(0.15678, options), '15,68%');
});
