import sinon from 'sinon';
import {ActionsObservable} from 'redux-observable';
import get from 'lodash/get';

const expectEpic = (epic, {expected, action, response, call, callArgs, store, done, replace}) => {

    const testScheduler = new TestScheduler((actual, expectation) => {

        // Handle any necessary data manipulation * this could be extended to take an array
        if (replace && get(actual, replace.key)) {
            actual[replace.key] = replace.value;
        }

        setTimeout(() => {
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
