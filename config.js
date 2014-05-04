var config = {
	debug: true,
	server: {
		host: 'irc.freenode.net',
		port: 6667
	},
	bot: {
		nick: 'nodejs-bot',
		userName: 'node',
		realName: 'Nibo JS Bot http://git.io/y5fYXQ'
	},
	joinOnInvite: true,
	tickTime: 1000, // Time for plugins update callback (in ms)
	channels: [],
	commandPrefix: '.', // .f Cracow
	pluginsDir: 'plugins',
	plugins: []
};

module.exports = config;