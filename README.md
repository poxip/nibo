# Nibo - nodejs irc bot [![Build Status](https://travis-ci.org/poxip/nibo.svg)](https://travis-ci.org/poxip/nibo)
_nibo_ - extensible IRC bot written in NodeJS

## Installation
Simply execute:
```
$ npm install
```
### Build Requirments
* NodeJS Environment

Full dependecies list is included in **package.json** file.
## Running
Be sure, that you have installed [NodeJS](http://nodejs.org).
Then just execute:
```
$ ./runnibo --config=config-file --debug
```
**Debug** option is optional, set it if you want to see debug messages.

#### Problems with node-irc and Iconv
Currently [node-irc](https://github.com/martynsmith/node-irc) module has a lot of bugs and one of them is a problem with charset conversion (such as `Error: Conversion not supported.`), at the moment the only way to fix it is to downgrade _node-irc_ to version __0.3.7__ (the problem exists on _node-irc >= 0.3.8_). Of course this might cause other problems like broken unicode support, but the bot will work at least (_Welcome to NodeJS world, my friend!_).

## Creating plugins
Plugins are NodeJS modules, which extends bot's functionality. A plugin is able to access bot's IRC events, such __as joining to the channel, saying something, and so on.__ [Check the wiki](https://github.com/MrPoxipol/nibo/wiki/Creating-plugins) for a simple how to!
### Useful stuff
* [Creating your own plugins](https://github.com/poxip/nibo/wiki/Creating-plugins)
* [Avaiable config options](https://github.com/poxip/nibo/wiki/Config-options)

Looking for live __nibo__? Check out __#nibo__ on Freenode!
### License
```
The MIT License (MIT)

Copyright (c) 2014,2015 Michal Proszek

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
