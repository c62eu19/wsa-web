/**
 * app.js
 * Contains general app methods.
 * 
 * @author Stan Zajdel
*/

function resetMenu() {

	try {
		document.getElementById('hamburger').style.display = '';
		document.getElementById('cross').style.display = 'none';
	}
	catch(err) {
		console.log("resetMenu(): " + err);
	}
	finally {

	}
}

function openHamburger(e) {

	try {
		document.getElementById('hamburger').style.display = 'none';
		document.getElementById('cross').style.display = '';

		var tm = "";
		var tmHtml = "";

		gblStateObj.origTemplateContent = document.getElementById('template-content').innerHTML;

		if(isEmpty(gblStateObj.mbrSkToken)) {
			tm = document.getElementById("t-menu-signed-out");
			tmHtml = tm.innerHTML;
		} else {

			var mbrTrayListSelectTag = renderMbrTraySelectTag("", "add-onchange");

			tm = document.getElementById("t-menu-signed-in");
			var tempHtml = tm.innerHTML;
			tmHtml = tempHtml.replace(/{{favoriteTraTokens}}/g, gblStateObj.favoriteTraTokens)
					.replace(/{{mbrTrayListSelectTag}}/g, mbrTrayListSelectTag);
		}

		document.getElementById('template-content').innerHTML = tmHtml;
	}
	catch(err) {
		console.log("openHamburger(): " + err);
	}
	finally {

	}
}

function closeHamburger(e) {

	try {
		document.getElementById('cross').style.display = 'none';
		document.getElementById('hamburger').style.display = '';

		document.getElementById('template-content').innerHTML = gblStateObj.origTemplateContent;
	}
	catch(err) {
		console.log("closeHamburger(): " + err);
	}
	finally {

	}
}

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
