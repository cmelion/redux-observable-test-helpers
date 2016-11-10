'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var expectEpic = exports.expectEpic = function expectEpic(epic, _ref) {
    var _testScheduler$expect;

    var expected = _ref.expected,
        action = _ref.action,
        response = _ref.response,
        call = _ref.call,
        callArgs = _ref.callArgs,
        store = _ref.store,
        done = _ref.done,
        replace = _ref.replace;


    var testScheduler = new TestScheduler(function (actual, expectation) {

        // Handle any necessary data manipulation * this could be extended to take an array
        if (replace && get(actual, replace.key)) {
            actual[replace.key] = replace.value;
        }

        setTimeout(function () {
            /* eslint-disable no-console */
            //console.log('expected', JSON.stringify(expectation));
            //console.log('actual--', JSON.stringify(actual));
            /* eslint-enable no-console */
            if (done) {
                actual.should.deep.equal(expectation);
                done();
            }
        });

        if (!done) {
            actual.should.deep.equal(actual);
        }
    });

    var action$ = new ActionsObservable(testScheduler.createHotObservable.apply(testScheduler, _toConsumableArray(action)));
    var responseSubs = '^!';
    var response$ = testScheduler.createColdObservable.apply(testScheduler, _toConsumableArray(response));
    call = sinon.stub().returns(response$);

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