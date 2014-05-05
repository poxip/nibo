/** Created on Apr 24, 2014
 *  author: MrPoxipol
 */

var colors = require('colors');
var util = require('util');

var debug = {
	on: false,
	// Don't use if you want to print object content
	log: function (message) {
		console.log('LOG: '.bold.blue + message.white);
	},

	success: function (message) {
		console.log('SUCCESS: '.bold.green + message.grey);
	},

	debug: function (message) {
		if (this.on) {
			console.log('DEBUG: '.bold.cyan + message.toString().grey);
		}
	},

	error: function (message) {
		console.log('ERROR: '.bold.red + message.magenta + '!!1'.magenta);
	},

	warning: function (message) {
		console.log('WARNING: '.bold.yellow + message.grey + '!'.grey);
	}
};

module.exports = debug;