/** Created on 24 Jun, 2014
 *  author: MrPoxipol
 *
 *    Utile functions.
 */

// @TODO: Write tests for utiles module
var http  = require('http');
var https = require('https');
var S	  = require('string');

var ut = {};
/**
 *    Cuts the string to specified length (to first space from right)
 *    @param {string} str - string to be shorten
 *    @param {int} maxLength - maximal length of shorted string. Default: 250.
 *    @param {boolean} addDots - defines that the elipsis (..) and (more) should be added
 *                               at end of the shorted string. Default: true
 *    @return shorted string
 */
ut.short = function (str, maxLength, addDots) {
	if (!maxLength) {
		maxLength = 250;
	}

	if (typeof addDots === 'undefined') {
		addDots = true;
	}

	if (str.length < maxLength)
		return str;

	str = str.substr(0, maxLength);
	var wordWrap = str.lastIndexOf(' ');
	if (wordWrap == -1) wordWrap = maxLength;

	str = str.substr(0, wordWrap);

	if (addDots) {
		str += '.. (more).';
	}

	return str;
};

ut.base64 = {};
/**
 * Uses Base64 to encode given string
 * @param {string} str - A string to be encoded
 * @returns {string} Encoded string
 */
ut.base64.encode = function (str) {
	var buff = new Buffer(str, 'utf8');
	return buff.toString('base64');
};

/**
 * Uses Base64 to decode given string
 * @param {string} str - A string to be decoded
 * @returns {string} Decoded string
 */
ut.base64.decode = function (str) {
	var buff = new Buffer(str, 'base64');
	return buff.toString('utf8');
};

/**
 * Removes HTML entities and trims the string
 * @param {string} str - A string to be sanitized
 * @returns {string}
 */
ut.sanitize = function (str) {
	return S(str).decodeHTMLEntities().s;
};

/**
 * Http utilities, for SSL support use https
 */
ut.http = {};

/**
 * Make HTTP(S) request using specified protocol
 * @param {Object}  type - http/https module (require('http') or 'https')
 * @param {string}  url  - A url to make request
 * @param {funtion} callback - A callback to be called on response
 */
function makeRequest(type, url, callback) {
	type.get(url, function (response) {
		var responseParts = [];
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			responseParts.push(chunk);
		});
		response.on('end', function () {
			var data = responseParts.join('');
			if (callback) {
				callback(data);
			}
		});
	}).on('error', function (err) {
		throw err;
	});
}

/**
 * Asynchronus http get request function
 * @param {string} url - A url to make a request
 * @param {function} [callback] - Optional callback function
 *                                to be called on request success - callback(data)
 * @throws http.Error on any error
 */
ut.http.get = function (url, callback) {
	makeRequest(http, url, callback);
};

/**
 * Https utilitiess
 */
ut.https = {};

/**
 * Same as ut.http.get but for SSL
 * @param {string} url - A url to make a request
 * @param {function} [callback] - Optional callback function
 *                                to be called on request success - callback(data)
 * @throws https.Error on any error
 */
ut.https.get = function (url, callback) {
	makeRequest(https, url, callback);
};

module.exports = ut;