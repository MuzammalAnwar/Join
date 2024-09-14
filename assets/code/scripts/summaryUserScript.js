let categories = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
let userID = checkLoginStatus();

/**
 * Initializes the application by rendering greeting, task stats, and adjusting UI for screen size.
 */
function init() {
    renderGreeting(`/${userID}`, 'greetingName');
    renderGreeting(`/${userID}`, 'greetingNameOverlay');
    showGreetingForSmallerScreen();
    renderTaskCategoryStats();
    renderTotalAmountofUrgentTasks()
    sortByDateStat();
}

/**
 * Renders a greeting message for the user.
 *
 * @param {string} taskPath - The path to fetch user data.
 * @param {string} contentID - The ID of the element to update with the user's name.
 */
function renderGreeting(taskPath, contentID) {
    fetchTask(taskPath, null, 'GET').then(user => {
        const greetingElement = document.getElementById('greeting');
        const contentElement = document.getElementById(contentID);
        if (user) {
            greetingElement.innerText = getGreeting() + ',';
            contentElement.innerText = user.name;
        } else if (userID === 'guestUser') {
            greetingElement.innerText = getGreeting();
            contentElement.innerText = '';
        }
    });
}

/**
 * Updates the date and count of urgent tasks in the UI.
 */
function sortByDateStat() {
    const inputContentDate = document.getElementById('taskDate');
    fetchTask(`/${userID}/addedTasks`, null, 'GET').then(tasks => {
        if (tasks) {
            const taskArray = Object.values(tasks);
            const urgentTasks = taskArray.filter(task => task.urgency === 'urgent')
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            const mostRecentUrgentTask = urgentTasks[0];
            inputContentDate.textContent = mostRecentUrgentTask ? formatDate(mostRecentUrgentTask.dueDate) : "No urgent tasks found.";
        } else {
            inputContentDate.textContent = "No urgent tasks found.";
        }
    });
}

/**
 * Renders task category statistics and total task count.
 */
async function renderTaskCategoryStats() {
    let taskCount = 0;
    for (const category of categories) {
        try {
            let tasks = await fetchTask(`/${userID}/addedTasks`, null, 'GET');
            if (tasks) {
                let count = Object.values(tasks).filter(task => task.taskCategory === category).length;
                document.getElementById(category).innerText = count;
                incrementalDisplay(count, category);
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
    setTimeout(() => incrementalDisplay(taskCount, 'totalAmountOfTasks'), taskCount * 60);
}

/**
 * Renders the total amount of urgent tasks.
 */
async function renderTotalAmountofUrgentTasks() {
    let inputContent = document.getElementById('urgentTaskAmount');
    let urgentTaskCount = 0;
    let tasks = await fetchTask(`/${userID}/addedTasks`, null, 'GET');
    if (typeof tasks === 'object' && tasks !== null) {
        Object.values(tasks).forEach((task) => {
            if (task.urgency == 'urgent') {
                urgentTaskCount++;
            }
        });
    }
    inputContent.innerText = urgentTaskCount;
}


/**
 * Calculates and updates the total task count.
 */
function calculateTotalTaskCount() {
    let taskCount = categories.reduce((total, category) =>
        total + Number(document.getElementById(category).innerText), 0);
    incrementalDisplay(taskCount, 'totalAmountOfTasks');
}

/**
 * Incrementally displays a count with animation.
 *
 * @param {number} finalCount - The final count to display.
 * @param {string} elementID - The ID of the element to update.
 */
function incrementalDisplay(finalCount, elementID) {
    let currentCount = 0;
    let targetElement = document.getElementById(elementID);
    for (let i = 1; i <= finalCount; i++) {
        setTimeout(() => targetElement.innerText = ++currentCount, i * 60);
    }
}

/**
 * Returns a greeting message based on the current time.
 * 
 * @returns {string} - The greeting message.
 */
function getGreeting() {
    let hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 18) return "Good afternoon";
    if (hour >= 18 && hour < 22) return "Good evening";
    return "Good night";
}

/**
 * Shows a greeting message on smaller screens.
 */
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
                setTimeout(() => element.style.display = 'none', 1000);
            }, 3000);
        }, 10);
    }
}

window.addEventListener('load', init);
window.addEventListener('load', checkLoginStatus)
window.addEventListener('load', setProfileCircleInitials);