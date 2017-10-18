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

const nl = new VI18N(); // Default locale is 'nl-NL' (Dutch) with 'EUR' (Euro) as currency
const uk = new VI18N('en-GB', 'GBP');
```

### Number formatting
```javascript
nl.formatNumber(12.50); // '12,50'
uk.formatNumber(12.50); // '12.50'
```

### Currency formatting
```javascript
nl.formatCurrency(12.50); // '€ 12,50'
uk.formatCurrency(12.50); // '£12.50'

// In another currency
nl.formatCurrency(12.50, { currency: 'JPY' }); // 'JP¥ 12,50'
uk.formatCurrency(12.50, { currency: 'JPY' }); // '¥12.50'

// Or without decimals
nl.formatCurrency(12.50, { minimumFractionDigits: 0, maximumFractionDigits: 0 }); // '€ 12'
uk.formatCurrency(12.50, { currency: 'JPY', minimumFractionDigits: 0, maximumFractionDigits: 0 }); // '¥12'
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
// Get locale instances
var dutch = VI18N.getLocale('nl-NL');

// Check for native browser support or the presence of a polyfill.
VI18N.isSupported();
```

## License

MIT © [VI Company](http://vicompany.nl)
