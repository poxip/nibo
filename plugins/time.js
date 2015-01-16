/** Created on Jan 15, 2015
 *  author: poxip
 *
 *  Open Movie Database plugin
 */

var util = require('util');
var Mustache = require('mustache');

var ut = require('../nibo/ut');
var debug = require('../nibo/debug');

const COORDS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const TIMEZONE_API_URL = 'https://maps.googleapis.com/maps/api/timezone/json';
const LANG = 'en_US';

exports.meta = {
    name: 'time',
    commandName: 'time',
    description: "Informs about current time at specified place. " +
                 "Usage: time <location>"
};

exports.onCommand = function (bot, user, channel, command) {
    if (command.name !== exports.meta.commandName)
        return;

    if (command.args.length < 1)
        return "[time] Location not specified";

    var city = command.args.join(' ');
    var coordsUrl = COORDS_API_URL + util.format(
            "?language=%s&address=%s&sensor=false", LANG, city
        );
    ut.https.get(coordsUrl, function (coordsData) {
        coordsData = JSON.parse(
            ut.sanitize(coordsData)
        );
        debug.debug(coordsData);
        if (coordsData.results.length < 1) {
            bot.sayToUser(channel, user.nick,
                util.format(
                    "[%s] City not found", city
                )
            );

            return;
        }

        // Get the timezone
        var timestamp = Date.now() / 1000 | 0;
        var location = coordsData.results[0].geometry.location;
        var timeUrl = TIMEZONE_API_URL + util.format(
                "?location=%s,%s&timestamp=%d",
                location.lat, location.lng, timestamp
            );
        ut.https.get(timeUrl, function (timeData) {
            timeData = JSON.parse(ut.sanitize(timeData));
            debug.debug(timeData);

            if (timeData.status !== 'OK') {
                bot.sayToUser(channel, user.nick,
                    util.format(
                        "[%s] Unable to get the timezone", city
                    )
                );
                return;
            }

            var utcTimestamp = timestamp + new Date().getTimezoneOffset()*60;
            var cityTime = new Date(
                (utcTimestamp + timeData.rawOffset + timeData.dstOffset)*1000
            );
            var pattern  = "[{{{ city }}}] {{{ time }}} {{{ id }}}";
            var output   = Mustache.render(pattern, {
                city: coordsData.results[0].formatted_address,
                time: cityTime.toLocaleTimeString(),
                id: timeData.timeZoneId
            });
            bot.sayToUser(channel, user.nick, output);
        });

    });
};