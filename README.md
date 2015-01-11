# Nibo - nodejs irc bot
_nibo_ is useful IRC bot, that can be extended by creating additional __plugins__.

**License**: MIT

Full dependecies list is included in **package.json** file.

## Installation
Simply execute:
```
$ npm install
```
### Build Requirments
* NodeJS Environment

## Running
Be sure, that you have installed [NodeJS](http://nodejs.org). Check the **Build Requirments** section for more.

Just run:
```
$ node nibo.js --config=config-file --debug 
```
**Debug** option is optional, set it if you want to see debug messages.

## Creating your own plugins
Plugins are files written in NodeJS, which extends the bot's functionality. They are able to access bot's IRC event, such as joining to the channel, saying something, and so on. Check the wiki for simple how to!

### Useful stuff
* [Creating your own plugins](https://github.com/MrPoxipol/nibo/wiki/Creating-plugins)
* [Avaiable config options](https://github.com/MrPoxipol/nibo/wiki/Config-options)

Looking for live __nibo__? Check out __#nibo__ on Freenode!
