function showNavbarIfLoggedIn() {
    const sideNavElements = document.querySelectorAll('.sidebarNav');

    if (localStorage.getItem('loggedInUserID')) {
        // User is logged in, show the sidebar by setting display to flex
        sideNavElements.forEach(element => {
            element.style.display = 'flex';
        });
    } else {
        // User is not logged in, hide the sidebar by setting display to none
        sideNavElements.forEach(element => {
            element.style.display = 'none';
        });
    }
}

function hideProfileCircleinHeader() {
    const sideNavElements = document.querySelectorAll('.headerProfile');
    if (localStorage.getItem('loggedInUserID')) {
        // User is logged in, show the sidebar by setting display to flex
        sideNavElements.forEach(element => {
            element.style.display = 'flex';
        });
    } else {
        // User is not logged in, hide the sidebar by setting display to none
        sideNavElements.forEach(element => {
            element.style.display = 'none';
        });
    }
}

window.addEventListener('load', hideProfileCircleinHeader);
window.addEventListener('load', showNavbarIfLoggedIn);