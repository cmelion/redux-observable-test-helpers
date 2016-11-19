import {TestScheduler} from 'rxjs';
import sinon from 'sinon';
import {ActionsObservable} from 'redux-observable';

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
export const expectEpic = (epic, {action, call, callArgs, done, expected, replace, response, store}) => {

    const replacer = (key, value) => {
        // Filtering out properties
        if (key === replace.key) {
            return replace.value;
        }
        return value;
    };

    const replaceValues = (actual, expectation) => {
        for (var i = 0; i < actual.length; i++) {
            actual[i] = JSON.parse(JSON.stringify(actual[i], replacer));
        }
        for (var j = 0; j < expectation.length; j++) {
            expectation[j] = JSON.parse(JSON.stringify(expectation[j], replacer));
        }
    };

    const testScheduler = new TestScheduler((actual, expectation) => {


        setTimeout(() => {
            // Handle any necessary data manipulation * this could be extended to take an array
            if (replace) {
                replaceValues(actual, expectation);
            }

            let e_str = JSON.stringify(expectation),
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

    const action$ = new ActionsObservable(
        testScheduler.createHotObservable(...action)
    );
    const responseSubs = '^!';
    const response$ = testScheduler.createColdObservable(...response);
    call = sinon.stub().returns(response$);

    const test$ = epic(action$, store, call);
    testScheduler.expectObservable(test$).toBe(...expected);
    testScheduler.flush();

    if (callArgs !== undefined) {
        call.called.should.eq(true);
        call.calledOnce.should.eq(true);
        call.calledWithExactly(...callArgs).should.eq(true);
    }

    testScheduler.expectSubscriptions(response$.subscriptions).toBe(responseSubs);
};

