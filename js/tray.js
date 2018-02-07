/**
 * tray.js
 * Contains general methods for managing trays.
 * 
 * @author Stan Zajdel
*/

function renderMbrTraySelectTag(traSk, includeChangeFunctionFlag) {

	var mbrTrayListSelectTag = "";

	try {
		var to = document.getElementById("t-tray-select-option-tag");
		var toHtml = to.innerHTML;

		var toHtmlReplace = "";

		var trayArray = JSON.parse(gblStateObj.mbrTrayJson);

		for(var i=0; i<trayArray.length; i++) {

			var tray = trayArray[i];

			var selected = "";

			if(traSk == tray.traSk) {
				selected = " selected";
			}

			toHtmlReplace += toHtml.replace(/{{traSk}}/g, tray.traSk)
						.replace(/{{selected}}/g, selected)
						.replace(/{{traName}}/g, tray.name);
		}

		var changeFunction = "";

		if(includeChangeFunctionFlag == "add-onchange") {
			changeFunction = 'onchange="getSelectedTrayList(this);"';
		}

		var ts = document.getElementById("t-tray-select-tag");
		var tsHtml = ts.innerHTML;
		var tsHtmlReplace = tsHtml.replace(/{{changeFunction}}/g, changeFunction)
					.replace(/{{traOptions}}/g, toHtmlReplace);

		mbrTrayListSelectTag = tsHtmlReplace;
	}
	catch(err) {
		console.log("renderMbrTraySelectTag(): " + err);
	}
	finally {

	}

	return mbrTrayListSelectTag;
}

function getSelectedTrayList(element) {
	try {
		var traSk = element.options[element.selectedIndex].value;
		var traName = element.options[element.selectedIndex].text;

		var traTokens = traSk + "|" + traName;

		postSearchDrawerByTraSk(traTokens);
	}
	catch(err) {
		console.log("getSelectedTray(): " + err);
	}
	finally {

	}
}

