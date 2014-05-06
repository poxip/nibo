/** Created on May 5, 2014
 *  author: MrPoxipol
 */
'use strict';
// Modules
var fs = require('fs');
var util = require('util');
var debug = require('./debug');

var configPath_default = './config.json';
var config = {
	debug: false,
	server: {
		host: 'irc.freenode.net',
		port: 6667
	},
	bot: {
		nick: 'nodejs-bot',
		userName: 'node',
		realName: 'Nibo JS Bot http://git.io/y5fYXQ'
	},
	joinOnInvite: true,
	tickTime: 1000, // Time for plugins update callback (in ms)
	channels: [],
	commandPrefix: '.', // .f Cracow
	pluginsDir: './plugins', // absolute path - main directory!
	plugins: []
};

function showConfigLoadError() {
	debug.warning('Unable to load config file');
}

function _loadConfig(configPath) {
	// plain version
	var file;
	try {
		file = fs.readFileSync(configPath);
	} catch (e) {
		if (e.code === 'ENOENT') {
			return "Specified config file does not exist";
		}

		// Catch other errors
		return "Error occurred while loading config file!\n" + (new Error().stack);
	}

	var parsedConfig;
	// Parse json
	try {
		parsedConfig = JSON.parse(file);
	} catch (err) {
		// Parsing error
		return "Config parsing error occurred: " + err.name + '\n' + (new Error().stack);
	}
	// Set up only these variables, which are set in config file
	for (var key in parsedConfig) {
		var parsedVar = parsedConfig[key];
		var debugMsg = util.format('config[%s] => %s', key, util.inspect(parsedVar));
		debug.debug(debugMsg);

		// fak u h4x0rs
		if (typeof config[key] === 'function')
			continue;

		config[key] = parsedVar;
		// {foo: {a: 'bar'}} support
		if (parsedVar.length > 1)
			for (var sub in parsedVar) {
				config[key][sub] = parsedVar[sub];
			}
	}

	// Clear code
	return undefined;
}

config.loadConfig = function (configPath) {
	debug.log('Config is loaded now');
	if (!configPath)
		configPath = configPath_default;

	var error = _loadConfig(configPath);
	if (!error) {
		// Config loaded
		debug.success('Config loaded');
		return true;
	}

	var msg = util.format('Unable to load config file \'%s\'', configPath);
	debug.warning(msg);
	debug.warning(error);

	return false;
};

module.exports = config;
