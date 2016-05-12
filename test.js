/* eslint camelcase:0 */

import test from 'ava';
import {fix1, fix2, fix3} from './fixtures';
import fn from './';

test('default behavior', t => {
	t.deepEqual(fn(fix1), {
		a: 'hello',
		b: 'there',
		c_breeze: 'sea',
		c_saw: 'see',
		d: 'end'
	});
});

test('custom glue', t => {
	t.deepEqual(fn(fix1, 'HI'), {
		a: 'hello',
		b: 'there',
		cHIbreeze: 'sea',
		cHIsaw: 'see',
		d: 'end'
	});
});

test('ignore empty values', t => {
	t.deepEqual(fn(fix2), {
		a: 'hi',
		b_d: 'hi'
	});
});

test('multi-nested flattening', t => {
	t.deepEqual(fn(fix3), {
		a: 'hi',
		b_a: 'hi',
		b_b: 'yo',
		b_c_a: 'howdy',
		b_c_b: 'hello',
		c: 'sup'
	});
});
