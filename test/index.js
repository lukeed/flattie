import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { flattie } from '../src';

test('exports', () => {
	assert.is(typeof flattie, 'function', 'exports a function');
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

});


test('ignore nullish', () => {
	let ddd = [, null, undefined, 0, 1];
	let bbb = { aaa: null, bbb: undefined, ccc: '', ddd: 'hi', eee: 0 };
	let input = { aaa: 123, bbb, ccc: null, ddd };

	assert.equal(
		flattie(input), {
			aaa: 123,
			bbb_ccc: '',
			bbb_ddd: 'hi',
			bbb_eee: 0,
			ddd_3: 0,
			ddd_4: 1,
		}
	);
});


test('plain types', () => {
	assert.equal(flattie(1), {});
	assert.equal(flattie(0), {});

	assert.equal(flattie(null), {});
	assert.equal(flattie(undefined), {});

	assert.equal(flattie(''), {});
	assert.equal(flattie('hello'), {});

});


test('object :: simple', () => {
	let ccc = { foo: 'bar', baz: 'bat' };
	let input = { aaa: 1, bbb: 2, ccc, ddd: 4 };
	let input_string = JSON.stringify(input);

	assert.equal(
		flattie(input), {
			aaa: 1,
			bbb: 2,
			ccc_foo: 'bar',
			ccc_baz: 'bat',
			ddd: 4
		}
	);

	assert.equal(
		input_string,
		JSON.stringify(input)
	);

});


test('object :: nested', () => {
	let ccc = { foo: 'bar', baz: 'bat' };
	let bbb = { aaa: 2, bbb: 3, ccc, ddd: 4 }
	let input = { aaa: 1, bbb, ccc: 3 };

	let input_string = JSON.stringify(input);

	assert.equal(
		flattie(input), {
			aaa: 1,
			bbb_aaa: 2,
			bbb_bbb: 3,
			bbb_ccc_foo: 'bar',
			bbb_ccc_baz: 'bat',
			bbb_ddd: 4,
			ccc: 3
		}
	);

	assert.equal(
		input_string,
		JSON.stringify(input)
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
			a: 1,

			b_0_0_a: 1,
			b_0_0_b_0: 2,
			b_0_0_b_2: 9,
			b_0_0_c_a_0: 1,
			b_0_0_c_b_foo_0: 2,
			b_0_0_c_b_foo_1: 2,
			b_0_0_d: 4,

			b_1_0_a: 2,
			b_1_0_b_0: 4,
			b_1_0_b_2: 9,
			b_1_0_c_a_0: 2,
			b_1_0_c_b_foo_0: 4,
			b_1_0_c_b_foo_1: 4,
			b_1_0_d: 5,

			b_2_0_a: 3,
			b_2_0_b_0: 6,
			b_2_0_b_2: 9,
			b_2_0_c_a_0: 4,
			b_2_0_c_b_foo_0: 8,
			b_2_0_c_b_foo_1: 8,
			b_2_0_d: 6,

			c: 3,

			d_bar_0_a: 1,
			d_bar_0_b: 2,
			d_bar_0_c_0_a: 1,
			d_bar_0_c_0_b_c: 3,
			d_bar_0_c_1_a: 2,
			d_bar_0_c_1_b_c: 4,
			d_bar_0_d: 4,

			d_baz_0_a: 2,
			d_baz_0_b: 3,
			d_baz_0_c_0_a: 2,
			d_baz_0_c_0_b_c: 4,
			d_baz_0_c_1_a: 3,
			d_baz_0_c_1_b_c: 5,
			d_baz_0_d: 5,
		}
	);

	assert.equal(
		input_string,
		JSON.stringify(input),
		'~> no input mutation'
	);

});


test('array :: simple', () => {
	const input = [0, , null, undefined, 1, 2, '', 3];
	const input_string = JSON.stringify(input);

	assert.equal(
		flattie(input), {
			0: 0,
			4: 1,
			5: 2,
			6: '',
			7: 3
		}
	);

	assert.equal(
		input_string,
		JSON.stringify(input),
		'~> no input mutation'
	);

});


test('array :: nested', () => {
	const input = [
		[1, 2, null, 3, 4],
		['foo', 'bar', ['hello', null, 'world'], 'baz'],
		[6, 7, 8, undefined, 9]
	];

	const input_string = JSON.stringify(input);

	assert.equal(
		flattie(input), {
			'0_0': 1,
			'0_1': 2,
			'0_3': 3,
			'0_4': 4,
			'1_0': 'foo',
			'1_1': 'bar',
			'1_2_0': 'hello',
			'1_2_2': 'world',
			'1_3': 'baz',
			'2_0': 6,
			'2_1': 7,
			'2_2': 8,
			'2_4': 9,
		}
	);

	assert.equal(
		input_string,
		JSON.stringify(input),
		'~> no input mutation'
	);

});


