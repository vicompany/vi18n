import test from 'ava';

import VI18N from '../src';

let locale;

test.beforeEach((t) => {
	locale = new VI18N();
});

test('formats 0.01 to "1%"', (t) => {
	t.is(locale.formatPercent(0.01), '1%');
});

test('formats 0.1 to "10%"', (t) => {
	t.is(locale.formatPercent(0.1), '10%');
});

test('formats 1 to "100%"', (t) => {
	t.is(locale.formatPercent(1), '100%');
});

// default decimals and rounding'
test('formats 0.123 to "12%"', (t) => {
	t.is(locale.formatPercent(0.123), '12%');
});

test('formats 0.1234 to "12%"', (t) => {
	t.is(locale.formatPercent(0.1234), '12%');
});

test('formats 0.156 to "16%"', (t) => {
	t.is(locale.formatPercent(0.156), '16%');
});


test('formats 0.123 to "12,30%"', (t) => {
	const nl = new VI18N('nl-NL', 'EUR', { percent: { minimumFractionDigits: 2 } });

	t.is(nl.formatPercent(0.123), '12,30%');
});

test('formats 0.1234 to "12,34%"', (t) => {
	const nl = new VI18N('nl-NL', 'EUR', { percent: { minimumFractionDigits: 2 } });

	t.is(nl.formatPercent(0.1234), '12,34%');
});

test('formats 0.156 to "15,60%"', (t) => {
	const nl = new VI18N('nl-NL', 'EUR', { percent: { minimumFractionDigits: 2 } });

	t.is(nl.formatPercent(0.156), '15,60%');
});

test('formats 0.1567 to "15,67%"', (t) => {
	const nl = new VI18N('nl-NL', 'EUR', { percent: { minimumFractionDigits: 2 } });

	t.is(nl.formatPercent(0.1567), '15,67%');
});

test('formats 0.15678 to "15,68%"', (t) => {
	const nl = new VI18N('nl-NL', 'EUR', { percent: { minimumFractionDigits: 2 } });

	t.is(nl.formatPercent(0.15678), '15,68%');
});
