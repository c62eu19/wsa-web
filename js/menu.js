/**
 * menu.js
 * Contains general methods for My Drawer.
 * 
 * @author Stan Zajdel
*/

function toggleNav() {

	try {       
		var navContent = document.getElementById("nav-content");     
		var mobileNavContainer = document.getElementById("mobile-nav-container");
		var mobileNavContent = document.getElementById("mobile-nav-content");

		if(classListContains(mobileNavContent, "nav-collapse")) {

			/* Expand Mobile Nav */             
			mobileNavContent.innerHTML = navContent.innerHTML;             

			classListRemove(mobileNavContent, "nav-collapse");
			classListAdd(mobileNavContainer, "nav-expanded");      

		} else {
			/* Collapse Mobile Nav */
			classListRemove(mobileNavContainer, "nav-expanded");              
			classListAdd(mobileNavContent, "nav-collapse");             
		}             
	} catch(e) {
		console.log(e);
	}
}

function classListAdd(element, className) {

	try {
		if(element.classList) {
			element.classList.add(className);

		} else {
			var classList = element.className.split(" ");

			if(classList.indexOf(className) == -1) {
				element.className += " " + className;
			}
		}
	} catch(e) {
		console.log(e);
	}
}

function classListRemove(element, className) {

	try {
		if(element.classList) {
			element.classList.remove(className);

		} else {    
			var classList = element.className.split(" ");
			var classIdx = classList.indexOf(className);

			if(classIdx > -1) {
				classList.splice(classIdx, 1);
				element.className = classList.join(" ");
			}             
		}
	} catch(e) {
		console.log(e);
	}
}

function classListContains(element, className) {

	try {
		if(element.classList) {
			return element.classList.contains(className);
		} else {
			return element.className.indexOf(className) == -1 ? false : true;
		}
	} catch(e) {         
		console.log(e);
		return false;
	}
}
