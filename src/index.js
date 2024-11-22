/**
 * Recursively iterates over a value (object or array) and flattens it into an output object.
 *
 * @param {Object} output - The object to which the flattened key-value pairs will be added.
 * @param {*} val - The current value to process; could be a primitive, object, or array.
 * @param {Object} options - Options for the iteration process.
 * @param {boolean} options.nullish - Whether to include nullish values (null, undefined) in the output.
 * @param {string} options.sep - The separator string used to concatenate nested keys.
 * @param {string} options.key - The current key being processed, used to build the flattened key.
 * @param {function} [options.transformKey] - An optional function to transform keys during processing.
 */
function iter(output, val, options) {

	const {
		nullish,
		sep,
		key,
		transformKey,
	} = options || {};

	var k, pfx = key ? (key + sep) : key;

	if (val == null) {
		if (nullish) output[key] = val;
	} else if (typeof val != 'object') {
		output[key] = val;
	} else if (Array.isArray(val)) {
		for (k = 0; k < val.length; k++) {
			iter(output, val[k], { nullish, sep, key: pfx + k, transformKey });
		}
	} else {
		for (k in val) {
			iter(output, val[k], { nullish, sep, key: pfx + (transformKey ? transformKey(pfx, k) : k), transformKey });
		}
	}
}

/**
 * Recursively iterate over an object or array and flatten it into a new
 * object.
 *
 * @param {Object} input - The value to flatten.
 * @param {string} [glue='.'] - The glue to use for joining nested keys. Can be
 *     an empty string if {@link options.allowGlueEmptyString} is true.
 * @param {boolean} [toNull=false] - Whether to include nullish values in the
 *     output.
 * @param {Object} [options] - Options for the iteration.
 * @param {boolean} [options.allowGlueEmptyString=false] - Allow an empty glue
 *     string.
 * @param {function} [options.transformKey] - A function to call on each key.
 *     The function should get pfx and key as inputs and return a new string. If not provided, the key will
 *     not be transformed.
 *
 * @returns {Object} - The flattened object.
 */
export function flattie(input, glue, toNull, options = {}) {
	var output = {};

	if (options && options.transformKey && typeof options.transformKey !== 'function') {
		throw new Error('value of options.transformKey must be a function returning a string');
	}

	if (typeof input == 'object') {
		iter(output, input, {
			nullish: !!toNull,
			sep: (glue || ( glue == "" && options.allowGlueEmptyString )) ? glue : '.',
			key: '',
			transformKey: options.transformKey,
		});
	}
	return output;
}

