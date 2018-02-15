/**
 * listeners.js
 * Contains all event listeners for My Drawer.
 * 
 * @author Stan Zajdel
*/

var listener = {

	create: function() {

		document.addEventListener('click', function (event) {

			var elementId = event.target.classList.toString();
console.log(elementId);

			if (elementId.indexOf("id-logo") >= 0) {
				getDrawer();
			}

			if (elementId.indexOf("id-hamburger") >= 0) {
				menu.openHamburger();
			}

			if (elementId.indexOf("id-cross") >= 0) {
				menu.closeHamburger();
			}

			if (elementId.indexOf("id-f-sign-in") >= 0) {
				postSignIn();
			}

			if (elementId.indexOf("id-b-sign-in") >= 0) {
				postSignIn();
			}

			if (elementId.indexOf("id-a-sign-in") >= 0) {
				renderSignIn();
			}

			if (elementId.indexOf("id-b-sign-up") >= 0) {
				renderSignUp();
			}

		}, false);
	}
};
