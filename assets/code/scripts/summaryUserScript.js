let categories = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
let userID = checkLoginStatus();

function init() {
    renderGreeting(`/${userID}`, 'greetingName');
    renderTaskCategoryStats()
    // sortByDateStat()
}

function renderGreeting(taskPath, contentID) {
    fetchTask(taskPath, null, 'GET').then(user => {
        if (user) {
            document.getElementById('greeting').innerText = getGreeting() + ',';
            document.getElementById(contentID).innerText = user.name;
        } if (userID == 'guestUser') {
            document.getElementById('greeting').innerText = getGreeting();
            document.getElementById(contentID).innerText = '';
        }
    });
}

// function sortByDateStat() {
//     let dateArray = [];
//     let inputContentDate = document.getElementById('taskDate');
//     let inputContentUrgency = document.getElementById('dueDateTaskUrgency');
//     let urgencyImg = document.getElementById('urgencyIcon');
//     let urgentTaskContainer = document.getElementById('urgentTaskContainer');
//     fetchTask(`/${userID}/addedTasks`, null, 'GET').then(tasks => {
//         let keys = Object.keys(tasks);
//         for (let i = 0; i < keys.length; i++) {
//             let task = tasks[keys[i]];
//             dateArray.push(task);
//         }
//         dateArray.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
//         let mostRecentTask = dateArray[0];
//         if (mostRecentTask) {
//             console.log(`Most recent due date: ${mostRecentTask.dueDate}, Urgency: ${mostRecentTask.urgency}`);
//             inputContentDate.textContent = `${mostRecentTask.dueDate}`;
//             inputContentUrgency.textContent = `${mostRecentTask.urgency}`;
//             urgencyImg.innerHTML = generateImage(mostRecentTask.urgency)
//         } else {
//             urgentTaskContainer.textContent = "No tasks found.";
//         }
//     }).catch(error => {
//         console.error("Error fetching tasks:", error);
//     });
// }

async function renderTaskCategoryStats() {
    let taskCount = 0;
    for (let category of categories) {
        try {
            let taskArray = await fetchTask(`/${userID}/addedTasks`, null, 'GET');
            if (taskArray && typeof taskArray === 'object') {
                let count = Object.values(taskArray).filter(task => task.taskCategory === category).length;
                document.getElementById(category).innerText = count;
                incrementalDisplay(count, category)
                taskCount += count;
            } else {
                document.getElementById(category).innerText = '0';
            }
        } catch (error) {
            console.error("Error fetching tasks for category:", category, error);
            document.getElementById(category).innerText = '0'; // Set to 0 on error
        }
    }
    document.getElementById('totalAmountOfTasks').innerText = '0';
    setTimeout(() => {
        incrementalDisplay(taskCount, 'totalAmountOfTasks');
    }, taskCount * 60);
}

function calculateTotalTaskCount() {
    let taskCount = 0;
    categories.forEach(category => {
        let count = Number(document.getElementById(category).innerText);
        taskCount += count;
    });
    incrementalDisplay(taskCount, 'totalAmountOfTasks');
}

function incrementalDisplay(finalCount, elementID) {
    let currentCount = 0;
    let targetElement = document.getElementById(elementID);
    for (let i = 1; i <= finalCount; i++) {
        setTimeout(() => {
            currentCount++;
            targetElement.innerText = currentCount;
        }, i * 60);
    }
}

function getGreeting() {
    let currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
        return "Good morning";
    } else if (currentHour >= 12 && currentHour < 18) {
        return "Good afternoon";
    } else if (currentHour >= 18 && currentHour < 22) {
        return "Good evening";
    } else {
        return "Good night";
    }
}

window.addEventListener('load', init);
window.addEventListener('load', checkLoginStatus)