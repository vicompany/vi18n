import IntlPolyfill from 'intl';

Intl.NumberFormat = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

// Polyfill toLocaleString(), toLocaleDateString(), etc.
IntlPolyfill.__applyLocaleSensitivePrototypes(); // eslint-disable-line no-underscore-dangle
