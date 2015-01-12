/** Created on 24 Jun, 2014
 *  author: MrPoxipol
 *
 *	Utiles fuctions.
 */

// @TODO: Write tests for utiles module

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

module.exports = ut;