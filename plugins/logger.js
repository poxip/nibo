var fs = require('fs');
var path = require('path');
var util = require('util');
var mkdirp = require('mkdirp');
var mustache = require('mustache');

var config = require('../config.json');
var debug = require('../debug');

// Config
exports.meta = {
	name: 'logger',
	description: 'Logs all conversations on channels'
};

// Plugin private variables and functions
var logDir = 'log';
var me = util.format('%s/me', config.bot.nick); // For LOG

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

function getFileName() {
	var date = new Date();
	var fileName = util.format('%s_%s_%s.txt',
		date.getUTCFullYear(),
		date.getUTCMonth() + 1, // Month +1 because Jan = 0, Feb = 1
		date.getUTCDate()
	);

	return fileName;
}

function writeToFile(channel, who, message) {
	var date = new Date();
	var fileName = getFileName();
	var text = util.format('%s:%s <%s> %s',
		addLeadingZero(date.getUTCHours()),
		addLeadingZero(date.getUTCMinutes()),
		who,
		message
	);

	// Add new line to the file
	text += '\n';
	fs.appendFileSync(getDirPath(channel) + '/' + fileName, text);

	// LOG THAT
	debug.log(text);
}

exports.onPluginInit = function (bot) {

};

exports.onBotJoin = function (bot, channel) {
	// Create channel folder
	// If folder named channel doesn't exit create it 
	var dirPath = getDirPath(channel);
	if (!fs.existsSync(dirPath)) {
		mkdirp.sync(dirPath);
	}

	writeToFile(channel, me, '[JOINED] to the channel ' + channel);
};

exports.onTopic = function (bot, channel, topic, user, message) {
	var pattern = '** Topic for {{&channel}}: {{&topic}} by {{&name}}\n';
	var data = {
		channel: channel,
		topic: topic,
		name: user.name
	};
	var output = mustache.render(pattern, data);

	var fileName = getFileName();
	fs.appendFileSync(getDirPath(channel) + '/' + fileName, output);

	debug.log(output);
};

exports.onUserJoin = function (bot, channel, user) {
	var fullName = util.format('%s!%s@%s',
		user.nick,
		user.username,
		user.host
	);
	writeToFile(channel, fullName, '[JOINED] to the channel ' + channel);
};

exports.onMessage = function (bot, user, to, text, message) {
	writeToFile(to, user.nick, message);
};

exports.onUserNickChange = function (bot, user, channels) {
	for (var i in channels) {
		var pattern = '** {{&oldnick}} is known as {{&newnick}}\n';
		var data = {
			oldnick: user.oldnick,
			newnick: user.nick
		};
		var output = mustache.render(pattern, data);

		var dirPath = getDirPath(channels[i]);
		var fileName = getFileName();
		fs.appendFileSync(dirPath + '/' + fileName, output);

		debug.log(output);
	}
};