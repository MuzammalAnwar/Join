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

function checkLoginStatus() {
    if (localStorage.getItem('loggedInUserID')) {
        return;
    } else {
        window.location.href = 'loadingSpinner.html';
    }
}