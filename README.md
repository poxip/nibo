# Nibo - nodejs irc bot
_nibo_ is useful IRC bot, that can be extended by creating additional __plugins__.

**License**: MIT

Full dependecies list is included in **package.json** or **requirments.txt** (with description)

# Before launching
First you have to patch **node-irc** module with *irc.js* patch, that fixes **ISO-8859-1** encoding/decoding.
Simply execute:
```
patch node_modules/irc/lib/irc.js -i irc.js.patch
```

__WIP__