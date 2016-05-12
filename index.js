'use strict';

/**
 * Flatten an Object into a single-depth Object
 * @param  {Object} obj
 * @param  {String} glue
 * @return {Object}
 */
function flatObj(obj, glue) {
	var out = {};
	glue = glue || '_';

	for (var k in obj) {
		if ((typeof obj[k]) === 'object') {
			var flat = flatObj(obj[k], glue);
			for (var x in flat) {
				if (flat.hasOwnProperty(x) && flat[x]) {
					out[k + glue + x] = flat[x];
				}
			}
		} else {
			out[k] = obj[k];
		}
	}
	return out;
}

module.exports = flatObj;
