const assert = require('uvu/assert');
const { Suite } = require('benchmark');

console.log('\nLoad Time: ');

console.time('flat');
const flat = require('flat');
console.timeEnd('flat');

console.time('flatten-object');
const flattenObject = require('flatten-object');
console.timeEnd('flatten-object');

console.time('flat-obj');
const flatObj = require('flat-obj');
console.timeEnd('flat-obj');

console.time('flattie');
const { flattie } = require('../dist');
console.timeEnd('flattie');

const contenders = {
	'flat': flat,
	'flatten-object': flattenObject,
	'flat-obj': flatObj,
	'flattie': flattie,
};

console.log('\nValidation: ');
Object.keys(contenders).forEach(name => {
	try {
		const c = { a:4, b:null, c:123 };
		const b = { a:2, b:3, c, d:'foo' };
		const obj = { a:1, b, c:6, d:456, e:[1,2,3] };

		const output = contenders[name](obj);
		assert.not.type(output['b'], 'object');
		assert.not.instance(output['e'], Array);
		assert.not.equal(output, obj);

		console.log('  ✔', name);
	} catch (err) {
		console.log('  ✘', name, `(FAILED)`);
	}
});


console.log('\nBenchmark:');
const bench = new Suite().on('cycle', e => {
	console.log('  ' + e.target);
});

Object.keys(contenders).forEach(name => {
	bench.add(name + ' '.repeat(18 - name.length), () => {
		contenders[name]({
			a: 1,
			b: {
				a: 2,
				b: 3,
				c: {
					a: 4,
					b: null,
					c: [1, 2, 3],
					d: 456
				},
				d: 'foo'
			},
			c: 456
		});
	})
});

bench.run();
