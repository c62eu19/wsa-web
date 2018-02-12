/**
 * tray.js
 * Contains general methods for managing trays.
 * 
 * @author Stan Zajdel
*/

function createTraySelectTag(trayId, includeChangeFunctionFlag) {

	var trayListSelectTag = "";

	try {
		var optionHtml = "";

		var trayArray = JSON.parse(gblStateObj.trayJson);

		for(var i=0; i<trayArray.length; i++) {

			var tray = trayArray[i];

			var selected = "";

			if(trayId == tray.trayId) {
				selected = " selected";
			}

			var optionData = {
				"{{traId}}" : tray.trayId,
				"{{selected}}" : selected,
				"{{traName}}" : tray.trayName
			};

			optionHtml += create("t-tray-select-option-tag", optionData);
		}

		var changeFunction = "";

		if(includeChangeFunctionFlag == "add-onchange") {
			changeFunction = 'onchange="getSelectedTrayList(this);"';
		}

		var selectData = {
			"{{changeFunction}}" : changeFunction,
			"{{trayOptions}}" : optionHtml
		};

		trayListSelectTag = create("t-tray-select-tag", selectData);
	}
	catch(err) {
		console.log("createTraySelectTag(): " + err);
	}
	finally {

	}

	return trayListSelectTag;
}

function getSelectedTrayList(element) {
	try {
		var trayId = element.options[element.selectedIndex].value;
		var trayName = element.options[element.selectedIndex].text;

		var trayTokens = trayId + "|" + trayName;

		postSearchDrawerByTraId(trayTokens);
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

					var trayJson = xhr.responseText;
					var trayArray = JSON.parse(xhr.responseText);

					var rowHtml = "";

					for(var i=0; i<trayArray.length; i++) {

						var tray = trayArray[i];

						var rowData = {
							"{{traId}}" : tray.trayId,
							"{{traName}}" : tray.trayName
						};

						rowHtml = create("t-tray-list-rows", rowData);
					}

					var tableData = {
						"{{trayRows}}" : rowHtml
					};

					render("t-tray-list", "template-content", tableData);

					gblStateObj.trayJson = trayJson;

					resetMenu();

				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("getTrays(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/Tray/" + gblStateObj.collectionName;

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

	var trayTokens = "";

	try {
		var drawerArray = JSON.parse(gblStateObj.drawerJson);

		if(drawerArray.length > 0) {

			for(var i=0; i<drawerArray.length; i++) {

				var item = drawerArray[i];

				if(item.trayName.toLowerCase() == "favorites") {

					trayTokens = item.trayId + "|" + item.trayName;
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

	return trayTokens;
}

function renderAddTray() {

	try {
		var data = {
			"{{heading}}": "Add a New Tray",
			"{{name}}": "",
			"{{saveFunction}}": "postSaveTray();"
		};

		render("t-tray", "template-content", data);

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

		var inputFields = {
			"collectionName":gblStateObj.collectionName, 
			"trayName":name
		};

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

		var url = "http://localhost:8080/mydrawer/Tray/";

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

function renderEditTray(trayId, trayName) {

	try {
		if(trayName.toLowerCase() == "favorites") {
			renderTrayError();

		} else {
			var data = {
				"{{heading}}": "Change the Name of Your Tray",
				"{{name}}": trayName,
				"{{saveFunction}}": 'putSaveTray("' + trayId + '");'
			};

			render("t-tray", "template-content", data);
		}

		resetMenu();
	}
	catch(err) {
		console.log("renderEditTray(): " + err);
	}
	finally {

	}
}

function putSaveTray(trayId) {

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

		var inputFields = {
			"collectionName":gblStateObj.collectionName, 
			"trayId":trayId, "trayName":name};

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

		var url = "http://localhost:8080/mydrawer/Tray/";

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

function checkIfTrayCanBeDeleted(trayId, trayName) {

	try {
		if(isFavoriteTray(trayName)) {
			renderCannotDeleteTray();

		} else {

			if(isTrayEmpty(trayId)) {

				var trayArray = gblStateObj.trayJson;

				if(trayArray.length > 1) {
					deleteTray(trayId);
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

function isFavoriteTray(trayName) {

	var result = false;

	try {
		if(trayName.toLowerCase() == "favorites") {
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

function isDuplicateTraName(trayName) {

	var duplicate = false;

	try {
		var drawerArray = JSON.parse(gblStateObj.drawerJson);

		if(drawerArray.length > 0) {

			for(var i=0; i<drawerArray.length; i++) {

				var item = drawerArray[i];

				if(trayName.toLowerCase() == item.trayName.toLowerCase()) {

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

function deleteTray(trayId) {

	try {
		var inputFields = {
			"collectionName":gblStateObj.collectionName, 
			"trayId":trayId
		};

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

		var url = "http://localhost:8080/mydrawer/Tray/";

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

function isTrayEmpty(trayId) {

	var empty = true;

	try {
		var drawerArray = JSON.parse(gblStateObj.drawerJson);

		if(drawerArray.length > 0) {

			for(var i=0; i<drawerArray.length; i++) {

				var item = drawerArray[i];

				if(trayId == item.trayId) {

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
		var data = {};

		render("t-tray-delete-error", "template-content", data);

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
		var data = {};

		render("t-tray-error", "template-content", data);

		resetMenu();
	}
	catch(err) {
		console.log("renderTrayError(): " + err);
	}
	finally {

	}
}
