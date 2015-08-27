# VI18N

Simple number, currency, type and date formatters based on the [Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

## Requirements

* A [polyfill](https://github.com/andyearnshaw/Intl.js) when supporting [older browsers](http://caniuse.com/#feat=internationalization).
  * You can also use the Financial Times polyfill service at https://cdn.polyfill.io.

##Installation

Clone the project or download the zip. Include the file from the *dist* folder in you project and create one or more locales. Don't forget to include a polyfill when supporting older browsers!

##Examples

```javascript
define(['vi18n'], function(VI18N) {

  var de = new VI18N('de-DE', 'EUR');

  de.formatCurrency(12.50); // "€ 12,50

});
```
