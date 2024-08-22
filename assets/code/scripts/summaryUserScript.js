let categories = ['toDo', 'inProgress', 'awaitFeedback', 'done'];

function init() {
    renderSummaryStats('', 'greetingName');
    categories.forEach(element => {
        renderSummaryStats(`/addedTasks/${element}`, element);
    });
}


function renderSummaryStats(category = '', id) {
    let userID = checkLoginStatus();
    if (category == '') {
        renderGreeting(`/${userID}`, id)
    } else {
        renderTaskCategoryStats(`/${userID}/${category}`, id);
    }
}

function renderGreeting(taskPath, contentID) {
    fetchTask(taskPath, null, 'GET').then(user => {
        if (user.name) {
            document.getElementById('greeting').innerText = getGreeting() + ',';
            document.getElementById(contentID).innerText = user.name
        } else {
            document.getElementById('greeting').innerText = getGreeting();
            document.getElementById(contentID).innerText = '';
        }
    });
}

async function renderTaskCategoryStats(taskPath, contentID) {
    let task = await fetchTask(taskPath, null, 'GET');
    let taskCount = 0;
    if (task && typeof task === 'object') {
        taskCount = Object.keys(task).length;
    }
    if (taskCount == 0) {
        document.getElementById(contentID).innerText = taskCount;
        document.getElementById('totalAmountOfTasks').innerText = '0';
    } else {
        incrementalDisplay(taskCount, contentID)
    }
    setTimeout(() => { calculateTotalTaskCount() }, (taskCount * 60))
}

function calculateTotalTaskCount() {
    let taskCount = 0;
    categories.forEach(element => {
        let count = Number(document.getElementById(element).innerText);
        taskCount += count;
    });
    incrementalDisplay(taskCount, 'totalAmountOfTasks')
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