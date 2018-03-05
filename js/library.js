/**
 * library.js
 * Contains general methods that can be used on any project.
 * 
 * NOTE: This file MUST be the first JS file to load
 * 
 * @author Stan Zajdel
*/

/*
 * Data Object for apps to use to store and retrieve specific data for their app
 */
var appData = {

	data: {},

	initialize: function() {
		this.data = {};
	},

	set: function(dataKey, dataVal) {

		try {
			this.data[dataKey] = dataVal;
		}
		catch(err) {
			console.log("set(): " + err);
		}
		finally {}
	},

	get: function(dataKey) {

		try {
			return this.data[dataKey];
		}
		catch(err) {
			console.log("get(): " + err);
		}
		finally {}
	}
};

/*
 * Data Object for apps to use to store and retrieve state
 */
var state = {

	initialState: "",

	saveInitialState: function(container) {

		try {
			this.initialState = document.getElementById(container).innerHTML;
		}
		catch(err) {
			console.log("saveInitialState(): " + err);
		}
	},

	restoreInitialState: function(container) {

		try {
			document.getElementById(container).innerHTML = this.initialState;
		}
		catch(err) {
			console.log("restoreInitialState(): " + err);
		}
		finally {}
	}
};

var component = {

	events: {},
	data: {},

	initializeEventRegistry: function() {
		this.events = {};
	},

	registerEvent: function(funcKey, funcVal) {

		try {
			/*
			 * Add the template braces to the event for substitution purposes
			 */
			var templateVar = "{{" + funcKey + "}}";

			this.events[templateVar] = funcVal;
		}
		catch(err) {
			console.log("registerEvent(): " + err);
		}
		finally {}
	},

	initializeDataRegistry: function() {
		this.data = {};
	},

	registerData: function(dataKey, dataVal) {

		try {
			/*
			 * Add the template braces to the dataKey for substitution purposes
			 */
			var templateVar = "{{" + dataKey + "}}";

			this.data[templateVar] = dataVal;
		}
		catch(err) {
			console.log("registerData(): " + err);
		}
		finally {}
	},

	render: function(template, container) {

		try {
			var t = document.getElementById(template);
			var tHtml = t.innerHTML;

			for(var key in this.data) {
				if(this.data.hasOwnProperty(key)) {

					var val = this.data[key];

					var regex = new RegExp(key, "g");

					if(tHtml.indexOf(key) >= 0) {
						tHtml = tHtml.replace(regex, val);
					}
				}
			}

			for(var key in this.events) {
				if(this.events.hasOwnProperty(key)) {

					var val = this.events[key];

					var regex = new RegExp(key, "g");

					if(tHtml.indexOf(key) >= 0) {
						tHtml = tHtml.replace(regex, val);
					}
				}
			}

			document.getElementById(container).innerHTML = tHtml;
		}
		catch(err) {
			console.log("render(): " + err);
		}
		finally {}
	},

	create:	function(template) {

		var componentHtml = "";

		try {
			var t = document.getElementById(template);
			componentHtml = t.innerHTML;

			for(var key in this.data) {
				if(this.data.hasOwnProperty(key)) {

					var val = this.data[key];

					var regex = new RegExp(key, "g");

					if(componentHtml.indexOf(key) >= 0) {
						componentHtml = componentHtml.replace(regex, val);
					}
				}
			}

			for(var key in this.events) {
				if(this.events.hasOwnProperty(key)) {

					var val = this.events[key];

					var regex = new RegExp(key, "g");

					if(componentHtml.indexOf(key) >= 0) {
						componentHtml = componentHtml.replace(regex, val);
					}
				}
			}
		}
		catch(err) {
			console.log("create(): " + err);
		}
		finally {}

		return componentHtml;
	},

	setText: function(element, text) {

		try {
			document.getElementById(element).innerHTML = text;
		}
		catch(err) {
			console.log("setText(): " + err);
		}
		finally {}
	},

	isVisible: function(elementId) {

		try {
			if(document.getElementById(elementId).style.display == 'none') {
				return false;
			} else {
				return true;
			}
		}
		catch(err) {
			console.log("isVisible(): " + err.message);
		}
	},

	addListener: function(event, elementId, callbackFunction, capture) {

		try {
			var element = document.getElementById(elementId);

			capture = capture ? true : false;

			/*
			 * Remove the event since we don't want to add multiples of the same listener
			 */
			element.removeEventListener(event, callbackFunction, capture);

			/*
			 * Add the event listener for the passed in element
			 */
			element.addEventListener(event, callbackFunction, capture);
		}
		catch(err) {
			console.log("addListener(): " + err);
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
		if(component.isVisible(elem)) {
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
