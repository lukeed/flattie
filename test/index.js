import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { flattie } from '../src';

test('exports', () => {
	assert.type(flattie, 'function');
});


test('custom glue', () => {
	let ccc = { foo: 'bar', baz: 'bat' };
	let input = { aaa: 1, bbb: 2, ccc, ddd: 4 };

	assert.equal(
		flattie(input, 'FOO'), {
			aaa: 1,
			bbb: 2,
			cccFOOfoo: 'bar',
			cccFOObaz: 'bat',
			ddd: 4
		}
	);

	assert.equal(
		flattie(input, '~'), {
			'aaa': 1,
			'bbb': 2,
			'ccc~foo': 'bar',
			'ccc~baz': 'bat',
			'ddd': 4
		}
	);

	assert.equal(
		flattie(input, '', true, { allowGlueEmptyString: true }), {
			'aaa': 1,
			'bbb': 2,
			'cccfoo': 'bar',
			'cccbaz': 'bat',
			'ddd': 4
		}
	);
})

test('ignore nullish', () => {
	let ddd = [, null, undefined, 0, NaN, 1];
	let bbb = { aaa: null, bbb: undefined, ccc: '', ddd: 'hi', eee: 0 };
	let input = { aaa: 123, bbb, ccc: null, ddd };

	assert.equal(
		flattie(input), {
			'aaa': 123,
			'bbb.ccc': '',
			'bbb.ddd': 'hi',
			'bbb.eee': 0,
			'ddd.3': 0,
			'ddd.4': NaN,
			'ddd.5': 1,
		}
	);
});

test('keep nullish', () => {
	let ddd = [, null, undefined, 0, NaN, 1];
	let bbb = { aaa: null, bbb: undefined, ccc: '', ddd: 'hi', eee: 0 };
	let input = { aaa: 123, bbb, ccc: null, ddd };

	assert.equal(
		flattie(input, '.', true), {
			'aaa': 123,
			'bbb.aaa': null,
			'bbb.bbb': undefined,
			'bbb.ccc': '',
			'bbb.ddd': 'hi',
			'bbb.eee': 0,
			'ccc': null,
			'ddd.0': undefined,
			'ddd.1': null,
			'ddd.2': undefined,
			'ddd.3': 0,
			'ddd.4': NaN,
			'ddd.5': 1,
		}
	);
});


test('plain types', () => {
	assert.equal(flattie(1), {});
	assert.equal(flattie(0), {});

	assert.equal(flattie(null), {});
	assert.equal(flattie(undefined), {});
	assert.equal(flattie(NaN), {});

	assert.equal(flattie(''), {});
	assert.equal(flattie('hello'), {});
});


test('object :: simple', () => {
	let ccc = { foo: 'bar', baz: 'bat' };
	let input = { aaa: 1, bbb: 2, ccc, ddd: 4 };
	let input_string = JSON.stringify(input);

	assert.equal(
		flattie(input), {
			'aaa': 1,
			'bbb': 2,
			'ccc.foo': 'bar',
			'ccc.baz': 'bat',
			'ddd': 4
		}
	);

	assert.is(
		input_string,
		JSON.stringify(input),
		'does not mutate original'
	);
});


test('object :: nested', () => {
	let ccc = { foo: 'bar', baz: 'bat' };
	let bbb = { aaa: 2, bbb: 3, ccc, ddd: 4 }
	let input = { aaa: 1, bbb, ccc: 3 };

	let input_string = JSON.stringify(input);

	assert.equal(
		flattie(input), {
			'aaa': 1,
			'bbb.aaa': 2,
			'bbb.bbb': 3,
			'bbb.ccc.foo': 'bar',
			'bbb.ccc.baz': 'bat',
			'bbb.ddd': 4,
			'ccc': 3
		}
	);

	assert.is(
		input_string,
		JSON.stringify(input),
		'does not mutate original'
	);
});


