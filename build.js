/**
 * build.js
 * Contains Node Server-specific code.
 * 
 * @author Stan Zajdel
*/

var fs = require('fs');

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

/* Read the Router config file */
var json = JSON.parse(fs.readFileSync('./app.json', 'utf8'));

for(var i = 0; i < json.length; i++) {

	console.log(json[i].path);
}

