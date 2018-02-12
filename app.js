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

var custom = require('./js/custom.js');

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

console.log('MyDrawer (Init): Reading router configure.json file');

/* Read the Router config file */
var json = JSON.parse(fs.readFileSync('./configure.json', 'utf8'));

/* Request handler, routes all requests to the appropriate handler */
const requestHandler = function(request, response) {

	try {
		/* Get the handler function that will handle the request */
		var handler = getConfigValue(request.url,"handler");

		/* Do the actual routing */
		global[handler](request, response);
	}
	catch(e) {
		console.log("RequestHandler: " + e);
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
		value = json[key][attribute];
	}
	catch(e) {
		console.log("Cannot find resource: " + e);
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
		console.log("writeContent: " + e);
	}
};


/* Handles posted contact us data */
postContactUsData = function(request, response) {

	try {
		var body = "";

		request.on('data', function(data) {
			body += data;
		});

		request.on('end',function() {
			var json = qs.parse(body);
			var inputJSON = JSON.parse(json.inputJSON);

			var app = inputJSON.app;
			var emailFrom = inputJSON.emailFrom;
			var emailMsg = inputJSON.emailMsg;
			var emailSubj = inputJSON.emailSubj;

			console.log(app + "," + emailFrom + "," + emailSubj + "," + emailMsg);
		});

custom.handleContactUsData(request, response);

		/* Get the template */

		var filePath = getConfigValue("/","path");

		console.log('Request: ', request.url + " -> " + filePath);

		var extName = String(path.extname(filePath)).toLowerCase();

		var contentType = 'text/html';

		contentType = 'text/html' || 'application/octet-stream';

		/* Write the content to the browser */
		writeContent(response, filePath, contentType);
	}
	catch(e) {
		console.log("postContactUsData: " + e);
	}
};

