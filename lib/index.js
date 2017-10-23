function flatObj(obj, sep) {
	var k, v, j, tmp, out={};
	sep = sep || '_';

	for (k in obj) {
		v = obj[k];
		if (typeof v === 'object') {
			tmp = flatObj(v, sep);
			for (j in tmp) {
				if (tmp[j] !== void 0) {
					out[k + sep + j] = tmp[j];
				}
			}
		} else {
			out[k] = v;
		}
	}
	return out;
}

module.exports = flatObj;
