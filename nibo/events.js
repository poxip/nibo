/** Created on May 03, 2014
 *  author: MrPoxipol
 */

var events = {
    init: 'onPluginInit',
    botJoin: 'onBotJoin',
    topic: 'onTopic',
    userJoin: 'onUserJoin',
    message: 'onMessage',
    command: 'onCommand',
    nick: 'onUserNickChange',
    part: 'onUserPart',
    quit: 'onUserQuit',
    kick: 'onUserKick',
    mode: 'onMode',
    notice: 'onNotice',
    botSay: 'onBotSay',
    tick: 'onUpdate'
};

module.exports = events;