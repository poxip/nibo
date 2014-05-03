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
	botSay: 'onBotSay'
};

module.exports = events;