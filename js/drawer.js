/**
 * drawer.js
 * Contains general methods for My Drawer.
 * 
 * @author Stan Zajdel
*/

var entry = {

	renderSignIn: function() {

		try {
			if(isEmpty(dataObj.collectionName)) {

				var data = {
					"{{onclick:renderSignUp}}" : "entry.renderSignUp();",
					"{{onclick:signIn}}" : "entry.signIn();"
				};

				component.render("t-sign-in", "template-content", data);

				component.saveInitialState("template-content");

				document.body.addEventListener("keydown", function(event) {
					if(event.keyCode === 13) {
						var element = document.getElementById("e-sign-in");
						if(element != null) {
							entry.signIn();
						}
					}
				});
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

					dataObj.collectionName = data.collectionName;
					dataObj.userName = data.userName;
					dataObj.trayJson = data.trayJson;
					dataObj.drawerJson = data.drawerJson;

					if(statusInd == "A") {
						dataObj.traySelected = "in your drawer";

						dataObj.favoriteTraTokens = tray.getFavoriteTrayTokens();

						menu.reset();
						drawer.render();

					} else if(statusInd == "D") {
						entry.renderAccountDisabled();
					}
					else {
						entry.renderSignInError();
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
			var data = {
				"{{onclick:renderSignIn}}" : "entry.renderSignIn();"
			};

			component.render("t-sign-in-error", "template-content", data);

			component.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderSignInError(): " + err);
		}
		finally {}
	},

	renderAccountDisabled: function() {

		try {
			var data = {};
			component.render("t-account-disabled", "template-content", data);

			component.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderAccountDisabled(): " + err);
		}
		finally {}
	},

	renderSignUp: function() {

		try {
			dataObj = {};

			var data = {
				"{{onclick:renderSignIn}}" : "entry.renderSignIn();",
				"{{onclick:signUp}}" : "entry.signUp();"
			};

			component.render("t-sign-up", "template-content", data);

			component.saveInitialState("template-content");

			document.body.addEventListener("keydown", function(event) {
				if(event.keyCode === 13) {
					var element = document.getElementById("e-sign-up");
					if(element != null) {
						entry.signUp();
					}
				}
			});

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

					dataObj.collectionName = data.collectionName;
					dataObj.userName = data.userName;
					dataObj.trayJson = data.trayJson;
					dataObj.drawerJson = data.drawerJson;

					if(statusInd == "A") {

						dataObj.traySelected = "in your drawer";
						dataObj.favoriteTraTokens = tray.getFavoriteTrayTokens();

						drawer.render();

						menu.reset();
					} else {
						entry.renderSignUpError(statusMsg);
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
			var data = {
				"{{data:errorMsg}}": errorMsg,
				"{{onclick:renderSignIn}}" : "entry.renderSignin();"
			};

			component.render("t-signup-error", "template-content", data);

			component.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderSignUpError(): " + err);
		}
		finally {}
	},

	signOut: function() {

		try {
			/* Clear dataObj.collectionName */
			dataObj = {};

			dataObj.CollectionName = "";

			var data = {};
			entry.renderSignIn();
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

				if(isEmpty(dataObj.collectionName)) {
					menu.renderMenuSignedOut();

				} else {
					menu.renderMenuSignedIn();
				}

			} else {
				component.restoreInitialState("template-content");
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

			component.restoreInitialState("template-content");
		}
		catch(err) {
			console.log("closeHamburger(): " + err);
		}
		finally {}
	},

	renderMenuSignedIn: function() {

		try {
			var trayListSelectTag = tray.createSelectTag("", "add-onchange");

			var data = {
				"{{onclick:renderAddTextItem}}": "drawer.renderAddTextItem();",
				"{{onclick:renderAddWebItem}}": "drawer.renderAddWebItem();",
				"{{onclick:renderAddMediaItem}}": "drawer.renderAddMediaItem();",
				"{{onclick:getTrayList}}": "tray.getList();",
				"{{onclick:renderContactUs}}": "general.renderContactUs();",
				"{{onclick:renderAbout}}": "general.renderAbout();",
				"{{onclick:signOut}}": "entry.signOut();",
				"{{favoriteTraTokens}}" : dataObj.favoriteTraTokens,
				"{{trayListSelectTag}}" : trayListSelectTag
			};

			component.render("t-menu-signed-in", "template-content", data);
		}
		catch(err) {
			console.log("renderMenuSignedIn(): " + err);
		}
		finally {}
	},

	renderMenuSignedOut: function() {

		try {
			var data = {
				"{{onclick:renderContactUs}}": "general.renderContactUs();",
				"{{onclick:renderAbout}}": "general.renderAbout();"
			};

			component.render("t-menu-signed-out", "template-content", data);
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
			dataObj.origTemplateContent = document.getElementById('template-content').innerHTML;

			var data = {
				"{{onclick:addContactUs}}" : "general.addContactUs();"
			};

			component.render("t-contact-us", "template-content", data);

			component.saveInitialState("template-content");
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
			var data = {};
			component.render("t-about", "template-content", data);

			component.saveInitialState("template-content");
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
			if(isEmpty(dataObj.collectionName)) {
				entry.renderSignIn();

			} else {

				var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

				xhr.onreadystatechange = function () {

					if (xhr.readyState !== 4) {
						return;
					}

					if (xhr.status === 200) {
						dataObj.drawerJson = xhr.responseText;

						var drawerArray = JSON.parse(dataObj.drawerJson);

						dataObj.traySelected = "in your drawer";

						drawer.render();

					} else {
						console.log('Error: ' + xhr.status);
					}
				};

				xhr.onerror = function () {
					console.log("getList(): An error occurred during the transaction");
				};

				var url = "http://localhost:8080/mydrawer/DrawerList/" + dataObj.collectionName;

				xhr.open("GET", url, true);
				xhr.send();
			}
		}
		catch(err) {
			console.log("getList(): " + err);
		}
		finally {}
	},

	render: function() {

		try {

			var drawerArray = JSON.parse(dataObj.drawerJson);

			var rowHtml = "";
			var columnData = {};

			var columnCount = 0;

			for(var i=0; i<drawerArray.length; i++) {

				var item = drawerArray[i];

				var sanitizedText = item.text.replace(/\r/g, " ");
				sanitizedText = item.text.replace(/\n/g, " ");

				var itemTitle = drawer.createViewTitle(item.drawerId);

				var viewButton = drawer.createViewButton(item.drawerId);
				var editButton = drawer.createEditButton(item.drawerId);
				var deleteButton = drawer.createDeleteButton(item.drawerId);

				columnData = {
					"{{data:itemTitle}}" : itemTitle,
					"{{data:trayName}}" : item.trayName,
					"{{data:text}}" : sanitizedText,
					"{{data:url}}" : item.url,
					"{{data:updatedDate}}" : item.updatedDate,
					"{{data:viewButton}}" : viewButton,
					"{{data:editButton}}" : editButton,
					"{{data:deleteButton}}" : deleteButton
				};

				columnCount++;

				if(columnCount == 1) {
					var columnLeft = component.create("t-drawer-columns", columnData);
				}

				if(columnCount == 2) {
					var columnRight = component.create("t-drawer-columns", columnData);
					var rowData = {
						"{{data:columnLeft}}" : columnLeft,
						"{{data:columnRight}}" : columnRight
					};

					rowHtml += component.create("t-drawer-rows", rowData);
					columnCount = 0;
				}

			}

			if(drawerArray.length <= 0) {
				rowHtml = "";
			}

			var tableData = {
				"{{onclick:getTrayList}}" : "tray.getList();",
				"{{favoriteTraTokens}}" : dataObj.favoriteTraTokens,
				"{{data:totalItems}}" : drawerArray.length,
				"{{data:traySelected}}" : dataObj.traySelected,
				"{{data:drawerRows}}" : rowHtml
			};

			component.render("t-drawer", "template-content", tableData);

			component.saveInitialState("template-content");
		}
		catch(err) {
			console.log("render(): " + err);
		}
		finally {}
	},

	renderNoResultsFound: function() {

		try {
			var data = {};

			component.render("t-no-results-found", "template-content", data);

			component.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderNoResultsFound(): " + err);
		}
		finally {}
	},

	getItem: function(drawerId) {

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
						drawerItem.updatedDate = item.updatedDate;
						drawerItem.title = item.title;
						drawerItem.text = item.text;
						drawerItem.url = decodeUrl;
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

			var editButtonComponent = drawer.createEditButton(drawerItem.drawerId);
			var deleteButtonComponent = drawer.createDeleteButton(drawerItem.drawerId);

			var data = {
				"{{data:editButton}}" : editButtonComponent,
				"{{data:deleteButton}}" : deleteButtonComponent,
				"{{data:title}}" : drawerItem.title,
				"{{data:trayName}}" : drawerItem.trayName,
				"{{data:text}}" : drawerItem.text
			};

			component.render("t-text-view", "template-content", data);

			component.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderViewTextItem(): " + err);
		}
		finally {}
	},

	renderAddTextItem: function() {

		try {
			var trayListSelectTag = tray.createSelectTag("", "N");

			var data = {
				"{{data:trayListSelectTag}}": trayListSelectTag,
				"{{onclick:addTextItem}}": "drawer.addTextItem();"
			};

			component.render("t-text-add", "template-content", data);

			component.saveInitialState("template-content");
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

			var viewButtonComponent = drawer.createViewButton(drawerItem.drawerId);
			var deleteButtonComponent = drawer.createDeleteButton(drawerItem.drawerId);

			var trayListSelectTag = tray.createSelectTag(drawerItem.trayId, "N");

			var data = {
				"{{data:viewButton}}" : viewButtonComponent,
				"{{data:deleteButton}}" : deleteButtonComponent,
				"{{data:trayListSelectTag}}" : trayListSelectTag,
				"{{data:drawerId}}" : drawerId,
				"{{onclick:editTextItem}}": "drawer.editTextItem(this);"
			};

			component.render("t-text-edit", "template-content", data);

			document.getElementById("title").value = drawerItem.title;
			document.getElementById("text").value = drawerItem.text;

			component.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderEditTextItem(): " + err);
		}
		finally {}
	},

	renderAddWebItem: function() {

		try {
			var trayListSelectTag = tray.createSelectTag("", "N");

			var data = {
				"{{data:trayListSelectTag}}": trayListSelectTag,
				"{{onclick:addWebItem}}": "drawer.addWebItem();"
			};

			component.render("t-web-add", "template-content", data);

			component.saveInitialState("template-content");
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

			var viewButtonComponent = drawer.createViewButton(drawerItem.drawerId);
			var deleteButtonComponent = drawer.createDeleteButton(drawerItem.drawerId);

			var trayListSelectTag = tray.createSelectTag(drawerItem.trayId, "N");

			var data = {
				"{{data:viewButton}}" : viewButtonComponent,
				"{{data:deleteButton}}" : deleteButtonComponent,
				"{{data:trayListSelectTag}}" : trayListSelectTag,
				"{{data:drawerId}}" : drawerId,
				"{{onclick:editWebItem}}": "drawer.editWebItem(this);"
			};

			component.render("t-web-edit", "template-content", data);

			var decodeUrl = decodeURIComponent(drawerItem.url);

			document.getElementById("url").value = decodeUrl;
			document.getElementById("title").value = drawerItem.title;
			document.getElementById("text").value = drawerItem.text;

			component.saveInitialState("template-content");
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

			var editButtonComponent = drawer.createEditButton(drawerItem.drawerId);
			var deleteButtonComponent = drawer.createDeleteButton(drawerItem.drawerId);

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

			component.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderViewVideoItem(): " + err);
		}
		finally {}
	},

	renderAddMediaItem: function() {

		try {
			var trayListSelectTag = tray.createSelectTag("", "N");

			var data = {
				"{{trayListSelectTag}}": trayListSelectTag,
			};

			component.render("t-media-entry", "template-content", data);

			component.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderAddMediaItem(): " + err);
		}
		finally {}
	},

	createViewTitle: function(drawerId) {

		var componentHtml = "";

		try {
			drawerItem = {};
			drawerItem = drawer.getItem(drawerId);

			var data = null;

			if(drawerItem.type == "1") {
				data = {
					"{{data:drawerId}}" : drawerId,
					"{{data:title}}" : drawerItem.title,
					"{{onclick:renderViewTextItem}}" : "drawer.renderViewTextItem(this);"
				};

				componentHtml = component.create("t-drawer-title-text-view", data);

			} else if(drawerItem.type == "4") {
				data = {
					"{{data:drawerId}}" : drawerId,
					"{{data:title}}" : drawerItem.title,
					"{{data:url}}" : drawerItem.url
				};

				componentHtml = component.create("t-drawer-title-article-view", data);

			} else if(drawerItem.type == "5") {
				data = {
					"{{data:drawerId}}" : drawerId,
					"{{data:title}}" : drawerItem.title,
					"{{onclick:renderViewVideoItem}}" : "drawer.renderViewVideoItem(this);"
				};

				componentHtml = component.create("t-drawer-title-video-view", data);
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

			var data = null;

			if(drawerItem.type == "1") {
				data = {
					"{{onclick:renderViewTextItem}}" : "drawer.renderViewTextItem(this);",
					"{{data:drawerId}}" : drawerId
				};

				componentHtml = component.create("t-drawer-button-text-view", data);

			} else if(drawerItem.type == "4") {
				data = {
					"{{data:url}}" : drawerItem.url
				};

				componentHtml = component.create("t-drawer-button-article-view", data);

			} else if(drawerItem.type == "5") {
				data = {
					"{{onclick:renderViewVideoItem}}" : "drawer.renderViewVideoItem(this);",
					"{{data:drawerId}}" : drawerId,
				};

				componentHtml = component.create("t-drawer-button-video-view", data);
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

			var data = null;

			if(drawerItem.type == "1") {
				var data = {
					"{{onclick:renderEditTextItem}}" : "drawer.renderEditTextItem(this);",
					"{{data:drawerId}}" : drawerId
				};

				componentHtml = component.create("t-drawer-button-text-edit", data);

			} else if(drawerItem.type == "4" || drawerItem.type == "5") {
				var data = {
					"{{onclick:renderEditWebItem}}" : "drawer.renderEditWebItem(this);",
					"{{data:drawerId}}" : drawerId
				};

				componentHtml = component.create("t-drawer-button-web-edit", data);
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
			var data = {
				"{{onclick:deleteItem}}" : "drawer.deleteItem(this);",
				"{{data:drawerId}}" : drawerId
			};

			componentHtml = component.create("t-drawer-button-delete", data);
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

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					dataObj.drawerJson = xhr.responseText;

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

			var trayId = document.forms[0].traId.value;
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

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					dataObj.drawerJson = xhr.responseText;

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

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					dataObj.drawerJson = xhr.responseText;

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

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					dataObj.drawerJson = xhr.responseText;

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

	addMediaItem() {

		try {
			var title = document.getElementById("title").value;

			if(isEmpty(title)) {
				component.setText("error", "Please enter a valid Title for your post.");
				return false;
			}

			var cleanedTitle = replaceSpecialChars(title);

			/* get selected file element */
			var oFile = document.getElementById("inputFile").files[0];

			/* filter for image files */

	/*		var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;

			if (!rFilter.test(oFile.type)) {
				component.setText("error", "The file is not an image file type (jpeg, gif, png, tiff, bmp).");
				return;
			}
	*/
			/* No File was selected */
			if (oFile.size <= 0) {
				component.setText("error", "You have not selected a file to upload.");
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
			component.setText("error", "We are sorry but we cannot post your file at this time.  Please try again in a little bit.");
		}
		finally {
			document.getElementById("preview").style.display = '';
		}
	},

	deleteItem: function(drawerId){

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

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					dataObj.drawerJson = xhr.responseText;

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

	pasteUrl: function(e) {

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
	}

};

function init() {

	try {
		/*
		 * Initialize the dataObj
		 */
		dataObj.collectionName = "";
		dataObj.userName = "";
		dataObj.trayJson = "";
		dataObj.drawerJson = "";
		dataObj.initialState = "";
		dataObj.traySelected = "";
		dataObj.favoriteTraTokens = "";

		var data = {
			"{{onclick:getDrawerList}}" : "drawer.getList();",
			"{{onclick:toggle}}" : "menu.toggle();"
		};

		component.render("t-header", "template-header", data);

		/*
		 * Render the sign in template
		 */
		entry.renderSignIn();
	}
	catch(err) {
		console.log("init(): " + err);
	}
	finally {}
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

			if (xhr.readyState !== 4) {
				return;
			}

			if (xhr.status === 200) {
				dataObj.drawerJson = xhr.responseText;

				var drawerArray = JSON.parse(dataObj.drawerJson);

				if(drawerArray.length <= 0) {
					renderNoResultsFound();

				} else {
					dataObj.traySelected = "resulting in your search";

					menu.reset();
					drawer.render();
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
		console.log("postSearchDrawerByWildcard(): " + err);
	}
	finally {}
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

			if (xhr.readyState !== 4) {
				return;
			}

			if (xhr.status === 200) {
				dataObj.drawerJson = xhr.responseText;

				var drawerArray = JSON.parse(dataObj.drawerJson);

				if(drawerArray.length <= 0) {
					renderNoResultsFound();

				} else {
					dataObj.traySelected = "in your " + trayName + " tray";

					menu.reset();
					drawer.render();
				}
			} else {
				console.log('Error: ' + xhr.status);
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
	finally {}
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
			component.setText("error", "The file is too big. You can only upload up to a 10MB file.");
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
	finally {}
}

function postUploadMediaFile(stringJSON) {

	try {
		var url = "https://mydrawer-itsallhere.rhcloud.com/sharepicture/social";

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			if (xhr.readyState !== 4) {
				return;
			}

			if (xhr.status === 200) {
				var data = JSON.parse(xhr.responseText);

				var htmlContent = data.htmlContent;

				document.getElementById('template-content').innerHTML = htmlContent;

				menu.reset();

			} else {
				console.log('Error: ' + xhr.status);
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
		component.setText("error", "We are sorry but we cannot post your file at this time.  Please try again in a little bit.");
	}
	finally {}
}

var tray = {

	createSelectTag: function(trayId, includeChangeFunctionFlag) {

		var trayListSelectTag = "";

		try {
			var optionHtml = "";

			var trayArray = JSON.parse(dataObj.trayJson);

			for(var i=0; i<trayArray.length; i++) {

				var tray = trayArray[i];

				var selected = "";

				if(trayId == tray.trayId) {
					selected = " selected";
				}

				var optionData = {
					"{{data:trayId}}" : tray.trayId,
					"{{data:selected}}" : selected,
					"{{data:trayName}}" : tray.trayName
				};

				optionHtml += component.create("t-tray-select-option-tag", optionData);
			}

			var changeFunction = "";

			if(includeChangeFunctionFlag == "add-onchange") {
				changeFunction = 'onchange="tray.getSelectedList(this);"';
			} else {
				changeFunction = "return false;"
			}

			var selectData = {
				"{{onchange:getSelectedList}}" : changeFunction,
				"{{data:trayOptions}}" : optionHtml
			};

			trayListSelectTag = component.create("t-tray-select-tag", selectData);
		}
		catch(err) {
			console.log("createSelectTag(): " + err);
		}
		finally {}

		return trayListSelectTag;
	},

	getSelectedList: function(element) {

		try {
			var trayId = element.options[element.selectedIndex].value;
			var trayName = element.options[element.selectedIndex].text;

			var trayTokens = trayId + "|" + trayName;

			postSearchDrawerByTraId(trayTokens);
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

					var trayRows = "";

					for(var i=0; i<trayArray.length; i++) {

						var tray = trayArray[i];

						var rowData = {
							"{{data:trayId}}" : tray.trayId,
							"{{data:trayName}}" : tray.trayName,
							"{{onclick:searchDrawerByTrayId}}" : "drawer.searchDrawerByTrayId(this);",
							"{{onclick:renderEditTray}}" : "tray.renderEditTray(this);",
							"{{onclick:deleteItem}}" : "tray.deleteItem(this);"
						};

						trayRows += component.create("t-tray-list-rows", rowData);
					}

					var tableData = {
						"{{onclick:renderAddTray}}" : "tray.renderAddTray();",
						"{{onclick:getDrawerList}}" : "drawer.getList();",
						"{{data:trayRows}}" : trayRows
					};

					component.render("t-tray-list", "template-content", tableData);

					component.saveInitialState("template-content");
				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("getList(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/Tray/" + dataObj.collectionName;

			xhr.open("GET", url, true);
			xhr.send();
		}
		catch(err) {
			console.log("getList(): " + err);
		}
		finally {}
	},

	getFavoriteTrayTokens: function() {

		var trayTokens = "";

		try {
			var drawerArray = JSON.parse(dataObj.drawerJson);

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
			console.log("getFavoriteTrayTokens(): " + err);
		}
		finally {}

		return trayTokens;
	},

	renderAddTray: function() {

		try {
			var data = {
				"{{onclick:getTrayList}}": "tray.getList();",
				"{{onclick:addItem}}": "tray.additem();"
			};

			component.render("t-tray-add", "template-content", data);

			component.saveInitialState("template-content");
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
				"collectionName":dataObj.collectionName, 
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
				var data = {
					"{{data:trayId}}": trayId,
					"{{data:trayName}}": trayName,
					"{{onclick:getTrayList}}": "tray.getList();",
					"{{onclick:editItem}}": "tray.editItem(this);"
				};

				component.render("t-tray-edit", "template-content", data);
			}

			component.saveInitialState("template-content");
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

			var name = document.getElementById("name").value;

			if(isEmpty(name)) {
				component.setText("error", "Please enter a Tray Name.");
				return false;
			}

			var nameEl = document.getElementById("name");
			var origName = nameEl.getAttribute('data-tray-name');

			if(tray.isDuplicate(name)) {
				component.setText("error", "You already have a Tray with this name.");
				document.getElementById("name").value = origName;
				return false;
			}

			var inputFields = {
				"collectionName":dataObj.collectionName, 
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

					var trayArray = dataObj.trayJson;

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
			var drawerArray = JSON.parse(dataObj.drawerJson);

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

			var inputFields = {
				"collectionName":dataObj.collectionName, 
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
			var drawerArray = JSON.parse(dataObj.drawerJson);

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
			var data = {};

			component.render("t-tray-delete-error", "template-content", data);

			component.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderCannotDeleteTray(): " + err);
		}
		finally {}
	},

	renderTrayError: function() {

		try {
			var data = {};

			component.render("t-tray-error", "template-content", data);

			component.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderTrayError(): " + err);
		}
		finally {}
	}

};

var listener = {

	create: function() {

		document.body.addEventListener("keydown", function(event) {

			if(event.keyCode === 13) {

				/*
				 * Check which template is being displayed by checking for the 
				 * presence of a hidden field that is specific for that template 
				 */
				var element = document.getElementById("signin");
				if(element != null) {
					entry.signIn();
				}

				var element = document.getElementById("signup");
				if(element != null) {
					entry.signUp();
				}

				var element = document.getElementById("contactus");
				if(element != null) {
					general.addContactUs();
				}

			}
		});

	}

};
