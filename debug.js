var colors = require('colors')

var debug = {
	on: false,

	log: function (message) {
		console.log('LOG: '.bold.blue + message.white);
	},

	success: function (message) {
		console.log('SUCCESS: '.bold.green + message.grey);
	},

	debug: function (message) {
		if (this.on)
			console.log('DEBUG: '.bold.cyan + message.grey);
	},

	error: function (message) {
		console.log('ERROR: '.bold.red + message.magenta + '!!1'.magenta);
	},

	warning: function (message) {
		console.log('WARNING: '.bold.yellow + message.grey + '!'.grey);
	}
};

module.exports = debug;