test('object :: kitchen', () => {
	let input = {
		a: 1,
		b: [
			[{ a:1, b:[2,null,9], c:{ a:[1], b: { foo: [2, 2] } }, d:4 }],
			[{ a:2, b:[4,null,9], c:{ a:[2], b: { foo: [4, 4] } }, d:5 }],
			[{ a:3, b:[6,null,9], c:{ a:[4], b: { foo: [8, 8] } }, d:6 }],
		],
		c: 3,
		d: {
			foo: undefined,
			bar: [{ a:1, b:2, c:[{ a:1, b:{ c:3 } }, { a:2, b:{ c:4 } }], d:4 }],
			baz: [{ a:2, b:3, c:[{ a:2, b:{ c:4 } }, { a:3, b:{ c:5 } }], d:5 }],
		}
	};

	let input_string = JSON.stringify(input);

	assert.equal(
		flattie(input), {
			'a': 1,

			'b.0.0.a': 1,
			'b.0.0.b.0': 2,
			'b.0.0.b.2': 9,
			'b.0.0.c.a.0': 1,
			'b.0.0.c.b.foo.0': 2,
			'b.0.0.c.b.foo.1': 2,
			'b.0.0.d': 4,

			'b.1.0.a': 2,
			'b.1.0.b.0': 4,
			'b.1.0.b.2': 9,
			'b.1.0.c.a.0': 2,
			'b.1.0.c.b.foo.0': 4,
			'b.1.0.c.b.foo.1': 4,
			'b.1.0.d': 5,

			'b.2.0.a': 3,
			'b.2.0.b.0': 6,
			'b.2.0.b.2': 9,
			'b.2.0.c.a.0': 4,
			'b.2.0.c.b.foo.0': 8,
			'b.2.0.c.b.foo.1': 8,
			'b.2.0.d': 6,

			'c': 3,

			'd.bar.0.a': 1,
			'd.bar.0.b': 2,
			'd.bar.0.c.0.a': 1,
			'd.bar.0.c.0.b.c': 3,
			'd.bar.0.c.1.a': 2,
			'd.bar.0.c.1.b.c': 4,
			'd.bar.0.d': 4,

			'd.baz.0.a': 2,
			'd.baz.0.b': 3,
			'd.baz.0.c.0.a': 2,
			'd.baz.0.c.0.b.c': 4,
			'd.baz.0.c.1.a': 3,
			'd.baz.0.c.1.b.c': 5,
			'd.baz.0.d': 5,
		}
	);

	assert.is(
		input_string,
		JSON.stringify(input),
		'does not mutate original'
	);
});


test('array :: simple', () => {
	const input = [0, , null, undefined, 1, 2, '', 3, NaN];
	const input_string = JSON.stringify(input);

	assert.equal(
		flattie(input), {
			0: 0,
			4: 1,
			5: 2,
			6: '',
			7: 3,
			8: NaN
		}
	);

	assert.is(
		input_string,
		JSON.stringify(input),
		'does not mutate original'
	);
});


test('array :: nested', () => {
	const input = [
		[1, 2, null, 3, 4],
		['foo', 'bar', ['hello', null, undefined, 'world'], 'baz'],
		[6, 7, 8, undefined, 9]
	];

	const input_string = JSON.stringify(input);

	assert.equal(
		flattie(input), {
			'0.0': 1,
			'0.1': 2,
			'0.3': 3,
			'0.4': 4,
			'1.0': 'foo',
			'1.1': 'bar',
			'1.2.0': 'hello',
			'1.2.3': 'world',
			'1.3': 'baz',
			'2.0': 6,
			'2.1': 7,
			'2.2': 8,
			'2.4': 9,
		}
	);

	assert.is(
		input_string,
		JSON.stringify(input),
		'does not mutate original'
	);
});


