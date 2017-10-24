# flat-obj [![Build Status](https://travis-ci.org/lukeed/flat-obj.svg?branch=master)](https://travis-ci.org/lukeed/flat-obj)

> Flatten a nested Object with customizable glue


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
    b: '',
    d: 'hello',
    e: {
      a: 'yo',
      b: undefined,
      c: 'sup',
      d: 0
    }
  },
  c: 'world'
});
//=> { a:'hi', b_b:'', b_d:'hello', b_e_a:'yo', b_e_c:'sup', b_e_d:0, c:'world' }
```

> **Note:** `null` and `undefined` values are purged.

## API

### flatObj(obj, [glue])

#### obj

Type: `Object`

The object to flatten.

#### glue

Type: `String`<br>
Default: `_`

A string used to join parent key names to nested child key names.

```js
{
  foo: {
    bar: 123
  }
} //=> { foo_bar:123 }
```


## Benchmarks

```
flat-obj (current)
  --> 540,089 ops/sec ±0.65% (83 runs sampled)
flat-obj (1.0.0)
  --> 511,842 ops/sec ±0.62% (91 runs sampled)
flat
  --> 140,012 ops/sec ±0.59% (96 runs sampled)
flatten-object
  --> 154,127 ops/sec ±0.78% (93 runs sampled)
```


## License

MIT © [Luke Edwards](https://lukeed.com)
