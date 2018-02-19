/**
 * user.js
 * Contains general methods for My Drawer.
 * 
 * @author Stan Zajdel
*/

function renderSignIn() {

	try {
		if(isEmpty(dataObj.collectionName)) {

			var data = {};
			component.render("t-sign-in", "template-content", data);
		}

		menu.reset();
	}
	catch(err) {
		console.log("getSignIn(): " + err);
	}
	finally {}
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

					dataObj.favoriteTraTokens = getFavoriteTraTokens();

					menu.reset();
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
	finally {}
}

function renderSignInError() {

	try {
		var data = {};
		component.render("t-sign-in-error", "template-content", data);

		menu.reset();
	}
	catch(err) {
		console.log("renderSignInError(): " + err);
	}
	finally {}
}

function renderAccountDisabled() {

	try {
		var data = {};
		component.render("t-account-disabled", "template-content", data);

		menu.reset();
	}
	catch(err) {
		console.log("renderAccountDisabled(): " + err);
	}
	finally {}
}

function renderSignUp() {

	try {
		dataObj = {};

		var data = {};
		component.render("t-sign-up", "template-content", data);

		document.body.addEventListener("keydown", function(e) {
			if (e.keyCode === 13) {
				postSignUp();
			}
		});

		menu.reset();
	}
	catch(err) {
		console.log("getSignUp(): " + err);
	}
	finally {}
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
					dataObj.favoriteTraTokens = getFavoriteTraTokens();

					renderDrawer();

					menu.reset();
				} else {
					renderSignUpError(statusMsg);
				}
			} else {
				console.log('Error: ' + xhr.status);
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
	finally {}
}

function renderSignUpError(errorMsg) {

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
}

function getSignOut() {

	try {
		/* Clear dataObj.collectionName */
		dataObj = {};

		dataObj.CollectionName = "";

		var data = {};
		component.render("t-sign-in", "template-content", data);

		menu.reset();
	}
	catch(err) {
		console.log("getSignOut(): " + err);
	}
	finally {}
}
