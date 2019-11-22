# eventlistener

Just a very simple wrapper around addEventListener with a stupid fallback to attachEvent. Does not handle the differences in Internet Exploreŕs events VS standard events.

Uses Universal Module Definition, so works with *AMD*, *CommonJS* or exposed as *window.eventListener*.

[![Build Status](https://api.travis-ci.org/finn-no/eventlistener.png)](https://travis-ci.org/finn-no/eventlistener)
[![NPM](https://nodei.co/npm/eventlistener.png?stars=true&downloads=true)](https://npmjs.org/package/eventlistener)

## API

    var eventListener = require('eventlistener');
    function onLoad(evt) {};
    eventListener.add(window, 'load', onLoad);
    eventListener.remove(window, 'load', onLoad);

    var el = document.getElementById('test');
    eventListener.add(el, 'click', function (evt) {});