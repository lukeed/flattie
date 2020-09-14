function iter(output, nullish, sep, val, key) {
	var k, pfx = key ? (key + sep) : key;

	if (val == null) {
		if (nullish) output[key] = val;
	} else if (typeof val != 'object') {
		output[key] = val;
	} else if (Array.isArray(val)) {
		let index = val.length;
    while (index--) {
      iter(output, nullish, sep, val[index], pfx + index);
    }
	} else {
		for (k in val) {
			iter(output, nullish, sep, val[k], pfx + k);
		}
	}
}

export function flattie(input, glue, toNull) {
	var output = {};
	if (typeof input == 'object') {
		iter(output, !!toNull, glue || '.', input, '');
	}
	return output;
}
