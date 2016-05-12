/* eslint camelcase:0 */

import test from 'ava';
import fn from './';

const fixture = {
	a: 'hello',
	b: 'there',
	c: {
		breeze: 'sea',
		saw: 'see'
	},
	d: 'end'
};

test('default behavior', t => {
	t.deepEqual(fn(fixture), {
		a: 'hello',
		b: 'there',
		c_breeze: 'sea',
		c_saw: 'see',
		d: 'end'
	});
});

test('custom glue', t => {
	t.deepEqual(fn(fixture, 'HI'), {
		a: 'hello',
		b: 'there',
		cHIbreeze: 'sea',
		cHIsaw: 'see',
		d: 'end'
	});
});

test('ignore empty values', t => {
	const fix = {
		a: 'hi',
		b: {
			a: null, b: undefined, c: '', d: 'hi'
		},
		c: null
	};
	t.deepEqual(fn(fix), {a: 'hi', b_d: 'hi'});
});

test('multi-nested flattening', t => {
	const fix = {
		a: 'hi',
		b: {
			a: 'hi',
			b: 'yo',
			c: {
				a: 'howdy',
				b: 'hello'
			}
		},
		c: 'sup'
	};
	t.deepEqual(fn(fix), {
		a: 'hi',
		b_a: 'hi',
		b_b: 'yo',
		b_c_a: 'howdy',
		b_c_b: 'hello',
		c: 'sup'
	});
});
