const URL = 'https://join-301-default-rtdb.europe-west1.firebasedatabase.app/users'
let task = {
    "title": "Task 1",
    "description": "Create JSON",
    "assignedTo": {},
    "dueDate": {
        "day": 1,
        "month": 12,
        "year": 2024
    },
    "priority": "urgent",
    "category": "Technical Task",
    "subtasks": {}
}

function init() {
    postTask("/addedTasks/done", task);
}

async function postTask(path = "", data) {
    try {
        let response = await fetch(URL + path, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let responseData = await response.json();
        console.log('Response Data:', responseData);
    } catch (error) {
        console.error('Error putting task:', error);
    } finally {
        console.log('Request completed');
    }
}

window.addEventListener('load', includeHTML);
window.addEventListener('load', init);