test('array :: object', () => {
	let baz = ['hello', null, 'world'];
	let bbb = { foo: 123, bar: 456, baz };

	let input = [
		{ aaa: 1, bbb, ccc: [4, 5] },
		{ aaa: 2, bbb, ccc: [null] },
		{ aaa: 3, bbb, ccc: [9999] },
	];

	let input_string = JSON.stringify(input);

	assert.equal(
		flattie(input), {
			'0_aaa': 1,
			'0_bbb_foo': 123,
			'0_bbb_bar': 456,
			'0_bbb_baz_0': 'hello',
			'0_bbb_baz_2': 'world',
			'0_ccc_0': 4,
			'0_ccc_1': 5,

			'1_aaa': 2,
			'1_bbb_foo': 123,
			'1_bbb_bar': 456,
			'1_bbb_baz_0': 'hello',
			'1_bbb_baz_2': 'world',

			'2_aaa': 3,
			'2_bbb_foo': 123,
			'2_bbb_bar': 456,
			'2_bbb_baz_0': 'hello',
			'2_bbb_baz_2': 'world',
			'2_ccc_0': 9999,
		}
	);

	assert.equal(
		flattie(input, '.'), {
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
		input_string,
		JSON.stringify(input),
		'~> no input mutation'
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

			'1_a': 1,
			'1_b_0_0_a': 1,
			'1_b_0_0_b_0': 2,
			'1_b_0_0_b_2': 9,
			'1_b_0_0_c_a_0': 1,
			'1_b_0_0_c_b_foo_0': 2,
			'1_b_0_0_c_b_foo_1': 2,
			'1_b_0_0_d': 4,
			'1_b_1_0_a': 2,
			'1_b_1_0_b_0': 4,
			'1_b_1_0_b_2': 9,
			'1_b_1_0_c_a_0': 2,
			'1_b_1_0_c_b_foo_0': 4,
			'1_b_1_0_c_b_foo_1': 4,
			'1_b_1_0_d': 5,
			'1_b_2_0_a': 3,
			'1_b_2_0_b_0': 6,
			'1_b_2_0_b_2': 9,
			'1_b_2_0_c_a_0': 4,
			'1_b_2_0_c_b_foo_0': 8,
			'1_b_2_0_c_b_foo_1': 8,
			'1_b_2_0_d': 6,
			'1_c': 3,
			'1_d_bar_0_a': 1,
			'1_d_bar_0_b': 2,
			'1_d_bar_0_c_0_a': 1,
			'1_d_bar_0_c_0_b_c': 3,
			'1_d_bar_0_c_1_a': 2,
			'1_d_bar_0_c_1_b_c': 4,
			'1_d_bar_0_d': 4,
			'1_d_baz_0_a': 2,
			'1_d_baz_0_b': 3,
			'1_d_baz_0_c_0_a': 2,
			'1_d_baz_0_c_0_b_c': 4,
			'1_d_baz_0_c_1_a': 3,
			'1_d_baz_0_c_1_b_c': 5,
			'1_d_baz_0_d': 5,

			'2': 'world',

			'3_a': 1,
			'3_b_0_0_a': 1,
			'3_b_0_0_b_0': 2,
			'3_b_0_0_b_2': 9,
			'3_b_0_0_c_a_0': 1,
			'3_b_0_0_c_b_foo_0': 2,
			'3_b_0_0_c_b_foo_1': 2,
			'3_b_0_0_d': 4,
			'3_b_1_0_a': 2,
			'3_b_1_0_b_0': 4,
			'3_b_1_0_b_2': 9,
			'3_b_1_0_c_a_0': 2,
			'3_b_1_0_c_b_foo_0': 4,
			'3_b_1_0_c_b_foo_1': 4,
			'3_b_1_0_d': 5,
			'3_b_2_0_a': 3,
			'3_b_2_0_b_0': 6,
			'3_b_2_0_b_2': 9,
			'3_b_2_0_c_a_0': 4,
			'3_b_2_0_c_b_foo_0': 8,
			'3_b_2_0_c_b_foo_1': 8,
			'3_b_2_0_d': 6,
			'3_c': 3,
			'3_d_bar_0_a': 1,
			'3_d_bar_0_b': 2,
			'3_d_bar_0_c_0_a': 1,
			'3_d_bar_0_c_0_b_c': 3,
			'3_d_bar_0_c_1_a': 2,
			'3_d_bar_0_c_1_b_c': 4,
			'3_d_bar_0_d': 4,
			'3_d_baz_0_a': 2,
			'3_d_baz_0_b': 3,
			'3_d_baz_0_c_0_a': 2,
			'3_d_baz_0_c_0_b_c': 4,
			'3_d_baz_0_c_1_a': 3,
			'3_d_baz_0_c_1_b_c': 5,
			'3_d_baz_0_d': 5,
		}
	);

	assert.equal(
		input_string,
		JSON.stringify(input),
		'~> no input mutation'
	);
});

test.run();
