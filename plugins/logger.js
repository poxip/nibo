var fs = require('fs');
var path = require('path');
var util = require('util');
var mkdirp = require('mkdirp');

// Config
exports.meta = {
    name: 'logger',
    description: 'Logs all conversations on channels'
}

// Plugin private variables and functions
logDir = 'log';
me = 'me'; // For LOG

function getDirPath(channel) {
    return path.join('./', logDir, channel);
}

function writeToFile(channel, who, message) {
    var date = new Date();
    var fileName = util.format('%s_%s_%s.txt',
        date.getUTCFullYear(),
        date.getUTCMonth() + 1, // Month +1 because Jan = 0, Feb = 1
        date.getUTCDate()
    );
    var text = util.format('%s:%s <%s> %s',
        date.getUTCHours(),
        date.getUTCMinutes(),
        who,
        message
    );

    fs.appendFileSync(getDirPath(channel) + '/' + fileName, text);
}

exports.onPluginInit = function () {

};

exports.onBotJoin = function (channel) {
    // Create channel folder
    // If folder named channel doesn't exit create it 
    var dirPath = path.join('./', logDir, channel);
    if (!fs.existsSync(dirPath)) {
        mkdirp.sync(dirPath);
    }

    writeToFile(channel, me, '[JOINED] to the channel ' + channel);
};