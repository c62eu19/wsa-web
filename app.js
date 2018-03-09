/**
 * app.js
 * Contains Node Server-specific code.
 * 
 * @author Stan Zajdel
*/

var http = require('http');
var url = require("url");
var fs = require('fs');
var path = require('path');
var qs = require('querystring');

/* 
 * Read the container.txt file in the container folder
 * Read all template files in the templates folder
 * Add all templates to the container file and save as app.html
 * 
 * app.html is the main page of the app
*/
console.log('MyDrawer (Init): Reading Template files');

var templates = "";

var dir = './templates';

var files = fs.readdirSync(dir);

for(var i in files) {
	var name = dir + '/' + files[i];

	templates += fs.readFileSync(name, 'utf8');
}

console.log('MyDrawer (Init): Reading container.txt file');

var containerFile = fs.readFileSync('./container/container.txt', 'utf8');

var appHtml = containerFile.replace(/{{templates}}/g, templates);

console.log('MyDrawer (Init): Creating app.html file');

fs.writeFile('./app.html', appHtml,  function(err) {
	if (err) {
		return console.error(err);
	}
});

/* Request handler, routes all requests to the appropriate handler */
const requestHandler = function(request, response) {

	try {
		/* Get the handler function that will handle the request */
		var handler = getConfigValue(request.url,"handler");

		/* Do the actual routing */
		global[handler](request, response);
	}
	catch(e) {
		console.log("requestHandler(): " + e);
	}
};

/* Create the server and listen on port 8081 */
const server = http.createServer(requestHandler)

var port = 8081;

server.listen(port, function(err) {  
	if(err) {
		return console.log('MyDrawer (Init): Failure: Unable to start the MyDrawer server', err);
	}

	console.log('MyDrawer (Init): Server is listening now on Port ' + port + '. Ready to serve YOU!');
});

/* Gets and serves all web resources */
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

/* Utility Read app config file for all app content */
getConfigValue = function(key, attribute) {

	var value = "";

	try {
		value = resources[key][attribute];
	}
	catch(e) {
		console.log("getConfigValue(): Cannot find resource: " + e);
	}

	return value;
};

/* Write content out to browser */
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