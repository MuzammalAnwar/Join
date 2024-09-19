/**
 * Handles the back navigation action based on the user's login status and browser history.
 * Navigates to the previous page in history if available, or redirects to a default page based on login status.
 */
function goBackArrow() {
    if (localStorage.getItem('loggedInUserID')) {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'summery.html';
        }
    } else {
        window.location.href = 'index.html';
    }
}

/**
 * Checks the screen size and toggles the visibility of the navigation bar.
 * Hides the navigation bar on small screens if the user is not logged in.
 */
function checkScreenSize() {
    let element = document.getElementById('navBar');
    if (!element) {
        console.error('navBar-Element nicht gefunden');
        return;  
    }
    let loggedInUserID = localStorage.getItem('loggedInUserID');
    if (!loggedInUserID) {
        if (window.innerWidth < 1000) {
            element.style.display = 'none'; 
        } else {
            element.style.display = 'normal'; 
        }
    }
}

/**
 * Loads the appropriate navigation bar based on the user's login status.
 * 
 * - If the user is logged in (determined by the existence of 'loggedInUserID' in localStorage), 
 *   the full navigation bar from 'navbarTemplate.html' is loaded.
 * - If the user is not logged in, a limited navigation bar from 'navbarPrivacyAndNotice.html' is loaded.
 *
 * The content is dynamically inserted into the HTML element with the ID 'navbarPlaceholder'.
 * 
 * @function
 */
function loadNavbar() {
    let navbarPlaceholder = document.getElementById('navbarPlaceholder');
    if (localStorage.getItem('loggedInUserID')) {
        fetch('./navbarTemplate.html')
            .then(response => response.text())
            .then(data => {
                navbarPlaceholder.innerHTML = data;  
            })
            .catch(error => {
                console.error('Fehler beim Laden von navbarTemplate:', error);
            });
    } else {
        fetch('./navbarPrivacyAndNotice.html')
            .then(response => response.text())
            .then(data => {
                navbarPlaceholder.innerHTML = data;  
            })
            .catch(error => {
                console.error('Fehler beim Laden von navbarPrivacyAndNotice:', error);
            });
    }
}

window.onload = loadNavbar;
window.onresize = checkScreenSize;
