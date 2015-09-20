/** Created on 20 Sep, 2015
 *  author: poxip
 *
 *  Wolfram Alpha plugin
 */

var debug = require('../nibo/debug');
var ut = require('../nibo/ut');
var wolfram = require('wolfram').createClient("YLQ6Q4-QJWW3TX7Y3")

var COMMAND_NAME = 'w';
exports.meta = {
    name: 'Wolfram Alpha',
    commandName: COMMAND_NAME,
    description: 'Polls Wolfram Alpha for given query. Usage: w <query>'
};

exports.onCommand = function (bot, user, channel, command) {
    if (command.name !== COMMAND_NAME) {
        return;
    }

    if (command.args.length < 1) {
        return 'Query not specified.';
    }

    var query = command.args.join(' ');
    wolfram.query(query, function(err, resultData) {
        if(err) {
            bot.sayToUser(
                channel, user.nick, '[Wolfram Alpha] Unable to fetch data.'
            );
            throw err;
        }

        var result = 'No results';
        var title = query;
        try {
            result = resultData[1].subpods[0].value || result;
            result = result.replace(/\n/g, ' ');

            title = resultData[0].subpods[0].value || title;
            title = title.replace(/\n/g, ' ');
        } catch(e) {}
        var reply = ut.format('[Wolfram Alpha: \'{query}\']: {result}', {
            query: ut.short(title, 50),
            result: result
        });
        bot.sayToUser(channel, user.nick, reply);
    });

};
