/**
 * Toggles the visibility of the sidebar navigation based on user login status.
 * Displays the sidebar if a user is logged in, otherwise hides it and adjusts the margin of the policy notice.
 */
function showNavbarIfLoggedIn() {
    const sideNavElements = document.querySelectorAll('.sidebarNav');
    const policyLegalNotice = document.querySelector('.policy-legalNotice');
    if (localStorage.getItem('loggedInUserID')) {
        sideNavElements.forEach(element => {
            element.style.display = 'flex';
        });
    } else {
        sideNavElements.forEach(element => {
            element.style.opacity = '0';
        });
        policyLegalNotice.style.margin = '25rem 0 0 0';
    }
}

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

    if (!localStorage.getItem('loggedInUserID')) {
        if (window.innerWidth < 1000) {
            element.style.display = 'none';
        } else {
            element.style.display = 'block';
        }
    }
}

window.onload = checkScreenSize;
window.onresize = checkScreenSize;
window.addEventListener('load', showNavbarIfLoggedIn);
