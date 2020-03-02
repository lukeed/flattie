export default function flatten(obj, sep) {
	var k, v, j, tmp, out={};
	sep = sep || '_';

	for (k in obj) {
		v = obj[k];
		if (v == null) {
			continue;
		} else if (Array.isArray(v)) {
			out[k] = v.map(o => flatten(o, sep));
		} else if (typeof v === 'object') {
			tmp = flatten(v, sep);
			for (j in tmp) {
				out[k + sep + j] = tmp[j];
			}
		} else {
			out[k] = v;
		}
	}

	return out;
}
