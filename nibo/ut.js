/** Created on 24 Jun, 2014
 *  author: MrPoxipol
 *
 *	Utiles fuctions.
 */

exports.short = function (str, maxLength, addDots) {
	/** @function utiles.short
	 *	Cuts the string to specified length (to first space from right)
	 *	@param {String} string to short
	 *	@param {int} maximal length of shorted string. <b>Default: 250.</b>
	 *	@param {boolean} defines that the elipsis (..) and (more) should be added on end of the shorted string. <b>Default: true</b>
	 *	\return shorted string.
	*/

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
}