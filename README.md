# redux-observable-test-helpers
Unit test helpers for redux-observable epics


## Install
#### Install with [npm](npmjs.org):

```bash
npm i redux-observable-test-helpers --save-dev
```

## Background
Testing async code that creates side effects isn't easy. One recommendation to make async testing with RXJS easier and more consistent is incorporating "marble notation" as a DSL for creating unit tests. "Marble Tests" are tests that use a specialized VirtualScheduler called the TestScheduler. They enable us to test asynchronous operations in a synchronous and dependable manner. By keeping our async "side-effects" within our epics we can leverage a simple test helper, expectEpic, to create concise and deterministic tests.

## Usage

ES6
```js
import {expectEpic} from 'redux-observable-test-helpers';
```

ES5
```js
var helpers = require('redux-observable-test-helpers');
var expectEpic = helpers.expectEpic;
```
[unpkg](https://unpkg.com/)

```html
 <script src="https://unpkg.com/redux-observable-test-helpers@1.3.22/dist/epic-helper.js"></script>
```
```js
Signature

 /**
 * expectEpic - Test helper for redux-observable epics
 *
 * @param epic     - the redux-observable epic to test
 *{
 * @param action   - marble notation for the action the epic is listening for
 * @param call     - (optional) a local sinon.spy used to get/set/reset api calls
 * @param callArgs - (optional) An array containing the api method, followed by any params
 * @param done     - (optional) mocha callback for async tests
 * @param expected - marble notation for the expected result
 * @param replace  - (optional) allows replacement of fields using timestamps or other generated values
 * @param response - the expected payload
 * @param store    - (optional) a reference to the redux store
 *}
 */
 const expectEpic = (epic, {action, call, callArgs, done, expected, replace, response, store}) => {...};
```

### expectEpic Examples
* [JSBin with multiple observables expected in the same frame ](http://jsbin.com/dagiguw/embed?js,output)
* [JSBin with indirect ajax call](http://jsbin.com/vegonak/embed?js,output)
* [JSBin with interval](http://jsbin.com/lefuva/embed?js,output)

### Alternative MockXMLHttpRequest approach
* http://jsbin.com/pudaqe/embed?js,output
