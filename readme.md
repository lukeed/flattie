# flat-obj [![Build Status](https://travis-ci.org/lukeed/flat-obj.svg?branch=master)](https://travis-ci.org/lukeed/flat-obj)

> Flatten a nested Object with customizable glue


## Install

```
$ npm install --save flat-obj
```


## Usage

```js
import flatObj from 'flat-obj';

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
const foo = { bar: 123 };

flatObj({ foo }); //=> { foo_bar: 123 }
flatObj({ foo }, '.'); //=> { 'foo.bar': 123 }
```


## Benchmarks

> Running on Node.js v10.13.0

```
Validation:
  ✔ flat
  ✔ flatten-object
  ✔ flat-obj@1.x
  ✔ flat-obj

Benchmark:
  flat               x 187,778 ops/sec ±1.27% (87 runs sampled)
  flatten-object     x 191,514 ops/sec ±0.26% (93 runs sampled)
  flat-obj@1.x       x 268,060 ops/sec ±1.21% (94 runs sampled)
  flat-obj           x 622,744 ops/sec ±0.33% (92 runs sampled)
```


## License

MIT © [Luke Edwards](https://lukeed.com)
