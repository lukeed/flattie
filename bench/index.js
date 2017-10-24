const flat = require('flat');
const Table = require('cli-table2');
const { Suite } = require('benchmark');
const flattenObject = require('flatten-object');
const flattenObjectStrict = require('flatten-object-strict');
const previous = require('flat-obj');
const qFlat = require('q-flat');
const curr = require('../lib');

const bench = new Suite();

const c = { a:4, b:null, c:123 };
const b = { a:2, b:3, c, d:'foo' };
const obj = { a:1, b, c:6, d:456 };

bench
	.add('flat-obj', () => curr(obj))
	.add('flat', () => flat(obj))
	.add('flatten-object', () => flattenObject(obj))
	.add('flat-obj (previous)', () => previous(obj))
	.on('cycle', e => console.log(String(e.target)))
	.on('complete', function() {
		console.log('Fastest is ' + this.filter('fastest').map('name'));

		const tbl = new Table({
			head: ['Name', 'Mean time', 'Ops/sec', 'Diff']
		});

		let prev, diff;

		bench.forEach(el => {
			if (prev) {
				diff = ((el.hz - prev) * 100 / prev).toFixed(2) + '% faster';
			} else {
				diff = 'N/A'
			}
			prev = el.hz;
			tbl.push([el.name, el.stats.mean, el.hz.toLocaleString(), diff])
		});
		console.log(tbl.toString());
	})
	.run();
