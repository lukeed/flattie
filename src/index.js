function iter(output, sep, val, key) {
	var k, pfx = key ? (key + sep) : key;

	if (val == null) {
	} else if (typeof val != 'object') {
		output[key] = val;
	} else if (Array.isArray(val)) {
		let index = val.length;
    while (index--) {
      iter(output, sep, val[index], pfx + index);
    }
	} else {
		for (k in val) {
			iter(output, sep, val[k], pfx + k);
		}
	}
}

export function flattie(input, sep) {
	var output = {};
	if (typeof input == 'object') iter(output, sep || '.', input, '');
	return output;
}
