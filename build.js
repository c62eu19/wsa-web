/**
 * build.js
 * Contains code to bundle web app files for deployment.
 * 
 * @author Stan Zajdel
*/
var exports = module.exports = {};

var fs = require("fs");

console.log("Building the App...");

var assets = {
	"css": {
		"src-dir": "/App-Workspace/my-drawer-web/css", 
		"tgt-dir":"./css", 
		"src-files":"*",
		"tgt-file":""
	},

	"images": {
		"src-dir": "/App-Workspace/my-drawer-web/images", 
		"tgt-dir":"./images", 
		"src-files":"*",
		"tgt-file":""
	},

	"js": {
		"src-dir": "/App-Workspace/my-drawer-web/js", 
		"tgt-dir":"./js", 
		"src-files":"*",
		"tgt-file":""
	},

	"app-js": {
		"src-dir": "/App-Workspace/my-drawer-web/", 
		"tgt-dir":"./",
		"src-files":"app.js",
		"tgt-file":"app.js"
	},

	"app-html": {
		"tgt-dir":"./",
		"tgt-file":"app.html",
		"templates": {
			"src-dir": "/App-Workspace/my-drawer-web/templates", 
			"src-files":"*"
		},
		"container": {
			"src-dir": "/App-Workspace/my-drawer-web/container", 
			"src-files":"container.txt"
		}
	}

};

/**
 * Build and Deployment functions
*/
start = function() {

	try {
		deployCssAssets();
		deployImageAssets();
		deployJsAssets();

		deployAppJsFile();
		deployAppHtmlFile();
	}
	catch(e) {
		console.log("start(): " + e);
	}
};

deployCssAssets = function() {

	try {
		console.log("..Deploying CSS Assets");

		var srcDir = assets["css"]["src-dir"];
		var tgtDir = assets["css"]["tgt-dir"];
		var srcFiles = assets["css"]["src-files"];
		var tgtFile = assets["css"]["tgt-file"];

		removeFiles(tgtDir);
		removeDir(tgtDir);
		createDir(tgtDir);

		var files = readFiles(srcDir, tgtDir, srcFiles);

		copyFiles(srcDir, tgtDir, files);
	}
	catch(e) {
		console.log("deployCssAssets(): " + e);
	}
};

deployImageAssets = function() {

	try {
		console.log("..Deploying Image Assets");

		var srcDir = assets["images"]["src-dir"];
		var tgtDir = assets["images"]["tgt-dir"];
		var srcFiles = assets["images"]["src-files"];
		var tgtFile = assets["images"]["tgt-file"];

		removeFiles(tgtDir);
		removeDir(tgtDir);
		createDir(tgtDir);

		var files = readFiles(srcDir, tgtDir, srcFiles);

		copyFiles(srcDir, tgtDir, files);
	}
	catch(e) {
		console.log("deployImageAssets(): " + e);
	}
};

deployJsAssets = function() {

	try {
		console.log("..Deploying Js Assets");

		var srcDir = assets["js"]["src-dir"];
		var tgtDir = assets["js"]["tgt-dir"];
		var srcFiles = assets["js"]["src-files"];
		var tgtFile = assets["js"]["tgt-file"];

		removeFiles(tgtDir);
		removeDir(tgtDir);
		createDir(tgtDir);

		var files = readFiles(srcDir, tgtDir, srcFiles);

		copyFiles(srcDir, tgtDir, files);
	}
	catch(e) {
		console.log("deployJsAssets(): " + e);
	}
};

deployAppJsFile = function() {

	try {
		console.log("..Deploying app.js file");

		var srcDir = assets["app-js"]["src-dir"];
		var tgtDir = assets["app-js"]["tgt-dir"];
		var srcFiles = assets["app-js"]["src-files"];
		var tgtFile = assets["app-js"]["tgt-file"];

		var files = readFiles(srcDir, tgtDir, srcFiles);

		copyFiles(srcDir, tgtDir, files);
	}
	catch(e) {
		console.log("deployAppJsFile(): " + e);
	}
};

