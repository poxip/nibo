var irc = require('irc');
var config = require('./config.json')

var plugins = {};



var bot = new irc.Client(
    config.server.host,
    config.bot.nick, {
        port: config.server.port,
        channels: config.channels
    }
);

bot.addListener('join', function (channel, who) {
    if (who == config.bot.nick)
        return

    bot.say(channel, 'Welcome ' + who + ' to the ' + channel + '!');
});