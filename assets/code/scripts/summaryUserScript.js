let categories = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
let userID = checkLoginStatus();

function init() {
    renderGreeting(`/${userID}`, 'greetingName');
    renderGreeting(`/${userID}`, 'greetingNameOverlay');
    showGreetingForSmallerScreen()
    renderTaskCategoryStats()
    sortByDateStat()
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

function sortByDateStat() {
    let inputContentDate = document.getElementById('taskDate');
    let inputContentTaskAmount = document.getElementById('urgentTaskAmount');
    let inputContentDeadlineText = document.getElementById('upcomingDeadlineText');
    fetchTask(`/${userID}/addedTasks`, null, 'GET').then(tasks => {
        if (tasks) {
            let taskArray = Object.keys(tasks).map(key => tasks[key]);
            let urgentTasks = taskArray.filter(task => task.urgency === 'urgent');
            urgentTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            let mostRecentUrgentTask = urgentTasks[0];
            inputContentDate.textContent = `${formatDate(mostRecentUrgentTask.dueDate)}`;
        }
        else {
            inputContentDate.textContent = "No urgent tasks found.";
            inputContentTaskAmount.textContent = 0;
            inputContentDeadlineText.innerHTML = '';
        }
    });
}

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
            document.getElementById(category).innerText = '0';
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

function showGreetingForSmallerScreen() {
    let element = document.getElementById('greetingResponsive');
    let greetingElement = document.getElementById('greetingTerm');
    greetingElement.innerText = getGreeting() + ',';
    if (window.innerWidth < 1340) {
        element.style.display = 'flex';
        setTimeout(() => {
            element.classList.add('show');
            setTimeout(() => {
                element.classList.remove('show');
                setTimeout(() => {
                    element.style.display = 'none';
                }, 1000);
            }, 3000);
        }, 10);
    }
}

window.addEventListener('load', init);
window.addEventListener('load', checkLoginStatus)
window.addEventListener('load', setProfileCircleInitials);