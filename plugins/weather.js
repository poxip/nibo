/** Created on May 6, 2014
 *  author: MrPoxipol
 */

var util = require('util');
// Templates module
var Mustache = require('mustache');

var ut = require('../nibo/ut');
var debug = require('../nibo/debug');

const COMMAND_NAME = 'weather';
// pattern for util.format()
const API_URL_PATTERN = 'http://api.openweathermap.org/data/2.5/weather?q=%s&lang=eng';

exports.meta = {
	name: 'weather',
	commandName: COMMAND_NAME,
	description: "Fetches actual weather conditions from openweathermap.org " +
				 "at specific place on the Earth. " +
				 "Usage: weather <location>"
};

function kelvinsToCelcius(temperature) {
	return Math.round(temperature - 273.15);
}

function calcWindChill(temperature, windSpeed) {
	if (temperature < 10 && (windSpeed / 3.6) >= 1.8) {
		var windChill = (13.12 + 0.6215 * temperature - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temperature * Math.pow(windSpeed, 0.16));
		windChill = Math.round(windChill);
	}

	return null;
}

function getWeatherFromJson(data) {
	var parsedJson;
	try {
		parsedJson = JSON.parse(data);
	} catch (e) {
		debug.debug('JSON parsing error');
		return;
	}

	var weather = {
		city: parsedJson.name
	};
	if (!weather.city) {
		return;
	}

	weather.country = parsedJson.sys.country;
	weather.temp = kelvinsToCelcius(parsedJson.main.temp);
	weather.description = parsedJson.weather[0].description;
	weather.windSpeed = parsedJson.wind.speed;
	weather.pressure = Math.round(parsedJson.main.pressure);
	weather.windChill = calcWindChill(weather.temp, weather.windSpeed);

	var pattern;
	if (weather.windChill !== null)
		pattern = '[{{&city}}, {{&country}}] {{&temp}}°C (felt as {{&windChill}}°C) - {{&description}}, {{&pressure}} hPa';
	else
		pattern = '[{{&city}}, {{&country}}] {{&temp}}°C - {{&description}}, {{&pressure}} hPa';

	var output = Mustache.render(pattern, weather);

	return output;
}

function sendResponse(bot, args, message) {
	bot.sayToUser(args.channel, args.user.nick, message);
}

function fetchWeather(bot, args) {
	args.place = encodeURIComponent(args.place);
	var url = util.format(API_URL_PATTERN, args.place);

	try {
		ut.http.get(url, function (data) {
			var message = getWeatherFromJson(data);
			if (message) {
				sendResponse(bot, args, message);
			} else {
				sendResponse(bot,
					args,
					util.format('[%s] Could not find weather information.', decodeURIComponent(args.place))
				);
			}
		});
	} catch (e) {
		debug.error('HTTP ' + e.message);
		sendResponse(bot, args, '[] Weather is not available at the moment.');
	}
}

exports.onCommand = function (bot, user, channel, command) {
	if (command.name !== COMMAND_NAME)
		return;

	if (command.args.length < 1)
		return;

	var args = {
		user: user,
		channel: channel,
		place: command.args.join(' ')
	};
	fetchWeather(bot, args);
};