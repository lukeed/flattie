const test = require('tape');
const fix = require('./fixtures');
const fn = require('../lib');

test('flat-obj', t => {
	t.is(typeof fn, 'function', 'exports a function');
	t.end();
});

test('simple', t => {
	t.deepEqual(fn(fix.foo), {
		a: 'hello',
		b: 'there',
		c_breeze: 'sea',
		c_saw: 'see',
		d: 'end'
	});
	t.end();
});

test('custom glue', t => {
	t.deepEqual(fn(fix.foo, 'HI'), {
		a: 'hello',
		b: 'there',
		cHIbreeze: 'sea',
		cHIsaw: 'see',
		d: 'end'
	});
	t.end();
});

test('ignore empty values', t => {
	t.deepEqual(fn(fix.bar), {
		a: 'hi',
		b_d: 'hi'
	});
	t.end();
});

test('multi-nested flattening', t => {
	t.deepEqual(fn(fix.baz), {
		a: 'hi',
		b_a: 'hi',
		b_b: 'yo',
		b_c_a: 'howdy',
		b_c_b: 'hello',
		c: 'sup'
	});
	t.end();
});
