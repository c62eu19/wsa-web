/**
 * story.js
 * Contains general methods for OHS.
 * 
 * @author Stan Zajdel
*/

function init() {

	try {
		/*
		 * Initialize the appData object
		 */
		appData.initialize();

		/*
		 * Register a listener for enter key pressed for selected templates
		 */
		listener.registerKeyDownEnter();

		/*
		 * Render the genre template
		 */
		access.renderGenre();
	}
	catch(err) {
		console.log("init(): " + err);
	}
	finally {}
}

var access = {

	renderWelcome: function() {

		try {
			if(isEmpty(appData.get("userToken"))) {

				component.initializeEventRegistry();
				component.registerEvent("func:signIn", "access.signIn();");
				component.registerEvent("func:renderSignUp", "access.renderSignUp();");

				component.render("t-welcome", "template-content");

				state.saveInitialState("template-content");
			}

			menu.renderMenuSignedOut();
		}
		catch(err) {
			console.log("renderWelcome(): " + err);
		}
		finally {}
	},

	renderGenre: function() {

		try {
			component.initializeEventRegistry();
			component.registerEvent("func:getStories", "story.getStories(this);");

			component.initializeDataRegistry();
			component.registerData("data:mystery", "Mystery and Suspense");

			component.render("t-genre", "template-content");

			if(isEmpty(appData.get("userToken"))) {
				menu.renderMenuSignedOut();
			} else {
				menu.renderMenuSignedIn();
			}

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderGenre(): " + err);
		}
		finally {}
	},

	renderSignIn: function() {

		try {
			if(isEmpty(appData.get("userToken"))) {

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

					appData.set("userName", data.userName);
					appData.set("userToken", data.userToken);

					if(statusInd == "A") {

						access.renderGenre();

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

			var url = "http://localhost:8080/ourstories/Signin/";

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

					appData.set("userName", data.userName);
					appData.set("userToken", data.userToken);

					if(statusInd == "A") {

						access.renderGenre();
					} else {
						access.renderSignUpError(statusMsg);
					}
				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("signUp(): An error occurred during the transaction" + err);
			};

			var url = "http://localhost:8080/ourstories/Signup/";

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

			access.renderWelcome();
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
		    var el = document.getElementById("navbar-dropdown");

			if(el.style.display == "none" || el.style.display == "") {
				el.style.display = "block";
				el.style.height = "20%";
			} else {
				el.style.height = "0%";
				el.style.display = "none";
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
			component.initializeDataRegistry();

			component.initializeEventRegistry();
			component.registerEvent("func:renderGenre", "access.renderGenre();");
			component.registerEvent("func:toggle", "menu.toggle();");

			component.registerEvent("func:renderContactUs", "general.renderContactUs();");
			component.registerEvent("func:renderAbout", "general.renderAbout();");
			component.registerEvent("func:signOut", "access.signOut();");

			component.render("t-navbar-signed-in", "template-navbar");
			component.render("t-navbar-dropdown-signed-in", "template-navbar-dropdown");
		}
		catch(err) {
			console.log("renderMenuSignedIn(): " + err);
		}
		finally {}
	},

	renderMenuSignedOut: function() {

		try {
			component.initializeEventRegistry();
			component.registerEvent("func:renderGenre", "access.renderGenre();");
			component.registerEvent("func:toggle", "menu.toggle();");

			component.registerEvent("func:renderSignIn", "access.renderSignIn();");
			component.registerEvent("func:renderContactUs", "general.renderContactUs();");
			component.registerEvent("func:renderAbout", "general.renderAbout();");

			component.render("t-navbar-signed-out", "template-navbar");
			component.render("t-navbar-dropdown-signed-out", "template-navbar-dropdown");
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

			var url = "http://localhost:8080/ourhealthstories/ContactUs/";

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

var story = {

	getStories: function(element) {

		try {
			var genre = element.getAttribute("data-genre");

			appData.set("genre", genre);

			story.getList();
		}
		catch(err) {
			console.log("getStories(): " + err);
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
					var storyJson = xhr.responseText;

					var storyArray = JSON.parse(storyJson);

					appData.set("storyArray", storyArray);

					if(storyArray.length > 0) {
						story.render();
					} else {
						story.renderCreateNewStory();
					}

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("getList(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/ourstories/StoryList/" + appData.get("genre");

			xhr.open("GET", url, true);
			xhr.send();
		}
		catch(err) {
			console.log("getList(): " + err);
		}
		finally {}
	},

	searchFeedByWildcard: function() {

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
					var feedJson = xhr.responseText;

					appData.set("feedJson", feedJson);

					var feedArray = JSON.parse(feedJson);

					if(feedArray.length > 0) {

						story.render();

					} else {
						story.renderNoResultsFound();
					}

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("postSearchFeedByWildcard(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/ourhealthstories/FeedList/";

			xhr.open("POST", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send("inputJSON=" + stringJSON);
		}
		catch(err) {
			console.log("searchFeedByWildcard(): " + err);
		}
		finally {}
	},

	render: function() {

		try {
			var rowHtml = "";

			var rowCount = 0;
			var columnCount = 0;

			var storyArray = appData.get("storyArray");

			for(var i=0; i<storyArray.length; i++) {

				var item = storyArray[i];

				var itemTitle = story.createViewTitle(item.storyId);

				var viewButton = "";

				/*
				 * Content can be text, web video or media
				 */
				var content = story.getItemTypeContent(item);

				component.initializeDataRegistry();
				component.registerData("data:itemTitle", itemTitle);
				component.registerData("data:topicName", item.topicName);
				component.registerData("data:itemTitle", itemTitle);
				component.registerData("data:content", content);
				component.registerData("data:url", item.url);
				component.registerData("data:updatedDate", item.updatedDate);
				component.registerData("data:viewButton", viewButton);

				var columnData = component.create("t-drawer-columns");

				rowCount++;
				columnCount++;

				if(columnCount == 1) {
					var columnLeft = columnData;

					/*
					 * If column count == 1 and rowCount == array count
					 */
					if(rowCount == storyArray.length) {
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
					if(rowCount == storyArray.length) {
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

			if(storyArray.length <= 0) {
				rowHtml = "";
			}

			component.initializeDataRegistry();
			component.registerData("data:topicId", appData.get("favoriteTrayId"));
			component.registerData("data:totalItems", storyArray.length);
			component.registerData("data:drawerRows", rowHtml);

			component.initializeEventRegistry();
			component.registerEvent("func:searchFeedByWildcard", "story.searchFeedByWildcard(this);");

			component.render("t-drawer", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("render(): " + err);
		}
		finally {}
	},

	renderNoResultsFound: function() {

		try {
			component.initializeEventRegistry();
			component.registerEvent("func:getStoryList", "story.getList();");

			component.render("t-no-results-found", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderNoResultsFound(): " + err);
		}
		finally {}
	},

	getItem: function(storyId) {

		var storyItem = {};

		try {
			var storyArray = JSON.parse(appData.get("storyJson"));

			if(storyArray.length > 0) {

				for(var i=0; i<storyArray.length; i++) {

					var item = storyArray[i];

					if(storyId == item.storyId) {

						var decodeUrl = decodeURIComponent(item.url);
						var decodeMediaBase64 = decodeURIComponent(item.mediaBase64);

						storyItem.storyId = item.storyId;
						storyItem.title = item.title;
						storyItem.content = item.content;
						storyItem.genre = item.genre;
						storyItem.createdBy = item.createdBy;
						storyItem.createdDate = item.createdDate;
						storyItem.updatedDate = item.updatedDate;
						storyItem.url = decodeUrl;
						storyItem.mediaType = item.mediaType;
						storyItem.mediaBase64 = decodeMediaBase64;
						storyItem.topicName = item.topicName;

						break;
					}
				}
			}
		}
		catch(err) {
			console.log("getItem(): " + err);
		}
		finally {}

		return storyItem;
	},

	renderViewTextItem: function(element) {

		try {
			var drawerId = element.getAttribute("data-drawer-id");

			drawerItem = {};
			drawerItem = story.getItem(drawerId);

			var editButton = story.createEditButton(drawerItem.drawerId);
			var deleteButton = story.createDeleteButton(drawerItem.drawerId);

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

	renderCreateNewStory: function() {

		try {
			component.initializeDataRegistry();
			component.registerData("data:genre", appData.get("genre"));

			component.initializeEventRegistry();
			component.registerEvent("func:toggleBold", "format.toggleBold(event,this);");
			component.registerEvent("func:toggleItalic", "format.toggleItalic(event,this);");
			component.registerEvent("func:toggleUnderline", "format.toggleUnderline(event,this);");
			component.registerEvent("func:createNewStory", "story.createNewStory();");

			component.render("t-new-story", "template-content");
/*			component.render("t-story-list", "template-content"); */

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderCreateNewStory(): " + err);
		}
		finally {}
	},

	renderCreateNewStoryBranch: function() {

		try {
			component.initializeDataRegistry();
			component.registerData("data:title", appData.get("title"));
			component.registerData("data:genre", appData.get("genre"));

			component.initializeEventRegistry();
			component.registerEvent("func:toggleBold", "format.toggleBold(this);");
			component.registerEvent("func:toggleItalic", "format.toggleItalic(this);");
			component.registerEvent("func:toggleUnderline", "format.toggleUnderline(this)();");
			component.registerEvent("func:createNewStoryBranch", "story.createNewStoryBranch();");

			component.render("t-new-story-branch", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderCreateNewStoryBranch(): " + err);
		}
		finally {}
	},

	renderViewStory: function() {

		try {
			component.initializeDataRegistry();
			component.registerData("data:title", appData.get("title"));
			component.registerData("data:genre", appData.get("genre"));

			component.initializeEventRegistry();
			component.registerEvent("func:renderCreateNewStoryBranch", "story.renderCreateNewStoryBranch();");

			component.render("t-view-story", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderViewStory(): " + err);
		}
		finally {}
	},

	renderEditTextItem: function(element) {

		try {
			var drawerId = element.getAttribute("data-drawer-id");

			drawerItem = {};
			drawerItem = story.getItem(drawerId);

			var viewButton = story.createViewButton(drawerItem.drawerId);
			var deleteButton = story.createDeleteButton(drawerItem.drawerId);

			var trayListSelectTag = tray.createSelectTag(drawerItem.trayId, "N");

			component.initializeDataRegistry();
			component.registerData("data:viewButton", viewButton);
			component.registerData("data:deleteButton", deleteButton);
			component.registerData("data:trayListSelectTag", trayListSelectTag);
			component.registerData("data:title", drawerItem.title);
			component.registerData("data:text", drawerItem.text);
			component.registerData("data:drawerId", drawerId);

			component.initializeEventRegistry();
			component.registerEvent("func:editTextItem", "story.editTextItem(this);");

			component.render("t-text-edit", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderEditTextItem(): " + err);
		}
		finally {}
	},

	createViewTitle: function(storyId) {

		var componentHtml = "";

		try {
			storyItem = {};
			storyItem = story.getItem(storyId);

			component.initializeDataRegistry();
			component.initializeEventRegistry();

			if(storyItem.type == "1") {

				component.registerData("data:storyId", storyId);
				component.registerData("data:title", storyItem.title);

				component.registerEvent("func:renderViewTextItem", "story.renderViewTextItem(this);");

				componentHtml = component.create("t-drawer-title-text-view");
			}
		}
		catch(err) {
			console.log("createViewTitle(): " + err);
		}
		finally {}

		return componentHtml;
	},

	createViewButton: function(storyId) {

		var componentHtml = "";

		try {
			storyItem = {};
			storyItem = story.getItem(storyId);

			component.initializeDataRegistry();
			component.initializeEventRegistry();

			if(storyItem.type == "1") {

				component.registerData("data:storyId", storyId);

				component.registerEvent("func:renderViewTextItem", "story.renderViewTextItem(this);");

				componentHtml = component.create("t-drawer-button-text-view");
			}
		}
		catch(err) {
			console.log("createViewButton(): " + err);
		}
		finally {}

		return componentHtml;
	},

	createEditButton: function(storyId) {

		var componentHtml = "";

		try {
			storyItem = {};
			storyItem = story.getItem(storyId);

			component.initializeDataRegistry();
			component.initializeEventRegistry();

			if(storyItem.type == "1") {
				component.registerData("data:storyId", storyId);

				component.registerEvent("func:renderEditTextItem", "story.renderEditTextItem(this);");

				componentHtml = component.create("t-drawer-button-text-edit");
			}
		}
		catch(err) {
			console.log("createEditTitle(): " + err);
		}
		finally {}

		return componentHtml;
	},

	createDeleteButton: function(storyId) {

		var componentHtml = "";

		try {
			component.initializeDataRegistry();
			component.registerData("data:storyId", storyId);

			component.initializeEventRegistry();
			component.registerEvent("func:deleteItem", "story.deleteItem(this);");

			componentHtml = component.create("t-drawer-button-delete");
		}
		catch(err) {
			console.log("createDeleteTitle(): " + err);
		}
		finally {}

		return componentHtml;
	},

	createNewStory: function(){

		try {
			var title = document.forms[0].title.value;
			var comments = document.forms[0].comments.value;

			var content = document.getElementById("content").innerHTML

			if(isEmpty(title)) {
				component.setText("error", "Please enter a Title.");
				return false;
			}

			if(isEmpty(comments)) {
				component.setText("error", "Please tell us your thought or what inspired you.");
				return false;
			}

			if(isEmpty(content)) {
				component.setText("error", "Please enter your Story.");
				return false;
			}

			var okCancel = confirm("Once you Save your story it cannot be changed. Are you sure that you want to Save?");

			if(okCancel == false) {
				return false;
			}

			var cleanedTitle = replaceSpecialChars(title);
			var cleanedComments = replaceSpecialChars(comments);
			var cleanedContent = replaceSpecialChars(content);

			/* New Story so no ancestors */
			var originalAncestorId = "0";

			/* New Story so no ancestor document IDs */
			var ancestorIdList = "";

			/* New Story so it's the first level */
			var level = "1";

			var inputFields = {
				"genre":appData.get("genre"), 
				"createdBy":appData.get("userName"), 
				"title":cleanedTitle, 
				"content":cleanedContent,
				"originalAncestorId":originalAncestorId, 
				"ancestorIdList":ancestorIdList, 
				"level":level,
				"comments":comments};

			var inputJSON = {};
			inputJSON.inputArgs = inputFields;

			var stringJSON = JSON.stringify(inputJSON);

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var storyJson = xhr.responseText;

					appData.set("storyJson", storyJson);

					story.render();

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("createNewStory(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/ourstories/StoryEntry/";
 
			xhr.open("POST", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send("inputJSON=" + stringJSON);
		}
		catch(err) {
			console.log("createNewStory(): " + err);
		}
		finally {}
	},

	createNewStoryBranch: function(){

		try {
			var title = "";
			var comments = document.forms[0].comments.value;

			var content = document.getElementById("content").innerHTML

			if(isEmpty(comments)) {
				component.setText("error", "Tell us your thoughts on why you decided to add your version.");
				return false;
			}

			if(isEmpty(content)) {
				component.setText("error", "Please enter your Branch of the Story.");
				return false;
			}

			var cleanedTitle = replaceSpecialChars(title);
			var cleanedComments = replaceSpecialChars(comments);
			var cleanedContent = replaceSpecialChars(content);

			/* New Branch of existing Story so get the original ancestor ID */
			var originalAncestorId = "0";

			/* New Branch of existing Story so append direct ancestor ID to the existing list */
			var ancestorIdList = "";

			/* New Branch of existing Story so increment the level by 1 */
			var level = "1";

			var inputFields = {
				"genre":appData.get("genre"), 
				"createdBy":appData.get("userName"), 
				"title":cleanedTitle, 
				"content":cleanedContent,
				"originalAncestorId":originalAncestorId, 
				"ancestorIdList":ancestorIdList, 
				"level":level,
				"comments":comments};

			var inputJSON = {};
			inputJSON.inputArgs = inputFields;

			var stringJSON = JSON.stringify(inputJSON);

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var storyJson = xhr.responseText;

					appData.set("storyJson", storyJson);

					story.render();

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("createNewStoryBranch(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/ourstories/StoryEntry/";
 
			xhr.open("POST", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send("inputJSON=" + stringJSON);
		}
		catch(err) {
			console.log("createNewStoryBranch(): " + err);
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

					story.render();

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("editTextItem(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/StoryEntry/";

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

	deleteItem: function(storyId){

		try {

			var inputFields = {
				"genre":appData.get("genre"), 
				"storyId":storyId
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
					var storyJson = xhr.responseText;

					appData.set("storyJson", storyJson);

					story.render();

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("deleteItem(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/mydrawer/FeedEntry/";

			xhr.open("DELETE", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(stringJSON);
		}
		catch(err) {
			console.log("deleteItem(): " + err);
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

				var element = document.getElementById("searchTerm");
				if(element != null) {
					story.searchFeedByWildcard();
				}

			}
		});

	}

};
