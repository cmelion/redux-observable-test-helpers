(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("rxjs"), require("sinon"), require("redux-observable"));
	else if(typeof define === 'function' && define.amd)
		define("epicHelper", ["rxjs", "sinon", "redux-observable"], factory);
	else if(typeof exports === 'object')
		exports["epicHelper"] = factory(require("rxjs"), require("sinon"), require("redux-observable"));
	else
		root["epicHelper"] = factory(root["rxjs"], root["sinon"], root["redux-observable"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.indirect = exports.MockXMLHttpRequest = exports.expectEpic = undefined;
	
	var _ajaxHelper = __webpack_require__(1);
	
	var _epicHelper = __webpack_require__(2);
	
	var _epicHelper2 = _interopRequireDefault(_epicHelper);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var indirect = {
	    call: function call(fn) {
	        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	            args[_key - 1] = arguments[_key];
	        }
	
	        return fn.apply(undefined, args);
	    }
	};
	
	exports.expectEpic = _epicHelper2.default;
	exports.MockXMLHttpRequest = _ajaxHelper.MockXMLHttpRequest;
	exports.indirect = indirect;
	exports.default = {
	    MockWebSocket: _ajaxHelper.MockWebSocket,
	    MockXMLHttpRequest: _ajaxHelper.MockXMLHttpRequest,
	    expectEpic: _epicHelper2.default,
	    indirect: indirect
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Utility classes helpful for testing AJAX calls, especially those made as side effects of
	 * Redux actions/epics.  Used by tests in Tavern-Client and Raven-Client.
	 */
	"use strict";
	
	var MockWebSocket = function () {
	    function MockWebSocket(url, protocol) {
	        this.url = url;
	        this.protocol = protocol;
	        this.sent = [];
	        this.handlers = {};
	        this.readyState = 0;
	        MockWebSocket.sockets.push(this);
	    }
	    Object.defineProperty(MockWebSocket, "lastSocket", {
	        get: function get() {
	            var socket = MockWebSocket.sockets;
	            var length = socket.length;
	            return length > 0 ? socket[length - 1] : undefined;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    MockWebSocket.clearSockets = function () {
	        MockWebSocket.sockets.length = 0;
	    };
	    MockWebSocket.prototype.send = function (data) {
	        this.sent.push(data);
	    };
	    Object.defineProperty(MockWebSocket.prototype, "lastMessageSent", {
	        get: function get() {
	            var sent = this.sent;
	            var length = sent.length;
	            return length > 0 ? sent[length - 1] : undefined;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    MockWebSocket.prototype.triggerClose = function (e) {
	        this.readyState = 3;
	        this.trigger('close', e);
	    };
	    MockWebSocket.prototype.triggerError = function (err) {
	        this.readyState = 3;
	        this.trigger('error', err);
	    };
	    MockWebSocket.prototype.triggerMessage = function (data) {
	        var messageEvent = {
	            data: data,
	            origin: 'mockorigin',
	            ports: undefined,
	            source: __root__
	        };
	        this.trigger('message', messageEvent);
	    };
	    MockWebSocket.prototype.open = function () {
	        this.readyState = 1;
	        this.trigger('open', {});
	    };
	    MockWebSocket.prototype.close = function (code, reason) {
	        if (this.readyState < 2) {
	            this.readyState = 2;
	            this.closeCode = code;
	            this.closeReason = reason;
	            this.triggerClose({ wasClean: true });
	        }
	    };
	    MockWebSocket.prototype.addEventListener = function (name, handler) {
	        var lookup = this.handlers[name] = this.handlers[name] || [];
	        lookup.push(handler);
	    };
	    MockWebSocket.prototype.removeEventListener = function (name, handler) {
	        var lookup = this.handlers[name];
	        if (lookup) {
	            for (var i = lookup.length - 1; i--;) {
	                if (lookup[i] === handler) {
	                    lookup.splice(i, 1);
	                }
	            }
	        }
	    };
	    MockWebSocket.prototype.trigger = function (name, e) {
	        if (this['on' + name]) {
	            this['on' + name](e);
	        }
	        var lookup = this.handlers[name];
	        if (lookup) {
	            for (var i = 0; i < lookup.length; i++) {
	                lookup[i](e);
	            }
	        }
	    };
	    MockWebSocket.sockets = [];
	    return MockWebSocket;
	}();
	exports.MockWebSocket = MockWebSocket;
	var MockXMLHttpRequest = function () {
	    function MockXMLHttpRequest() {
	        this.responseType = '';
	        this.eventHandlers = [];
	        this.readyState = 0;
	        this.requestHeaders = {};
	        this.previousRequest = MockXMLHttpRequest.recentRequest;
	        MockXMLHttpRequest.recentRequest = this;
	        MockXMLHttpRequest.requests.push(this);
	    }
	    Object.defineProperty(MockXMLHttpRequest, "mostRecent", {
	        get: function get() {
	            return MockXMLHttpRequest.recentRequest;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(MockXMLHttpRequest, "allRequests", {
	        get: function get() {
	            return MockXMLHttpRequest.requests;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    MockXMLHttpRequest.clearRequest = function () {
	        MockXMLHttpRequest.requests.length = 0;
	        MockXMLHttpRequest.recentRequest = null;
	    };
	    MockXMLHttpRequest.prototype.send = function (data) {
	        this.data = data;
	    };
	    MockXMLHttpRequest.prototype.abort = function () {
	        this.aborted = true;
	    };
	    MockXMLHttpRequest.prototype.open = function (method, url, async, user, password) {
	        this.method = method;
	        this.url = url;
	        this.user = user;
	        this.password = password;
	        this.readyState = 1;
	        this.triggerEvent('readyStateChange');
	    };
	    MockXMLHttpRequest.prototype.setRequestHeader = function (key, value) {
	        this.requestHeaders[key] = value;
	    };
	    MockXMLHttpRequest.prototype.addEventListener = function (name, handler) {
	        this.eventHandlers.push({ name: name, handler: handler });
	    };
	    MockXMLHttpRequest.prototype.removeEventListener = function (name, handler) {
	        for (var i = this.eventHandlers.length - 1; i--;) {
	            var eh = this.eventHandlers[i];
	            if (eh.name === name && eh.handler === handler) {
	                this.eventHandlers.splice(i, 1);
	            }
	        }
	    };
	    MockXMLHttpRequest.prototype.throwError = function (err) {
	        // TODO: something better with errors
	        this.triggerEvent('error');
	    };
	    MockXMLHttpRequest.prototype.respondWith = function (response) {
	        this.readyState = 4;
	        this.responseHeaders = {
	            'Content-Type': response.contentType || 'text/plain'
	        };
	        this.status = response.status || 200;
	        this.responseText = response.responseText;
	        if (!('response' in response)) {
	            switch (this.responseType) {
	                case 'json':
	                    try {
	                        this.response = JSON.parse(response.responseText);
	                    } catch (err) {
	                        throw new Error('unable to JSON.parse: \n' + response.responseText);
	                    }
	                    break;
	                case 'text':
	                    this.response = response.responseText;
	                    break;
	                default:
	                    throw new Error('unhandled type "' + this.responseType + '"');
	            }
	        }
	        // TODO: pass better event to onload.
	        this.triggerEvent('load');
	        this.triggerEvent('readystatechange');
	    };
	    MockXMLHttpRequest.prototype.triggerEvent = function (name, eventObj) {
	        // TODO: create a better default event
	        var e = eventObj || {};
	        if (this['on' + name]) {
	            this['on' + name](e);
	        }
	        this.eventHandlers.forEach(function (eh) {
	            if (eh.name === name) {
	                eh.handler.call(this, e);
	            }
	        });
	    };
	    MockXMLHttpRequest.requests = [];
	
	    // IIFE used to assign bearer token for all ajax requests at the application's top level
	    (function (open) {
	        var bearerToken;
	
	        /* istanbul ignore else  */
	        if (!MockXMLHttpRequest.hasOwnProperty('setBearerToken')) {
	            /* istanbul ignore next  */
	            MockXMLHttpRequest.prototype.open = function () {
	                open.apply(this, arguments);
	                if (bearerToken) {
	                    this.setRequestHeader('Authorization', 'Bearer ' + bearerToken);
	                }
	            };
	
	            MockXMLHttpRequest.setBearerToken = function (token) {
	                bearerToken = token;
	            };
	            MockXMLHttpRequest.clearBearerToken = function () {
	                bearerToken = null;
	            };
	        }
	    })(MockXMLHttpRequest.prototype.open);
	
	    return MockXMLHttpRequest;
	}();
	exports.MockXMLHttpRequest = MockXMLHttpRequest;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _rxjs = __webpack_require__(3);
	
	var _rxjs2 = _interopRequireDefault(_rxjs);
	
	var _sinon = __webpack_require__(4);
	
	var _sinon2 = _interopRequireDefault(_sinon);
	
	var _reduxObservable = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var TestScheduler = _rxjs2.default.TestScheduler;
	
	/**
	 *
	 * @param epic - the redux-observable epic to test
	 * @param action - the action the epic is listening for
	 * @param call -  (optional) a local sinon.spy used to get/set/reset api calls
	 * @param callArgs - (optional) An array containing the api method, followed by any params
	 * @param done - (optional) a reference to sinon done function
	 * @param expected - marble notation for the expected result
	 * @param replace - (optional) allows replacement of fields using timestamps or other generated values
	 * @param response - the expected payload
	 * @param store - (optional) a reference to the redux store
	 */
	
	var expectEpic = function expectEpic(epic, _ref) {
	    var _testScheduler$expect;
	
	    var action = _ref.action,
	        call = _ref.call,
	        callArgs = _ref.callArgs,
	        done = _ref.done,
	        expected = _ref.expected,
	        replace = _ref.replace,
	        response = _ref.response,
	        store = _ref.store;
	
	
	    var replacer = function replacer(key, value) {
	        // Filtering out properties
	        if (key === replace.key) {
	            return replace.value;
	        }
	        return value;
	    };
	
	    var replaceValues = function replaceValues(actual, expectation) {
	        for (var i = 0; i < actual.length; i++) {
	            actual[i] = JSON.parse(JSON.stringify(actual[i], replacer));
	        }
	        for (var j = 0; j < expectation.length; j++) {
	            expectation[j] = JSON.parse(JSON.stringify(expectation[j], replacer));
	        }
	    };
	
	    var testScheduler = new TestScheduler(function (actual, expectation) {
	
	        setTimeout(function () {
	            // Handle any necessary data manipulation * this could be extended to take an array
	            if (replace) {
	                replaceValues(actual, expectation);
	            }
	
	            var e_str = JSON.stringify(expectation),
	                a_str = JSON.stringify(actual);
	            if (e_str !== a_str) {
	                /* eslint-disable no-console */
	                console.log('expected', JSON.stringify(expectation));
	                console.log('actual--', JSON.stringify(actual));
	                /* eslint-enable no-console */
	            }
	
	            if (done) {
	                actual.should.deep.equal(expectation);
	                done();
	            }
	        });
	
	        if (!done) {
	            // Handle any necessary data manipulation * this could be extended to take an array
	            if (replace) {
	                replaceValues(actual, expectation);
	            }
	            actual.should.deep.equal(expectation);
	        }
	    });
	
	    var action$ = new _reduxObservable.ActionsObservable(testScheduler.createHotObservable.apply(testScheduler, _toConsumableArray(action)));
	    var responseSubs = '^!';
	    var response$ = testScheduler.createColdObservable.apply(testScheduler, _toConsumableArray(response));
	    call = _sinon2.default.stub().returns(response$);
	
	    var test$ = epic(action$, store, call);
	    (_testScheduler$expect = testScheduler.expectObservable(test$)).toBe.apply(_testScheduler$expect, _toConsumableArray(expected));
	    testScheduler.flush();
	
	    if (callArgs !== undefined) {
	        var _call;
	
	        call.called.should.eq(true);
	        call.calledOnce.should.eq(true);
	        (_call = call).calledWithExactly.apply(_call, _toConsumableArray(callArgs)).should.eq(true);
	    }
	
	    testScheduler.expectSubscriptions(response$.subscriptions).toBe(responseSubs);
	};
	
	exports.default = expectEpic;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("rxjs");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("sinon");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("redux-observable");

/***/ }
/******/ ])
});
;
//# sourceMappingURL=epic-helper.js.map