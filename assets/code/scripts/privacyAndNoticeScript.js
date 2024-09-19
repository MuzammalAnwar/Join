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
 * Determines which navigation bar to load based on the user's login status.
 * Calls the appropriate function to load the full or limited navbar.
 */
function checkLoginStatus() {
    if (localStorage.getItem('loggedInUserID')) {
        loadFullNavbar();
    } else {
        loadLimitedNavbar();
    }
}

/**
 * Loads the full navigation bar from 'navbarTemplate.html' and makes it visible.
 */
function loadFullNavbar() {
    let navbarPlaceholder = document.getElementById('navbarPlaceholder');
    fetch('./navbarTemplate.html')
        .then(response => response.text())
        .then(data => {
            navbarPlaceholder.innerHTML = data;
            showNavbar();
        })
        .catch(error => {
            console.error('Error loading navbarTemplate:', error);
        });
}

/**
 * Loads the limited navigation bar from 'navbarPrivacyAndNotice.html' and makes it visible.
 */
function loadLimitedNavbar() {
    let navbarPlaceholder = document.getElementById('navbarPlaceholder');
    
    fetch('./navbarPrivacyAndNotice.html')
        .then(response => response.text())
        .then(data => {
            navbarPlaceholder.innerHTML = data;
            showNavbar();
        })
        .catch(error => {
            console.error('Error loading navbarPrivacyAndNotice:', error);
        });
}

/**
 * Makes the navbar visible by setting its opacity to 1.
 */
function showNavbar() {
    let navbarPlaceholder = document.getElementById('navbarPlaceholder');
    navbarPlaceholder.style.opacity = '1';
}

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

window.onresize = checkScreenSize;
