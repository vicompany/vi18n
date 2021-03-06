import test from 'ava';

import VI18N from '../src';

test('formats 100 to "100"', (t) => {
	const nl = new VI18N('nl-NL');
	const us = new VI18N('en-US');

	t.is(nl.formatNumber(100), '100');
	t.is(us.formatNumber(100), '100');
});

test('formats 1000 to "1.000"', (t) => {
	const nl = new VI18N('nl-NL');
	const uk = new VI18N('en-GB');
	const ch = new VI18N('de-ch');

	t.is(nl.formatNumber(1000), '1.000');
	t.is(uk.formatNumber(1000), '1,000');
	t.is(ch.formatNumber(1000), '1’000');
});

test('formats 1000000 to "1.000.000"', (t) => {
	const nl = new VI18N('nl-NL');
	const uk = new VI18N('en-GB');
	const ch = new VI18N('de-ch');

	t.is(nl.formatNumber(1000000), '1.000.000');
	t.is(uk.formatNumber(1000000), '1,000,000');
	t.is(ch.formatNumber(1000000), '1’000’000');
});

// default decimals and rounding
// maximumFractionDigits: "the default for plain number formatting is the larger of minimumFractionDigits and 3"
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
test('formats 1.1211 to "1,121"', (t) => {
	const nl = new VI18N('nl-NL');
	const uk = new VI18N('en-GB');
	const ch = new VI18N('de-ch');

	t.is(nl.formatNumber(1.1211), '1,121');
	t.is(uk.formatNumber(1.1211), '1.121');
	t.is(ch.formatNumber(1.1211), '1.121');
});

test('formats 1.1293 to "1,129"', (t) => {
	const nl = new VI18N('nl-NL');
	const uk = new VI18N('en-GB');
	const ch = new VI18N('de-ch');

	t.is(nl.formatNumber(1.1293), '1,129');
	t.is(uk.formatNumber(1.1293), '1.129');
	t.is(ch.formatNumber(1.1293), '1.129');
});

test('formats 1.1298 to "1,13"', (t) => {
	const nl = new VI18N('nl-NL');
	const uk = new VI18N('en-GB');
	const ch = new VI18N('de-ch');

	t.is(nl.formatNumber(1.1298), '1,13');
	t.is(uk.formatNumber(1.1298), '1.13');
	t.is(ch.formatNumber(1.1298), '1.13');
});

test('formats 100 to "100,00"', (t) => {
	const nl = new VI18N('nl-NL', { number: { minimumFractionDigits: 2 } });
	const uk = new VI18N('en-GB', { number: { minimumFractionDigits: 2 } });
	const ch = new VI18N('de-ch', { number: { minimumFractionDigits: 2 } });

	t.is(nl.formatNumber(100), '100,00');
	t.is(uk.formatNumber(100), '100.00');
	t.is(ch.formatNumber(100), '100.00');
});

test('formats 1.1211 to "1,12"', (t) => {
	const nl = new VI18N('nl-NL', { number: { maximumFractionDigits: 2 } });
	const uk = new VI18N('en-BG', { number: { maximumFractionDigits: 2 } });
	const ch = new VI18N('de-ch', { number: { maximumFractionDigits: 2 } });

	t.is(nl.formatNumber(1.1211), '1,12');
	t.is(uk.formatNumber(1.1211), '1.12');
	t.is(ch.formatNumber(1.1211), '1.12');
});

test('formats 1.1293 to "1,13"', (t) => {
	const nl = new VI18N('nl-NL', { number: { maximumFractionDigits: 2 } });
	const uk = new VI18N('en-GB', { number: { maximumFractionDigits: 2 } });

	t.is(nl.formatNumber(1.1293), '1,13');
	t.is(uk.formatNumber(1.1293), '1.13');
});

test('formats 1.1298 to "1,13"', (t) => {
	const nl = new VI18N('nl-NL', { number: { maximumFractionDigits: 2 } });
	const uk = new VI18N('en-GB', { number: { maximumFractionDigits: 2 } });

	t.is(nl.formatNumber(1.1298), '1,13');
	t.is(uk.formatNumber(1.1298), '1.13');
});
