var exports = module.exports = {};

var fs = require('fs');

/**
 * Deployment functions
*/
bundle = function(srcFolder) {

	var bundledFiles = "";

	try {
		var files = fs.readdirSync(srcFolder);

		for(var i in files) {
			var filePath = srcFolder + '/' + files[i];

			bundledFiles += fs.readFileSync(filePath, 'utf8');
		}
	}
	catch(e) {
		console.log("bundle(): " + e);
	}

	return bundledFiles;
};

minify = function(unminifiedData) {

	var minifiedData = "";

	try {
		/*
		 * Need to remove comments also
		 */

		const lines = unminifiedData.split('\n')

		for (let line of lines) {
			var sanitizedLine = line.replace(/\r?\n?/g, '');
			minifiedData += sanitizedLine.trim();
		}
	}
	catch(e) {
		console.log("minify(): " + e);
	}

	return minifiedData;
};

exports.bundle = bundle;
exports.minify = minify;
