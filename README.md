# redux-observable-test-helpers
Unit test helpers for redux-observable epics


## Install
#### Install with [npm](npmjs.org):

```bash
npm i redux-observable-test-helpers --save-dev
```


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

### Examples
* [JSBin with multiple observables expected in the same frame ](http://jsbin.com/dagiguw/embed?js,output)
* [JSBin with indirect ajax call](http://jsbin.com/vegonak/embed?js,output)
