function initRender() {
    renderTasks('toDo', 'categoryToDo');
    // renderTasks('InProgress', 'categoryInProgress');
    // renderTasks('AwaitFeedback', 'categoryAwaitFeedback');
    // renderTasks('Done', 'categoryDone');
}

function renderTasks(category, id) {
    let htmlContent = document.getElementById(id)
    htmlContent.innerHTML = '';
    fetchTask(`/addedTasks/${category}/`, null, 'GET').then(taskArray => {
        let keys = Object.keys(taskArray);
        for (let i = 0; i < keys.length; i++) {
            let task = taskArray[keys[i]];
            htmlContent.innerHTML += `
                <div class="task">
                    <p id="category" class='${returnClass(task.category)}'>${task.category}</p>
                    <div class="taskTitleAndDescription">
                        <p class="title">${task.title}</p>
                        <p class="description">${task.description}</p>
                    </div>
                    ${insertSubtaskBar(task.subtasks)}
                    <div>
                        ${generateImage(task.urgency)}
                    </div>
                </div>
            `;
        }
    });
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

function returnClass(category) {
    if (category === 'Technical Task') {
        return 'categoryTechnicalTask';
    } else if (category === 'User Story') {
        return 'categoryUserStory';
    } else {
        return '';
    }
}

function insertSubtaskBar(subtasks) {
    if (!Array.isArray(subtasks) || subtasks.length === 0) {
        return '';
    } else {
        let completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
        return /*HTML*/`
        <div class="progressSection">
            <div class="progress-container">
                <div id="progress-bar" class="progress-bar" style="width: ${(completedSubtasks / subtasks.length) * 100}%"></div>
            </div>
            <div id="progress-text">${completedSubtasks}/${subtasks.length} Subtasks</div>
        </div>
        `;
    }
}

window.addEventListener('load', includeHTML);
window.addEventListener('load', initRender)
