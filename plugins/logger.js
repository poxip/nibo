/** Created on Apr 24, 2014
 *  author: MrPoxipol
 */

var fs = require('fs');
var path = require('path');
var util = require('util');
var mkdirp = require('mkdirp');
var mustache = require('mustache');

var config = require('../nibo/config');
var debug = require('../nibo/debug');

// Config
exports.meta = {
	name: 'logger',
	description: 'Logs all conversations on channels'
};

// Plugin private variables and functions
var logDir = 'log';
var me = util.format('%s/me', config.bot.nick); // For LOG

function addLeadingZero(date) {
	if (date < 10)
		return '0' + date;

	return date;
}

function getDirPath(channel, nocreate) {
	var dirPath = path.join('./',
		logDir,
		config.server.host,
		channel
	);

	if (!nocreate) {
		if (!fs.existsSync(dirPath)) {
			mkdirp.sync(dirPath);
		}
	}

	return dirPath;
	// log/server/channel // channel or nick
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

function appendToFile(fileName, str) {
	var date = new Date();
	var time = util.format('%s:%s',
		addLeadingZero(date.getUTCHours()),
		addLeadingZero(date.getUTCMinutes())
	);
	var output = time + ' ' + str;

	debug.log(output);
	output += '\n';

	fs.appendFileSync(fileName, output);
}

function writeToFile(channel, who, message) {
	var date = new Date();
	var fileName = getFileName();
	var text = util.format('<%s> %s',
		who,
		message
	);

	appendToFile(getDirPath(channel) + '/' + fileName, text);
}

exports.onBotJoin = function (bot, channel) {
	// Create channel folder
	// If folder named channel doesn't exit create it 
	var dirPath = getDirPath(channel);

	writeToFile(channel, me, '[JOINED] to the channel ' + channel);
};

exports.onTopic = function (bot, channel, topic, nick) {
	var pattern = '** Topic for {{&channel}}: {{&topic}} by {{&nick}}';
	var data = {
		channel: channel,
		topic: topic,
		nick: nick,
	};
	var output = mustache.render(pattern, data);

	var fileName = getFileName();
	appendToFile(getDirPath(channel) + '/' + fileName, output);
};

exports.onUserJoin = function (bot, channel, user) {
	writeToFile(channel, user.fullName, '[JOINED] to the channel ' + channel);
};

exports.onMessage = function (bot, user, channel, text, message) {
	writeToFile(channel, user.nick, message);
};

exports.onUserNickChange = function (bot, user, channels) {
	for (var i in channels) {
		var pattern = '** {{&oldnick}} is known as {{&newnick}}';
		var data = {
			oldnick: user.oldnick,
			newnick: user.nick
		};
		var output = mustache.render(pattern, data);

		var dirPath = getDirPath(channels[i]);
		var fileName = getFileName();
		appendToFile(dirPath + '/' + fileName, output);
	}
};

exports.onUserPart = function (bot, channel, user, reason) {
	var pattern = '** {{&fullName}} left the channel {{&channel}}';
	if (reason)
		pattern += ' ({{&reason}})';

	var data = {
		fullName: user.fullName,
		channel: channel,
		reason: reason
	};
	var output = mustache.render(pattern, data);

	var dirPath = getDirPath(channel);
	var fileName = getFileName();
	appendToFile(dirPath + '/' + fileName, output);
};

exports.onUserQuit = function (bot, user, channels, reason) {
	for (var i in channels) {
		var pattern = '** {{&fullName}} left the channel {{&channel}}';
		if (reason)
			pattern += ' (Quit: {{&reason}})';

		var data = {
			fullName: user.fullName,
			channel: channels[i],
			reason: reason
		};
		var output = mustache.render(pattern, data);

		var dirPath = getDirPath(channels[i]);
		var fileName = getFileName();
		appendToFile(dirPath + '/' + fileName, output);
	}
};

exports.onUserKick = function (bot, nick, by, channel, reason) {
	var pattern = '** {{&nick}} was kicked by {{&by}}';
	if (reason)
		pattern += ' ({{&reason}})';

	var data = {
		nick: nick,
		by: by,
		reason: reason
	};
	var output = mustache.render(pattern, data);

	var dirPath = getDirPath(channel);
	var fileName = getFileName();
	appendToFile(dirPath + '/' + fileName, output);
};

exports.onMode = function (bot, channel, by, mode, target) {
	var pattern = '** MODE {{&channel]} {{&mode}}';
	if (target)
		pattern += ' {{&target}}';

	if (by)
		pattern += ' by {{&by}}';

	var data = {
		channel: channel,
		mode: mode,
		target: target,
		by: by
	};
	var output = mustache.render(pattern, data);

	var dirPath = getDirPath(channel);
	var fileName = getFileName();
	appendToFile(dirPath + '/' + fileName, output);
};

exports.onNotice = function (bot, channel, to, text) {
	if (!channel) {
		debug.log(to + ' ' + text);
		return;
	}

	var pattern = '** NOTICE {{&channel}}: {{&message}}';
	var data = {
		channel: channel,
		message: text
	};
	var output = mustache.render(pattern, data);

	var dirPath = getDirPath(to);
	var fileName = getFileName();
	appendToFile(dirPath + '/' + fileName, output);
};

exports.onCommand = function (bot, user, channel, command) {
	// Log it
	var message = util.format('%s%s %s',
		config.commandPrefix,
		command.name,
		command.args.join(' ')); // '!seen nibo'

	writeToFile(channel, user.nick, message);

	// return 'some to user who send me command' -> <nibo/me> userwhichsendthatcommand: blabal some to user who send me commands
};

exports.onBotSay = function (bot, channel, message) {
	writeToFile(channel, me, message);
};