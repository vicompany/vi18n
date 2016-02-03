# VI18N

[![Build Status](https://travis-ci.org/vicompany/vi18n.svg)](https://travis-ci.org/vicompany/vi18n)
[![Coverage Status](https://coveralls.io/repos/vicompany/vi18n/badge.svg?branch=master&service=github)](https://coveralls.io/github/vicompany/vi18n?branch=master)

Simple number, currency, type and date formatters based on the [Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

## Requirements

* A [polyfill](https://github.com/andyearnshaw/Intl.js) when supporting [older browsers](http://caniuse.com/#feat=internationalization).
* Or use the Financial Times polyfill service at https://cdn.polyfill.io.

##Installation

Clone the project or download the zip. Include the file from the *dist* folder in you project and create one or more locales. Don't forget to include a polyfill when supporting older browsers!

##Examples

###Creating a locale
```javascript
define(['vi18n'], function(VI18N) {
  
  var nl = new VI18N(), // Default locale is Dutch with the Euro as currency
      uk = new VI18N('en-GB', 'GBP');
});
```

###Number formatting
```javascript
nl.formatNumber(12.50); // '12,50'
uk.formatNumber(12.50); // '12.50'
```

###Currency formatting
```javascript
nl.formatCurrency(12.50); // '€ 12,50'
uk.formatCurrency(12.50); // '£12.50'

// In another currency
nl.formatCurrency(12.50, { currency: 'JPY' }); // 'JP¥ 12,50'
uk.formatCurrency(12.50, { currency: 'JPY' }); // '¥12.50'

// Without currency symbol
nl.formatCurrency(12.50, { currency: false }); // '12,50'
uk.formatCurrency(12.50, { currency: false }); // '12.50'

// or without decimals
nl.formatCurrency(12.50, { minimumFractionDigits: 0, maximumFractionDigits: 0 }); // '€ 12'
uk.formatCurrency(12.50, { currency: 'JPY', minimumFractionDigits: 0, maximumFractionDigits: 0 }); // '¥12'
```

###Percent formatting
```javascript
nl.formatPercent(0.75); // '75%'
uk.formatPercent(0.75); // '75%'
```

###Date and time formatting
```javascript
var date = new Date();

nl.formatDate(date); // '2-9-2015'
uk.formatDate(date); // '02/09/2015'

nl.formatTime(date); // '12:38:09'
uk.formatTime(date); // '12:38:09'
```

###Decimal and thousand separator
```javascript
nl.getDecimalSeparator();   // ','
nl.getThousandSeparator();  // '.'
```

###Months and days
```javascript
// Possible representations are 'narrow', 'short' or 'long' (default).

uk.getMonths()          // [ 'January', 'February', 'March', etc. ]
uk.getMonths('short')   // [ 'Jan', 'Feb', 'Mar', etc. ]
uk.getMonths('narrow')  // [ 'J', 'F', 'M', etc. ]

uk.getDays()            // [ 'Sunday', 'Monday', 'Tuesday', etc. ]
uk.getDays('short')     // [ 'Sun', 'Mon', 'Tue', etc. ]
uk.getDays('narrow')    // [ 'S', 'M', 'T', etc. ]
```

###Static methods
```javascript
// Get locale instances
var dutch = VI18N.getLocale('nl-NL');

// Check for native browser support or the presence of a polyfill.
VI18N.isSupported();
```

## License

MIT © [VI Company](http://vicompany.nl)