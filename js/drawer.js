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

				var data = {};
				component.render("t-sign-in", "template-content", data);
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
				document.getElementById('error').innerHTML = 'Please enter a valid Email.';
				return false;
			}

			if(isEmpty(password)) {
				document.getElementById('error').innerHTML = 'Please enter a Password.';
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
			var data = {};
			component.render("t-sign-in-error", "template-content", data);

			menu.reset();
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

			menu.reset();
		}
		catch(err) {
			console.log("renderAccountDisabled(): " + err);
		}
		finally {}
	},

	renderSignUp: function() {

		try {
			dataObj = {};

			var data = {};
			component.render("t-sign-up", "template-content", data);

			document.body.addEventListener("keydown", function(e) {
				if (e.keyCode === 13) {
					entry.postSignUp();
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
				document.getElementById('error').innerHTML = 'Your Email is required.';
				return false;
			}

			if(!isValidEmail(email)) {
				document.getElementById('error').innerHTML = 'You have entered an invalid Email.';
				return false;
			}

			if(isEmpty(password)) {
				document.getElementById('error').innerHTML = 'Your Password is required.';
				return false;
			}

			if(password.length < 6) {
				document.getElementById('error').innerHTML = 'Your password must be at least 6 characters.';
				return false;
			}

			if(isEmpty(passwordReentry)) {
				document.getElementById('error').innerHTML = 'Please reenter your Password.';
				return false;
			}

			if(password != passwordReentry) {
				document.getElementById('error').innerHTML = 'The reentered Password does not match your Password.';
				return false;
			}

			if(isEmpty(name)) {
				document.getElementById('error').innerHTML = 'Your Name is required.';
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
			document.getElementById('error').innerHTML = "An error has occured in your account signup. Please try again.";
			console.log("signUp(): " + err);
		}
		finally {}
	},

	renderSignUpError: function(errorMsg) {

		try {
			var data = {
				"{{errorMsg}}": errorMsg
			};

			component.render("t-signup-error", "template-content", data);

			menu.reset();
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
			component.render("t-sign-in", "template-content", data);

			menu.reset();
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

				var trayListSelectTag = tray.createSelectTag("", "add-onchange");

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

var general = {

	renderContactUs: function() {

		try {
			dataObj.origTemplateContent = document.getElementById('template-content').innerHTML;

			var data = {};
			component.render("t-contact-us", "template-content", data);

			menu.reset();
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
				document.getElementById('error').innerHTML = 'Your Email is required.';
				return false;
			}

			if(!isValidEmail(email)) {
				document.getElementById('error').innerHTML = 'You have entered an invalid Email.';
				return false;
			}

			if(isEmpty(subject)) {
				document.getElementById('error').innerHTML = ' The Subject is required.';
				return false;
			}

			if(isEmpty(message)) {
				document.getElementById('error').innerHTML = 'The Message is required.';
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
					menu.reset();

					document.getElementById('template-content').innerHTML = dataObj.origTemplateContent;
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
			document.getElementById('template-content').innerHTML = dataObj.origTemplateContent;
		}
		finally {}
	},

	renderAbout: function() {

		try {
			dataObj.origTemplateContent = document.getElementById('template-content').innerHTML;

			var data = {};
			component.render("t-about", "template-content", data);

			menu.reset();
		}
		catch(err) {
			console.log("renderAbout(): " + err);
		}
		finally {}
	}

};

var drawer = {

	list: function() {

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

						menu.reset();
						drawer.render();

					} else {
						console.log('Error: ' + xhr.status);
					}
				};

				xhr.onerror = function () {
					console.log("list(): An error occurred during the transaction");
				};

				var url = "http://localhost:8080/mydrawer/DrawerList/" + dataObj.collectionName;

				xhr.open("GET", url, true);
				xhr.send();
			}
		}
		catch(err) {
			console.log("list(): " + err);
		}
		finally {}
	},

	render: function() {

		try {

			var drawerArray = JSON.parse(dataObj.drawerJson);

			var rowHtml = "";
			var rowData = {};

			for(var i=0; i<drawerArray.length; i++) {

				var item = drawerArray[i];

				var sanitizedText = item.text.replace(/\r/g, " ");
				sanitizedText = item.text.replace(/\n/g, " ");

				var itemTitle = drawer.createViewTitle(item.drawerId);

				var viewButton = drawer.createViewButton(item.drawerId);
				var editButton = drawer.createEditButton(item.drawerId);
				var deleteButton = drawer.createDeleteButton(item.drawerId);

				rowData = {
					"{{itemTitle}}" : itemTitle,
					"{{trayName}}" : item.trayName,
					"{{text}}" : sanitizedText,
					"{{updatedDate}}" : item.updatedDate,
					"{{viewButton}}" : viewButton,
					"{{editButton}}" : editButton,
					"{{deleteButton}}" : deleteButton
				};

				rowHtml += component.create("t-drawer-rows", rowData);
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
			console.log("render(): " + err);
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

	renderAddTextEntry: function() {

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
		finally {}
	},

	renderAddWebEntry: function() {

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
		finally {}
	},

	renderAddMediaEntry: function() {

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
		finally {}
	},

	createViewTitle: function(drawerId) {

		var componentHtml = "";

		try {
			drawerItem = {};
			drawerItem = drawer.getItem(drawerId);

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
			console.log("createEditTitle(): " + err);
		}
		finally {}

		return componentHtml;
	},

	createDeleteButton: function(drawerId) {

		var componentHtml = "";

		try {
			var data = {
				"{{drawerId}}" : drawerId
			};

			componentHtml = component.create("t-drawer-button-delete", data);
		}
		catch(err) {
			console.log("createDeleteTitle(): " + err);
		}
		finally {}

		return componentHtml;
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
		dataObj.origTemplateContent = "";
		dataObj.traySelected = "";
		dataObj.favoriteTraTokens = "";

		/*
		 * Create all event listeners for the app
		 */
		listener.create();

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

function renderNoResultsFound() {

	try {
		var data = {};

		component.render("t-no-results-found", "template-content", data);

		menu.reset();
	}
	catch(err) {
		console.log("renderNoResultsFound(): " + err);
	}
	finally {}
}

function renderViewTextEntry(drawerId) {

	try {
		drawerItem = {};
		drawerItem = drawer.getItem(drawerId);

		var editButtonComponent = drawer.createEditButton(drawerItem.drawerId);
		var deleteButtonComponent = drawer.createDeleteButton(drawerItem.drawerId);

		var buttonBarData = {
			"{{editButton}}" : editButtonComponent,
			"{{deleteButton}}" : deleteButtonComponent
		};

		var buttonBarComponent = component.create("t-view-button-bar", buttonBarData);

		var data = {
			"{{buttonBar}}" : buttonBarComponent,
			"{{title}}" : drawerItem.title,
			"{{trayName}}" : drawerItem.trayName,
			"{{text}}" : drawerItem.text
		};

		component.render("t-text-view", "template-content", data);

		menu.reset();
	}
	catch(err) {
		console.log("renderViewTextEntry(): " + err);
	}
	finally {}
}

function renderViewVideoEntry(drawerId) {

	try {
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

		menu.reset();
	}
	catch(err) {
		console.log("renderViewVideoEntry(): " + err);
	}
	finally {}
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
	finally {}
}

function renderEditTextEntry(drawerId) {

	try {
		drawerItem = {};
		drawerItem = drawer.getItem(drawerId);

		var viewButtonComponent = drawer.createViewButton(drawerItem.drawerId);
		var deleteButtonComponent = drawer.createDeleteButton(drawerItem.drawerId);

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
	finally {}
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
	finally {}
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
	finally {}
}

function getUrlParts(url) {

	try {
		if(isEmpty(url)) {
			document.getElementById('error').innerHTML = 'Please paste a valid Url.';
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
					document.getElementById('error').innerHTML = "We are sorry but we could not fetch the title or description for your link.";
					document.getElementById('url').innerHTML = "";
				}

				document.body.style.cursor = "default";

			} else {
				document.getElementById('url').innerHTML = "";
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
		document.getElementById('url').innerHTML = "";
		document.getElementById('error').innerHTML = 'We are sorry but there is a problem with the Link that you are trying to fetch.';
	}
	finally {}
}

function postSaveWebEntry(){

	try {
		var pastedUrl = document.forms[0].url.value;
		var trayId = document.forms[0].trayId.value;
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
	finally {}
}

function renderEditWebEntry(drawerId) {

	try {
		drawerItem = {};
		drawerItem = drawer.getItem(drawerId);

		var viewButtonComponent = drawer.createViewButton(drawerItem.drawerId);
		var deleteButtonComponent = drawer.createDeleteButton(drawerItem.drawerId);

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
	finally {}
}

function putSaveWebEntry(drawerId) {

	try {
		var pastedUrl = document.forms[0].url.value;
		var trayId = document.forms[0].trayId.value;
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
	finally {}
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
		document.getElementById('error').innerHTML = 'We are sorry but we cannot post your file at this time.  Please try again in a little bit.';
	}
	finally {}
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
					"{{trayId}}" : tray.trayId,
					"{{selected}}" : selected,
					"{{trayName}}" : tray.trayName
				};

				optionHtml += component.create("t-tray-select-option-tag", optionData);
			}

			var changeFunction = "";

			if(includeChangeFunctionFlag == "add-onchange") {
				changeFunction = 'onchange="tray.getSelectedList(this);"';
			}

			var selectData = {
				"{{changeFunction}}" : changeFunction,
				"{{trayOptions}}" : optionHtml
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

					var rowHtml = "";

					for(var i=0; i<trayArray.length; i++) {

						var tray = trayArray[i];

						var rowData = {
							"{{trayId}}" : tray.trayId,
							"{{trayName}}" : tray.trayName
						};

						rowHtml += component.create("t-tray-list-rows", rowData);
					}

					var tableData = {
						"{{trayRows}}" : rowHtml
					};

					component.render("t-tray-list", "template-content", tableData);

					menu.reset();
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
				"{{heading}}": "Add a New Tray",
				"{{name}}": "",
				"{{event-class}}": "e-add-tray",
				"{{event-data}}": ""
			};

			component.render("t-tray", "template-content", data);

			menu.reset();
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
				document.getElementById('error').innerHTML = 'Please enter a Tray Name.';
				return false;
			}

			if(tray.isDuplicate(name)) {
				document.getElementById('error').innerHTML = 'You already have this Tray in your Drawer.';
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

	renderEditTray: function(data) {

		try {
			var tokens = data.split("|");
			var trayId = tokens[0];
			var trayName = tokens[1];

			if(trayName.toLowerCase() == "favorites") {
				tray.renderTrayError();

			} else {
				var data = {
					"{{heading}}": "Change the Name of Your Tray",
					"{{name}}": trayName,
					"{{event-class}}": "e-edit-tray",
					"{{event-data}}": trayId
				};

				component.render("t-tray", "template-content", data);
			}

			menu.reset();
		}
		catch(err) {
			console.log("renderEditTray(): " + err);
		}
		finally {}
	},

	editItem: function(trayId) {

		try {
			var name = document.getElementById("name").value;

			if(isEmpty(name)) {
				document.getElementById('error').innerHTML = 'Please enter a Tray Name.';
				return false;
			}

			var nameEl = document.getElementById("name");
			var origName = nameEl.getAttribute('data-name');

			if(tray.isDuplicate(name)) {
				document.getElementById('error').innerHTML = 'You already have a Tray with this name.';
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

	deleteItem: function(trayId) {

		try {
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

			menu.reset();
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

			menu.reset();
		}
		catch(err) {
			console.log("renderTrayError(): " + err);
		}
		finally {}
	}

};

var listener = {

	create: function() {

		document.addEventListener('click', function(event) {

			var elementId = event.target.classList.toString();
console.log(elementId);

			if(elementId.indexOf("e-get-drawer-list") >= 0) {
				drawer.list();
			}

			if(elementId.indexOf("e-open-hamburger") >= 0) {
				menu.openHamburger();
			}

			if(elementId.indexOf("e-close-hamburger") >= 0) {
				menu.closeHamburger();
			}

			if(elementId.indexOf("e-render-sign-in") >= 0) {
				entry.renderSignIn();
			}

			if(elementId.indexOf("e-sign-in") >= 0) {
				entry.signIn();
			}

			if(elementId.indexOf("e-render-sign-up") >= 0) {
				entry.renderSignUp();
			}

			if(elementId.indexOf("e-sign-up") >= 0) {
				entry.signUp();
			}

			if(elementId.indexOf("e-render-add-text") >= 0) {
				drawer.renderAddTextEntry();
			}

			if(elementId.indexOf("e-render-add-web") >= 0) {
				drawer.renderAddWebEntry();
			}

			if(elementId.indexOf("e-render-add-media") >= 0) {
				drawer.renderAddMediaEntry();
			}

			if(elementId.indexOf("e-post-search-drawer-by-tra-id") >= 0) {
				postSearchDrawerByTraId("{{favoriteTraTokens}}");
			}

			if(elementId.indexOf("e-render-contact-us") >= 0) {
				general.renderContactUs();
			}

			if(elementId.indexOf("e-add-contact-us") >= 0) {
				general.addContactUs();
			}

			if(elementId.indexOf("e-render-about") >= 0) {
				general.renderAbout();
			}

			if(elementId.indexOf("e-sign-out") >= 0) {
				entry.signOut();
			}

			if(elementId.indexOf("e-get-tray-list") >= 0) {
				tray.getList();
			}

			if(elementId.indexOf("e-render-add-tray") >= 0) {
				tray.renderAddTray();
			}

			if(elementId.indexOf("e-add-tray") >= 0) {
				var data = event.target.id.toString();
				tray.addItem();
			}

			if(elementId.indexOf("e-render-edit-tray") >= 0) {
				var data = event.target.id.toString();
				tray.renderEditTray(data);
			}

			if(elementId.indexOf("e-edit-tray") >= 0) {
				var data = event.target.id.toString();
				tray.editItem(data);
			}

			if(elementId.indexOf("e-delete-tray") >= 0) {
				var data = event.target.id.toString();
				tray.checkIfCanBeDeleted(data);
			}


		}, false);

		document.body.addEventListener("keydown", function(event) {

			if(event.keyCode === 13) {

				var elementId = event.target.classList.toString();
			console.log(elementId);

				/*
				 * Check which template is being displayed by interrogating 
				 * the form id
				 */
				var elementHtml = "";

/*				elementHtml = document.getElementById("e-f-sign-in");
console.log(elementHtml);
				if(elementHtml != null && elementHtml.toString().indexOf("e-f-sign-in") >= 0) {
					signIn();
				}

				elementHtml = document.getElementById("e-f-sign-up");
				if(elementHtml != null && elementHtml.toString().indexOf("e-f-sign-up") >= 0) {
					signUp();
				}
*/
			}
		});

	}
};
