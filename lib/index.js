function flatObj(obj, sep) {
	var k, v, j, tmp, out={};
	sep = sep || '_';

	for (k in obj) {
		v = obj[k];
		if (v == null) {
			continue;
		} else if (Array.isArray(v)) {
			out[k] = v.map(o => flatObj(o, sep));
		} else if (typeof v === 'object') {
			tmp = flatObj(v, sep);
			for (j in tmp) {
				out[k + sep + j] = tmp[j];
			}
		} else {
			out[k] = v;
		}
	}
	return out;
}

module.exports = flatObj;
