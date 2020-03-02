const assert = require('assert');
const { Suite } = require('benchmark');

const contenders = {
	'flat': require('flat'),
	'flatten-object': require('flatten-object'),
	'flat-obj@1.x': require('flat-obj'),
	'flat-obj': require('../dist'),
};

console.log('Validation: ');
Object.keys(contenders).forEach(name => {
	try {
		const c = { a:4, b:null, c:123 };
		const b = { a:2, b:3, c, d:'foo' };
		const obj = { a:1, b, c:6, d:456 };

		const output = contenders[name](obj);
		assert.notEqual(typeof output['b'], 'object');
		assert.notDeepEqual(output, obj);

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
