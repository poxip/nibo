/**
@author MrPoxipol
@date	31 Aug, 2014
@brief	Base64 encoding/decoding plugin
*/

var ut = require('../nibo/ut');

const COMMAND_NAME = 'base64';
const DESCRIPTION  = "Base64 encoding/decoding. " +
	                 "Usage: base64 -e|-d <string> -- encode/decode";

exports.meta = {
	name: 'help',
	commandName: COMMAND_NAME,
	description: DESCRIPTION
};

exports.onCommand = function (bot, user, channel, command) {
	if (command.name !== COMMAND_NAME)
		return;
	
	if (command.args.length < 2)
		return DESCRIPTION;
		
	if (command.args[0][0] !== '-') // Not param
		return DESCRIPTION;
	
	// Split string and parameters
	var type = command.args[0];
	command.args.shift();
	// and avoid long texts
	var text = command.args.join(' ');
	text = text.slice(0, 128);
	if (type !== '-d') {
		// encode
		return "[base64: '"+ text + "'] " + ut.base64.encode(text);
	} else {
		// decode
		return "[base64: '"+ text + "'] " + ut.base64.decode(text);
	}
	
	return "[base64] Error occurred";
};