test('array :: object', () => {
	let baz = ['hello', void 0, 'world', null];
	let bbb = { foo: 123, bar: 456, baz };

	let input = [
		{ aaa: 1, bbb, ccc: [4, 5] },
		{ aaa: 2, bbb, ccc: [null, undefined] },
		{ aaa: 3, bbb, ccc: [9999] },
	];

	let input_string = JSON.stringify(input);

	assert.equal(
		flattie(input), {
			'0.aaa': 1,
			'0.bbb.foo': 123,
			'0.bbb.bar': 456,
			'0.bbb.baz.0': 'hello',
			'0.bbb.baz.2': 'world',
			'0.ccc.0': 4,
			'0.ccc.1': 5,

			'1.aaa': 2,
			'1.bbb.foo': 123,
			'1.bbb.bar': 456,
			'1.bbb.baz.0': 'hello',
			'1.bbb.baz.2': 'world',

			'2.aaa': 3,
			'2.bbb.foo': 123,
			'2.bbb.bar': 456,
			'2.bbb.baz.0': 'hello',
			'2.bbb.baz.2': 'world',
			'2.ccc.0': 9999,
		}
	);

	assert.equal(
		flattie(input, '~'), {
			'0~aaa': 1,
			'0~bbb~foo': 123,
			'0~bbb~bar': 456,
			'0~bbb~baz~0': 'hello',
			'0~bbb~baz~2': 'world',
			'0~ccc~0': 4,
			'0~ccc~1': 5,

			'1~aaa': 2,
			'1~bbb~foo': 123,
			'1~bbb~bar': 456,
			'1~bbb~baz~0': 'hello',
			'1~bbb~baz~2': 'world',

			'2~aaa': 3,
			'2~bbb~foo': 123,
			'2~bbb~bar': 456,
			'2~bbb~baz~0': 'hello',
			'2~bbb~baz~2': 'world',
			'2~ccc~0': 9999,
		}
	);

	assert.is(
		input_string,
		JSON.stringify(input),
		'does not mutate original'
	);
});


test('array :: kitchen', () => {
	let input = [
		'hello',
		{
			a: 1,
			b: [
				[{ a:1, b:[2,null,9], c:{ a:[1], b: { foo: [2, 2] } }, d:4 }],
				[{ a:2, b:[4,null,9], c:{ a:[2], b: { foo: [4, 4] } }, d:5 }],
				[{ a:3, b:[6,null,9], c:{ a:[4], b: { foo: [8, 8] } }, d:6 }],
			],
			c: 3,
			d: {
				foo: undefined,
				bar: [{ a:1, b:2, c:[{ a:1, b:{ c:3 } }, { a:2, b:{ c:4 } }], d:4 }],
				baz: [{ a:2, b:3, c:[{ a:2, b:{ c:4 } }, { a:3, b:{ c:5 } }], d:5 }],
			}
		},
		'world',
		{
			a: 1,
			b: [
				[{ a:1, b:[2,null,9], c:{ a:[1], b: { foo: [2, 2] } }, d:4 }],
				[{ a:2, b:[4,null,9], c:{ a:[2], b: { foo: [4, 4] } }, d:5 }],
				[{ a:3, b:[6,null,9], c:{ a:[4], b: { foo: [8, 8] } }, d:6 }],
			],
			c: 3,
			d: {
				foo: undefined,
				bar: [{ a:1, b:2, c:[{ a:1, b:{ c:3 } }, { a:2, b:{ c:4 } }], d:4 }],
				baz: [{ a:2, b:3, c:[{ a:2, b:{ c:4 } }, { a:3, b:{ c:5 } }], d:5 }],
			}
		},
	];

	let input_string = JSON.stringify(input);

	assert.equal(
		flattie(input), {
			'0': 'hello',
			'1.a': 1,
			'1.b.0.0.a': 1,
			'1.b.0.0.b.0': 2,
			'1.b.0.0.b.2': 9,
			'1.b.0.0.c.a.0': 1,
			'1.b.0.0.c.b.foo.0': 2,
			'1.b.0.0.c.b.foo.1': 2,
			'1.b.0.0.d': 4,
			'1.b.1.0.a': 2,
			'1.b.1.0.b.0': 4,
			'1.b.1.0.b.2': 9,
			'1.b.1.0.c.a.0': 2,
			'1.b.1.0.c.b.foo.0': 4,
			'1.b.1.0.c.b.foo.1': 4,
			'1.b.1.0.d': 5,
			'1.b.2.0.a': 3,
			'1.b.2.0.b.0': 6,
			'1.b.2.0.b.2': 9,
			'1.b.2.0.c.a.0': 4,
			'1.b.2.0.c.b.foo.0': 8,
			'1.b.2.0.c.b.foo.1': 8,
			'1.b.2.0.d': 6,
			'1.c': 3,
			'1.d.bar.0.a': 1,
			'1.d.bar.0.b': 2,
			'1.d.bar.0.c.0.a': 1,
			'1.d.bar.0.c.0.b.c': 3,
			'1.d.bar.0.c.1.a': 2,
			'1.d.bar.0.c.1.b.c': 4,
			'1.d.bar.0.d': 4,
			'1.d.baz.0.a': 2,
			'1.d.baz.0.b': 3,
			'1.d.baz.0.c.0.a': 2,
			'1.d.baz.0.c.0.b.c': 4,
			'1.d.baz.0.c.1.a': 3,
			'1.d.baz.0.c.1.b.c': 5,
			'1.d.baz.0.d': 5,
			'2': 'world',
			'3.a': 1,
			'3.b.0.0.a': 1,
			'3.b.0.0.b.0': 2,
			'3.b.0.0.b.2': 9,
			'3.b.0.0.c.a.0': 1,
			'3.b.0.0.c.b.foo.0': 2,
			'3.b.0.0.c.b.foo.1': 2,
			'3.b.0.0.d': 4,
			'3.b.1.0.a': 2,
			'3.b.1.0.b.0': 4,
			'3.b.1.0.b.2': 9,
			'3.b.1.0.c.a.0': 2,
			'3.b.1.0.c.b.foo.0': 4,
			'3.b.1.0.c.b.foo.1': 4,
			'3.b.1.0.d': 5,
			'3.b.2.0.a': 3,
			'3.b.2.0.b.0': 6,
			'3.b.2.0.b.2': 9,
			'3.b.2.0.c.a.0': 4,
			'3.b.2.0.c.b.foo.0': 8,
			'3.b.2.0.c.b.foo.1': 8,
			'3.b.2.0.d': 6,
			'3.c': 3,
			'3.d.bar.0.a': 1,
			'3.d.bar.0.b': 2,
			'3.d.bar.0.c.0.a': 1,
			'3.d.bar.0.c.0.b.c': 3,
			'3.d.bar.0.c.1.a': 2,
			'3.d.bar.0.c.1.b.c': 4,
			'3.d.bar.0.d': 4,
			'3.d.baz.0.a': 2,
			'3.d.baz.0.b': 3,
			'3.d.baz.0.c.0.a': 2,
			'3.d.baz.0.c.0.b.c': 4,
			'3.d.baz.0.c.1.a': 3,
			'3.d.baz.0.c.1.b.c': 5,
			'3.d.baz.0.d': 5,
		}
	);

	assert.is(
		input_string,
		JSON.stringify(input),
		'does not mutate original'
	);
});

