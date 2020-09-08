export function flattie(obj, sep) {
	var k, v, j, tmp, out={};
	sep = sep || '_';

	if (Array.isArray(obj)) {
		for (k=0; k < obj.length; k++) {
			v = obj[k];
			if (v == null) {
			} else if (typeof v == 'object') {
				tmp = flattie(v, sep);
				for (j in tmp) out[k + sep + j] = tmp[j];
			} else {
				out[k] = v;
			}
		}
	} else if (typeof obj == 'object') {
		for (k in obj) {
			v = obj[k];
			if (v == null) {
			} else if (typeof v == 'object') {
				tmp = flattie(v, sep);
				for (j in tmp) out[k + sep + j] = tmp[j];
			} else {
				out[k] = v;
			}
		}
	}

	return out;
}
