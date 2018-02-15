/**
 * library.js
 * Contains general methods that can be used on any project.
 * 
 * NOTE: This file MUST be the first JS file to load
 * 
 * @author Stan Zajdel
*/

/*
 * Data Object for apps to use to house all relevant data
 */
var dataObj = {};

var component = {

	render: function(template, container, data) {

		try {
			var t = document.getElementById(template);
			var tHtml = t.innerHTML;

			Object.keys(data).forEach(function(key, idx) {
				var regex = new RegExp(key, "g");

				if(tHtml.indexOf(key) >= 0) {
					tHtml = tHtml.replace(regex, data[key]);
				}
			}); 

			document.getElementById(container).innerHTML = tHtml;
		}
		catch(err) {
			console.log("render(): " + err);
		}
		finally {}
	},

	create:	function(template, data) {

		var componentHtml = "";

		try {
			var t = document.getElementById(template);
			componentHtml = t.innerHTML;

			Object.keys(data).forEach(function(key, idx) {
				var regex = new RegExp(key, "g");

				if(componentHtml.indexOf(key) >- 0) {
					componentHtml = componentHtml.replace(regex, data[key]);
				}
			}); 
		}
		catch(err) {
			console.log("create(): " + err);
		}
		finally {}

		return componentHtml;
	},

	addEvent: function(event, elementId, callbackFunction, capture) {

		try {
			var element = document.getElementById(elementId);

			capture = capture ? true : false;

			element.addEventListener(event, callbackFunction, capture);
		}
		catch(err) {
			console.log("addEvent(): " + err);
		}
		finally {}
	}

};

var menu = {

	reset: function() {

		try {
			document.getElementById('id-hamburger').style.display = '';
			document.getElementById('id-cross').style.display = 'none';
		}
		catch(err) {
			console.log("reset(): " + err);
		}
		finally {}
	},

	openHamburger: function(e) {

		try {
			document.getElementById('id-hamburger').style.display = 'none';
			document.getElementById('id-cross').style.display = '';

			var tm = "";
			var tmHtml = "";

			dataObj.origTemplateContent = document.getElementById('template-content').innerHTML;

			if(isEmpty(dataObj.collectionName)) {
				var signedOutData = {};
				component.render("t-menu-signed-out", "template-content", signedOutData);

			} else {

				var trayListSelectTag = createTraySelectTag("", "add-onchange");

				var signedInData = {
					"{{favoriteTraTokens}}" : dataObj.favoriteTraTokens,
					"{{trayListSelectTag}}" : trayListSelectTag
				};

				component.render("t-menu-signed-in", "template-content", signedInData);
			}
		}
		catch(err) {
			console.log("openHamburger(): " + err);
		}
		finally {}
	},

	closeHamburger: function(e) {

		try {
			document.getElementById('id-cross').style.display = 'none';
			document.getElementById('id-hamburger').style.display = '';

			document.getElementById('template-content').innerHTML = dataObj.origTemplateContent;
		}
		catch(err) {
			console.log("closeHamburger(): " + err);
		}
		finally {}
	}
};

function cursorWait() {
	document.body.style.cursor = "wait";
}

function cursorClear() {
	document.body.style.cursor = "default";
}

function togglePanel(elem) {

	try {
		if(isVisible(elem)) {
			document.getElementById(elem).style.display = 'none';
		} else {
			document.getElementById(elem).style.display = '';
		}
	}
	catch(err) {
		console.log("togglePanel: " + err.message);
	}
}

function emptyDiv(e,elem) {

	try {
		e.preventDefault();

		document.getElementById(elem).innerHTML = '';
	}
	catch(err) {
		console.log("emptyDiv: " + err.message);
	}
}

function disableField(fieldName) {

	try {
		document.getElementById(fieldName).disabled = true;
	}
	catch(err) {
		console.log("disableField: " + err.message);
	}
}

function isVisible(elem) {

	try {
		if(document.getElementById(elem).style.display == 'none') {
			return false;
		} else {
			return true;
		}
	}
	catch(err) {
		console.log("isVisible(): " + err.message);
	}
}

function isEmpty(str) {

	try {
		if(typeof(str) === "undefined" || str == null || str.trim().length <= 0) {
			return true;
		}
	}
	catch(err) {
		console.log("isEmpty(): " + err.message);
	}

	return false;
}

function isValidEmail(str) {

	try {
		if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str)) {
			return true;
		}
	}
	catch(err) {
		console.log("isValidEmail(): " + err);
	}

	return false;
}  

function isPositiveInteger(n) {

	try {
		return parseFloat(n) === n >>> 0;
	}
	catch(err) {
		console.log("isPositiveInteger(): " + err);
	}
}

function replaceSpecialChars(s) {

	var output = "";

	try {
		output = s;
		output = output.replace(/"/gi, "'");
		output = output.replace(/`/gi, "'");
		output = output.replace(/%/gi, " percent");
		output = output.replace(/&/gi, " and");
	}
	catch(err) {
		console.log("replaceSpecialChars(): " + err);
	}

	return output;
}

function sortByProperty(property) {

	return function (x, y) {

		return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
	};
};

/* someArray.sort(sortByProperty('id')); */
