const URL = 'https://join-301-default-rtdb.europe-west1.firebasedatabase.app/users'

function init() {
    // postTask("users/addedTasks/done/tasks/firstTask", task);
    // getTask("users");
}

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
        let response = await fetch(URL + path + '.json', options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let responseData = await response.json();
    } catch (error) {
        console.error('Error putting task:', error);
    } finally {
    }
}


window.addEventListener('load', includeHTML);
window.addEventListener('load', init);