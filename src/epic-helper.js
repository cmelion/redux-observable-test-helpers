import Rx from 'rxjs';
import sinon from 'sinon';
import {ActionsObservable} from 'redux-observable';

const {TestScheduler} = Rx;

const expectEpic = (epic, {expected, action, response, call, callArgs, store, done, replace}) => {

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
            /* eslint-disable no-console */
            console.log('expected', JSON.stringify(expectation));
            console.log('actual--', JSON.stringify(actual));
            /* eslint-enable no-console */
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
            actual.should.deep.equal(actual);
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

export default expectEpic;
