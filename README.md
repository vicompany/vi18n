# VI18N

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
nl.formatNumber(12.50); // 12,50
uk.formatNumber(12.50); // 12.50
```

###Currency formatting
```javascript
nl.formatCurrency(12.50); // € 12,50
uk.formatCurrency(12.50); // £12.50

// In another currency
nl.formatCurrency(12.50, 'JPY'); // JP¥ 12,50
uk.formatCurrency(12.50, 'JPY'); // ¥12.50

// Or without currency symbol
nl.formatCurrency(12.50, false); // 12,50
uk.formatCurrency(12.50, false); // 12.50
```

###Percent formatting
```javascript
nl.formatPercent(0.75); // 75%
uk.formatPercent(0.75); // 75%
```

###Date and time formatting
```javascript
var date = new Date();

nl.formatDate(date); // 2-9-2015
uk.formatDate(date); // 02/09/2015

nl.formatTime(date); // 12:38:09
uk.formatTime(date); // 12:38:09
```

###Months and days

```javascript

// Possible representations are "narrow", "short" or "long" (default).

uk.getMonths()          // [ "January", "February", "March", etc. ]
uk.getMonths('short')   // [ "Jan", "Feb", "Mar", etc. ]
uk.getMonths('narrow')  // [ "J", "F", "M", etc. ]

uk.getDays()            // [ "Sunday", "Monday", "Tuesday", etc. ]
uk.getDays('short')     // [ "Sun", "Mon", "Tue", etc. ]
uk.getDays('narrow')    // [ "S", "M", "T", etc. ]
```

###Static methods
```javascript
// Get locale instances
var dutch = VI18N.get('nl-NL');

// Check for native browser support or the presence of a polyfill.
VI18N.isSupported();
```
