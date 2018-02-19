/**
 * listeners.js
 * Contains all event listeners for My Drawer.
 * 
 * @author Stan Zajdel
*/

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
				tray.list();
			}

			if(elementId.indexOf("e-render-add-tray") >= 0) {
				tray.renderAddTray();
			}

			if(elementId.indexOf("e-render-edit-tray") >= 0) {
				var data = event.target.id.toString();
				tray.renderEditTray(data);
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
