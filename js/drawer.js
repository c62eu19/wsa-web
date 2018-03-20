/**
 * drawer.js
 * Contains general methods for My Drawer.
 * 
 * @author Stan Zajdel
*/

function init() {

	try {
		/*
		 * Initialize the appData object
		 */
		appData.initialize();

		component.initializeEventRegistry();
		component.registerEvent("func:getDrawerList", "drawer.getList();");
		component.registerEvent("func:toggle", "menu.toggle();");

		component.render("t-menu-bar", "template-header");
/*		component.render("t-menu-signed-out", "template-menu"); */

		/*
		 * Register a listener for enter key pressed for selected templates
		 */
		listener.registerKeyDownEnter();

		/*
		 * Render the sign in template
		 */
		access.renderSignIn();
	}
	catch(err) {
		console.log("init(): " + err);
	}
	finally {}
}

var access = {

	renderSignIn: function() {

		try {
			if(isEmpty(appData.get("collectionName"))) {

				component.initializeEventRegistry();
				component.registerEvent("func:signIn", "access.signIn();");
				component.registerEvent("func:renderSignUp", "access.renderSignUp();");

				component.render("t-sign-in", "template-content");

				state.saveInitialState("template-content");
			}

			menu.reset();
		}
		catch(err) {
			console.log("renderSignIn(): " + err);
		}
		finally {}
	},

	signIn: function(){

		try {
			var email = document.getElementById("email").value;
			var password = document.getElementById("password").value;

			if(isEmpty(email)) {
				component.setText("error", "Please enter a valid Email.");
				return false;
			}

			if(isEmpty(password)) {
				component.setText("error", "Please enter a Password.");
				return false;
			}

			var inputFields = {"email":email, "password":password};

			var inputJSON = {};
			inputJSON.inputArgs = inputFields;
			
			var stringJSON = JSON.stringify(inputJSON);

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var data = JSON.parse(xhr.responseText);

					var statusInd = data.statusInd;
					var statusMsg = data.statusMsg;

					appData.set("collectionName", data.collectionName);
					appData.set("userName", data.userName);
					appData.set("trayJson", data.trayJson);
					appData.set("drawerJson", data.drawerJson);

					if(statusInd == "A") {
						appData.set("traySelected", "in your drawer");

						var favoriteTrayId = tray.getFavoriteTrayId();
						appData.set("favoriteTrayId", favoriteTrayId);

						menu.reset();
						drawer.render();

					} else if(statusInd == "D") {
						access.renderAccountDisabled();
					}
					else {
						access.renderSignInError();
					}

				} else {
					console.log('signin(): ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("signIn(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/Signin/";

			xhr.open("POST", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send("inputJSON=" + stringJSON);
		}
		catch(err) {
			console.log("signIn(): " + err);
		}
		finally {}
	},

	renderSignInError: function() {

		try {
			component.initializeEventRegistry();
			component.registerEvent("func:renderSignIn", "access.renderSignIn();");

			component.render("t-sign-in-error", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderSignInError(): " + err);
		}
		finally {}
	},

	renderAccountDisabled: function() {

		try {
			component.render("t-account-disabled", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderAccountDisabled(): " + err);
		}
		finally {}
	},

	renderSignUp: function() {

		try {
			appData.initialize();

			component.initializeEventRegistry();
			component.registerEvent("func:signUp", "access.signUp();");
			component.registerEvent("func:renderSignIn", "access.renderSignIn();");

			component.render("t-sign-up", "template-content");

			state.saveInitialState("template-content");

			menu.reset();
		}
		catch(err) {
			console.log("renderSignUp(): " + err);
		}
		finally {}
	},

	signUp: function(){

		try {
			var email = document.getElementById("email").value;
			var password = document.getElementById("password").value;
			var passwordReentry = document.getElementById("passwordReentry").value;
			var name = document.getElementById("name").value;

			if(isEmpty(email)) {
				component.setText("error", "Your Email is required.");
				return false;
			}

			if(!isValidEmail(email)) {
				component.setText("error", "You have entered an invalid Email.");
				return false;
			}

			if(isEmpty(password)) {
				component.setText("error", "Your Password is required.");
				return false;
			}

			if(password.length < 6) {
				component.setText("error", "Your password must be at least 6 characters.");
				return false;
			}

			if(isEmpty(passwordReentry)) {
				component.setText("error", "Please reenter your Password.");
				return false;
			}

			if(password != passwordReentry) {
				component.setText("error", "The reentered Password does not match your Password.");
				return false;
			}

			if(isEmpty(name)) {
				component.setText("error", "Your Name is required.");
				return false;
			}

			var inputFields = {"email":email, "password":password, "name":name};

			var inputJSON = {};
			inputJSON.inputArgs = inputFields;
			
			var stringJSON = JSON.stringify(inputJSON);

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var data = JSON.parse(xhr.responseText);

					var statusInd = data.statusInd;
					var statusMsg = data.statusMsg;

					appData.set("collectionName", data.collectionName);
					appData.set("userName", data.userName);
					appData.set("trayJson", data.trayJson);
					appData.set("drawerJson", data.drawerJson);

					if(statusInd == "A") {

						appData.set("traySelected", "in your drawer");

						var favoriteTrayId = tray.getfavoriteTrayId();
						appData.set("favoriteTrayId", favoriteTrayId);

						drawer.render();

						menu.reset();
					} else {
						access.renderSignUpError(statusMsg);
					}
				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("signUp(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/Signup/";

			xhr.open("POST", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

			xhr.send("inputJSON=" + stringJSON);
		}
		catch(err) {
			component.setText("error", "An error has occured in your account signup. Please try again.");
			console.log("signUp(): " + err);
		}
		finally {}
	},

	renderSignUpError: function(errorMsg) {

		try {
			component.initializeDataRegistry();
			component.registerData("data:errorMsg", errorMsg);

			component.initializeEventRegistry();
			component.registerEvent("func:renderSignUp", "access.renderSignUp();");

			component.render("t-signup-error", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderSignUpError(): " + err);
		}
		finally {}
	},

	signOut: function() {

		try {
			appData.initialize();

			access.renderSignIn();
		}
		catch(err) {
			console.log("signOut(): " + err);
		}
		finally {}
	}
};

var menu = {

	reset: function() {

		try {
/*			document.getElementById('id-hamburger').style.display = ''; */
		}
		catch(err) {
			console.log("reset(): " + err);
		}
		finally {}
	},

	toggle: function(e) {

		try {
			var menuElement = document.getElementById("command-menu");

			if(menuElement == null) {

				if(isEmpty(appData.get("collectionName"))) {
					menu.renderMenuSignedOut();

				} else {
					menu.renderMenuSignedIn();
				}

			} else {
				state.restoreInitialState("template-content");
			}
		}
		catch(err) {
			console.log("toggle(): " + err);
		}
		finally {}
	},

	closeHamburger: function(e) {

		try {
			document.getElementById('id-cross').style.display = 'none';
			document.getElementById('id-hamburger').style.display = '';

			state.restoreInitialState("template-content");
		}
		catch(err) {
			console.log("closeHamburger(): " + err);
		}
		finally {}
	},

	renderMenuSignedIn: function() {

		try {
			var trayListSelectTag = tray.createSelectTag("", "add-onchange");

			component.initializeDataRegistry();
			component.registerData("data:trayId", appData.get("favoriteTrayId"));
			component.registerData("data:trayListSelectTag", trayListSelectTag);

			component.initializeEventRegistry();
			component.registerEvent("func:renderAddTextItem", "drawer.renderAddTextItem();");
			component.registerEvent("func:renderAddWebItem", "drawer.renderAddWebItem();");
			component.registerEvent("func:renderAddMediaItem", "drawer.renderAddMediaItem();");
			component.registerEvent("func:searchDrawerByTrayId", "drawer.searchDrawerByTrayId(this);");
			component.registerEvent("func:getTrayList", "tray.getList();");
			component.registerEvent("func:renderContactUs", "general.renderContactUs();");
			component.registerEvent("func:renderAbout", "general.renderAbout();");
			component.registerEvent("func:signOut", "access.signOut();");

			component.render("t-menu-signed-in", "template-content");
		}
		catch(err) {
			console.log("renderMenuSignedIn(): " + err);
		}
		finally {}
	},

	renderMenuSignedOut: function() {

		try {

			component.initializeEventRegistry();
			component.registerEvent("func:renderContactUs", "general.renderContactUs();");
			component.registerEvent("func:renderAbout", "general.renderAbout();");

			component.render("t-menu-signed-out", "template-content");
		}
		catch(err) {
			console.log("renderMenuSignedOut(): " + err);
		}
		finally {}
	}

};

var general = {

	renderContactUs: function() {

		try {
			component.initializeEventRegistry();
			component.registerEvent("func:addContactUs", "general.addContactUs();");

			component.render("t-contact-us", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderContactUs(): " + err);
		}
		finally {}
	},

	addContactUs: function() {

		try {
			var email = document.getElementById("email").value;

			var subjectEl = document.getElementById("subject");
			var subject = msgSubjEl.options[subjectEl.selectedIndex].text;

			var message = document.getElementById("message").value;

			if(isEmpty(email)) {
				component.setText("error", "Your Email is required.");
				return false;
			}

			if(!isValidEmail(email)) {
				component.setText("error", "You have entered an invalid Email.");
				return false;
			}

			if(isEmpty(subject)) {
				component.setText("error", "The Subject is required.");
				return false;
			}

			if(isEmpty(message)) {
				component.setText("error", "The Message is required.");
				return false;
			}

			var inputFields = {"email":email, "subject":subject, "message":message};

			var inputJSON = {};
			inputJSON.inputArgs = inputFields;
				
			var stringJSON = JSON.stringify(inputJSON);

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("addContactUs(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/ContactUs/";

			xhr.open("POST", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send("inputJSON=" + stringJSON);
		}
		catch(err) {
			console.log("addContactUs(): " + err);
		}
		finally {}
	},

	renderAbout: function() {

		try {
			component.render("t-about", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderAbout(): " + err);
		}
		finally {}
	}

};

var drawer = {

	getList: function() {

		try {
			if(isEmpty(appData.get("collectionName"))) {
				access.renderSignIn();

			} else {

				var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

				xhr.onreadystatechange = function () {

					if (xhr.readyState !== 4) {
						return;
					}

					if (xhr.status === 200) {
						var drawerJson = xhr.responseText;

						appData.set("drawerJson", drawerJson);

						var drawerArray = JSON.parse(drawerJson);

						appData.set("traySelected", "in your drawer");

						drawer.render();

					} else {
						console.log('Error: ' + xhr.status);
					}
				};

				xhr.onerror = function () {
					console.log("getList(): An error occurred during the transaction");
				};

				var url = "http://localhost:8080/mydrawer/DrawerList/" + appData.get("collectionName");

				xhr.open("GET", url, true);
				xhr.send();
			}
		}
		catch(err) {
			console.log("getList(): " + err);
		}
		finally {}
	},

	searchDrawerByWildcard: function() {

		try {
			var searchTerm = document.getElementById("searchTerm").value;

			if(isEmpty(searchTerm)) {
				return false;
			}

			var inputFields = {
				"searchType":"WILDCARD", 
				"collectionName":appData.get("collectionName"), 
				"searchTerm":searchTerm, 
				"trayId":""
			};

			var inputJSON = {};
			inputJSON.inputArgs = inputFields;
		
			var stringJSON = JSON.stringify(inputJSON);

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var drawerJson = xhr.responseText;

					appData.set("drawerJson", drawerJson);

					var drawerArray = JSON.parse(drawerJson);

					if(drawerArray.length > 0) {

						appData.set("traySelected", "resulting in your search");

						drawer.render();

					} else {
						drawer.renderNoResultsFound();
					}

				} else {
					console.log('Error: ' + xhr.status);
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
			console.log("searchDrawerByWildcard(): " + err);
		}
		finally {}
	},

	searchDrawerByTrayId: function(element) {

		try {
			var trayId = "";
			var trayName = "";

			trayId = element.getAttribute("data-tray-id");
			trayName = element.getAttribute("data-tray-name");

			/*
			 * If the element is from the menu then...
			 */
			if(trayId == null) {
				trayId = element.options[element.selectedIndex].value;
				trayName = element.options[element.selectedIndex].innerText;
			}

			var inputFields = {
				"searchType":"TRAY", 
				"collectionName":appData.get("collectionName"), 
				"searchTerm":"", 
				"trayId":trayId
			};

			var inputJSON = {};
			inputJSON.inputArgs = inputFields;
		
			var stringJSON = JSON.stringify(inputJSON);

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var drawerJson = xhr.responseText;

					appData.set("drawerJson", drawerJson);

					var drawerArray = JSON.parse(drawerJson);

					if(drawerArray.length <= 0) {
						drawer.renderNoResultsFound();

					} else {
						appData.set("traySelected", "in your " + trayName + " tray");

						drawer.render();
					}
				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("searchDrawerByTrayId(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/DrawerList/";

			xhr.open("POST", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send("inputJSON=" + stringJSON);
		}
		catch(err) {
			console.log("searchDrawerByTrayId(): " + err);
		}
		finally {}
	},

	render: function() {

		try {
			var drawerJson = appData.get("drawerJson");

			var drawerArray = JSON.parse(drawerJson);

			var rowHtml = "";

			var rowCount = 0;
			var columnCount = 0;

			for(var i=0; i<drawerArray.length; i++) {

				var item = drawerArray[i];

				var itemTitle = drawer.createViewTitle(item.drawerId);

				var viewButton = drawer.createViewButton(item.drawerId);
				var editButton = drawer.createEditButton(item.drawerId);
				var deleteButton = drawer.createDeleteButton(item.drawerId);

				/*
				 * Content can be text, web video or media
				 */
				var content = drawer.getItemTypeContent(item);

				component.initializeDataRegistry();
				component.registerData("data:itemTitle", itemTitle);
				component.registerData("data:trayName", item.trayName);
				component.registerData("data:itemTitle", itemTitle);
				component.registerData("data:content", content);
				component.registerData("data:url", item.url);
				component.registerData("data:updatedDate", item.updatedDate);
				component.registerData("data:viewButton", viewButton);
				component.registerData("data:editButton", editButton);
				component.registerData("data:deleteButton", deleteButton);

				var columnData = component.create("t-drawer-columns");

				rowCount++;
				columnCount++;

				if(columnCount == 1) {
					var columnLeft = columnData;

					/*
					 * If column count == 1 and rowCount == array count
					 */
					if(rowCount == drawerArray.length) {
						component.initializeDataRegistry();
						component.registerData("data:columnLeft", columnLeft);
						component.registerData("data:columnMiddle", "");
						component.registerData("data:columnRight", "");

						rowHtml += component.create("t-drawer-rows");
					}
				}

				if(columnCount == 2) {
					var columnMiddle = columnData;

					/*
					 * If column count == 2 and rowCount == array count
					 */
					if(rowCount == drawerArray.length) {
						component.initializeDataRegistry();
						component.registerData("data:columnLeft", columnLeft);
						component.registerData("data:columnMiddle", columnMiddle);
						component.registerData("data:columnRight", "");

						rowHtml += component.create("t-drawer-rows");
					}
				}

				if(columnCount == 3) {
					var columnRight = columnData;

					component.initializeDataRegistry();
					component.registerData("data:columnLeft", columnLeft);
					component.registerData("data:columnMiddle", columnMiddle);
					component.registerData("data:columnRight", columnRight);

					rowHtml += component.create("t-drawer-rows");
					columnCount = 0;
				}
			}

			if(drawerArray.length <= 0) {
				rowHtml = "";
			}

			component.initializeDataRegistry();
			component.registerData("data:trayId", appData.get("favoriteTrayId"));
			component.registerData("data:totalItems", drawerArray.length);
			component.registerData("data:traySelected", appData.get("traySelected"));
			component.registerData("data:drawerRows", rowHtml);

			component.initializeEventRegistry();
			component.registerEvent("func:searchDrawerByWildcard", "drawer.searchDrawerByWildcard();");
			component.registerEvent("func:searchDrawerByTrayId", "drawer.searchDrawerByTrayId(this);");
			component.registerEvent("func:getTrayList", "tray.getList();");

			component.render("t-drawer", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("render(): " + err);
		}
		finally {}
	},

	getItemTypeContent: function(drawerItem) {

		var content = "";

		try {
			var sanitizedText = drawerItem.text.replace(/\r/g, " ");
			sanitizedText = drawerItem.text.replace(/\n/g, " ");

			var shortSanitizedText = "";

			if(sanitizedText.length > 200) {
				shortSanitizedText = sanitizedText.substring(0,199) + "...";
			} else {
				shortSanitizedText = sanitizedText;
			}

			component.initializeDataRegistry();

			if(drawerItem.type == "1") {

				content = shortSanitizedText;

			} else if(drawerItem.type == "2") {

				if(drawer.isUrlWebVideo(drawerItem.url)) {

					var embeddedVideoLink = drawer.getEmbeddedVideoLink(drawerItem.url);

					component.registerData("data:videoUrl", embeddedVideoLink);

					content = component.create("t-drawer-column-video");

				} else {
					content = shortSanitizedText;
				}

			} else if(drawerItem.type == "3") {

				var decodeMediaBase64 = decodeURIComponent(drawerItem.mediaBase64);
				component.registerData("data:imageUrl", decodeMediaBase64);

				content = component.create("t-drawer-column-image");
			}

		}
		catch(err) {
			console.log("getItemTypeContent(): " + err);
		}
		finally {}

		return content;
	},

	getEmbeddedVideoLink: function(url) {

		var embeddedLink = "";

		try {
			var id = "";

			var decodeUrl = decodeURIComponent(url);

			if(decodeUrl.indexOf("www.youtube.com") > -1) {
				id = decodeUrl.split("?v=")[1];
				embeddedLink = "https://www.youtube.com/embed/" + id;

			} else if(decodeUrl.indexOf("www.vimeo.com") > -1) {
				id = decodeUrl.split("/")[2];
				embeddedLink="https://player.vimeo.com/video/" + id;

			} else if(decodeUrl.indexOf("www.ted.com") > -1) {

			} else {

			}
		}
		catch(err) {
			console.log("getEmbeddedVideoLink(): " + err);
		}
		finally {}

		return embeddedLink;
	},

	renderNoResultsFound: function() {

		try {
			component.initializeEventRegistry();
			component.registerEvent("func:getDrawerList", "drawer.getList();");

			component.render("t-no-results-found", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderNoResultsFound(): " + err);
		}
		finally {}
	},

	getItem: function(drawerId) {

		var drawerItem = {};

		try {
			var drawerArray = JSON.parse(appData.get("drawerJson"));

			if(drawerArray.length > 0) {

				for(var i=0; i<drawerArray.length; i++) {

					var item = drawerArray[i];

					if(drawerId == item.drawerId) {

						var decodeUrl = decodeURIComponent(item.url);
						var decodeMediaBase64 = decodeURIComponent(item.mediaBase64);

						drawerItem.drawerId = item.drawerId;
						drawerItem.trayId = item.trayId;
						drawerItem.type = item.type;
						drawerItem.updatedDate = item.updatedDate;
						drawerItem.title = item.title;
						drawerItem.text = item.text;
						drawerItem.url = decodeUrl;
						drawerItem.mediaType = item.mediaType;
						drawerItem.mediaBase64 = decodeMediaBase64;
						drawerItem.trayName = item.trayName;

						break;
					}
				}
			}
		}
		catch(err) {
			console.log("getItem(): " + err);
		}
		finally {}

		return drawerItem;
	},

	renderViewTextItem: function(element) {

		try {
			var drawerId = element.getAttribute("data-drawer-id");

			drawerItem = {};
			drawerItem = drawer.getItem(drawerId);

			var editButton = drawer.createEditButton(drawerItem.drawerId);
			var deleteButton = drawer.createDeleteButton(drawerItem.drawerId);

			component.initializeDataRegistry();
			component.registerData("data:editButton", editButton);
			component.registerData("data:deleteButton", deleteButton);
			component.registerData("data:title", drawerItem.title);
			component.registerData("data:trayName", drawerItem.trayName);
			component.registerData("data:text", drawerItem.text);

			component.render("t-text-view", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderViewTextItem(): " + err);
		}
		finally {}
	},

	renderAddTextItem: function() {

		try {
			var trayListSelectTag = tray.createSelectTag("", "N");

			component.initializeDataRegistry();
			component.registerData("data:trayListSelectTag", trayListSelectTag);

			component.initializeEventRegistry();
			component.registerEvent("func:addTextItem", "drawer.addTextItem();");

			component.render("t-text-add", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderAddTextItem(): " + err);
		}
		finally {}
	},

	renderEditTextItem: function(element) {

		try {
			var drawerId = element.getAttribute("data-drawer-id");

			drawerItem = {};
			drawerItem = drawer.getItem(drawerId);

			var viewButton = drawer.createViewButton(drawerItem.drawerId);
			var deleteButton = drawer.createDeleteButton(drawerItem.drawerId);

			var trayListSelectTag = tray.createSelectTag(drawerItem.trayId, "N");

			component.initializeDataRegistry();
			component.registerData("data:viewButton", viewButton);
			component.registerData("data:deleteButton", deleteButton);
			component.registerData("data:trayListSelectTag", trayListSelectTag);
			component.registerData("data:title", drawerItem.title);
			component.registerData("data:text", drawerItem.text);
			component.registerData("data:drawerId", drawerId);

			component.initializeEventRegistry();
			component.registerEvent("func:editTextItem", "drawer.editTextItem(this);");

			component.render("t-text-edit", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderEditTextItem(): " + err);
		}
		finally {}
	},

	renderAddWebItem: function() {

		try {
			var trayListSelectTag = tray.createSelectTag("", "N");

			component.initializeDataRegistry();
			component.registerData("data:trayListSelectTag", trayListSelectTag);

			component.initializeEventRegistry();
			component.registerEvent("func:pasteWebUrl", "drawer.pasteWebUrl(event);");
			component.registerEvent("func:addWebItem", "drawer.addWebItem();");

			component.render("t-web-add", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderAddWebItem(): " + err);
		}
		finally {}
	},

	renderEditWebItem: function(element) {

		try {
			var drawerId = element.getAttribute("data-drawer-id");

			drawerItem = {};
			drawerItem = drawer.getItem(drawerId);

			var viewButton = drawer.createViewButton(drawerItem.drawerId);
			var deleteButton = drawer.createDeleteButton(drawerItem.drawerId);

			var trayListSelectTag = tray.createSelectTag(drawerItem.trayId, "N");

			var decodeUrl = decodeURIComponent(drawerItem.url);

			component.initializeDataRegistry();
			component.registerData("data:viewButton", viewButton);
			component.registerData("data:deleteButton", deleteButton);
			component.registerData("data:trayListSelectTag", trayListSelectTag);
			component.registerData("data:url", decodeUrl);
			component.registerData("data:title", drawerItem.title);
			component.registerData("data:text", drawerItem.text);
			component.registerData("data:drawerId", drawerId);

			component.initializeEventRegistry();
			component.registerEvent("func:pasteWebUrl", "drawer.pasteWebUrl(event);");
			component.registerEvent("func:editWebItem", "drawer.editWebItem(this);");

			component.render("t-web-edit", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderEditWebItem(): " + err);
		}
		finally {}
	},

	renderViewVideoItem: function(element) {

		try {
			var drawerId = element.getAttribute("data-drawer-id");

			drawerItem = {};
			drawerItem = drawer.getItem(drawerId);

			var editButton = drawer.createEditButton(drawerItem.drawerId);
			var deleteButton = drawer.createDeleteButton(drawerItem.drawerId);

			var videoLink = drawer.getEmbeddedVideoLink(drawerItem.url);

			component.initializeDataRegistry();
			component.registerData("data:editButton", editButton);
			component.registerData("data:deleteButton", deleteButton);
			component.registerData("data:title", drawerItem.title);
			component.registerData("data:trayName", drawerItem.trayName);
			component.registerData("data:text", drawerItem.text);
			component.registerData("data:videoUrl", videoLink);

			component.render("t-web-video-view", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderViewVideoItem(): " + err);
		}
		finally {}
	},

	renderAddMediaItem: function() {

		try {
			var trayListSelectTag = tray.createSelectTag("", "N");

			component.initializeDataRegistry();
			component.registerData("data:trayListSelectTag", trayListSelectTag);

			component.initializeEventRegistry();
			component.registerEvent("func:fetchMediaItem", "drawer.fetchMediaItem(this.files[0]);");
			component.registerEvent("func:addMediaItem", "drawer.addMediaItem();");

			component.render("t-media-add", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderAddMediaItem(): " + err);
		}
		finally {}
	},

	renderViewMediaItem: function(element) {

		try {
			var drawerId = element.getAttribute("data-drawer-id");

			drawerItem = {};
			drawerItem = drawer.getItem(drawerId);

			var editButton = drawer.createEditButton(drawerItem.drawerId);
			var deleteButton = drawer.createDeleteButton(drawerItem.drawerId);

			var decodeMediaBase64 = decodeURIComponent(drawerItem.mediaBase64);

			component.initializeDataRegistry();
			component.registerData("data:editButton", editButton);
			component.registerData("data:deleteButton", deleteButton);
			component.registerData("data:title", drawerItem.title);
			component.registerData("data:trayName", drawerItem.trayName);
			component.registerData("data:text", drawerItem.text);
			component.registerData("data:imageUrl", decodeMediaBase64);

			component.render("t-media-view", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderViewMediaItem(): " + err);
		}
		finally {}
	},

	renderEditMediaItem: function(element) {

		try {
			var drawerId = element.getAttribute("data-drawer-id");

			drawerItem = {};
			drawerItem = drawer.getItem(drawerId);

			var viewButton = drawer.createViewButton(drawerItem.drawerId);
			var deleteButton = drawer.createDeleteButton(drawerItem.drawerId);

			var trayListSelectTag = tray.createSelectTag(drawerItem.trayId, "N");

			var decodeMediaBase64 = decodeURIComponent(drawerItem.mediaBase64);

			component.initializeDataRegistry();
			component.registerData("data:viewButton", viewButton);
			component.registerData("data:deleteButton", deleteButton);
			component.registerData("data:title", drawerItem.title);
			component.registerData("data:trayListSelectTag", trayListSelectTag);
			component.registerData("data:text", drawerItem.text);
			component.registerData("data:imageUrl", decodeMediaBase64);
			component.registerData("data:drawerId", drawerId);

			component.initializeEventRegistry();
			component.registerEvent("func:fetchMediaItem", "drawer.fetchMediaItem(this.files[0]);");
			component.registerEvent("func:editMediaItem", "drawer.editMediaItem(this);");

			component.render("t-media-edit", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderEditMediaItem(): " + err);
		}
		finally {}
	},

	fetchMediaItem: function(file) {

		try {
			if(!window.FileReader){
				alert('The File APIs are not fully supported in this browser.');
				return false;
			}

			/* get selected file element */
			var oFile = document.getElementById("inputFile").files[0];

			/* filter for image files */
			var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;

			if(!rFilter.test(oFile.type)) {
				document.getElementById('error').innerHTML = 'The file is not an image file type (jpeg, gif, png, tiff, bmp).';
				return false;
			}

			/* Maximum file size is 10MB */
			if(file.size > 10485760) {
				component.setText("error", "The file is too big. You can only upload up to a 10MB file.");
				return false;
			}

			var oReader = new FileReader();

			oReader.onload = function(event) {

				/* event.target.result contains the DataURL which we will use as a source of the image */
				var theImage = event.target.result;

				document.getElementById("preview").innerHTML = "<img src='" + theImage + "'/>";
			};
			oReader.readAsDataURL(file);

			document.getElementById("preview").style.display = '';
		}
		catch(err) {
			console.log("fetchMediaFile(): " + err);
		}
		finally {}
	},

	addMediaItem: function(){

		try {
			var trayId = document.forms[0].trayId.value;
			var title = document.forms[0].title.value;
			var text = document.forms[0].text.value;

			if(isEmpty(trayId)) {
				component.setText("error", "Please select a Tray.");
				return false;
			}

			if(isEmpty(title)) {
				component.setText("error", "Please enter a Title.");
				return false;
			}

			if(isEmpty(text)) {
				component.setText("error", "Please enter some Text to describe your entry.");
				return false;
			}

			var cleanedTitle = replaceSpecialChars(title);
			var cleanedText = replaceSpecialChars(text);

			var base64 = document.getElementById("preview").innerHTML;

			if(isEmpty(base64)) {
				component.setText("error", "Please choose an Image or Video file.");
				return false;
			}

			var sanitizedBase64 = base64.replace(/<img src="/gi, "");
			sanitizedBase64 = sanitizedBase64.replace(/">/gi, "");

			var mediaBase64 = encodeURIComponent(sanitizedBase64);

			var inputFields = {
				"collectionName":appData.get("collectionName"), 
				"trayId":trayId, 
				"title":cleanedTitle, 
				"text":cleanedText,
				"type":"3",
				"mediaType":".", 
				"mediaBase64":mediaBase64};

				var inputJSON = {};
				inputJSON.inputArgs = inputFields;

				var stringJSON = JSON.stringify(inputJSON);

				drawer.uploadMediaItem(stringJSON, "POST");
 		}
		catch(err) {
			component.setText("error", "addMediaItem(): We cannot post your file. Please try again in a little bit.");
		}
		finally {}
	},

	editMediaItem: function(element){

		try {
			var drawerId = element.getAttribute("data-drawer-id");

			var trayId = document.forms[0].trayId.value;
			var title = document.forms[0].title.value;
			var text = document.forms[0].text.value;

			if(isEmpty(trayId)) {
				component.setText("error", "Please select a Tray.");
				return false;
			}

			if(isEmpty(title)) {
				component.setText("error", "Please enter a Title.");
				return false;
			}

			if(isEmpty(text)) {
				component.setText("error", "Please enter some Text to describe your entry.");
				return false;
			}

			var cleanedTitle = replaceSpecialChars(title);
			var cleanedText = replaceSpecialChars(text);

			var base64 = document.getElementById("preview").innerHTML;

			if(isEmpty(base64)) {
				component.setText("error", "Please choose an Image or Video file.");
				return false;
			}

			var sanitizedBase64 = base64.replace(/<img src="/gi, "");
			sanitizedBase64 = sanitizedBase64.replace(/">/gi, "");

			var mediaBase64 = encodeURIComponent(sanitizedBase64);

			var inputFields = {
				"collectionName":appData.get("collectionName"), 
				"drawerId":drawerId, 
				"trayId":trayId, 
				"title":cleanedTitle, 
				"text":cleanedText,
				"type":"3",
				"mediaType":".", 
				"mediaBase64":mediaBase64};

				var inputJSON = {};
				inputJSON.inputArgs = inputFields;

				var stringJSON = JSON.stringify(inputJSON);

				drawer.uploadMediaItem(stringJSON, "PUT");
 		}
		catch(err) {
			component.setText("error", "editMediaItem(): We cannot post your file. Please try again in a little bit.");
		}
		finally {}
	},

	uploadMediaItem: function(stringJSON, httpMethod) {

		try {
			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var drawerJson = xhr.responseText;

					appData.set("drawerJson", drawerJson);

					drawer.render();

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("uploadMediaItem(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/MediaEntry/";

			xhr.open(httpMethod, url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send("inputJSON=" + stringJSON);
		}
		catch(err) {
			component.setText("error", "uploadMediaItem(): We cannot post your file. Please try again in a little bit.");
		}
		finally {}
	},

	createViewTitle: function(drawerId) {

		var componentHtml = "";

		try {
			drawerItem = {};
			drawerItem = drawer.getItem(drawerId);

			component.initializeDataRegistry();
			component.initializeEventRegistry();

			if(drawerItem.type == "1") {

				component.registerData("data:drawerId", drawerId);
				component.registerData("data:title", drawerItem.title);

				component.registerEvent("func:renderViewTextItem", "drawer.renderViewTextItem(this);");

				componentHtml = component.create("t-drawer-title-text-view");

			} else if(drawerItem.type == "2") {

				/*
				 * If the url contains youtube, vimeo or ted then video view
				 */
				if(drawer.isUrlWebVideo(drawerItem.url)) {

					component.registerData("data:drawerId", drawerId);
					component.registerData("data:title", drawerItem.title);

					component.registerEvent("func:renderViewVideoItem", "drawer.renderViewVideoItem(this);");

					componentHtml = component.create("t-drawer-title-video-view");

				} else {
					component.registerData("data:title", drawerItem.title);
					component.registerData("data:url", drawerItem.url);

					componentHtml = component.create("t-drawer-title-article-view");
				}

			} else if(drawerItem.type == "3") {

				component.registerData("data:drawerId", drawerId);
				component.registerData("data:title", drawerItem.title);

				component.registerEvent("func:renderViewMediaItem", "drawer.renderViewMediaItem(this);");

				componentHtml = component.create("t-drawer-title-media-view");
			}
		}
		catch(err) {
			console.log("createViewTitle(): " + err);
		}
		finally {}

		return componentHtml;
	},

	createViewButton: function(drawerId) {

		var componentHtml = "";

		try {
			drawerItem = {};
			drawerItem = drawer.getItem(drawerId);

			component.initializeDataRegistry();
			component.initializeEventRegistry();

			if(drawerItem.type == "1") {

				component.registerData("data:drawerId", drawerId);

				component.registerEvent("func:renderViewTextItem", "drawer.renderViewTextItem(this);");

				componentHtml = component.create("t-drawer-button-text-view");

			} else if(drawerItem.type == "2") {

				/*
				 * If the url contains youtube, vimeo or ted then video view
				 */
				if(drawer.isUrlWebVideo(drawerItem.url)) {
					component.registerData("data:drawerId", drawerId);

					component.registerEvent("func:renderViewVideoItem", "drawer.renderViewVideoItem(this);");

					componentHtml = component.create("t-drawer-button-video-view");

				} else {
					component.registerData("data:url", drawerItem.url);
					componentHtml = component.create("t-drawer-button-article-view");
				}

			} else if(drawerItem.type == "3") {

				component.registerData("data:drawerId", drawerId);

				component.registerEvent("func:renderViewMediaItem", "drawer.renderViewMediaItem(this);");

				componentHtml = component.create("t-drawer-button-media-view");
			}
		}
		catch(err) {
			console.log("createViewButton(): " + err);
		}
		finally {}

		return componentHtml;
	},

	createEditButton: function(drawerId) {

		var componentHtml = "";

		try {
			drawerItem = {};
			drawerItem = drawer.getItem(drawerId);

			component.initializeDataRegistry();
			component.initializeEventRegistry();

			if(drawerItem.type == "1") {
				component.registerData("data:drawerId", drawerId);

				component.registerEvent("func:renderEditTextItem", "drawer.renderEditTextItem(this);");

				componentHtml = component.create("t-drawer-button-text-edit");

			} else if(drawerItem.type == "2") {

				component.registerData("data:drawerId", drawerId);

				component.registerEvent("func:renderEditWebItem", "drawer.renderEditWebItem(this);");

				componentHtml = component.create("t-drawer-button-web-edit");

			} else if(drawerItem.type == "3") {
				component.registerData("data:drawerId", drawerId);

				component.registerEvent("func:renderEditMediaItem", "drawer.renderEditMediaItem(this);");

				componentHtml = component.create("t-drawer-button-media-edit");
			}
		}
		catch(err) {
			console.log("createEditTitle(): " + err);
		}
		finally {}

		return componentHtml;
	},

	createDeleteButton: function(drawerId) {

		var componentHtml = "";

		try {
			component.initializeDataRegistry();
			component.registerData("data:drawerId", drawerId);

			component.initializeEventRegistry();
			component.registerEvent("func:deleteItem", "drawer.deleteItem(this);");

			componentHtml = component.create("t-drawer-button-delete");
		}
		catch(err) {
			console.log("createDeleteTitle(): " + err);
		}
		finally {}

		return componentHtml;
	},

	addTextItem: function(){

		try {
			var trayId = document.forms[0].trayId.value;
			var title = document.forms[0].title.value;
			var text = document.forms[0].text.value;

			if(isEmpty(trayId)) {
				component.setText("error", "Please select a Tray.");
				return false;
			}

			if(isEmpty(title)) {
				component.setText("error", "Please enter a Title.");
				return false;
			}

			if(isEmpty(text)) {
				component.setText("error", "Please enter some Text to describe your entry.");
				return false;
			}

			var cleanedTitle = replaceSpecialChars(title);
			var cleanedText = replaceSpecialChars(text);

			var inputFields = {
				"collectionName":appData.get("collectionName"), 
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

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var drawerJson = xhr.responseText;

					appData.set("drawerJson", drawerJson);

					drawer.render();

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("addTextItem(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/DrawerEntry/";

			xhr.open("POST", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send("inputJSON=" + stringJSON);
		}
		catch(err) {
			console.log("addTextItem(): " + err);
		}
		finally {}
	},

	editTextItem: function(element){

		try {
			var drawerId = element.getAttribute("data-drawer-id");

			var trayId = document.forms[0].trayId.value;
			var title = document.forms[0].title.value;
			var text = document.forms[0].text.value;

			if(isEmpty(trayId)) {
				component.setText("error", "Please select a Tray.");
				return false;
			}

			if(isEmpty(title)) {
				component.setText("error", "Please enter a Title.");
				return false;
			}

			if(isEmpty(text)) {
				component.setText("error", "Please enter some Text to describe your entry.");
				return false;
			}

			var cleanedTitle = replaceSpecialChars(title);
			var cleanedText = replaceSpecialChars(text);

			var inputFields = {
				"collectionName":appData.get("collectionName"), 
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

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var drawerJson = xhr.responseText;

					appData.set("drawerJson", drawerJson);

					drawer.render();

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("editTextItem(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/DrawerEntry/";

			xhr.open("PUT", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(stringJSON);
		}
		catch(err) {
			console.log("editTextItem: " + err);
		}
		finally {}
	},

	addWebItem: function(){

		try {
			var pastedUrl = document.forms[0].url.value;
			var trayId = document.forms[0].trayId.value;
			var title = document.forms[0].title.value;
			var text = document.forms[0].text.value;

			if(isEmpty(pastedUrl)) {
				component.setText("error", "Please enter a URL.");
				return false;
			}

			if(isEmpty(trayId)) {
				component.setText("error", "Please select a Tray.");
				return false;
			}

			if(isEmpty(title)) {
				component.setText("error", "Please enter a Title.");
				return false;
			}

			if(isEmpty(text)) {
				component.setText("error", "Please enter some Text to describe your entry.");
				return false;
			}

			var cleanedTitle = replaceSpecialChars(title);
			var cleanedText = replaceSpecialChars(text);

			var encodeUrl = encodeURIComponent(pastedUrl);

			var inputFields = {
				"collectionName":appData.get("collectionName"), 
				"trayId":trayId, 
				"type":"2", 
				"url":encodeUrl, 
				"title":cleanedTitle, 
				"text":cleanedText};

			var inputJSON = {};
			inputJSON.inputArgs = inputFields;

			var stringJSON = JSON.stringify(inputJSON);

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var drawerJson = xhr.responseText;

					appData.set("drawerJson", drawerJson);

					drawer.render();

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("addWebItem(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/DrawerEntry/";

			xhr.open("POST", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send("inputJSON=" + stringJSON);
		}
		catch(err) {
			console.log("addWebItem: " + err);
		}
		finally {}
	},

	editWebItem: function(element) {

		try {
			var drawerId = element.getAttribute("data-drawer-id");

			var pastedUrl = document.forms[0].url.value;
			var trayId = document.forms[0].trayId.value;
			var title = document.forms[0].title.value;
			var text = document.forms[0].text.value;

			if(isEmpty(pastedUrl)) {
				component.setText("error", "Please enter a URL.");
				return false;
			}

			if(isEmpty(trayId)) {
				component.setText("error", "Please select a Tray.");
				return false;
			}

			if(isEmpty(title)) {
				component.setText("error", "Please enter a Title.");
				return false;
			}

			if(isEmpty(text)) {
				component.setText("error", "Please enter some Text to describe your entry.");
				return false;
			}

			var cleanedTitle = replaceSpecialChars(title);
			var cleanedText = replaceSpecialChars(text);

			var encodeUrl = encodeURIComponent(pastedUrl);

			var inputFields = {
				"collectionName":appData.get("collectionName"), 
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

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var drawerJson = xhr.responseText;

					appData.set("drawerJson", drawerJson);

					drawer.render();

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("editWebItem(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/DrawerEntry/";

			xhr.open("PUT", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(stringJSON);
		}
		catch(err) {
			console.log("editWebItem(): " + err);
		}
		finally {}
	},

	deleteItem: function(drawerId){

		try {

			var inputFields = {
				"collectionName":appData.get("collectionName"), 
				"drawerId":drawerId
			};

			var inputJSON = {};
			inputJSON.inputArgs = inputFields;

			var stringJSON = JSON.stringify(inputJSON);

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var drawerJson = xhr.responseText;

					appData.set("drawerJson", drawerJson);

					drawer.render();

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("deleteItem(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/DrawerEntry/";

			xhr.open("DELETE", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(stringJSON);
		}
		catch(err) {
			console.log("deleteItem(): " + err);
		}
		finally {}
	},

	pasteWebUrl: function(e) {

		try {
			document.body.style.cursor = "wait";

			/* gets the copied text after a specified time (200 milliseconds) */
			setTimeout(function() {

				var url = document.forms[0].url.value;
				drawer.getUrlParts(url); 
				document.body.style.cursor = "default";
			}, 200);

		}
		catch(err) {
			document.body.style.cursor = "default";
			component.setText("url","");
			component.setText("error", "We are sorry but there is a problem with the Link that you are trying to fetch.");
		}
		finally {}
	},

	getUrlParts: function(url) {

		try {
			if(isEmpty(url)) {
				component.setText("error", "Please paste a valid Url.");
				return false;
			}

			document.body.style.cursor = "wait";

			/* 
			 * encode the base64 so that it transfers properly to the server 
			 */
			var encodeUrl = encodeURIComponent(url);

			var inputFields = {"url":encodeUrl};

			var inputJSON = {};
			inputJSON.inputArgs = inputFields;
		
			var stringJSON = JSON.stringify(inputJSON);

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var data = JSON.parse(xhr.responseText);

					var statusCd = data.statusCd;
					var title = data.title;
					var text = data.text;

					if(statusCd == "0") {
						document.getElementById("title").value = title;
						document.getElementById("text").value = text;

					} else {
						component.setText("error", "We are sorry but we could not fetch the title or description for your link.");
						component.setText("url","");
					}

					document.body.style.cursor = "default";

				} else {
					component.setText("url","");
					document.body.style.cursor = "default";
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("getUrlParts(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/UrlParts/";

			xhr.open("POST", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send("inputJSON=" + stringJSON);
		}
		catch(err) {
			document.body.style.cursor = "default";
			component.setText("url","");
			component.setText("error", "We are sorry but there is a problem with the Link that you are trying to fetch.");
		}
		finally {}
	},

	isUrlWebVideo: function(url) {

		var result = false;

		try {
			if(url.indexOf("www.youtube.com") > -1) {
				result = true;

			} else if(url.indexOf("www.vimeo.com") > -1) {
				result = true;

			} else if(url.indexOf("www.ted.com") > -1) {
				result = true;

			} else {
				result = false;
			}
		}
		catch(err) {
			console.log("isUrlWebVideo(): " + err);
			result = false;
		}
		finally {}

		return result;
	}

};

var tray = {

	createSelectTag: function(trayId, includeChangeFunctionFlag) {

		var trayListSelectTag = "";

		try {
			var optionHtml = "";

			var trayArray = JSON.parse(appData.get("trayJson"));

			for(var i=0; i<trayArray.length; i++) {

				var tray = trayArray[i];

				var selected = "";

				if(trayId == tray.trayId) {
					selected = " selected";
				}

				component.initializeDataRegistry();
				component.registerData("data:trayId", tray.trayId);
				component.registerData("data:selected", selected);
				component.registerData("data:trayName", tray.trayName);

				optionHtml += component.create("t-tray-select-option-tag");
			}

			var changeFunction = "";

			if(includeChangeFunctionFlag == "add-onchange") {
				changeFunction = 'onchange="tray.getSelectedList(this);"';
			} else {
				changeFunction = "";
			}

			component.initializeDataRegistry();
			component.registerData("onchange:getSelectedList", changeFunction);
			component.registerData("data:trayOptions", optionHtml);

			trayListSelectTag = component.create("t-tray-select-tag");
		}
		catch(err) {
			console.log("createSelectTag(): " + err);
		}
		finally {}

		return trayListSelectTag;
	},

	getSelectedList: function(element) {

		try {
			drawer.searchDrawerByTrayId(element);
		}
		catch(err) {
			console.log("getSelectedList(): " + err);
		}
		finally {}
	},

	getList: function() {

		try {
			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var trayJson = xhr.responseText;
					var trayArray = JSON.parse(xhr.responseText);

					appData.set("trayJson", trayJson);

					var trayRows = "";

					for(var i=0; i<trayArray.length; i++) {

						var tray = trayArray[i];

						component.initializeDataRegistry();
						component.registerData("data:trayId", tray.trayId);
						component.registerData("data:trayName", tray.trayName);

						component.initializeEventRegistry();
						component.registerEvent("func:searchDrawerByTrayId", "drawer.searchDrawerByTrayId(this);");
						component.registerEvent("func:renderEditTray", "tray.renderEditTray(this);");
						component.registerEvent("func:deleteItem", "tray.deleteItem(this);");

						trayRows += component.create("t-tray-list-rows");
					}

					component.initializeDataRegistry();
					component.registerData("data:trayRows", trayRows);

					component.initializeEventRegistry();
					component.registerEvent("func:renderAddTray", "tray.renderAddTray();");
					component.registerEvent("func:getDrawerList", "drawer.getList();");

					component.render("t-tray-list", "template-content");

					state.saveInitialState("template-content");
				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("getList(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/Tray/" + appData.get("collectionName");

			xhr.open("GET", url, true);
			xhr.send();
		}
		catch(err) {
			console.log("getList(): " + err);
		}
		finally {}
	},

	getFavoriteTrayId: function() {

		var trayId = "";

		try {
			var trayArray = JSON.parse(appData.get("trayJson"));

			if(trayArray.length > 0) {

				for(var i=0; i<trayArray.length; i++) {

					var item = trayArray[i];

					if(item.trayName.toLowerCase() == "favorites") {

						trayId = item.trayId;
						break;
					}
				}
			}
		}
		catch(err) {
			console.log("getFavoriteTrayId(): " + err);
		}
		finally {}

		return trayId;
	},

	renderAddTray: function() {

		try {
			component.initializeEventRegistry();
			component.registerEvent("func:getTrayList", "tray.getList();");
			component.registerEvent("func:addItem", "tray.addItem();");

			component.render("t-tray-add", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderAddTray(): " + err);
		}
		finally {}
	},

	addItem: function() {

		try {
			var name = document.getElementById("name").value;

			if(isEmpty(name)) {
				component.setText("error", "Please enter a Tray Name.");
				return false;
			}

			if(tray.isDuplicate(name)) {
				component.setText("error", "You already have this Tray in your Drawer.");
				return false;
			}

			var inputFields = {
				"collectionName":appData.get("collectionName"), 
				"trayName":name
			};

			var inputJSON = {};
			inputJSON.inputArgs = inputFields;
		
			var stringJSON = JSON.stringify(inputJSON);

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					tray.getList();

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("addItem(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/Tray/";

			xhr.open("POST", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send("inputJSON=" + stringJSON);
		}
		catch(err) {
			console.log("addItem(): " + err);
		}
		finally {}
	},

	renderEditTray: function(element) {

		try {
			var trayId = element.getAttribute('data-tray-id');
			var trayName = element.getAttribute('data-tray-name');

			if(trayName.toLowerCase() == "favorites") {
				tray.renderTrayError();

			} else {

				component.initializeDataRegistry();
				component.registerData("data:trayId", trayId);
				component.registerData("data:trayName", trayName);

				component.initializeEventRegistry();
				component.registerEvent("func:getTrayList", "tray.getList();");
				component.registerEvent("func:editItem", "tray.editItem(this);");

				component.render("t-tray-edit", "template-content");
			}

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderEditTray(): " + err);
		}
		finally {}
	},

	editItem: function(element) {

		try {
			var trayId = element.getAttribute('data-tray-id');
			var trayName = element.getAttribute('data-tray-name');

			if(trayName.toLowerCase() == "favorites") {
				tray.renderTrayError();
				return false;
			}

			var name = document.getElementById("name").value;

			if(isEmpty(name)) {
				component.setText("error", "Please enter a Tray Name.");
				return false;
			}

			var nameEl = document.getElementById("name");
			var origName = nameEl.getAttribute('data-tray-name');

			if(tray.isDuplicate(name)) {
				component.setText("error", "You already have a Tray with this name.");
				state.restoreInitialState("template-content");
				return false;
			}

			var inputFields = {
				"collectionName":appData.get("collectionName"), 
				"trayId":trayId, 
				"trayName":name};

			var inputJSON = {};
			inputJSON.inputArgs = inputFields;
		
			var stringJSON = JSON.stringify(inputJSON);

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					tray.getList();

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("editItem(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/Tray/";

			xhr.open("PUT", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(stringJSON);
		}
		catch(err) {
			console.log("editItem(): " + err);
		}
		finally {}
	},

	checkIfCanBeDeleted: function(data) {

		try {
			var tokens = data.split("|");
			var trayId = tokens[0];
			var trayName = tokens[1];

			if(isFavoriteTray(trayName)) {
				tray.renderCannotDeleteTray();

			} else {

				if(tray.isEmpty(trayId)) {

					var trayArray = appData.get("trayJson");

					if(trayArray.length > 1) {
						tray.deleteItem(trayId);
					} else {
						tray.renderCannotDeleteTray();
					}
				} else {
					tray.renderCannotDeleteTray();
				}
			}
		}
		catch(err) {
			console.log("checkIfCanBeDeleted(): " + err);
		}
		finally {}
	},

	isFavorite: function(trayName) {

		var result = false;

		try {
			if(trayName.toLowerCase() == "favorites") {
				result = true;

			} else {
				result = false;
			}
		}
		catch(err) {
			console.log("isFavorite(): " + err);
		}
		finally {}

		return result;
	},

	isDuplicate: function(trayName) {

		var duplicate = false;

		try {
			var drawerArray = JSON.parse(appData.get("drawerJson"));

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
			console.log("isDuplicate(): " + err);
		}
		finally {}

		return duplicate;
	},

	deleteItem: function(element) {

		try {
			var trayId = element.getAttribute('data-tray-id');
			var trayName = element.getAttribute('data-tray-name');

			if(trayName.toLowerCase() == "favorites") {
				tray.renderTrayError();
				return false;
			}

			var inputFields = {
				"collectionName":appData.get("collectionName"), 
				"trayId":trayId
			};

			var inputJSON = {};
			inputJSON.inputArgs = inputFields;
		
			var stringJSON = JSON.stringify(inputJSON);

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					tray.getList();

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("deleteItem(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/Tray/";

			xhr.open("DELETE", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(stringJSON);
		}
		catch(err) {
			console.log("deleteItem(): " + err);
		}
		finally {}
	},

	isEmpty: function(trayId) {

		var empty = true;

		try {
			var drawerArray = JSON.parse(appData.get("drawerJson"));

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
			console.log("isEmpty(): " + err);
		}
		finally {}

		return empty;
	},

	renderCannotDeleteTray: function() {

		try {
			component.render("t-tray-delete-error", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderCannotDeleteTray(): " + err);
		}
		finally {}
	},

	renderTrayError: function() {

		try {
			component.render("t-tray-error", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderTrayError(): " + err);
		}
		finally {}
	}

};

var listener = {

	registerKeyDownEnter: function() {

		document.body.addEventListener("keydown", function(event) {

			if(event.keyCode === 13) {

				/*
				 * Check which template is being displayed by checking for the 
				 * presence of a element id that is specific for that template 
				 */
				var element = document.getElementById("btn-sign-in");
				if(element != null) {
					access.signIn();
				}

				var element = document.getElementById("btn-sign-up");
				if(element != null) {
					access.signUp();
				}

				var element = document.getElementById("btn-contact-us");
				if(element != null) {
					general.addContactUs();
				}

				var element = document.getElementById("button-holder");
				if(element != null) {
					drawer.searchDrawerByWildcard();
				}

			}
		});

	}

};
