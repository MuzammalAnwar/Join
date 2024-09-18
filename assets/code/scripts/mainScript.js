let base_URL = `https://join-301-default-rtdb.europe-west1.firebasedatabase.app/users`

/**
 * Fetches task data from the specified path using the given HTTP method and data.
 *
 * @param {string} [path=""] - The API endpoint path.
 * @param {Object|null} [data=null] - The data to send for POST or PUT requests.
 * @param {string} [method="GET"] - The HTTP method to use ("GET", "POST", etc.).
 * @returns {Promise<Object>} - The JSON response from the server.
 */
async function fetchTask(path = "", data = null, method = "GET") {
    try {
        let options = {
            method: method
        };
        if (method !== "GET" && data) {
            options.headers = {
                'Content-Type': 'application/json'
            };
            options.body = JSON.stringify(data);
        }
        let response = await fetch(base_URL + path + '.json', options);
        return await response.json();
    } catch (error) {
        console.error('Error with task operation:', error);
    }
}

/**
 * Generates a unique key using a random string.
 *
 * @returns {string} - A random unique key.
 */
function generateUniqueKey() {
    return Math.random().toString(36).substring(2, 11);
}

/**
 * Generates an image tag based on the urgency level of a task.
 *
 * @param {string} urgency - The urgency level ("none", "urgent", "medium", "low").
 * @returns {string} - HTML string representing an image element.
 */
function generateImage(urgency) {
    if (urgency === 'none') {
        return '';
    } else if (urgency === 'urgent') {
        return /*html*/ `
            <img class="urgentIcon" src='../../img/urgentIcon.png' alt="">
        `;
    } else if (urgency === 'medium') {
        return /*html*/ `
            <img class="mediumIcon" src='../../img/mediumIcon.png' alt="">
        `;
    } else if (urgency === 'low') {
        return /*html*/ `
            <img class="lowIcon" src='../../img/lowIcon.png' alt="">
        `;
    }
}

/**
 * Checks if the user is logged in by looking for a stored user ID in localStorage.
 * Redirects to the login page if not logged in.
 *
 * @returns {string|null} - The logged-in user ID, or redirects if not logged in.
 */
function checkLoginStatus() {
    if (localStorage.getItem('loggedInUserID')) {
        return localStorage.getItem('loggedInUserID');
    } else {
        window.location.href = 'loadingSpinner.html';
    }
}

/**
 * Gets the initials of a user's name.
 *
 * @param {string} name - The full name of the user.
 * @returns {string} - The initials of the user.
 */
function getInitials(name) {
    let names = name.trim().split(' ');
    let initials = '';
    if (names.length > 0) {
        initials += names[0].charAt(0);
    }

    if (names.length > 1) {
        initials += names[names.length - 1].charAt(0);
    }
    return initials.toUpperCase();
}

/**
 * Formats a date string into a readable format (e.g., "September 10, 2024").
 *
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date.
 */
function formatDate(dateString) {
    let date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Sets the profile circle's initials based on the logged-in user's name.
 * Fetches the user's data and updates the UI accordingly.
 */
function setProfileCircleInitials() {
    let userID = checkLoginStatus();
    let taskPath = `/${userID}`;
    fetchTask(taskPath, null, 'GET').then(user => {
        if (userID == 'guestUser') {
            document.getElementById('userMenuButton').innerText = 'G';
        } else {
            document.getElementById('userMenuButton').innerText = getInitials(user.name);
        }
    });
}

/**
 * Generates a random RGB color.
 *
 * @returns {string} - A random RGB color string.
 */
function getRandomRgbColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Notifies the user of failed authentication by marking input fields and resetting placeholders.
 *
 * @param {string} inputField1Marker - The ID of the first input field marker.
 * @param {string} inputField2Marker - The ID of the second input field marker.
 * @param {HTMLElement} Field1ValueResetID - The first field element to reset.
 * @param {HTMLElement} Field2ValueResetID - The second field element to reset.
 * @param {string} msg1 - The error message for the first field.
 * @param {string} msg2 - The error message for the second field.
 * @param {string} resetPlaceholder1 - The placeholder to reset after the error for the first field.
 * @param {string} resetPlaceholder2 - The placeholder to reset after the error for the second field.
 */
function notifyFailedAuthentication(inputField1Marker, inputField2Marker, Field1ValueResetID, Field2ValueResetID, msg1, msg2, resetPlaceholder1, resetPlaceholder2) {
    document.getElementById(inputField1Marker).classList.add('input-error');
    document.getElementById(inputField2Marker).classList.add('input-error');
    Field1ValueResetID.placeholder = msg1;
    Field2ValueResetID.placeholder = msg2;
    setTimeout(() => {
        document.getElementById(inputField1Marker).classList.remove('input-error');
        document.getElementById(inputField2Marker).classList.remove('input-error');
        Field1ValueResetID.placeholder = resetPlaceholder1;
        Field2ValueResetID.placeholder = resetPlaceholder2;
    }, 2000);
    Field1ValueResetID.value = '';
    Field2ValueResetID.value = '';
}

/**
 * Toggles the visibility of the user menu.
 */
function toggleUserMenu() {
    let menu = document.getElementById('userMenu');
    menu.classList.toggle('d_none');
}

/**
 * Prevents event bubbling when clicking on an inner div.
 *
 * @param {MouseEvent} event - The click event.
 */
function handleInnerDivClick(event) {
    event.stopPropagation();
}

/**
 * Sets the category in the dropdown menu for adding tasks
 * @param {string} category 
 */
function setCategory(category) {
    localStorage.setItem('categoryOverlayForAddTask', category);
}

document.addEventListener('DOMContentLoaded', setCategory(document.getElementById('category').value));