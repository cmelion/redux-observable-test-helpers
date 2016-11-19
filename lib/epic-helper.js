'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.expectEpic = undefined;

var _rxjs = require('rxjs');

var _rxjs2 = _interopRequireDefault(_rxjs);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _reduxObservable = require('redux-observable');

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

var expectEpic = exports.expectEpic = function expectEpic(epic, _ref) {
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