test('custom transformKey', () => {
	let ccc = { foo: 'bar', baz: 'bat' };
	let input = { aaa: { bbb: { ccc: 1 }}, bbb: 2, ccc, ddd: 4 };

	assert.throws(
		() => flattie(input, '', false, {
			transformKey: 'true'
		}), 'value of options.transformKey must be a function returning a string', 'transformKey isn\'t a function'
	);
	
	assert.equal(
			flattie(input, '', false, {
				transformKey: (pfx, key) => {
					if(!pfx) { return key.toLowerCase() }
					if (key.length == 1) { return key.toUpperCase() }
					return key.slice(0, 1).toUpperCase() + key.slice(1, key.length).toLowerCase()
				},
				allowGlueEmptyString: true,
			}), {
			"aaaBbbCcc": 1,
			"cccFoo": "bar",
			"cccBaz": "bat",
			"ddd": 4,
			"bbb": 2,
		}, 'should match camel case transformation'
	);
	
	
	assert.equal(
			flattie(input, '_', false, {
				transformKey: (pfx, key) => key.toLowerCase()
			}), {
			"aaa_bbb_ccc": 1,
			"ccc_foo": "bar",
			"ccc_baz": "bat",
			"ddd": 4,
			"bbb": 2,
		}, 'should match snake case transformation'
	);
	
	assert.equal(
			flattie(input, '-', false, {
				transformKey: (pfx, key) => key.toLowerCase()
			}), {
			"aaa-bbb-ccc": 1,
			"ccc-foo": "bar",
			"ccc-baz": "bat",
			"ddd": 4,
			"bbb": 2,
		}, 'should match kebab case transformation'
	);
	
	assert.equal(
		flattie(input, '', false, {
				transformKey: (pfx, key) => {
					if (key.length == 1) { return key.toUpperCase() }
					return key.slice(0, 1).toUpperCase() + key.slice(1, key.length).toLowerCase()
				},
				allowGlueEmptyString: true
			}), {
			"AaaBbbCcc": 1,
			"CccFoo": "bar",
			"CccBaz": "bat",
			"Ddd": 4,
			"Bbb": 2,
		}, 'should match pascal case transformation'
	);
});


test.run();