function init() {
    renderSummaryStats('', 'greetingName');
    renderSummaryStats('/addedTasks/toDo', 'taskToDo');
    renderSummaryStats('/addedTasks/inProgress', 'inProgress');
    renderSummaryStats('/addedTasks/awaitingFeedback', 'awaitingFeedback');
    renderSummaryStats('/addedTasks/done', 'doneTasks');
    renderTotalAmountOfBoardTasks()
}

function renderSummaryStats(category = '', id) {
    let userID = localStorage.getItem('loggedInUserID');
    if (category == '') {
        renderNonTaskStats(`/${userID}`, id)
    } else {
        renderTaskCategoryStats(`/${userID}/${category}`, id);
    }
}

function renderNonTaskStats(taskPath, contentID) {
    fetchTask(taskPath, null, 'GET').then(user => {
        document.getElementById(contentID).innerText = user.name
    });
}

function renderTaskCategoryStats(taskPath, contentID) {
    fetchTask(taskPath, null, 'GET').then(task => {
        if (!task) {
            return document.getElementById(contentID).innerText = 0;
        }
        let keys = Object.keys(task);
        return document.getElementById(contentID).innerText = keys.length
    });
}

function renderTotalAmountOfBoardTasks() {

}

window.addEventListener('load', init);
window.addEventListener('load', checkLoginStatus)