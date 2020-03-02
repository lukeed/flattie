import test from 'tape';
import flat from '../src';

test('flat-obj', t => {
	t.is(typeof flat, 'function', 'exports a function');
	t.end();
});

test('simple', t => {
	let c = { foo:'bar', baz:'bat' };
	let val = flat({ a:1, b:2, c, d:4 });
	t.deepEqual(val, { a:1, b:2, c_foo:'bar', c_baz:'bat', d:4 });
	t.end();
});

test('custom glue', t => {
	let c = { x:7, y:8, z:9 };
	let val = flat({ a:1, b:4, c, d:5 }, 'FOO');
	t.deepEqual(val, { a:1, b:4, cFOOx:7, cFOOy:8, cFOOz:9, d:5 });
	t.end();
});

test('ignore empty values', t => {
	let val = flat({
		a: 123,
		b: { a:null, b:undefined, c:'', d:0, e:'hi' },
		c: null
	});
	t.deepEqual(val, { a:123, b_c:'', b_d:0, b_e:'hi' }, 'keeps 0 and empty string');
	t.end();
});

test('multi-nested flattening', t => {
	let val = flat({
		a: 1,
		b: { a:2, b:3, c:{ a:4, b:null, c:5 } },
		c: 6
	});
	t.deepEqual(val, { a:1, b_a:2, b_b:3, b_c_a:4, b_c_c:5, c:6 });
	t.end();
});

test('with array keys', t => {
	let val = flat({
		a: 1,
		b: [
			{ a:1, b:2, c:{ a:1, b:2 }, d:4 },
			{ a:2, b:4, c:{ a:2, b:4 }, d:5 },
			{ a:3, b:6, c:{ a:4, b:8 }, d:6 }
		],
		c: 3,
		d: [
			{ a:1, b:2, c:[{ a:1, b:{ c:3 } }, { a:2, b:{ c:4 } }], d:4 },
			{ a:2, b:3, c:[{ a:2, b:{ c:4 } }, { a:3, b:{ c:5 } }], d:5 },
		]
	});
	t.deepEqual(val, {
		a: 1,
		b: [
			{ a:1, b:2, c_a:1, c_b:2, d:4 },
			{ a:2, b:4, c_a:2, c_b:4, d:5 },
			{ a:3, b:6, c_a:4, c_b:8, d:6 },
		],
		c: 3,
		d: [
			{ a:1, b:2, c:[{ a:1, b_c:3 }, { a:2, b_c:4 }], d:4 },
			{ a:2, b:3, c:[{ a:2, b_c:4 }, { a:3, b_c:5 }], d:5 }
		]
	});
	t.end();
});
