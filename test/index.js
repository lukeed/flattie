const test = require('tape');
const fn = require('../lib');

test('flat-obj', t => {
	t.is(typeof fn, 'function', 'exports a function');
	t.end();
});

test('simple', t => {
	let c = { foo:'bar', baz:'bat' };
	let val = fn({ a:1, b:2, c, d:4 });
	t.deepEqual(val, { a:1, b:2, c_foo:'bar', c_baz:'bat', d:4 });
	t.end();
});

test('custom glue', t => {
	let c = { x:7, y:8, z:9 };
	let val = fn({ a:1, b:4, c, d:5 }, 'FOO');
	t.deepEqual(val, { a:1, b:4, cFOOx:7, cFOOy:8, cFOOz:9, d:5 });
	t.end();
});

test('ignore empty values', t => {
	let val = fn({
		a: 123,
		b: { a:null, b:undefined, c:'', d:0, e:'hi' },
		c: null
	});
	t.deepEqual(val, { a:123, b_c:'', b_d:0, b_e:'hi' }, 'keeps 0 and empty string');
	t.end();
});

test('multi-nested flattening', t => {
	let val = fn({
		a: 1,
		b: { a:2, b:3, c:{ a:4, b:null, c:5 } },
		c: 6
	});
	t.deepEqual(val, { a:1, b_a:2, b_b:3, b_c_a:4, b_c_c:5, c:6 });
	t.end();
});
