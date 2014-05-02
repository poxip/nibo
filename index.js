// Useful modules
var path = require('path');
var util = require('util');
// Mustache - easy string templates
var mustache = require('mustache');
// **Kwargs
var kwargs = require('kwargs');
// useful debug functions
var debug = require('./debug');

var irc = require('irc');
var config = require('./config.json');

var plugins = [];

// Some config
debug.on = config.debug;

// Inform about error
function showPluginRuntimeError(pluginName, method, exception) {
	var data = {
		plugin: pluginName,
		message: exception.message,
		method: method
	};

	var pattern = 'Module {{&plugin}} runtime error: {{&message}} in {{&method}}';
	var output = mustache.render(pattern, data);
	debug.error(output);
}

function initPlugins() {
	for (var i in config.plugins) {
		var pluginPath = './' +
			path.join(config.plugins_conf.dir, config.plugins[i]);

		debug.debug('Plugin ' + config.plugins[i] + ' path: ' + pluginPath);

		var tempPlugin;

		try {
			tempPlugin = require(pluginPath);
		} catch (e) {
			var data = {
				plugin: config.plugins[i],
				message: e.message
			};

			var pattern = 'Module {{&plugin}} load error: {{&message}}';
			var output = mustache.render(pattern, data);
			debug.error(output);

			// If module name is wrong don't add that
			continue;
		}

		debug.success('Module: ' + config.plugins[i] + ' loaded');
		plugins.push(tempPlugin);

		// Init event
		plugins[i].onPluginInit(bot);
	}

	if (plugins.length > 0) {
		var messageToLog = util.format('Loaded %s modules of %s',
			plugins.length,
			config.plugins.length
		);
		debug.success(messageToLog);
	} else {
		debug.warning('No module of ' + config.plugins.length + ' loaded');
	}
}

var events = {
	botJoin: 'onBotJoin',
	topic: 'onTopic',
	userJoin: 'onUserJoin',
	message: 'onMessage',
	nick: 'onUserNickChange',
	part: 'onUserPart',
	quit: 'onUserQuit'
};

function executeCallback(eventName, args) {
	args.bot = bot;
	for (var i in plugins) {
		try {
			kwargs(plugins[i][eventName], args);
		} catch (e) {
			showPluginRuntimeError(plugins[i].meta.name, eventName + '()', e);
		}
	}
}

// Start bot = main function
debug.log('Bot is starting up at the moment..');

var bot = new irc.Client(
	config.server.host,
	config.bot.nick, {
		port: config.server.port,
		channels: config.channels
	}
);

initPlugins();

bot.getUser = function (message) {
	if (!message) {
		debug.warning('bot.getUser() requires 1 argument, 0 given');
		return;
	}

	var user = {
		nick: message.nick,
		username: message.user,
		host: message.host,
		fullName: util.format('%s!%s@%s',
			message.nick,
			message.user,
			message.host
		)
	};

	// The object may be incomplete

	return user;
};

bot.addListener('topic', function (channel, topic, nick, message) {
	/*
		If bot joins 		nick = full user name e.g 'niboman!~op@ophost.eu'
		If op changes topic nick = op nick		  e.g 'niboman'
	*/

	var args = {
		channel: channel,
		topic: topic,
		nick: nick,
		message: message
	};

	executeCallback(events.topic, args);
});

bot.addListener('join', function (channel, nick, message) {
	if (nick == bot.nick) {
		executeCallback(events.botJoin, {
			channel: channel
		});
		return;
	}
	var user = bot.getUser(message);

	// If user join to the channel
	executeCallback(events.userJoin, {
		channel: channel,
		user: user
	});
});

bot.addListener('message', function (nick, to, text, message) {
	var user = bot.getUser(message);
	var args = {
		user: user,
		to: to,
		text: text,
		message: message.args[1]
	};

	executeCallback(events.message, args);
});

bot.addListener('nick', function (oldnick, newnick, userChannels, message) {
	var user = bot.getUser(message);
	user.nick = newnick; // nick is newnick!
	user.oldnick = oldnick;

	var args = {
		user: user,
		channels: userChannels,
	};

	executeCallback(events.nick, args);
});

bot.addListener('part', function (channel, nick, reason, message) {
	var user = bot.getUser(message);
	var args = {
		channel: channel,
		user: user,
		reason: reason
	};

	executeCallback(events.part, args);
});

bot.addListener('quit', function (nick, reason, channels, message) {
	var user = bot.getUser(message);
	var args = {
		user: user,
		channels: channels,
		reason: reason
	};

	executeCallback(events.quit, args);
});