/**
 * drawer.js
 * Contains general methods for My Drawer.
 * 
 * @author Stan Zajdel
*/

function init() {

	try {
		/*
		 * Initialize the dataObj
		 */
		dataObj.collectionName = "";
		dataObj.userName = "";
		dataObj.trayJson = "";
		dataObj.drawerJson = "";
		dataObj.origTemplateContent = "";
		dataObj.traySelected = "";
		dataObj.favoriteTraTokens = "";

		renderSignIn();
	}
	catch(err) {
		console.log("init(): " + err);
	}
	finally {

	}
}

function getDrawer() {

	try {
		if(isEmpty(dataObj.collectionName)) {
			renderSignIn();

		} else {

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				var DONE = 4;
				var OK = 200;

				if (xhr.readyState === DONE) {
					if (xhr.status === OK) {

						dataObj.drawerJson = xhr.responseText;

						var drawerArray = JSON.parse(dataObj.drawerJson);

						dataObj.traySelected = "in your drawer";

						menu.reset();
						renderDrawer();

					} else {
						console.log('Error: ' + xhr.status);
					}
				}
			};

			xhr.onerror = function () {
				console.log("getDrawer(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/DrawerList/" + dataObj.collectionName;

			xhr.open("GET", url, true);
			xhr.send();
		}
	}
	catch(err) {
		console.log("getDrawer(): " + err);
	}
	finally {

	}
}

function postSearchDrawerByWildcard() {

	try {
		var searchTerm = document.getElementById("searchTerm").value;

		if(isEmpty(searchTerm)) {
			return false;
		}

		var inputFields = {
			"searchType":"WILDCARD", 
			"collectionName":dataObj.collectionName, 
			"searchTerm":searchTerm, "trayId":""
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

					dataObj.drawerJson = xhr.responseText;

					var drawerArray = JSON.parse(dataObj.drawerJson);

					if(drawerArray.length <= 0) {

						renderNoResultsFound();

					} else {
						dataObj.traySelected = "resulting in your search";

						menu.reset();
						renderDrawer();
					}
				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("postSearchDrawerByWildcard(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/DrawerList/";

		xhr.open("POST", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send("inputJSON=" + stringJSON);
	}
	catch(err) {
		console.log("postSearchDrawerByWildcard(): " + err);
	}
	finally {

	}
}

function postSearchDrawerByTraId(traTokens) {

	try {
		var tokens = traTokens.split("|");
		var trayId = tokens[0];
		var trayName = tokens[1];

		var inputFields = {
			"searchType":"TRAY", 
			"collectionName":dataObj.collectionName, 
			"searchTerm":"", 
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

					dataObj.drawerJson = xhr.responseText;

					var drawerArray = JSON.parse(dataObj.drawerJson);

					if(drawerArray.length <= 0) {
						renderNoResultsFound();

					} else {
						dataObj.traySelected = "in your " + trayName + " tray";

						menu.reset();
						renderDrawer();
					}
				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("postSearchDrawerByTraId(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/DrawerList/";

		xhr.open("POST", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send("inputJSON=" + stringJSON);
	}
	catch(err) {
		console.log("postSearchDrawerByTraId(): " + err);
	}
	finally {

	}
}

function renderNoResultsFound() {

	try {
		var data = {};

		component.render("t-no-results-found", "template-content", data);

		menu.reset();
	}
	catch(err) {
		console.log("renderNoResultsFound(): " + err);
	}
	finally {

	}
}

function renderDrawer() {

	try {

		var drawerArray = JSON.parse(dataObj.drawerJson);

		var rowHtml = "";
		var rowData = {};

		for(var i=0; i<drawerArray.length; i++) {

			var item = drawerArray[i];

			var abbrText = item.abbrText.replace(/\r/g, " ");
			abbrText = item.abbrText.replace(/\n/g, " ");

			var itemTitle = createDrawerItemViewTitle(item.drawerId);

			var viewButton = createDrawerItemViewButton(item.drawerId);
			var editButton = createDrawerItemEditButton(item.drawerId);
			var deleteButton = createDrawerItemDeleteButton(item.drawerId);

			rowData = {
				"{{itemTitle}}" : itemTitle,
				"{{traName}}" : item.traName,
				"{{text}} " : abbrText,
				"{{updatedDt}}" : item.updatedDt,
				"{{viewButton}}" : viewButton,
				"{{editButton}}" : editButton,
				"{{deleteButton}}" : deleteButton
			};

			rowHtml = component.create("t-drawer-rows", rowData);
		}

		if(drawerArray.length <= 0) {
			rowHtml = "";
		}

		var tableData = {
			"{{favoriteTraTokens}}" : dataObj.favoriteTraTokens,
			"{{totalItems}}" : drawerArray.length,
			"{{traySelected}}" : dataObj.traySelected,
			"{{drawerRows}}" : rowHtml
		};

		component.render("t-drawer", "template-content", tableData);

		document.body.addEventListener("keydown", function(e) {
			if (e.keyCode === 13) {
				postSearchDrawerByWildcard();
			}
		});
	}
	catch(err) {
		console.log("renderDrawer(): " + err);
	}
	finally {

	}
}

function getDrawerItem(drawerId) {

	var drawerItem = {};

	try {
		var drawerArray = JSON.parse(dataObj.drawerJson);

		if(drawerArray.length > 0) {

			for(var i=0; i<drawerArray.length; i++) {

				var item = drawerArray[i];

				if(drawerId == item.drawerId) {

					var decodeUrl = decodeURIComponent(item.url);

					drawerItem.drawerId = item.drawerId;
					drawerItem.trayId = item.trayId;
					drawerItem.type = item.type;
					drawerItem.updatedDt = item.updatedDt;
					drawerItem.title = item.title;
					drawerItem.text = item.text;
					drawerItem.url = decodeUrl;
					drawerItem.traName = item.traName;

					break;
				}
			}
		}
	}
	catch(err) {
		console.log("getDrawerItem(): " + err);
	}
	finally {

	}

	return drawerItem;
}

function createDrawerItemViewTitle(drawerId) {

	var componentHtml = "";

	try {
		drawerItem = {};
		drawerItem = getDrawerItem(drawerId);

		var data = {
			"{{drawerId}}" : drawerId,
			"{{title}}" : drawerItem.title,
			"{{url}}" : drawerItem.url
		};

		if(drawerItem.type == "1") {
			componentHtml = component.create("t-drawer-title-text-view", data);

		} else if(drawerItem.type == "4") {
			componentHtml = component.create("t-drawer-title-article-view", data);

		} else if(drawerItem.type == "5") {
			componentHtml = component.create("t-drawer-title-video-view", data);
		}
	}
	catch(err) {
		console.log("createDrawerItemViewTitle(): " + err);
	}
	finally {

	}

	return componentHtml;
}

function createDrawerItemViewButton(drawerId) {

	var componentHtml = "";

	try {
		drawerItem = {};
		drawerItem = getDrawerItem(drawerId);

		var data = {
			"{{drawerId}}" : drawerId,
			"{{url}}" : drawerItem.url
		};

		if(drawerItem.type == "1") {
			componentHtml = component.create("t-drawer-button-text-view", data);

		} else if(drawerItem.type == "4") {
			componentHtml = component.create("t-drawer-button-article-view", data);

		} else if(drawerItem.type == "5") {
			componentHtml = component.create("t-drawer-button-video-view", data);
		}
	}
	catch(err) {
		console.log("createDrawerItemViewButton(): " + err);
	}
	finally {

	}

	return componentHtml;
}

function createDrawerItemEditButton(drawerId) {

	var componentHtml = "";

	try {
		drawerItem = {};
		drawerItem = getDrawerItem(drawerId);

		var data = {
			"{{drawerId}}" : drawerId
		};

		if(drawerItem.type == "1") {
			componentHtml = component.create("t-drawer-button-text-edit", data);

		} else if(drawerItem.type == "4" || drawerItem.type == "5") {
			componentHtml = component.create("t-drawer-button-web-edit", data);
		}
	}
	catch(err) {
		console.log("createDrawerItemEditTitle(): " + err);
	}
	finally {

	}

	return componentHtml;
}

function createDrawerItemDeleteButton(drawerId) {

	var componentHtml = "";

	try {
		var data = {
			"{{drawerId}}" : drawerId
		};

		componentHtml = component.create("t-drawer-button-delete", data);
	}
	catch(err) {
		console.log("createDrawerItemDeleteTitle(): " + err);
	}
	finally {

	}

	return componentHtml;
}

function renderViewTextEntry(drawerId) {

	try {
		drawerItem = {};
		drawerItem = getDrawerItem(drawerId);

		var editButtonComponent = createDrawerItemEditButton(drawerItem.drawerId);
		var deleteButtonComponent = createDrawerItemDeleteButton(drawerItem.drawerId);

		var buttonBarData = {
			"{{editButton}}" : editButtonComponent,
			"{{deleteButton}}" : deleteButtonComponent
		};

		var buttonBarComponent = component.create("t-view-button-bar", buttonBarData);

		var data = {
			"{{buttonBar}}" : buttonBarComponent,
			"{{deleteButton}}" : deleteButton,
			"{{title}}" : drawerItem.title,
			"{{traName}}" : drawerItem.traName,
			"{{text}}" : drawerItem.text
		};

		component.render("t-text-view", "template-content", data);

		menu.reset();
	}
	catch(err) {
		console.log("renderViewTextEntry(): " + err);
	}
	finally {

	}
}

function renderViewVideoEntry(drawerId) {

	try {
		drawerItem = {};
		drawerItem = getDrawerItem(drawerId);

		var editButtonComponent = createDrawerItemEditButton(drawerItem.drawerId);
		var deleteButtonComponent = createDrawerItemDeleteButton(drawerItem.drawerId);

		var buttonBarData = {
			"{{editButton}}" : editButtonComponent,
			"{{deleteButton}}" : deleteButtonComponent
		};

		var buttonBarComponent = component.create("t-view-button-bar", buttonBarData);

		var id = "";
		var embeddedLink = "";

		var decodeUrl = decodeURIComponent(drawerItem.url);

		if(decodeUrl.indexOf("www.youtube.com") > -1) {
			id = decodeUrl.split("?v=")[1];
			embeddedlink = "https://www.youtube.com/embed/" + id;

		} else if(decodeUrl.indexOf("www.vimeo.com") > -1) {
			id = decodeUrl.split("/")[2];
			embeddedlink="https://player.vimeo.com/video/" + id;

		} else if(decodeUrl.indexOf("www.ted.com") > -1) {

		} else {

		}

		var data = {
			"{{buttonBar}}" : buttonBarComponent,
			"{{title}}" : drawerItem.title,
			"{{traName}}" : drawerItem.traName
		};

		component.render("t-video-view", "template-content", data);

		document.getElementById("embedded-video").src = embeddedlink;

		menu.reset();
	}
	catch(err) {
		console.log("renderViewVideoEntry(): " + err);
	}
	finally {

	}
}

function renderAddTextEntry() {

	try {
		var trayListSelectTag = createTraySelectTag("", "N");

		var data = {
			"{{buttonBar}}": "",
			"{{trayListSelectTag}}": trayListSelectTag,
			"{{saveFunction}}": 'postSaveTextEntry();'
		};

		component.render("t-text-entry", "template-content", data);

		menu.reset();
	}
	catch(err) {
		console.log("renderAddTextEntry(): " + err);
	}
	finally {

	}
}

function postSaveTextEntry(){

	try {
		var trayId = document.forms[0].trayId.value;
		var title = document.forms[0].title.value;
		var text = document.forms[0].text.value;

		if(isEmpty(trayId)) {
			document.getElementById('error').innerHTML = 'Please select a Tray.';
			return false;
		}

		if(isEmpty(title)) {
			document.getElementById('error').innerHTML = 'Please enter a Title.';
			return false;
		}

		if(isEmpty(text)) {
			document.getElementById('error').innerHTML = 'Please enter some Text to describe your entry.';
			return false;
		}

		var cleanedTitle = replaceSpecialChars(title);
		var cleanedText = replaceSpecialChars(text);

		var inputFields = {
			"collectionName":dataObj.collectionName, 
			"trayId":trayId, 
			"type":"1", 
			"url":".", 
			"title":cleanedTitle, 
			"text":cleanedText};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;

		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					dataObj.drawerJson = xhr.responseText;

					renderDrawer();

				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("postSaveTextEntry(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/DrawerEntry/";

		xhr.open("POST", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send("inputJSON=" + stringJSON);
	}
	catch(err) {
		console.log("postSaveTextEntry(): " + err);
	}
	finally {

	}
}

function renderEditTextEntry(drawerId) {

	try {
		drawerItem = {};
		drawerItem = getDrawerItem(drawerId);

		var viewButtonComponent = createDrawerItemViewButton(drawerItem.drawerId);
		var deleteButtonComponent = createDrawerItemDeleteButton(drawerItem.drawerId);

		var buttonBarData = {
			"{{viewButton}}" : viewButtonComponent,
			"{{deleteButton}}" : deleteButtonComponent
		};

		var buttonBarComponent = component.create("t-edit-button-bar", buttonBarData);

		var trayListSelectTag = createTraySelectTag(drawerItem.trayId, "N");

		var data = {
			"{{buttonBar}}" : buttonBarComponent,
			"{{trayListSelectTag}}" : trayListSelectTag,
			"{{drawerId}}" : drawerId,
			"{{saveFunction}}" : 'putSaveTextEntry("' + drawerId + '");'
		};

		component.render("t-text-entry", "template-content", data);

		document.getElementById("title").value = drawerItem.title;
		document.getElementById("text").value = drawerItem.text;

		menu.reset();
	}
	catch(err) {
		console.log("renderEditTextEntry(): " + err);
	}
	finally {

	}
}

function putSaveTextEntry(drawerId){

	try {
		var trayId = document.forms[0].traId.value;
		var title = document.forms[0].title.value;
		var text = document.forms[0].text.value;

		if(isEmpty(trayId)) {
			document.getElementById('error').innerHTML = 'Please select a Tray.';
			return false;
		}

		if(isEmpty(title)) {
			document.getElementById('error').innerHTML = 'Please enter a Title.';
			return false;
		}

		if(isEmpty(text)) {
			document.getElementById('error').innerHTML = 'Please enter some Text to describe your entry.';
			return false;
		}

		var cleanedTitle = replaceSpecialChars(title);
		var cleanedText = replaceSpecialChars(text);

		var inputFields = {
			"collectionName":dataObj.collectionName, 
			"drawerId":drawerId, 
			"trayId":trayId, 
			"url":".", 
			"title":cleanedTitle, 
			"text":cleanedText};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;

		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					dataObj.drawerJson = xhr.responseText;

					renderDrawer();

				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("putSaveTextEntry(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/DrawerEntry/";

		xhr.open("PUT", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(stringJSON);
	}
	catch(err) {
		console.log("putSaveTextEntry(): " + err);
	}
	finally {

	}
}

function renderAddWebEntry() {

	try {
		var trayListSelectTag = createTraySelectTag("", "N");

		var data = {
			"{{buttonBar}}": "",
			"{{trayListSelectTag}}": trayListSelectTag,
			"{{saveFunction}}": 'postSaveWebEntry();'
		};

		component.render("t-web-entry", "template-content", data);

		menu.reset();
	}
	catch(err) {
		console.log("renderAddWebEntry(): " + err);
	}
	finally {

	}
}

function postPasteUrl(e) {

	try {
		document.body.style.cursor = "wait";

		/* gets the copied text after a specified time (200 milliseconds) */
		setTimeout(function() {

			var url = document.forms[0].url.value;
			getUrlParts(url); 
			document.body.style.cursor = "default";
		}, 200);

	}
	catch(err) {
		document.body.style.cursor = "default";
		document.getElementById('url').innerHTML = "";
		document.getElementById('error').innerHTML = 'We are sorry but there is a problem with the Link that you are trying to fetch.';
	}
	finally {

	}
}

function getUrlParts(url) {

	try {
		if(isEmpty(url)) {
			document.getElementById('error').innerHTML = 'Please paste a valid Url.';
			return false;
		}

		document.body.style.cursor = "wait";

		/* encode the base64 so that it transfers properly to the server */
		var encodeUrl = encodeURIComponent(url);

		var inputFields = {"url":encodeUrl};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;
	
		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					var data = JSON.parse(xhr.responseText);

					var statusCd = data.statusCd;
					var title = data.title;
					var text = data.text;

					if(statusCd == "0") {
						document.getElementById("title").value = title;
						document.getElementById("text").value = text;
					} else {
						document.getElementById('error').innerHTML = "We are sorry but we could not fetch the title or description for your link.";
						document.getElementById('url').innerHTML = "";
					}

					document.body.style.cursor = "default";

				} else {
					document.getElementById('url').innerHTML = "";
					document.body.style.cursor = "default";
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("getUrlParts(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/urlparts/";

		xhr.open("POST", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send("inputJSON=" + stringJSON);
	}
	catch(err) {
		document.body.style.cursor = "default";
		document.getElementById('url').innerHTML = "";
		document.getElementById('error').innerHTML = 'We are sorry but there is a problem with the Link that you are trying to fetch.';
	}
	finally {

	}
}

function postSaveWebEntry(){

	try {
		var pastedUrl = document.forms[0].url.value;
		var trayId = document.forms[0].traId.value;
		var title = document.forms[0].title.value;
		var text = document.forms[0].text.value;

		if(isEmpty(pastedUrl)) {
			document.getElementById('error').innerHTML = 'Please enter a URL.';
			return false;
		}

		if(isEmpty(trayId)) {
			document.getElementById('error').innerHTML = 'Please select a Tray.';
			return false;
		}

		if(isEmpty(title)) {
			document.getElementById('error').innerHTML = 'Please enter a Title.';
			return false;
		}

		if(isEmpty(text)) {
			document.getElementById('error').innerHTML = 'Please enter some Text to describe your entry.';
			return false;
		}

		var cleanedTitle = replaceSpecialChars(title);
		var cleanedText = replaceSpecialChars(text);

		var encodeUrl = encodeURIComponent(pastedUrl);

		var type = "4";

		if(pastedUrl.indexOf("www.youtube.com") > -1) {
			type = "5";
		} else if(pastedUrl.indexOf("www.vimeo.com") > -1) {
			type = "5";
		} else if(pastedUrl.indexOf("www.ted.com") > -1) {
			type = "5";
		} else {
			type = "4";
		}

		var inputFields = {
			"collectionName":dataObj.collectionName, 
			"trayId":trayId, 
			"type":type, 
			"url":encodeUrl, 
			"title":cleanedTitle, 
			"text":cleanedText};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;

		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					dataObj.drawerJson = xhr.responseText;

					renderDrawer();

				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("postSaveWebEntry(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/DrawerEntry/";

		xhr.open("POST", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send("inputJSON=" + stringJSON);
	}
	catch(err) {
		console.log("postSaveWebEntry(): " + err);
	}
	finally {

	}
}

function renderEditWebEntry(drawerId) {

	try {
		drawerItem = {};
		drawerItem = getDrawerItem(drawerId);

		var viewButtonComponent = createDrawerItemViewButton(drawerItem.drawerId);
		var deleteButtonComponent = createDrawerItemDeleteButton(drawerItem.drawerId);

		var buttonBarData = {
			"{{viewButton}}" : viewButtonComponent,
			"{{deleteButton}}" : deleteButtonComponent
		};

		var buttonBarComponent = component.create("t-edit-button-bar", buttonBarData);

		var trayListSelectTag = createTraySelectTag(drawerItem.trayId, "N");

		var data = {
			"{{buttonBar}}" : buttonBarComponent,
			"{{trayListSelectTag}}" : trayListSelectTag,
			"{{drawerId}}" : drawerId,
			"{{saveFunction}}" : 'putSaveWebEntry("' + drawerId + '");'
		};

		component.render("t-web-entry", "template-content", data);

		var decodeUrl = decodeURIComponent(drawerItem.url);

		document.getElementById("url").value = decodeUrl;
		document.getElementById("title").value = drawerItem.title;
		document.getElementById("text").value = drawerItem.text;

		menu.reset();
	}
	catch(err) {
		console.log("renderEditWebEntry(): " + err);
	}
	finally {

	}
}

function putSaveWebEntry(drawerId) {

	try {
		var pastedUrl = document.forms[0].url.value;
		var trayId = document.forms[0].traId.value;
		var title = document.forms[0].title.value;
		var text = document.forms[0].text.value;

		if(isEmpty(pastedUrl)) {
			document.getElementById('error').innerHTML = 'Please enter a URL.';
			return false;
		}

		if(isEmpty(trayId)) {
			document.getElementById('error').innerHTML = 'Please select a Tray.';
			return false;
		}

		if(isEmpty(title)) {
			document.getElementById('error').innerHTML = 'Please enter a Title.';
			return false;
		}

		if(isEmpty(text)) {
			document.getElementById('error').innerHTML = 'Please enter some Text to describe your entry.';
			return false;
		}

		var cleanedTitle = replaceSpecialChars(title);
		var cleanedText = replaceSpecialChars(text);

		var encodeUrl = encodeURIComponent(pastedUrl);

		var inputFields = {
			"collectionName":dataObj.collectionName, 
			"drawerId":drawerId, 
			"trayId":trayId, 
			"url":encodeUrl, 
			"title":cleanedTitle, 
			"text":cleanedText};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;

		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					dataObj.drawerJson = xhr.responseText;

					renderDrawer();

				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("putSaveWebEntry(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/DrawerEntry/";

		xhr.open("PUT", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(stringJSON);
	}
	catch(err) {
		console.log("putSaveWebEntry(): " + err);
	}
	finally {

	}
}


function renderAddMediaEntry() {

	try {
		var trayListSelectTag = createTraySelectTag("", "N");

		var data = {
			"{{trayListSelectTag}}": trayListSelectTag,
		};

		component.render("t-media-entry", "template-content", data);

		menu.reset();
	}
	catch(err) {
		console.log("renderAddMediaEntry(): " + err);
	}
	finally {

	}
}

function postFetchMediaFile() {

	try {
		/* Check if the browser supports this API */
		if(!window.FileReader){
			alert('The File APIs are not fully supported in this browser.');
			return;
		}

		/* get selected file element */
		var oFile = document.getElementById('inputFile').files[0];

		/* filter for image files */
/*
		var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;

		if (!rFilter.test(oFile.type)) {
			document.getElementById('error').innerHTML = 'The file is not an image file type (jpeg, gif, png, tiff, bmp).';
			return;
		}
*/
		/* Maximum file size is 10MB */
		if (oFile.size > 10485760) {
			document.getElementById('error').innerHTML = 'The file is too big. You can only upload up to a 10MB file.';
			return;
		}

		/* get preview element */
		var oImage = null;

		/* prepare HTML5 FileReader */
		var oReader = new FileReader();

		oReader.onload = function(e) {

			/* e.target.result contains the DataURL which we will use as a source of the image */
			oImage.src = e.target.result;
		};

		/* read selected file as DataURL */
		oReader.readAsDataURL(oFile);
	}
	catch(err) {
		console.log("postFetchMediaFile(): " + err);
	}
	finally {

	}
}

function postSaveMediaEntry() {

	try {
		var title = document.getElementById("title").value;

		if(isEmpty(title)) {
			document.getElementById('error').innerHTML = 'Please enter a valid Title for your post.';
			return false;
		}

		var cleanedTitle = replaceSpecialChars(title);

		/* get selected file element */
		var oFile = document.getElementById("inputFile").files[0];

		/* filter for image files */

/*		var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;

		if (!rFilter.test(oFile.type)) {
			document.getElementById('error').innerHTML = 'The file is not an image file type (jpeg, gif, png, tiff, bmp).';
			return;
		}
*/
		/* No File was selected */
		if (oFile.size <= 0) {
			document.getElementById('error').innerHTML = 'You have not selected a file to upload.';
			return;
		}

		/* The file type will tell the server what to convert as */
		var fileType = oFile.type;

alert("File Type: " + fileType);
alert("File Size: " + oFile.size);

		/* prepare HTML5 FileReader */
		var oReader = new FileReader();

		oReader.onload = function(e){

			/* Capture the base64 to send to the server. */
			var base64Code = e.target.result;

			/* encode the base64 so that it transfers properly to the server otherwise we'll not get the image */
			var base64 = encodeURIComponent(base64Code);

			var inputFields = {
				"title":cleanedTitle, 
				"fileType":fileType, 
				"base64Code":base64};

			var inputJSON = {};
			inputJSON.inputArgs = inputFields;

			var stringJSON = JSON.stringify(inputJSON);

			/* Post the file and other fields to the server */
/*			postUploadMediaFile(stringJSON);  */
		};

		/* read selected file as DataURL */
		oReader.readAsDataURL(oFile);
	}
	catch(err) {
		document.getElementById('error').innerHTML = 'We are sorry but we cannot post your file at this time.  Please try again in a little bit.';
	}
	finally {
		document.getElementById("preview").style.display = '';
	}
}

function postUploadMediaFile(stringJSON) {

	try {
		var url = "https://mydrawer-itsallhere.rhcloud.com/sharepicture/social";

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					var data = JSON.parse(xhr.responseText);

					var htmlContent = data.htmlContent;

					document.getElementById('template-content').innerHTML = htmlContent;

					menu.reset();

				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("postUploadMediaFile(): An error occurred during the transaction");
		};

		xhr.open("POST", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send("inputJSON=" + stringJSON);
	}
	catch(err) {
		document.getElementById('error').innerHTML = 'We are sorry but we cannot post your file at this time.  Please try again in a little bit.';
	}
	finally {

	}
}

function deleteDrawerItem(drawerId){

	try {

		var inputFields = {
			"collectionName":dataObj.collectionName, 
			"drawerId":drawerId
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

					dataObj.drawerJson = xhr.responseText;

					renderDrawer();

				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("deleteDrawerItem(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/DrawerEntry/";

		xhr.open("DELETE", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(stringJSON);
	}
	catch(err) {
		console.log("deleteDrawerItem(): " + err);
	}
	finally {

	}
}
