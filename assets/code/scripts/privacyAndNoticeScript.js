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
            element.style.display = 'block'; 
        }
    }
}

/**
 * Loads the appropriate navigation bar based on the user's login status.
 * - By default, the limited navbar (Privacy and Notice) is already shown.
 * - If the user is logged in, the function replaces the limited navbar with the full one.
 */
function checkLoginStatus() {
    // If user is logged in, load the full navbar
    if (localStorage.getItem('loggedInUserID')) {
        loadFullNavbar();
    }
}

/**
 * Loads the full navbar and replaces the current (limited) navbar.
 */
function loadFullNavbar() {
    let navbarPlaceholder = document.getElementById('navbarPlaceholder');
    
    fetch('./navbarTemplate.html')
        .then(response => response.text())
        .then(data => {
            navbarPlaceholder.innerHTML = data;  // Replace the limited navbar with full navbar
        })
        .catch(error => {
            console.error('Error loading full navbar:', error);
        });
}

// Ensure the function runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();  // Check login status and possibly replace the navbar
});



window.onresize = checkScreenSize;
