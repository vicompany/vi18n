require.config({

	paths: {
		'text':		'../bower_components/text/text',
		'intl':		'../bower_components/intl/dist/Intl.min'
	},

	shim: {
		intl: {
			exports: 'Intl' // AMD support has been removed, see: https://github.com/andyearnshaw/Intl.js/issues/132
		}
	}

});
