/** Created on May 6, 2014
 *  author: MrPoxipol
 */

var http = require('http');
var util = require('util');
// Templates module
var Mustache = require('mustache');
var S = require('string');

var debug = require('../nibo/debug');

const COMMAND_NAME = 'ud';
// pattern for util.format()
const TERM_API_URL_PATTERN = 'http://api.urbandictionary.com/v0/define?term=%s';
const RANDOM_API_URL = 'http://api.urbandictionary.com/v0/random';

const DESCRIPTION_MAX_LEN = 250;

exports.meta = {
	name: 'urban-dictionary',
	commandName: COMMAND_NAME,
	description: 'Polls UrbanDictionary for given phrase. Returns random definition when the term is not specified'
};

function shorten(str) {
	/** Shortens string*/
	if (str.length < DESCRIPTION_MAX_LEN)
		return str;

	str = str.substr(0, DESCRIPTION_MAX_LEN);
	var wordWrap = str.lastIndexOf(' ');
	if (wordWrap == -1) wordWrap = DESCRIPTION_MAX_LEN;

	str = str.substr(0, wordWrap) + '..';
	return str;
}

function getDefFromJson(data) {
	var parsedJson;
	try {
		parsedJson = JSON.parse(data);
	} catch (e) {
		debug.debug('JSON parsing error');
		return;
	}

	if (parsedJson.list.length < 1) {
		return;
	}

	var first = parsedJson.list[0];

	var term = {};
	term.id = first.defid;
	term.link = first.permalink;
	term.word = first.word;
	term.definition = shorten(first.definition);
	term.example = shorten(first.example);
	term.upvotes = first.thumbs_up;
	term.downvotes = first.thumbs_down;

	var pattern = '[#{{&id}}|{{&word}}] {{&upvotes}}/{{&downvotes}} - {{&definition}}|Example: {{&example}} ({{&link}})';
	var output = Mustache.render(pattern, term);
	// Remove \r\n
	output = S(output).collapseWhitespace().s;

	return output;
}

function sendResponse(bot, args, message) {
	bot.sayToUser(args.channel, args.user.nick, message);
}

function fetchTerm(bot, args, random) {
	args.term = encodeURIComponent(args.term);
	var url = util.format(TERM_API_URL_PATTERN, args.term);

	if (random) {
		url = RANDOM_API_URL;
	}

	http.get(url, function (response) {
		var responseParts = [];
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			responseParts.push(chunk);
		});
		response.on('end', function () {
			var data = responseParts.join('');
			var message = getDefFromJson(data);
			if (message) {
				sendResponse(bot, args, message);
			} else {
				sendResponse(bot,
					args,
					util.format('[%s] Could not find definition for given phrase.', decodeURIComponent(args.term))
				);
			}
		});
	}).on('error', function (e) {
		debug.error('HTTP ' + e.message);
		sendResponse(bot, args, '[] UrbanDictionary is not available at the moment.');
	});
}

exports.onCommand = function (bot, user, channel, command) {
	if (command.name !== COMMAND_NAME)
		return;

	var random = false;
	if (command.args.length < 1) {
		// Random switch!
		random = true;
	}

	var args = {
		user: user,
		channel: channel,
		term: command.args.join(' '),
	};
	fetchTerm(bot, args, random);
};