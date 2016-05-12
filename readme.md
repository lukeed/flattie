# flat-obj [![Build Status](https://travis-ci.org/lukeed/flat-obj.svg?branch=master)](https://travis-ci.org/lukeed/flat-obj)

> Flatten a multi-dimensional Object into an Object of single depth.


## Install

```
$ npm install --save flat-obj
```


## Usage

```js
const flatObj = require('flat-obj');

flatObj({
  a: 'hi',
  b: {
    a: null,
    b: undefined,
    c: '',
    d: 'hello',
    e: {
      a: 'yo',
      b: 'sup'
    }
  },
  c: 'world'
});
//=> {a: 'hi', b_d: 'hello', b_e_a: 'yo', b_e_b: 'sup', c: 'world'}
```

> **Note:** `null`, `undefined`, and `''` values are purged.

## API

### flatObj(obj, [glue])

#### obj

Type: `object`

The object to flatten.

#### glue

Type: `string`<br>
Default: `_`

The delimiter for joining parent keys to their children's names.

```javascript
{a: {b: 'hello', c: 'world'}} //=> {a_b: 'hello', a_c: 'world'}
```


## License

MIT © [Luke Edwards](https://lukeed.com)
