/**
 * app.js
 * 
 * Node Server code for the MyDrawer app
 * 
 * @author Stan Zajdel
 */

var http = require('http');
var url = require("url");
var fs = require('fs');
var path = require('path');
var qs = require('querystring');

/* 
 * Request handler, routes all requests to the appropriate handler
 */
const requestHandler = function(request, response) {

	try {
		/* Get the handler function that will handle the request */
		var handler = getConfigValue(request.url,"handler");

		/* Do the actual routing */
		global[handler](request, response);
	}
	catch(e) {
		console.log("requestHandler(): " + request.url + ": " + e);
	}
};

/*
 *  Create the server and listen on port 8081
 */  
const server = http.createServer(requestHandler)

var port = 8081;

server.listen(port, function(err) {  
	if(err) {
		return console.log('MyDrawer (Init): Failure: Unable to start the MyDrawer server', err);
	}

	console.log('MyDrawer (Init): Server is listening now on Port ' + port + '. Ready to serve YOU!');
});

/*
 *  Gets and serves all web resources
 */
getResource = function(request, response) {

	try {
		var filePath = getConfigValue(request.url,"path");

		console.log('MyDrawer (Request): ', request.url + " -> " + filePath);

		var extName = String(path.extname(filePath)).toLowerCase();

		var contentType = 'text/html';

		var mimeTypes = {
			'.html': 'text/html',
			'.js': 'text/javascript',
			'.css': 'text/css',
			'.json': 'application/json',
			'.png': 'image/png',
			'.jpg': 'image/jpg',
			'.gif': 'image/gif',
			'.ico': 'image/ico',
			'.wav': 'audio/wav',
			'.mp4': 'video/mp4',
			'.woff': 'application/font-woff',
			'.ttf': 'application/font-ttf',
			'.eot': 'application/vnd.ms-fontobject',
			'.otf': 'application/font-otf',
			'.svg': 'application/image/svg+xml'
		};

		contentType = mimeTypes[extName] || 'application/octet-stream';

		/* Write the content to the browser */
		writeContent(response, filePath, contentType);
	}
	catch(e) {
		console.log("getResource: " + e);
	}
};

/*
 *  Default method for all non-resource calls
 */
getDefault = function(request, response) {

	try {
	}
	catch(e) {
		console.log("getDefault: " + e);
	}
};

/*
 * Utility Read app config file for all app content
 */
getConfigValue = function(key, attribute) {

	var value = "";

	try {
		value = resources[key][attribute];

		if(value == "undefined" || value == null) {
			value = "getDefault"
		}
	}
	catch(e) {
		console.log("getConfigValue(): Value not found, call getDefault method");
		value = "getDefault"
	}

	return value;
};

/* 
 * Write content out to browser
 */
writeContent = function(response, filePath, contentType) {

	try {
		fs.readFile(filePath, function(error, content) {
			if(error) {
				if(error.code == 'ENOENT') {
					fs.readFile('./404.html', function(error, content) {
						response.writeHead(200, { 'Content-Type': contentType });
						response.end(content, 'utf-8');
					});

				} else {
					response.writeHead(500);
					response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
					response.end();
	 			}

			} else {
				response.writeHead(200, { 'Content-Type': contentType });
				response.end(content, 'utf-8');
			}
		});
	}
	catch(e) {
		console.log("writeContent(): " + e);
	}
};

readFile = function(filePath) {

	var fileData;

	try {
		fileData = fs.readFileSync(filePath, 'utf8');
	}
	catch(e) {
		console.log("readFiles(): " + e);
	}

	return fileData;
};

/*
 * All Resources for the app
 */
var resources = {
	"/mydrawer": {
		"path": "./app.html", 
		"method":"GET", 
		"handler":"getResource"
	},

	"/normalize-css": {
		"path": "./css/normalize.css", 
		"method":"GET", 
		"handler":"getResource"
	},
	"/skeleton-css": {
		"path": "./css/skeleton.css", 
		"method":"GET", 
		"handler":"getResource"
	},
	"/style-css": {
		"path": "./css/style.css", 
		"method":"GET", 
		"handler":"getResource"
	},

	"/drawer-js": {
		"path": "./js/drawer.js", 
		"method":"GET", 
		"handler":"getResource"
	},
	"/library-js": {
		"path": "./js/library.js", 
		"method":"GET", 
		"handler":"getResource"
	},

	"/favicon-image": {
		"path": "./images/favicon.ico", 
		"method":"GET", 
		"handler":"getResource"
	},
	"/search-image": {
		"path": "./images/search.png", 
		"method":"GET", 
		"handler":"getResource"
	}
}