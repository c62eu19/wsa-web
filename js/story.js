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
		 * get and Render the genre list
		 */
		story.getGenreList();
	}
	catch(err) {
		console.log("init(): " + err);
	}
	finally {}
}

var access = {

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

						story.getGenreList();

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

			var url = "http://localhost:8080/wsa/Signin/";

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

						story.getGenreList();
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

			var url = "http://localhost:8080/wsa/Signup/";

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
			init();
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
			component.registerEvent("func:getGenreList", "story.getGenreList();");
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
			component.registerEvent("func:getGenreList", "story.getGenreList();");
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

	getGenreList: function() {

		try {
			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

			xhr.onreadystatechange = function () {

				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					var genreJson = xhr.responseText;

					var genreArray = JSON.parse(genreJson);

					appData.set("genreArray", genreArray);

					/*
					 * Render the appropriate menu based on if user signed in or not
					 */
					if(isEmpty(appData.get("userToken"))) {
						menu.renderMenuSignedOut();
					} else {
						menu.renderMenuSignedIn();
					}

					story.renderGenreList(genreArray);

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("getGenreList(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/wsa/GenreList/";

			xhr.open("GET", url, true);
			xhr.send();
		}
		catch(err) {
			console.log("getGenreList(): " + err);
		}
		finally {}
	},

	getGenreItem: function(genreMnem) {

		var genreItem = {};

		try {
			var genreArray = appData.get("genreArray");

			if(genreArray.length > 0) {

				for(var i=0; i<genreArray.length; i++) {

					var item = genreArray[i];

					if(genreMnem == item.genreMnem) {

						genreItem.genre = item.genre;
						genreItem.genreMnem = item.genreMnem;
						break;
					}
				}
			}
		}
		catch(err) {
			console.log("getGenreItem(): " + err);
		}
		finally {}

		return genreItem;
	},

	renderGenreList: function(genreArray) {

		try {
			var rowHtml = "";

			var rowCount = 0;
			var columnCount = 0;

			for(var i=0; i<genreArray.length; i++) {

				var item = genreArray[i];

				component.initializeDataRegistry();
				component.registerData("data:genreMnem", item.genreMnem);
				component.registerData("data:genre", item.genre);
				component.registerData("data:genreImage", item.image);
				component.registerData("data:totalStories", item.totalStories);

				component.initializeEventRegistry();
				component.registerEvent("func:getStoryList", "story.getStoryList(this);");

				var columnData = component.create("t-genre-column");

				rowCount++;
				columnCount++;

				if(columnCount == 1) {
					var columnOne = columnData;

					/*
					 * If column count == 1 and rowCount == array count
					 */
					if(rowCount == genreArray.length) {
						component.initializeDataRegistry();
						component.registerData("data:columnOne", columnOne);
						component.registerData("data:columnTwo", "");
						component.registerData("data:columnThree", "");

						rowHtml += component.create("t-genre-row");
					}
				}

				if(columnCount == 2) {
					var columnTwo = columnData;

					/*
					 * If column count == 2 and rowCount == array count
					 */
					if(rowCount == genreArray.length) {
						component.initializeDataRegistry();
						component.registerData("data:columnOne", columnOne);
						component.registerData("data:columnTwo", columnTwo);
						component.registerData("data:columnThree", "");

						rowHtml += component.create("t-genre-row");
					}
				}

				if(columnCount == 3) {
					var columnThree = columnData;

					component.initializeDataRegistry();
					component.registerData("data:columnOne", columnOne);
					component.registerData("data:columnTwo", columnTwo);
					component.registerData("data:columnThree", columnThree);

					rowHtml += component.create("t-genre-row");
					columnCount = 0;
				}
			}

			if(genreArray.length <= 0) {
				rowHtml = "";
			}

			component.initializeDataRegistry();
			component.registerData("data:rows", rowHtml);

			component.render("t-genre", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderGenreList(): " + err);
		}
		finally {}
	},

	getStoryList: function(element) {

		try {
			var genreMnem = element.getAttribute("data-genre-mnem");

			var genreItem = story.getGenreItem(genreMnem);

			var inputFields = {"genreMnem":genreItem.genreMnem};

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

					var storyArray = JSON.parse(storyJson);

					appData.set("storyArray", storyArray);

					if(storyArray.length > 0) {
						story.renderStoryList(genreItem, storyArray);
					} else {
						story.renderCreateNewStory(genreItem);
					}

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("getstoryList(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/wsa/StoryList/";

			xhr.open("POST", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

			xhr.send("inputJSON=" + stringJSON);
		}
		catch(err) {
			console.log("getStoryList(): " + err);
		}
		finally {}
	},

	renderStoryList: function(genreItem, storyArray) {

		try {
			var rowHtml = "";

			var rowCount = 0;
			var columnCount = 0;

			for(var i=0; i<storyArray.length; i++) {

				var item = storyArray[i];

				var storyVersionRows = story.renderStoryVersionList(storyArray, item.storyId);

				component.initializeDataRegistry();
				component.registerData("data:storyId", item.storyId);
				component.registerData("data:genreMnem", genreItem.genreMnem);
				component.registerData("data:genre", genreItem.genre);
				component.registerData("data:title", item.title);
				component.registerData("data:createdBy", item.createdBy);
				component.registerData("data:createdDate", item.createdDate);
				component.registerData("data:storyDropdownRows", storyVersionRows);

				component.initializeEventRegistry();
				component.registerEvent("func:renderViewStory", "story.renderViewStory(this);");
				component.registerEvent("func:toggleStoryVersions", "story.toggleStoryVersions(this);");

				var columnData = component.create("t-story-list-column");

				rowCount++;
				columnCount++;

				if(columnCount == 1) {
					var columnOne = columnData;

					/*
					 * If column count == 1 and rowCount == array count
					 */
					if(rowCount == storyArray.length) {
						component.initializeDataRegistry();
						component.registerData("data:listColumnOne", columnOne);
						component.registerData("data:listColumnTwo", "");

						rowHtml += component.create("t-story-list-row");
					}
				}

				if(columnCount == 2) {
					var columnTwo = columnData;

					/*
					 * If column count == 2 and rowCount == array count
					 */
					if(rowCount == storyArray.length) {
						component.initializeDataRegistry();
						component.registerData("data:listColumnOne", columnOne);
						component.registerData("data:listColumnTwo", columnTwo);

						rowHtml += component.create("t-story-list-row");
					}
				}

			}

			if(storyArray.length <= 0) {
				rowHtml = "";
			}

			component.initializeDataRegistry();
			component.registerData("data:genreMnem", genreItem.genreMnem);
			component.registerData("data:genre", genreItem.genre);
			component.registerData("data:storyRows", rowHtml);

			component.initializeEventRegistry();
			component.registerEvent("func:renderCreateNewStory", "story.renderCreateNewStory(this);");

			component.render("t-story-list", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderStoryList(): " + err);
		}
		finally {}
	},

	renderStoryVersionList: function(storyArray, storyId) {

		var rowHtml = "";

		try {

			var rowCount = 0;

			for(var i=0; i<storyArray.length; i++) {

				var item = storyArray[i];

				if(item.originalStoryId == storyId) {

					rowCount++;

					component.initializeDataRegistry();
					component.registerData("data:createdBy", item.createdBy);
					component.registerData("data:createdDate", item.createdDate);

					component.initializeEventRegistry();
					component.registerEvent("func:renderViewStory", "story.renderViewStory(this);");

					rowHtml += component.create("t-story-dropdown-row");
				}

				/* if no versions created then show a message with link to create new version */
				if(rowCount == 0) {
					rowHtml = component.create("t-story-dropdown-no-versions");
				}

			}
		}
		catch(err) {
			console.log("renderStoryVersionList(): " + err);
		}
		finally {}

		return rowHtml;
	},

	getStoryItem: function(storyId) {

		var storyItem = {};

		try {
			var storyArray = appData.get("storyArray");

			if(storyArray.length > 0) {

				for(var i=0; i<storyArray.length; i++) {

					var item = storyArray[i];

					if(storyId == item.storyId) {

						var decodeImageBase64 = decodeURIComponent(item.imageBase64);

						storyItem.storyId = item.storyId;
						storyItem.title = item.title;
						storyItem.content = item.content;
						storyItem.createdBy = item.createdBy;
						storyItem.createdDate = item.createdDate;
						storyItem.updatedDate = item.updatedDate;
						storyItem.originalStoryId = item.originalStoryId;
						storyItem.ancestorStoryIdList = item.ancestorStoryIdList;
						storyItem.imageBase64 = decodeImageBase64;

						break;
					}
				}
			}
		}
		catch(err) {
			console.log("getStoryItem(): " + err);
		}
		finally {}

		return storyItem;
	},

	getStoryItemContent: function(ancestorStoryIdList, content) {

		var ancestorContent = "";

		try {
			if(ancestorStoryIdList == "") {
				ancestorContent = content;

			} else {
				var ancestorStoryIdArray = string.split(',');

				for(var i=0; i<ancestorStoryIdArray.length; i++) {

					var ancestorStoryId = ancestorStoryIdArray[i];

					storyItem = story.getStoryItem(anscestorStoryId);

					// Get the content row template
					storyItem.content = item.content;
					storyItem.createdBy = item.createdBy;
					storyItem.createdDate = item.createdDate;

					// Substitute all variables

					// Concatenate to contentHtml
				}
			}
		}
		catch(err) {
			console.log("getStoryItemContent(): " + err);
		}
		finally {}

		return content;
	},

	renderCreateNewStory: function(element) {

		try {
			var genreMnem = element.getAttribute("data-genre-mnem");

			var genreItem = story.getGenreItem(genreMnem);

			component.initializeDataRegistry();
			component.registerData("data:genre", genreItem.genre);

			component.initializeEventRegistry();
			component.registerEvent("func:toggleBold", "format.toggleBold(event,this);");
			component.registerEvent("func:toggleItalic", "format.toggleItalic(event,this);");
			component.registerEvent("func:toggleUnderline", "format.toggleUnderline(event,this);");
			component.registerEvent("func:createNewStory", "story.createNewStory(this);");

			component.render("t-new-story", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderCreateNewStory(): " + err);
		}
		finally {}
	},

	renderCreateNewStoryVersion: function(element) {

		try {
			component.initializeDataRegistry();
			component.registerData("data:title", appData.get("title"));
			component.registerData("data:genre", appData.get("genre"));

			component.initializeEventRegistry();
			component.registerEvent("func:toggleBold", "format.toggleBold(this);");
			component.registerEvent("func:toggleItalic", "format.toggleItalic(this);");
			component.registerEvent("func:toggleUnderline", "format.toggleUnderline(this)();");
			component.registerEvent("func:createNewStoryVersion", "story.createNewStoryVersion();");

			component.render("t-new-story-version", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderCreateNewStoryVersion(): " + err);
		}
		finally {}
	},

	renderViewStory: function(element) {

		try {
			var genreMnem = element.getAttribute("data-genre-mnem");
			var storyId = element.getAttribute("data-story-id");

			var genreItem = story.getGenreItem(genreMnem);

			var storyItem = story.getStoryItem(storyId);

			component.initializeDataRegistry();
			component.registerData("data:storyId", storyItem.storyId);
			component.registerData("data:title", storyItem.title);
			component.registerData("data:genre", genreItem.genre);

			// ToDo:  Get all ancestor content
			var ancestorStoryId = storyItem.originalStoryId;
			var ancestorStoryIdList = storyItem.ancestorStoryIdList;

			component.registerData("data:content", storyItem.content);

			component.initializeEventRegistry();
			component.registerEvent("func:renderCreateNewStoryVersion", "story.renderCreateNewStoryVersion(this);");

			component.render("t-view-story", "template-content");

			state.saveInitialState("template-content");
		}
		catch(err) {
			console.log("renderViewStory(): " + err);
		}
		finally {}
	},

	createNewStory: function(element){

		try {
			var genreMnem = element.getAttribute("data-genre-mnem");

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

			var inputFields = {
				"genre":appData.get("genre"), 
				"genreMnem":appData.get("genreMnem"), 
				"createdBy":appData.get("userName"), 
				"title":cleanedTitle, 
				"content":cleanedContent,
				"originalStoryId":originalStoryId, 
				"ancestorStoryIdList":ancestorStoryIdList, 
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

					story.renderStoryList();

				} else {
					console.log('Error: ' + xhr.status);
				}
			};

			xhr.onerror = function () {
				console.log("createNewStory(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/wsa/StoryEntry/";
 
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

	createNewStoryVersion: function(element){

		try {
			var genreMnem = element.getAttribute("data-genre-mnem");

			var title = "";
			var comments = document.forms[0].comments.value;

			var content = document.getElementById("content").innerHTML

			if(isEmpty(comments)) {
				component.setText("error", "Tell us your thoughts on why you decided to add your version.");
				return false;
			}

			if(isEmpty(content)) {
				component.setText("error", "Please enter your Version of the Story.");
				return false;
			}

			var cleanedTitle = replaceSpecialChars(title);
			var cleanedComments = replaceSpecialChars(comments);
			var cleanedContent = replaceSpecialChars(content);

			/* New Version of existing Story so get the original ancestor ID */
			var originalStoryId = "0";

			/* New Version of existing Story so append direct ancestor ID to the existing list */
			var ancestorStoryIdList = "";

			var inputFields = {
				"genre":appData.get("genre"), 
				"genreMnem":appData.get("genreMnem"), 
				"createdBy":appData.get("userName"), 
				"title":cleanedTitle, 
				"content":cleanedContent,
				"originalStoryId":originalStoryId, 
				"ancestorStoryIdList":ancestorStoryIdList, 
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
				console.log("createNewStoryVersion(): An error occurred during the transaction");
			};

			var url = "http://localhost:8080/wsa/StoryEntry/";
 
			xhr.open("POST", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send("inputJSON=" + stringJSON);
		}
		catch(err) {
			console.log("createNewStoryVersion(): " + err);
		}
		finally {}
	},

	toggleStoryVersions: function(element) {

		var storyId = element.getAttribute("data-story-id");

		var panelEl = document.getElementById(storyId);

		if(panelEl.style.display == "none" || panelEl.style.display == "") {
			panelEl.style.display = "block";
			panelEl.style.height = "auto";
		} else {
			panelEl.style.height = "0%";
			panelEl.style.display = "none";
		}
	}

}

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
