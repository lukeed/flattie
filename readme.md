# flattie [![CI](https://github.com/lukeed/flattie/workflows/CI/badge.svg)](https://github.com/lukeed/flattie/actions) [![codecov](https://badgen.now.sh/codecov/c/github/lukeed/flattie)](https://codecov.io/gh/lukeed/flattie)

> A tiny (187B) and [fast](#benchmarks) utility to flatten an object with customizable glue

This module recursively squashes an Object/Array. The output is a flat object – AKA, it has a single level of depth.

By default, the `.` character is used to glue/join layers' keys together. This is customizable.

Finally, any keys with nullish values (`null` and `undefined`) are **not** included in the return object.

## Install

```
$ npm install --save flattie
```


## Usage

```js
import { flattie } from 'flattie';

flattie({
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
//   'a': 'hi',
//   'b.b.0': 'foo',
//   'b.b.1': '',
//   'b.b.3': 'bar',
//   'b.d': 'hello',
//   'b.e.a': 'yo',
//   'b.e.c': 'sup',
//   'b.e.d': 0,
//   'b.e.f.0.foo': 123,
//   'b.e.f.0.bar': 123,
//   'b.e.f.1.foo': 465,
//   'b.e.f.1.bar': 456,
//   'c': 'world'
// }
```

> **Note:** `null` and `undefined` values are purged.

## API

### flattie(input, glue?)
Returns: `Object`

Returns a new object with a single level of depth.

> **Important:** An object is always returned despite `input` type.

#### input
Type: `Object|Array`

The object to flatten.

#### glue
Type: `String`<br>
Default: `.`

A string used to join parent key names to nested child key names.

```js
const foo = { bar: 123 };

flattie({ foo }); //=> { 'foo.bar': 123 }
flattie({ foo }, '???'); //=> { 'foo???bar': 123 }
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
