# flat-obj [![build status](https://badgen.net/github/status/lukeed/flat-obj)](https://github.com/lukeed/flat-obj/actions) [![codecov](https://badgen.now.sh/codecov/c/github/lukeed/flat-obj)](https://codecov.io/gh/lukeed/flat-obj)

> A tiny (185B) utility to flatten an object with customizable glue

This module squashes a nested object (including its internal Arrays) so that the output is a flat object – AKA, it has a single level of depth. By default, the `_` character is used to glue/join layers' keys together. This is customizable, of course.

Finally, any keys with nullish values (`null` and `undefined`) are **not** included in the return object.

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
    b: ['foo', '', null, 'bar'],
    d: 'hello',
    e: {
      a: 'yo',
      b: undefined,
      c: 'sup',
      d: 0,
      f: [
        { foo: 123, bar: 123 },
        { foo: 465, bar: 456 },
      ]
    }
  },
  c: 'world'
});
// {
//   a: 'hi',
//   b_b_0: 'foo',
//   b_b_1: '',
//   b_b_3: 'bar',
//   b_d: 'hello',
//   b_e_a: 'yo',
//   b_e_c: 'sup',
//   b_e_d: 0,
//   b_e_f_0_foo: 123,
//   b_e_f_0_bar: 123,
//   b_e_f_1_foo: 465,
//   b_e_f_1_bar: 456,
//   c: 'world'
// }
```

> **Note:** `null` and `undefined` values are purged.

## API

### flatObj(input, [glue])
Returns: `Object`

Returns a new object with a single level of depth.

> **Important:** An object is always returned despite `input` type.

#### input
Type: `Object|Array`

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
Load Time:
  flat             1.004ms
  flatten-object   1.223ms
  flat-obj         0.971ms
  flattie          0.239ms

Validation:
  ✔ flat
  ✔ flatten-object
  ✔ flat-obj
  ✔ flattie

Benchmark:
  flat               x 183,670 ops/sec ±1.30% (86 runs sampled)
  flatten-object     x 209,886 ops/sec ±0.32% (93 runs sampled)
  flat-obj           x 383,326 ops/sec ±1.65% (89 runs sampled)
  flattie            x 901,407 ops/sec ±0.72% (90 runs sampled)
```


## License

MIT © [Luke Edwards](https://lukeed.com)