function getTrays() {

	try {
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					var mbrTrayJson = xhr.responseText;
					var mbrTrayArray = JSON.parse(xhr.responseText);

					var tr = document.getElementById("t-tray-list-rows");
					var trHtml = tr.innerHTML;

					var trHtmlReplace = "";

					for(var i=0; i<mbrTrayArray.length; i++) {

						var tray = mbrTrayArray[i];

						trHtmlReplace += trHtml.replace(/{{traSk}}/g, tray.traSk)
							.replace(/{{traName}}/g, tray.name);
					}

					var tt = document.getElementById("t-tray-list");
					var ttHtml = tt.innerHTML;
					var ttHtmlReplace = ttHtml.replace(/{{trayRows}}/g, trHtmlReplace);

					document.getElementById('template-content').innerHTML = ttHtmlReplace;

					gblStateObj.mbrTrayJson = mbrTrayJson;

					resetMenu();

				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("getTrays(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/tray/" + gblStateObj.mbrSkToken;

		xhr.open("GET", url, true);
		xhr.send();
	}
	catch(err) {
		console.log("getTrays(): " + err);
	}
	finally {

	}
}

function getFavoriteTraTokens() {

	var traTokens = "";

	try {
		var mbrDrawerArray = JSON.parse(gblStateObj.mbrDrawerJson);

		if(mbrDrawerArray.length > 0) {

			for(var i=0; i<mbrDrawerArray.length; i++) {

				var item = mbrDrawerArray[i];

				if(item.traName.toLowerCase() == "favorites") {

					traTokens = item.traSk + "|" + item.traName;
					break;
				}
			}
		}
	}
	catch(err) {
		console.log("getFavoriteTraTokens(): " + err);
	}
	finally {

	}

	return traTokens;
}

function renderAddTray() {

	try {
		var tm = document.getElementById("t-tray");
		var tmHtml = tm.innerHTML;

		var tmHtmlReplace = tmHtml.replace(/{{heading}}/g, "Add a New Tray")
			.replace(/{{name}}/g, "")
			.replace(/{{saveFunction}}/g, "postSaveTray();");

		document.getElementById('template-content').innerHTML = tmHtmlReplace;

		resetMenu();
	}
	catch(err) {
		console.log("renderAddTray(): " + err);
	}
	finally {

	}
}

function postSaveTray() {

	try {
		var name = document.getElementById("name").value;

		if(isEmpty(name)) {
			document.getElementById('error').innerHTML = 'Please enter a Tray Name.';
			return false;
		}

		if(isDuplicateTraName(name)) {
			document.getElementById('error').innerHTML = 'You already have this Tray in your Drawer.';
			return false;
		}

		var inputFields = {"mbrSkToken":gblStateObj.mbrSkToken, "name":name};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;
	
		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					getTrays();

 				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("postSaveTray(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/tray/";

		xhr.open("POST", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send("inputJSON=" + stringJSON);
	}
	catch(err) {
		console.log("postSaveTray(): " + err);
	}
	finally {

	}
}

function renderEditTray(traSk, name) {

	try {
		if(name.toLowerCase() == "favorites") {
			renderTrayError();

		} else {
			var tm = document.getElementById("t-tray");
			var tmHtml = tm.innerHTML;

			var tmHtmlReplace = tmHtml.replace(/{{heading}}/g, "Change the Name of Your Tray")
				.replace(/{{name}}/g, name)
				.replace(/{{saveFunction}}/g, 'putSaveTray("' + traSk + '");');

			document.getElementById('template-content').innerHTML = tmHtmlReplace;
		}

		resetMenu();
	}
	catch(err) {
		console.log("renderEditTray(): " + err);
	}
	finally {

	}
}

function putSaveTray(traSk) {

	try {
		var name = document.getElementById("name").value;

		if(isEmpty(name)) {
			document.getElementById('error').innerHTML = 'Please enter a Tray Name.';
			return false;
		}

		var nameEl = document.getElementById("name");
		var origName = nameEl.getAttribute('data-name');

		if(isDuplicateTraName(name)) {
			document.getElementById('error').innerHTML = 'You already have a Tray with this name.';
			document.getElementById("name").value = origName;
			return false;
		}

		var inputFields = {"mbrSkToken":gblStateObj.mbrSkToken, "traSk":traSk, "name":name};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;
	
		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					getTrays();

 				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("putSaveTray(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/tray/";

		xhr.open("PUT", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(stringJSON);
	}
	catch(err) {
		console.log("putSaveTray(): " + err);
	}
	finally {

	}
}

function checkIfTrayCanBeDeleted(traSk, traName) {

	try {
		if(isFavoriteTray(traName)) {
			renderCannotDeleteTray();

		} else {

			if(isTrayEmpty(traSk)) {

				var mbrTrayArray = gblStateObj.mbrTrayJson;

				if(mbrTrayArray.length > 1) {
					deleteTray(traSk);
				} else {
					renderCannotDeleteTray();
				}
			} else {
				renderCannotDeleteTray();
			}
		}
	}
	catch(err) {
		console.log("checkIfTrayCanBeDeleted(): " + err);
	}
	finally {

	}
}

function isFavoriteTray(traName) {

	var result = false;

	try {
		if(traName.toLowerCase() == "favorites") {
			result = true;

		} else {
			result = false;
		}
	}
	catch(err) {
		console.log("isFavoriteTray(): " + err);
	}
	finally {

	}

	return result;
}

function isDuplicateTraName(traName) {

	var duplicate = false;

	try {
		var mbrDrawerArray = JSON.parse(gblStateObj.mbrDrawerJson);

		if(mbrDrawerArray.length > 0) {

			for(var i=0; i<mbrDrawerArray.length; i++) {

				var item = mbrDrawerArray[i];

				if(traName.toLowerCase() == item.traName.toLowerCase()) {

					duplicate = true;
					break;
				}
			}
		}
	}
	catch(err) {
		console.log("isDuplicateTrayName(): " + err);
	}
	finally {

	}

	return duplicate;
}

function deleteTray(traSk) {

	try {
		var inputFields = {"mbrSkToken":gblStateObj.mbrSkToken, "traSk":traSk};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;
	
		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					getTrays();

 				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("deleteTray(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/tray/";

		xhr.open("DELETE", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(stringJSON);
	}
	catch(err) {
		console.log("deleteTray(): " + err);
	}
	finally {

	}
}

function isTrayEmpty(traSk) {

	var empty = true;

	try {
		var mbrDrawerArray = JSON.parse(gblStateObj.mbrDrawerJson);

		if(mbrDrawerArray.length > 0) {

			for(var i=0; i<mbrDrawerArray.length; i++) {

				var item = mbrDrawerArray[i];

				if(traSk == item.traSk) {

					empty = false;
					break;
				}
			}
		}
	}
	catch(err) {
		console.log("isTrayEmpty(): " + err);
	}
	finally {

	}

	return empty;
}

function renderCannotDeleteTray() {

	try {
		var t = document.getElementById("t-tray-delete-error");

		var tHtml = t.innerHTML;

		document.getElementById('template-content').innerHTML = tHtml;

		resetMenu();
	}
	catch(err) {
		console.log("renderCannotDeleteTray(): " + err);
	}
	finally {

	}
}

function renderTrayError() {

	try {
		var t = document.getElementById("t-tray-error");

		var tHtml = t.innerHTML;

		document.getElementById('template-content').innerHTML = tHtml;

		resetMenu();
	}
	catch(err) {
		console.log("renderTrayError(): " + err);
	}
	finally {

	}
}
