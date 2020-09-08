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
Validation:
  ✔ flat
  ✔ flatten-object
  ✔ flat-obj@1.x
  ✔ flat-obj

Benchmark:
  flat               x 186,002 ops/sec ±1.28% (89 runs sampled)
  flatten-object     x 188,715 ops/sec ±0.22% (94 runs sampled)
  flat-obj@1.x       x 274,414 ops/sec ±1.03% (95 runs sampled)
  flat-obj           x 363,332 ops/sec ±0.57% (97 runs sampled)
```


## License

MIT © [Luke Edwards](https://lukeed.com)
