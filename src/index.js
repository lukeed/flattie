function iter(output, sep, val, key) {
	var k, pfx = key ? (key + sep) : key;

	if (Array.isArray(val)) {
		for (k=0; k < val.length; k++) {
			iter(output, sep, val[k], pfx + k);
		}
	} else if (val && typeof val == 'object') {
		for (k in val) iter(output, sep, val[k], pfx + k);
	} else if (val !== void 0) {
		output[key] = val;
	}
}

export function flattie(input, sep) {
	var output = {};
	if (input && typeof input == 'object') {
		iter(output, sep || '.', input, '');
	}
	return output;
}
