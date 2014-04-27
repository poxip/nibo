var fs = require('fs');
var path = require('path');
var util = require('util');
var mkdirp = require('mkdirp');

var config = require('../config.json');

// Config
exports.meta = {
	name: 'logger',
	description: 'Logs all conversations on channels'
}

// Plugin private variables and functions
logDir = 'log';
me = util.format('%s/me', config.bot.nick); // For LOG

function getDirPath(channel) {
	return path.join('./',
		logDir,
		config.server.host,
		channel
	);

	// log/server/channel
}

function addLeadingZero(date) {
	if (date < 10)
		return '0' + date;

	return date;
}

function writeToFile(channel, who, message) {
	var date = new Date();
	var fileName = util.format('%s_%s_%s.txt',
		date.getUTCFullYear(),
		date.getUTCMonth() + 1, // Month +1 because Jan = 0, Feb = 1
		date.getUTCDate()
	);
	var text = util.format('%s:%s <%s> %s',
		addLeadingZero(date.getUTCHours()),
		addLeadingZero(date.getUTCMinutes()),
		who,
		message
	);

	// Add new line to the file
	text += '\n';
	fs.appendFileSync(getDirPath(channel) + '/' + fileName, text);
}

exports.onPluginInit = function () {

};

exports.onBotJoin = function (channel) {
	// Create channel folder
	// If folder named channel doesn't exit create it 
	var dirPath = getDirPath(channel);
	if (!fs.existsSync(dirPath)) {
		mkdirp.sync(dirPath);
	}

	writeToFile(channel, me, '[JOINED] to the channel ' + channel);
};

exports.onUserJoin = function (channel, user) {
	writeToFile(channel, user, '[JOINED] to the channel ' + channel);
}