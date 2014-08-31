/** Created on Jun 24, 2014
 *  author: MrPoxipol
 *
 *	The urlspy plugin, that provides functionality
 * 	related to URLs spoken by users on IRC channel.
 */

var URL_REGEXP = new RegExp(/^((https?\:\/\/)|(www\.))(\w+\.)*\w+(\/[^\s\/]+)*\/?-*$/, 'i');

exports.onMessage = function (bot, channel, user, message) {
	// Match first link (we don't want to have mess on channel)
	var link = message.match(URL_REGEXP);
	if (!link) {
		return;
	}
	
	
}

function handleRegularPage()