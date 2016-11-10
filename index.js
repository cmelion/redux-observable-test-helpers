'use strict';

var ajaxHelper = require('./lib/ajax-helper');
var expectEpic = require('./lib/epic-helper').default;

var indirect = {
    call:  (fn, ...args) => fn(...args)
};

exports.MockWebSocket = ajaxHelper.MockWebSocket;
exports.MockXMLHttpRequest = ajaxHelper.MockXMLHttpRequest;
exports.expectEpic = expectEpic;
exports.indirect = indirect;
