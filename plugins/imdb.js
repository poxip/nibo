/** Created on 13 Jan, 2015
 *  author: poxip
 *
 *  Open Movie Database plugin
 */

var util = require('util');
var S = require('string');
var Mustache = require('mustache');

var ut = require('../nibo/ut');

const COMMAND_NAME = 'imdb';
const API_URL = 'http://www.omdbapi.com/';

exports.meta = {
    name: 'imdb',
    commandName: COMMAND_NAME,
    description: "Polls Open Movie Database for specified movie. " +
    "Usage: imdb <movie> (<year>) -- year is optional"
};

exports.onCommand = function (bot, user, channel, command) {
    if (command.name !== COMMAND_NAME)
        return;

    if (command.args.length < 1)
        return "Movie not specified";

    var re = /([^\(]*)(?:\((\d+)\))?/;
    var matches = re.exec(command.args.join(' '));
    if (!matches)
        return "Movie not specified";

    var movie = {};
    movie.title = matches[1].trim();
    movie.year = matches[3];
    if (!movie.year)
        movie.year = '';

    var url = API_URL + util.format(
            "?plot=short&t=%s&y=%s", movie.title, movie.year
        );
    ut.http.get(url, function (data) {
        data = JSON.parse(
            S(data).decodeHTMLEntities().s
        );
        if (!data['Title']) {
            if (!data['Error'])
                data['Error'] = "[imdb] Could not find specified movie.";

            bot.sayToUser(channel, user.nick,
                util.format("[%s] %s",
                    movie.title,
                    data['Error']
                )
            );
            return;
        }

        var pattern = "[{{{ Title }}} ({{{ Year }}}, " +
            "{{{ Country }}}) {{{ Genre }}}/{{{ Type }}}] " +
            "{{{ imdbRating }}}/10 - Starring: {{{ Actors }}}: {{{ Plot }}} " +
            "http://imdb.com/title/{{ imdbID }}";
        var output = Mustache.render(pattern, data);
        bot.sayToUser(channel, user.nick, output);
    });
};