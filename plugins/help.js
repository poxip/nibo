/** Created on May 7, 2014
 *  author: MrPoxipol
 */

var util = require('util');

const COMMAND_NAME = 'help';

exports.meta = {
	name: 'help',
	commandName: COMMAND_NAME,
	description: 'Simply helps!'
};

function getCommands() {
	var names = [];
	var descriptions = [];

	var plugins = module.parent.exports.plugins;
	if (!plugins) {
		return commands;
	}

	for (var i in plugins) {
		var pluginCommandName = plugins[i].meta.commandName;
		if (!pluginCommandName)
		// If plugin isn't a command
			continue;
		// Otherwise

		var pluginDescription = plugins[i].meta.description;
		names.push(pluginCommandName);
		descriptions.push(pluginDescription);
	}

	var result = {
		names: names,
		descriptions: descriptions
	};

	return result;
}

function getCommandDescription(commandName) {
	var commands = getCommands();
	var index = commands.names.indexOf(commandName);

	if (index === -1) {
		return;
	}

	return commands.descriptions[index];
}

function getListOfCommands() {
	var names = getCommands().names;

	names.toString = function () {
		return (this.length > 0 ? this.join(', ') : 'No one knows');
	};

	return names;
}

exports.onCommand = function (bot, user, channel, command) {
	if (channel.indexOf('*') !== -1)
		return;

	if (command.name !== COMMAND_NAME)
		return;
	// !help
	var avCommands = getListOfCommands(bot);
	if (command.args.length < 1) {
		var message = util.format('[help] Available commands: %s. Say help command_name for description of command',
			avCommands.toString()
		);

		return message;
	} else {
		var name = command.args[0];
		if (avCommands.indexOf(name) == -1) {
			return util.format("[%s] Command not found", name);
		}

		var description = getCommandDescription(name);
		return util.format(
			'[%s] %s', name,
			description ? description : "No description found"
		);
	}
};
