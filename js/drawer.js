/**
 * drawer.js
 * Contains general methods for My Drawer.
 * 
 * @author Stan Zajdel
*/

function init() {

	try {

		if(typeof(gblStateObj) === "undefined" || gblStateObj == null) {

			gblStateObj = {};
			gblStateObj.mbrSkToken = "";
			gblStateObj.mbrName = "";
			gblStateObj.mbrTrayJson = "";
			gblStateObj.mbrDrawerJson = "";
			gblStateObj.origTemplateContent = "";
			gblStateObj.mbrTraySelected = "";
			gblStateObj.favoriteTraTokens = "";
		}

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
		if(isEmpty(gblStateObj.mbrSkToken)) {
			renderSignIn();

		} else {

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				var DONE = 4;
				var OK = 200;

				if (xhr.readyState === DONE) {
					if (xhr.status === OK) {

						gblStateObj.mbrDrawerJson = xhr.responseText;

						var mbrDrawerArray = JSON.parse(gblStateObj.mbrDrawerJson);

						gblStateObj.mbrTraySelected = "in your drawer";

						resetMenu();
						renderDrawer();

					} else {
						console.log('Error: ' + xhr.status);
					}
				}
			};

			xhr.onerror = function () {
				console.log("getDrawer(): An error occurred during the transaction");
			};

			var url = "https://mydrawer-itsallhere.rhcloud.com/memberdrawerlistws/" + gblStateObj.mbrSkToken;

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

		var inputFields = {"searchType":"WILDCARD", "mbrSkToken":gblStateObj.mbrSkToken, "searchTerm":searchTerm, "traSk":""};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;
	
		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					gblStateObj.mbrDrawerJson = xhr.responseText;

					var mbrDrawerArray = JSON.parse(gblStateObj.mbrDrawerJson);

					if(mbrDrawerArray.length <= 0) {

						renderNoResultsFound();

					} else {
						gblStateObj.mbrTraySelected = "resulting in your search";

						resetMenu();
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

		var url = "https://mydrawer-itsallhere.rhcloud.com/memberdrawerlistws/";

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

function postSearchDrawerByTraSk(traTokens) {

	try {
		var tokens = traTokens.split("|");
		var traSk = tokens[0];
		var traName = tokens[1];

		var inputFields = {"searchType":"TRAY", "mbrSkToken":gblStateObj.mbrSkToken, "searchTerm":"", "traSk":traSk};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;
	
		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					gblStateObj.mbrDrawerJson = xhr.responseText;

					var mbrDrawerArray = JSON.parse(gblStateObj.mbrDrawerJson);

					if(mbrDrawerArray.length <= 0) {
						renderNoResultsFound();

					} else {
						gblStateObj.mbrTraySelected = "in your " + traName + " tray";

						resetMenu();
						renderDrawer();
					}
				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("postSearchDrawerByTraSk(): An error occurred during the transaction");
		};

		var url = "https://mydrawer-itsallhere.rhcloud.com/memberdrawerlistws/";

		xhr.open("POST", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send("inputJSON=" + stringJSON);
	}
	catch(err) {
		console.log("postSearchDrawerByTraSk(): " + err);
	}
	finally {

	}
}

function renderNoResultsFound() {

	try {
		var t = document.getElementById("t-no-results-found");

		var tHtml = t.innerHTML;

		document.getElementById('template-content').innerHTML = tHtml;

		resetMenu();
	}
	catch(err) {
		console.log("renderNoResultsFound(): " + err);
	}
	finally {

	}
}

function renderDrawer() {

	try {
		var td = "";
		var tdHtml = "";
		var tdHtmlReplace = "";

		var mbrDrawerArray = JSON.parse(gblStateObj.mbrDrawerJson);

		var tr = document.getElementById("t-drawer-rows");
		var trHtml = tr.innerHTML;
		var trHtmlReplace = "";

		for(var i=0; i<mbrDrawerArray.length; i++) {

			var item = mbrDrawerArray[i];

			var abbrText = item.abbrText.replace(/\r/g, " ");
			abbrText = item.abbrText.replace(/\n/g, " ");

			var itemTitle = renderDrawerItemViewTitle(item.drwSk);

			var viewButton = renderDrawerItemViewButton(item.drwSk);
			var editButton = renderDrawerItemEditButton(item.drwSk);
			var deleteButton = renderDrawerItemDeleteButton(item.drwSk);

			trHtmlReplace += trHtml.replace(/{{itemTitle}}/g, itemTitle)
				.replace(/{{traName}}/g, item.traName)
				.replace(/{{text}}/g, abbrText)
				.replace(/{{updatedDt}}/g, item.updatedDt)
				.replace(/{{viewButton}}/g, viewButton)
				.replace(/{{editButton}}/g, editButton)
				.replace(/{{deleteButton}}/g, deleteButton);
		}

		td = document.getElementById("t-drawer");

		if(mbrDrawerArray.length <= 0) {
			trHtmlReplace = "";
		}

		tdHtml = td.innerHTML;
		tdHtmlReplace = tdHtml.replace(/{{favoriteTraTokens}}/g, gblStateObj.favoriteTraTokens)
			.replace(/{{totalItems}}/g, mbrDrawerArray.length)
			.replace(/{{mbrTraySelected}}/g, gblStateObj.mbrTraySelected)
			.replace(/{{drawerRows}}/g, trHtmlReplace);

		document.getElementById('template-content').innerHTML = tdHtmlReplace;

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

function getDrawerItem(drwSk) {

	var drawerItem = {};

	try {
		var mbrDrawerArray = JSON.parse(gblStateObj.mbrDrawerJson);

		if(mbrDrawerArray.length > 0) {

			for(var i=0; i<mbrDrawerArray.length; i++) {

				var item = mbrDrawerArray[i];

				if(drwSk == item.drwSk) {

					var decodeUrl = decodeURIComponent(item.url);

					drawerItem.drwSk = item.drwSk;
					drawerItem.traSk = item.traSk;
					drawerItem.typeId = item.typeId;
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

function renderDrawerItemViewTitle(drwSk) {

	var ttReplace = "";

	try {
		drawerItem = {};
		drawerItem = getDrawerItem(drwSk);

		var tt = "";
		var ttHtml = "";

		if(drawerItem.typeId == "1") {
			tt = document.getElementById("t-drawer-title-text-view");
			ttHtml = tt.innerHTML;

			ttReplace = ttHtml.replace(/{{drwSk}}/g, drwSk)
				.replace(/{{title}}/g, drawerItem.title);

		} else if(drawerItem.typeId == "4") {
			tt = document.getElementById("t-drawer-title-article-view");
			ttHtml = tt.innerHTML;

			ttReplace = ttHtml.replace(/{{url}}/g, drawerItem.url)
				.replace(/{{title}}/g, drawerItem.title);

		} else if(drawerItem.typeId == "5") {
			tt = document.getElementById("t-drawer-title-video-view");
			ttHtml = tt.innerHTML;

			ttReplace = ttHtml.replace(/{{drwSk}}/g, drwSk)
				.replace(/{{title}}/g, drawerItem.title);
		}
	}
	catch(err) {
		console.log("renderDrawerItemViewTitle(): " + err);
	}
	finally {

	}

	return ttReplace;
}

function renderDrawerItemViewButton(drwSk) {

	var tbReplace = "";

	try {
		drawerItem = {};
		drawerItem = getDrawerItem(drwSk);

		var tb = "";
		var tbHtml = "";

		if(drawerItem.typeId == "1") {
			tb = document.getElementById("t-drawer-button-text-view");
			tbHtml = tb.innerHTML;

			tbReplace = tbHtml.replace(/{{drwSk}}/g, drwSk);

		} else if(drawerItem.typeId == "4") {
			tb = document.getElementById("t-drawer-button-article-view");
			tbHtml = tb.innerHTML;

			tbReplace = tbHtml.replace(/{{url}}/g, drawerItem.url);

		} else if(drawerItem.typeId == "5") {
			tb = document.getElementById("t-drawer-button-video-view");
			tbHtml = tb.innerHTML;

			tbReplace = tbHtml.replace(/{{drwSk}}/g, drwSk);
		}
	}
	catch(err) {
		console.log("renderDrawerItemViewButton(): " + err);
	}
	finally {

	}

	return tbReplace;
}

function renderDrawerItemEditButton(drwSk) {

	var tbReplace = "";

	try {
		drawerItem = {};
		drawerItem = getDrawerItem(drwSk);

		var tb = "";
		var tbHtml = "";

		if(drawerItem.typeId == "1") {
			tb = document.getElementById("t-drawer-button-text-edit");
			tbHtml = tb.innerHTML;

			tbReplace = tbHtml.replace(/{{drwSk}}/g, drwSk);

		} else if(drawerItem.typeId == "4" || drawerItem.typeId == "5") {
			tb = document.getElementById("t-drawer-button-web-edit");
			tbHtml = tb.innerHTML;

			tbReplace = tbHtml.replace(/{{drwSk}}/g, drwSk);
		}
	}
	catch(err) {
		console.log("renderDrawerItemEditTitle(): " + err);
	}
	finally {

	}

	return tbReplace;
}

function renderDrawerItemDeleteButton(drwSk) {

	var tbReplace = "";

	try {
		var tb = document.getElementById("t-drawer-button-delete");
		var tbHtml = tb.innerHTML;

		tbReplace = tbHtml.replace(/{{drwSk}}/g, drwSk);
	}
	catch(err) {
		console.log("renderDrawerItemDeleteTitle(): " + err);
	}
	finally {

	}

	return tbReplace;
}

function renderViewTextEntry(drwSk) {

	try {
		drawerItem = {};
		drawerItem = getDrawerItem(drwSk);

		var b = document.getElementById("t-view-button-bar");

		var editButton = renderDrawerItemEditButton(drawerItem.drwSk);
		var deleteButton = renderDrawerItemDeleteButton(drawerItem.drwSk);

		var bHtml = b.innerHTML;
		var bHtmlReplace = bHtml.replace(/{{editButton}}/g, editButton)
			.replace(/{{deleteButton}}/g, deleteButton);

		var t = document.getElementById("t-text-view");

		var tHtml = t.innerHTML;
		var tHtmlReplace = tHtml.replace(/{{buttonBar}}/g, bHtmlReplace)
			.replace(/{{deleteButton}}/g, deleteButton)
			.replace(/{{title}}/g, drawerItem.title)
			.replace(/{{traName}}/g, drawerItem.traName)
			.replace(/{{text}}/g, drawerItem.text);

		document.getElementById('template-content').innerHTML = tHtmlReplace;

		resetMenu();
	}
	catch(err) {
		console.log("renderViewTextEntry(): " + err);
	}
	finally {

	}
}

function renderViewVideoEntry(drwSk) {

	try {
		drawerItem = {};
		drawerItem = getDrawerItem(drwSk);

		var b = document.getElementById("t-view-button-bar");

		var editButton = renderDrawerItemEditButton(drawerItem.drwSk);
		var deleteButton = renderDrawerItemDeleteButton(drawerItem.drwSk);

		var bHtml = b.innerHTML;
		var bHtmlReplace = bHtml.replace(/{{editButton}}/g, editButton)
			.replace(/{{deleteButton}}/g, deleteButton);

		var t = document.getElementById("t-video-view");

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

		var tHtml = t.innerHTML;
		var tHtmlReplace = tHtml.replace(/{{buttonBar}}/g, bHtmlReplace)
			.replace(/{{title}}/g, drawerItem.title)
			.replace(/{{traName}}/g, drawerItem.traName);

		document.getElementById('template-content').innerHTML = tHtmlReplace;

		document.getElementById("embedded-video").src = embeddedlink;

		resetMenu();
	}
	catch(err) {
		console.log("renderViewVideoEntry(): " + err);
	}
	finally {

	}
}

function renderAddTextEntry() {

	try {
		var t = document.getElementById("t-text-entry");

		var mbrTrayListSelectTag = renderMbrTraySelectTag("","N");

		var tHtml = t.innerHTML;
		var tHtmlReplace = tHtml.replace(/{{buttonBar}}/g, "")
			.replace(/{{mbrTrayListSelectTag}}/g, mbrTrayListSelectTag)
			.replace(/{{saveFunction}}/g, 'postSaveTextEntry();');

		document.getElementById('template-content').innerHTML = tHtmlReplace;

		resetMenu();
	}
	catch(err) {
		console.log("renderAddTextEntry(): " + err);
	}
	finally {

	}
}

function postSaveTextEntry(){

	try {
		var traSk = document.forms[0].traSk.value;
		var title = document.forms[0].title.value;
		var text = document.forms[0].text.value;

		if(isEmpty(traSk)) {
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

		var inputFields = {"mbrSkToken":gblStateObj.mbrSkToken, "traSk":traSk, "typeId":"1", "url":".", "title":cleanedTitle, "text":cleanedText};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;

		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					gblStateObj.mbrDrawerJson = xhr.responseText;

					renderDrawer();

				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("postSaveTextEntry(): An error occurred during the transaction");
		};

		var url = "https://mydrawer-itsallhere.rhcloud.com/memberdrawerentryws/";

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

function renderEditTextEntry(drwSk) {

	try {
		drawerItem = {};
		drawerItem = getDrawerItem(drwSk);

		var b = document.getElementById("t-edit-button-bar");

		var viewButton = renderDrawerItemViewButton(drawerItem.drwSk);
		var deleteButton = renderDrawerItemDeleteButton(drawerItem.drwSk);

		var bHtml = b.innerHTML;
		var bHtmlReplace = bHtml.replace(/{{viewButton}}/g, viewButton)
			.replace(/{{deleteButton}}/g, deleteButton);

		var t = document.getElementById("t-text-entry");

		var mbrTrayListSelectTag = renderMbrTraySelectTag(drawerItem.traSk, "N");

		var tHtml = t.innerHTML;
		var tHtmlReplace = tHtml.replace(/{{buttonBar}}/g, bHtmlReplace)
			.replace(/{{mbrTrayListSelectTag}}/g, mbrTrayListSelectTag)
			.replace(/{{drwSk}}/g, drwSk)
			.replace(/{{saveFunction}}/g, 'putSaveTextEntry("' + drwSk + '");');

		document.getElementById('template-content').innerHTML = tHtmlReplace;

		document.getElementById("title").value = drawerItem.title;
		document.getElementById("text").value = drawerItem.text;

		resetMenu();
	}
	catch(err) {
		console.log("renderEditTextEntry(): " + err);
	}
	finally {

	}
}

function putSaveTextEntry(drwSk){

	try {
		var traSk = document.forms[0].traSk.value;
		var title = document.forms[0].title.value;
		var text = document.forms[0].text.value;

		if(isEmpty(traSk)) {
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

		var inputFields = {"mbrSkToken":gblStateObj.mbrSkToken, "drwSk":drwSk, "traSk":traSk, "url":".", "title":cleanedTitle, "text":cleanedText};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;

		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					gblStateObj.mbrDrawerJson = xhr.responseText;

					renderDrawer();

				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("putSaveTextEntry(): An error occurred during the transaction");
		};

		var url = "https://mydrawer-itsallhere.rhcloud.com/memberdrawerentryws/";

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
		var t = document.getElementById("t-web-entry");

		var mbrTrayListSelectTag = renderMbrTraySelectTag("", "N");

		var tHtml = t.innerHTML;
		var tHtmlReplace = tHtml.replace(/{{buttonBar}}/g, "")
			.replace(/{{mbrTrayListSelectTag}}/g, mbrTrayListSelectTag)
			.replace(/{{saveFunction}}/g, 'postSaveWebEntry();');

		document.getElementById('template-content').innerHTML = tHtmlReplace;

		resetMenu();
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

		var url = "https://mydrawer-itsallhere.rhcloud.com/urlpartsws/";

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
		var traSk = document.forms[0].traSk.value;
		var title = document.forms[0].title.value;
		var text = document.forms[0].text.value;

		if(isEmpty(pastedUrl)) {
			document.getElementById('error').innerHTML = 'Please enter a URL.';
			return false;
		}

		if(isEmpty(traSk)) {
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

		var typeId = "4";

		if(pastedUrl.indexOf("www.youtube.com") > -1) {
			typeId = "5";
		} else if(pastedUrl.indexOf("www.vimeo.com") > -1) {
			typeId = "5";
		} else if(pastedUrl.indexOf("www.ted.com") > -1) {
			typeId = "5";
		} else {
			typeId = "4";
		}

		var inputFields = {"mbrSkToken":gblStateObj.mbrSkToken, "traSk":traSk, "typeId":typeId, "url":encodeUrl, "title":cleanedTitle, "text":cleanedText};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;

		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					gblStateObj.mbrDrawerJson = xhr.responseText;

					renderDrawer();

				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("postSaveWebEntry(): An error occurred during the transaction");
		};

		var url = "https://mydrawer-itsallhere.rhcloud.com/memberdrawerentryws/";

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

function renderEditWebEntry(drwSk) {

	try {
		drawerItem = {};
		drawerItem = getDrawerItem(drwSk);

		var b = document.getElementById("t-edit-button-bar");

		var viewButton = renderDrawerItemViewButton(drawerItem.drwSk);
		var deleteButton = renderDrawerItemDeleteButton(drawerItem.drwSk);

		var bHtml = b.innerHTML;
		var bHtmlReplace = bHtml.replace(/{{viewButton}}/g, viewButton)
			.replace(/{{deleteButton}}/g, deleteButton);

		var t = document.getElementById("t-web-entry");

		var mbrTrayListSelectTag = renderMbrTraySelectTag(drawerItem.traSk, "N");

		var tHtml = t.innerHTML;
		var tHtmlReplace = tHtml.replace(/{{buttonBar}}/g, bHtmlReplace)
			.replace(/{{mbrTrayListSelectTag}}/g, mbrTrayListSelectTag)
			.replace(/{{drwSk}}/g, drwSk)
			.replace(/{{saveFunction}}/g, 'putSaveWebEntry("' + drwSk + '");');

		document.getElementById('template-content').innerHTML = tHtmlReplace;

		var decodeUrl = decodeURIComponent(drawerItem.url);

		document.getElementById("url").value = decodeUrl;
		document.getElementById("title").value = drawerItem.title;
		document.getElementById("text").value = drawerItem.text;

		resetMenu();
	}
	catch(err) {
		console.log("renderEditWebEntry(): " + err);
	}
	finally {

	}
}

function putSaveWebEntry(drwSk) {

	try {
		var pastedUrl = document.forms[0].url.value;
		var traSk = document.forms[0].traSk.value;
		var title = document.forms[0].title.value;
		var text = document.forms[0].text.value;

		if(isEmpty(pastedUrl)) {
			document.getElementById('error').innerHTML = 'Please enter a URL.';
			return false;
		}

		if(isEmpty(traSk)) {
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

		var inputFields = {"mbrSkToken":gblStateObj.mbrSkToken, "drwSk":drwSk, "traSk":traSk, "url":encodeUrl, "title":cleanedTitle, "text":cleanedText};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;

		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					gblStateObj.mbrDrawerJson = xhr.responseText;

					renderDrawer();

				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("putSaveWebEntry(): An error occurred during the transaction");
		};

		var url = "https://mydrawer-itsallhere.rhcloud.com/memberdrawerentryws/";

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
		var t = document.getElementById("t-media-entry");

		var mbrTrayListSelectTag = renderMbrTraySelectTag("", "N");

		var tHtml = t.innerHTML;
		var tHtmlReplace = tHtml.replace(/{{mbrTrayListSelectTag}}/g, mbrTrayListSelectTag);

		document.getElementById('template-content').innerHTML = tHtmlReplace;

		resetMenu();
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

			var inputFields = {"title":cleanedTitle, "fileType":fileType, "base64Code":base64};

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
		var url = "https://mydrawer-itsallhere.rhcloud.com/sharepicturews/social";

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					var data = JSON.parse(xhr.responseText);

					var htmlContent = data.htmlContent;

					document.getElementById('template-content').innerHTML = htmlContent;

					resetMenu();

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

function deleteDrawerItem(drwSk){

	try {

		var inputFields = {"mbrSkToken":gblStateObj.mbrSkToken, "drwSk":drwSk};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;

		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					gblStateObj.mbrDrawerJson = xhr.responseText;

					renderDrawer();

				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("deleteDrawerItem(): An error occurred during the transaction");
		};

		var url = "https://mydrawer-itsallhere.rhcloud.com/memberdrawerentryws/";

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

