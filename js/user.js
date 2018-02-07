/**
 * user.js
 * Contains general methods for My Drawer.
 * 
 * @author Stan Zajdel
*/

function renderSignIn() {

	try {
		if(isEmpty(gblStateObj.mbrSkToken)) {
			var t = document.getElementById("t-sign-in");
			var tHtml = t.innerHTML;

			document.getElementById('template-content').innerHTML = tHtml;

			document.body.addEventListener("keydown", function(e) {
				if (e.keyCode === 13) {
					postSignIn();
				}
			});
		}

		resetMenu();
	}
	catch(err) {
		console.log("getSignIn(): " + err);
	}
	finally {

	}
}

function postSignIn(){

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

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					var data = JSON.parse(xhr.responseText);

					var statusInd = data.statusInd;
					var statusMsg = data.statusMsg;

					gblStateObj.collectionName = data.collectionName;
					gblStateObj.userName = data.userName;
					gblStateObj.trayJson = data.trayJson;
					gblStateObj.drawerJson = data.drawerJson;

					console.log("statusInd: " + statusInd);

					if(statusInd == "A") {

						gblStateObj.mbrTraySelected = "in your drawer";

						gblStateObj.favoriteTraTokens = getFavoriteTraTokens();

						resetMenu();
						renderDrawer();

					} else if(statusInd == "D") {
						renderAccountDisabled();
					}
					else {
						renderSignInError();
					}

 				} else {
					console.log('postSignin(): ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("postSignIn(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/Signin/";

		xhr.open("POST", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send("inputJSON=" + stringJSON);
	}
	catch(err) {
		console.log("postSignIn(): " + err);
	}
	finally {

	}
}

function renderSignInError() {

	try {
		var t = document.getElementById("t-signin-error");

		var tHtml = t.innerHTML;

		document.getElementById('template-content').innerHTML = tHtml;

		resetMenu();
	}
	catch(err) {
		console.log("renderSignInError(): " + err);
	}
	finally {

	}
}

function renderAccountDisabled() {

	try {
		var t = document.getElementById("t-account-disabled");

		var tHtml = t.innerHTML;

		document.getElementById('template-content').innerHTML = tHtml;

		resetMenu();
	}
	catch(err) {
		console.log("renderAccountDisabled(): " + err);
	}
	finally {

	}
}

function renderSignUp() {

	try {
		gblStateObj = {};

		var ts = document.getElementById("t-sign-up");
		var tsHtml = ts.innerHTML;

		document.getElementById('template-content').innerHTML = tsHtml;

		document.body.addEventListener("keydown", function(e) {
			if (e.keyCode === 13) {
				postSignUp();
			}
		});

		resetMenu();
	}
	catch(err) {
		console.log("getSignUp(): " + err);
	}
	finally {

	}
}

function postSignUp(){

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

		if(name.length > 50) {
			document.getElementById('error').innerHTML = 'Your Name cannot be more that 50 characters.';
			return false;
		}

		var inputFields = {"email":email, "password":password, "name":name};

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

					var statusInd = data.statusInd;
					var statusMsg = data.statusMsg;

					gblStateObj.collectionName = data.collectionName;
					gblStateObj.userName = data.userName;
					gblStateObj.trayJson = data.trayJson;
					gblStateObj.drawerJson = data.drawerJson;

					if(statusInd == "A") {

						gblStateObj.mbrTraySelected = "in your drawer";

						gblStateObj.favoriteTraTokens = getFavoriteTraTokens();

						renderDrawer();

						resetMenu();

					} else {
						renderSignUpError(statusMsg);
					}
				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("postSignUp(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/Signup/";

		xhr.open("POST", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		xhr.send("inputJSON=" + stringJSON);
	}
	catch(err) {
		document.getElementById('error').innerHTML = "An error has occured in your account signup. Please try again.";
		console.log("postSignUp(): " + err);
	}
	finally {

	}
}

function renderSignUpError(errorMsg) {

	try {
		var t = document.getElementById("t-signup-error");

		var tHtml = t.innerHTML;
		tHtmlReplace = tHtml.replace(/{{errorMsg}}/g, errorMsg);

		document.getElementById('template-content').innerHTML = tHtmlReplace;

		resetMenu();
	}
	catch(err) {
		console.log("renderSignUpError(): " + err);
	}
	finally {

	}
}

function getSignOut() {

	try {
		/* Clear gblStateObj.mbrSkToken */
		gblStateObj = {};

		gblStateObj.mbrSkToken = "";

		var ts = document.getElementById("t-sign-in");
		var tsHtml = ts.innerHTML;

		document.getElementById('template-content').innerHTML = tsHtml;

		resetMenu();
	}
	catch(err) {
		console.log("getSignOut(): " + err);
	}
	finally {

	}
}

function renderContactUs() {

	try {
		var t = document.getElementById("t-contact-us");
		var tHtml = t.innerHTML;

		gblStateObj.origTemplateContent = document.getElementById('template-content').innerHTML;

		document.getElementById('template-content').innerHTML = tHtml;

		resetMenu();
	}
	catch(err) {
		console.log("renderContactUs(): " + err);
	}
	finally {

	}
}

function postContactUs() {

	try {
		var msgFrom = document.getElementById("msgFrom").value;

		var msgSubjEl = document.getElementById("msgSubj");
		var msgSubj = msgSubjEl.options[msgSubjEl.selectedIndex].text;

		var msg = document.getElementById("msg").value;

		if(isEmpty(msgFrom)) {
			document.getElementById('error').innerHTML = 'Your Email is required.';
			return false;
		}

		if(!isValidEmail(msgFrom)) {
			document.getElementById('error').innerHTML = 'You have entered an invalid Email.';
			return false;
		}

		if(isEmpty(msgSubj)) {
			document.getElementById('error').innerHTML = ' The Subject is required.';
			return false;
		}

		if(isEmpty(msg)) {
			document.getElementById('error').innerHTML = 'The Message is required.';
			return false;
		}

		var inputFields = {"msgFrom":msgFrom, "msgSubj":msgSubj, "msg":msg};

		var inputJSON = {};
		inputJSON.inputArgs = inputFields;
	
		var stringJSON = JSON.stringify(inputJSON);

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.onreadystatechange = function () {

			var DONE = 4;
			var OK = 200;

			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {

					resetMenu();

					document.getElementById('template-content').innerHTML = gblStateObj.origTemplateContent;

				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		};

		xhr.onerror = function () {
			console.log("postContactUs(): An error occurred during the transaction");
		};

		var url = "http://localhost:8080/mydrawer/ContactUs/";

		xhr.open("POST", url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send("inputJSON=" + stringJSON);
	}
	catch(err) {
		console.log("postContactUs(): " + err);
		document.getElementById('template-content').innerHTML = gblStateObj.origTemplateContent;
	}
	finally {

	}
}

function renderAbout() {

	try {
		var t = document.getElementById("t-about");
		var tHtml = t.innerHTML;

		gblStateObj.origTemplateContent = document.getElementById('template-content').innerHTML;

		document.getElementById('template-content').innerHTML = tHtml;

		resetMenu();
	}
	catch(err) {
		console.log("renderAbout(): " + err);
	}
	finally {

	}
}