deployAppHtmlFile = function() {

	try {
		console.log("..Deploying app.html file");

		var appHtmlTgtDir = assets["app-html"]["tgt-dir"];
		var appHtmlTgtFile = assets["app-html"]["tgt-file"];

		var templatesSrcDir = assets["app-html"]["templates"]["src-dir"];
		var templatesSrcFiles = assets["app-html"]["templates"]["src-files"];

		var containerSrcDir = assets["app-html"]["container"]["src-dir"];
		var containerSrcFiles = assets["app-html"]["container"]["src-files"];

		console.log("....Getting template files");
		var templatesFile = combineFiles(templatesSrcDir, templatesSrcFiles);

		console.log("....Getting container file");
		var containerFile = fs.readFileSync(containerSrcDir + "/" + containerSrcFiles, 'utf8');

		console.log("....Adding templates to the container file");
		var appHtml = containerFile.replace(/{{templates}}/g, templatesFile);

		console.log("....creating the app.html file");
		fs.writeFileSync(appHtmlTgtDir + "/" + appHtmlTgtFile, appHtml);
	}
	catch(e) {
		console.log("deployAppHtmlFile(): " + e);
	}
};

removeFiles = function(tgtDir) {

	try {
		console.log("....Removing old files");

		files = fs.readdirSync(tgtDir);

		for(var i in files) {
			var filePath = tgtDir + '/' + files[i];

			console.log("......removing: " + filePath);

			fs.unlinkSync(filePath);
		}
	}
	catch(e) {
		console.log("removeFiles(): " + e);
	}
};

removeDir = function(tgtDir) {

	try {
		console.log("....Removing directory");

		console.log("......removing: " + tgtDir);
		fs.rmdirSync(tgtDir);
	}
	catch(e) {
		console.log("removeDir(): " + e);
	}
};

createDir = function(tgtDir) {

	try {
		console.log("....Creating target directory");

		console.log("......creating: " + tgtDir);
		fs.mkdirSync(tgtDir);
	}
	catch(e) {
		console.log("createDir(): " + e);
	}
};

readFiles = function(srcDir, tgtDir, srcFiles) {

	var files = [];

	try {
		console.log("....Reading source files");

		if(srcFiles == null || srcFiles == "*" || srcFiles.trim().length <= 0) {
			files = fs.readdirSync(srcDir);

		} else {
			files = splitFiles(srcFiles);
		}
	}
	catch(e) {
		console.log("readFiles(): " + e);
	}

	return files;
};

combineFiles = function(srcDir, srcFiles) {

	var combinedFiles = "";

	try {
		console.log("....Combining source files");

		var files = [];

		if(srcFiles == null || srcFiles == "*" || srcFiles.trim().length <= 0) {
			files = fs.readdirSync(srcDir);

		} else {
			files = splitFiles(srcFiles);
		}

		for(var i in files) {
			var filePath = srcDir + '/' + files[i];

			combinedFiles += fs.readFileSync(filePath, 'utf8');
		}
	}
	catch(e) {
		console.log("combineFiles(): " + e);
	}

	return combinedFiles;
};

copyFiles = function(srcDir, tgtDir, files) {

	try {
		console.log("....Copying source files to target directory");

		var srcFilePath = srcDir + '/' + files[i];

		for(var i in files) {
			var filePath = srcDir + '/' + files[i];

			var fileData = fs.readFileSync(filePath, 'utf8');

			/*
			 * Cleanse and Minify if desired
			 */

			var tgtFilePath = tgtDir + "/" + files[i];

			console.log("......Copying: " + tgtFilePath);

			fs.writeFileSync(tgtFilePath, fileData);
		}
	}
	catch(e) {
		console.log("copyFiles(): " + e);
	}
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

cleanse = function(uncleansedData) {

	var cleansedData = "";

	try {
		/*
		 * remove all comments
		 */
		cleansedData = uncleansedData.replace(/\/\*[\s\S]*?\*V|([^\\:]|^}\/\/.*$/gm,"");
	}
	catch(e) {
		console.log("cleansed(): " + e);
	}

	return cleansedData;
};

splitFiles = function(fileTokens) {

	var files = [];

	try {
		if(fileTokens != null && fileTokens.trim().length > 0) {
				
			var tokens = fileTokens.split(",");

			for(i=0; i<tokens.length; i++) {
				files.push(tokens[i]);
			}
		} else {
			files = [];
		}
	}
	catch(e) {
		console.log("splitFiles(): " + e);
		files = [];
	}

	return files;
};

exports.start = start;
exports.deployCssAssets = deployCssAssets;
exports.deployImageAssets = deployImageAssets;
exports.deployJsAssets = deployJsAssets;
exports.deployAppJsFile = deployAppJsFile;
exports.deployAppHtmlFile = deployAppHtmlFile;
exports.removeFiles = removeFiles;
exports.removeDir = removeDir;
exports.createDir = createDir;
exports.readFiles = readFiles;
exports.combineFiles = combineFiles;
exports.copyFiles = copyFiles;
exports.minify = minify;
exports.cleanse = cleanse;
