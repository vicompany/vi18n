# VI18N

[![npm](https://img.shields.io/npm/v/vi18n.svg)](https://npm.im/vi18n)
[![Build Status](https://travis-ci.org/vicompany/vi18n.svg)](https://travis-ci.org/vicompany/vi18n)
[![Coverage Status](https://coveralls.io/repos/vicompany/vi18n/badge.svg?branch=master&service=github)](https://coveralls.io/github/vicompany/vi18n?branch=master)

Simple number, currency, type and date formatters based on the [Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

## Requirements

* [**Intl** object (ECMAScript Internationalization API)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) see the [support](http://caniuse.com/#feat=internationalization).
  * You can include the [polyfill](https://github.com/andyearnshaw/Intl.js) when supporting older environments.
  * Or use the Financial Times polyfill service at [cdn.polyfill.io](https://cdn.polyfill.io).

## Installation

```
npm install --save vi18n
```

## Examples

### Creating a locale
```javascript
import VI18N from 'vi18n';

// const locale = new VI18N(culture, options);

const nl = new VI18N(); // Default locale is 'nl-NL' (Dutch)
const uk = new VI18N('en-GB');

// overriding default settings with options
const ch = new VI18N('de-ch', { number: { maximumFractionDigits: 2 } });
const nl = new VI18N('nl-NL', { percent: { minimumFractionDigits: 2 } });
const jp = new VI18N('ja', { currency: { currency: 'JPY' } });

const uk = new VI18N('en-GB', {
  time: { timeZone: 'etc/UTC' },
  currency: { currency: 'GBP' },
});

const us = new VI18N('us-US', {
  time: { hour: 'numeric' },
  currency: { currency: 'USD' } ,
});
```

The `options` parameter can contain the following configuration objects:
- `number`
- `percent`
- `currency`
- `time`

See [MDN: NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) for possible values for the `number`, `percent` and `currency` configuration objects.  
See [MDN: DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) for possible values for the `time` configuration object.

### Number formatting
```javascript
nl.formatNumber(12.50); // '12,50'
uk.formatNumber(12.50); // '12.50'
```

### Currency formatting
```javascript
nl.formatCurrency(12.50); // '€ 12,50'
uk.formatCurrency(12.50); // '£12.50'
```

### Percent formatting
```javascript
nl.formatPercent(0.75); // '75%'
uk.formatPercent(0.75); // '75%'
```

### Date and time formatting
```javascript
var date = new Date();

nl.formatDate(date); // '2-9-2015'
uk.formatDate(date); // '02/09/2015'

nl.formatTime(date); // '12:38:09'
uk.formatTime(date); // '12:38:09'
```

### Decimal and thousand separator
```javascript
nl.getDecimalSeparator();   // ','
nl.getThousandSeparator();  // '.'
```

### Months and days
```javascript
// Possible representations are 'narrow', 'short' or 'long' (default).

uk.getMonths()          // [ 'January', 'February', 'March', etc. ]
uk.getMonths('short')   // [ 'Jan', 'Feb', 'Mar', etc. ]
uk.getMonths('narrow')  // [ 'J', 'F', 'M', etc. ]

uk.getDays()            // [ 'Sunday', 'Monday', 'Tuesday', etc. ]
uk.getDays('short')     // [ 'Sun', 'Mon', 'Tue', etc. ]
uk.getDays('narrow')    // [ 'S', 'M', 'T', etc. ]
```

### Static methods
```javascript
// Check for native browser support or the presence of a polyfill.
VI18N.isSupported();
```

## License

MIT © [VI Company](http://vicompany.nl)
