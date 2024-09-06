

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
        document.querySelector('.policy-legalNotice').style.margin = '25rem 0 0 0';
    }
}

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

// Check the screen width when the page loads
function checkScreenSize() {
    let element = document.getElementById('navBar');
    if (!localStorage.getItem('loggedInUserID')) {
        if (window.innerWidth < 1000) {
            // Hide the element if screen width is less than 600px
            element.style.display = 'none';
        } else {
            // Show the element for larger screens
            element.style.display = 'block';
        }
    }
}

// Call the function on page load
window.onload = checkScreenSize;
window.onresize = checkScreenSize;
window.addEventListener('load', showNavbarIfLoggedIn);
