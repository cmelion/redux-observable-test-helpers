import {MockWebSocket, MockXMLHttpRequest} from './ajax-helper';
import expectEpic from './epic-helper';

const indirect = {
    call:  (fn, ...args) => fn(...args)
};

export {expectEpic};
export {MockXMLHttpRequest};
export {indirect};
export default {
    MockWebSocket,
    MockXMLHttpRequest,
    expectEpic,
    indirect
}
