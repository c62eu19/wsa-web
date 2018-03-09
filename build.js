/**
 * build.js
 * Contains Node Server-specific code.
 * 
 * @author Stan Zajdel
*/

var deploy = require("./deploy");

/* 
 * Read Command line arguments and route from there
 * 
 * Delete all files in deployment directories
 * 
 * Read all js files and combine into one js deployment file. Copy to js directory
 * Read all css files. Copy each to the css deployment directory
 * Read all image files. Copy each to the images directory
 * 
 * Read the container.txt file in the container folder
 * Read all template files in the templates folder
 * Add all templates to the container file and save as app.html
 * 
 * app.html is the main page of the app
*/
console.log('MyDrawer (Init): Reading Template files');

 var srcJsFolder = "/App-Workspace/my-drawer-web/js";
var srcCssFolder = "/App-Workspace/my-drawer-web/css";
var srcImagesFolder = "/App-Workspace/my-drawer-web/images";
var srcTemplatesFolder = "/App-Workspace/my-drawer-web/templates";
var srcContainerFolder = "/App-Workspace/my-drawer-web/container";

var targetJsFolder = "./js";
var targetCssFolder = "./css";
var targetImagesFolder = "./images";

var appHtml = "./app.html";

var cssBundle = deploy.bundle(srcCssFolder);

var minifiedCssBundle = deploy.minify(cssBundle);

console.log(minifiedCssBundle);

var templateBundle = deploy.bundle(srcTemplatesFolder);

var minifiedTemplateBundle = deploy.minify(templateBundle);

console.log(minifiedTemplateBundle);

/*
console.log('MyDrawer (Init): Reading container.txt file');

var containerFile = fs.readFileSync('./container/container.txt', 'utf8');

var appHtml = containerFile.replace(/{{templates}}/g, templates);

console.log('MyDrawer (Init): Creating app.html file');

fs.writeFile('./app.html', appHtml,  function(err) {
	if (err) {
		return console.error(err);
	}
});

var test = "";
fs.readFile('./app.html', 'utf-8', (err, file) => {
	const lines = file.split('\n')

	  for (let line of lines) {
		  var foo = line.replace(/\r?\n?/g, '');
		  test += foo.trim();
		  }
	console.log(test);
 });

var jstest = "";
fs.readFile('./js/drawer.js', 'utf-8', (err, file) => {
	const lines = file.split('\n')

	  for (let line of lines) {
		  var foo = line.replace(/\r?\n?/g, '');
		  jstest += foo.trim();
		  }
	console.log(jstest);
 });

console.log('MyDrawer (Init): Reading router app.json file');

*/
