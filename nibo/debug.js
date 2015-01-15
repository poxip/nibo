/**
* Created by poxip on April 24, 2014
* A debug methods module
*/

var colors  = require('colors');
util    = require('util');

var debug = {};
/**
 * @property {Boolean} on
 * Contains information, that is debugging turned on.
 * Set false to hide debug.debug() messages.
 */
debug.on = false;

debug.log = function (message) {
	console.log('LOG: '.bold.blue + message.white);
};

debug.success = function (message) {
	console.log('SUCCESS: '.bold.green + message.grey);
};

debug.error = function (message) {
	console.log('ERROR: '.bold.red + message.magenta + '!!1'.magenta);
};

debug.warning = function (message) {
	console.log('WARNING: '.bold.yellow + message.grey + '!'.grey);
}

debug.debug = function (message) {
	if (this.on) {
		console.log('DEBUG: '.bold.cyan + util.inspect(message).grey);
	}
};

module.exports = debug;