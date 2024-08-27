let base_URL = `https://join-301-default-rtdb.europe-west1.firebasedatabase.app/users`

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
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error with task operation:', error);
        console.log(base_URL);
    }
}

function generateUniqueKey() {
    return Math.random().toString(36).substring(2, 11);
}

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

function checkLoginStatus() {
    if (localStorage.getItem('loggedInUserID')) {
        return localStorage.getItem('loggedInUserID');
    }
    else {
        window.location.href = 'loadingSpinner.html';
    }
}

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

function formatDate(dateString) {
    let date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function setProfileCircleInitials() {
    let userID = checkLoginStatus();
    let taskPath = `/${userID}`
    fetchTask(taskPath, null, 'GET').then(user => {
        if (userID == 'guestUser') {
            document.getElementById('userMenuButton').innerText = 'G';
        }
        else {
            document.getElementById('userMenuButton').innerText = getInitials(user.name);
        }
    });
}

function getRandomRgbColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256); 
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}