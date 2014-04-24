var colors = require('colors')

var debug = {
    on: false,

    log: function (message) {
        console.log('LOG: '.bold.blue + message.white);
    },

    debug: function (message) {
        console.log('DEBUG: '.bold.green + message.grey);
    },

    error: function (message) {
        console.log('ERROR: '.bold.red + message.magenta);
    },

    warning: function (message) {
        console.log('WARNING: '.bold.yellow + message.grey);
    }
}

module.exports = debug;