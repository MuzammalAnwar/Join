let categories = [
    { id: 'toDo', element: document.getElementById('categoryToDo'), message: 'No tasks to do' },
    { id: 'inProgress', element: document.getElementById('categoryInProgress'), message: 'No tasks in progress' },
    { id: 'awaitFeedback', element: document.getElementById('categoryAwaitFeedback'), message: 'No tasks awaiting feedback' },
    { id: 'done', element: document.getElementById('categoryDone'), message: 'No tasks done' }
];

function initRender() {
    Promise.all([
        renderTasks('toDo', 'categoryToDo'),
        renderTasks('inProgress', 'categoryInProgress'),
        renderTasks('awaitFeedback', 'categoryAwaitFeedback'),
        renderTasks('done', 'categoryDone')
    ]).then(() => {
        checkIfCategoryHasNoTasks();
    }).catch(error => {
        console.error("Error during initialization:", error);
    });
}

async function renderTasks(category, id) {
    let htmlContent = document.getElementById(id);
    htmlContent.innerHTML = '';
    let taskPath = `/${userID}/addedTasks/`;
    try {
        let taskArray = await fetchTask(taskPath, null, 'GET');
        let filteredTasks = Object.keys(taskArray).filter(taskKey => taskArray[taskKey].taskCategory === category);
        if (filteredTasks.length === 0) {
            htmlContent.innerHTML = `<div class="NoTaskToDo">${returnEqualMsg(category)}</div>`;
        } else {
            filteredTasks.forEach(taskKey_1 => {
                let task = taskArray[taskKey_1];
                console.log(task.assigned);
                htmlContent.innerHTML += /*HTML*/ `
                <div class="task" draggable="true" ondragend="dragend(event)" ondragstart="drag(event)" id="task${taskKey_1}" data-path="${task.path}" onclick="showTallTaskOverlay('${taskKey_1}', '${task.title}', '${task.category}', '${task.urgency}', '${task.dueDate}', '${task.description}', '${task.subtasks}')">
                    <div class="categoryPlacement">
                        <p id="category" class='${returnClass(task.category)}'>${task.category}</p>
                    </div>
                    <div class="taskTitleAndDescription">
                        <p class="title">${task.title}</p>
                        <p class="description">${task.description}</p>
                    </div>
                        ${insertSubtaskBar(taskKey_1, task.subtasks)}
                    <div class="contactsAndUrgencyInfo">
                        ${generateImage(task.urgency)}
                        <div id="contactCircles">${generateContactCircles(task.assigned)}</div>
                    </div>
                </div>
            `;
                initializeProgressBarForTask(taskKey_1);
            });
        }
    } catch (error) {
        console.error(`Error rendering tasks for category ${category}:`, error);
    }
}

function getContactArray(contacts) {
    return contacts ? Object.values(contacts) : [];
}

function generateContactCircle(contact) {
    return `
        <div class="profile-circleSmall" style="background-color: ${getRandomRgbColor()};">
            ${getInitials(contact)}
        </div>
    `;
}

function generateMoreContactsCircle() {
    return `
        <div class="profile-circleSmall more-contacts" style="background-color: #cccccc;">
            ...
        </div>
    `;
}

function generateNoContactsCircle() {
    return `
        <div class="no-contacts">
            N/A
        </div>
    `;
}

function generateContactCircles(contacts) {
    const contactArray = getContactArray(contacts);

    if (contactArray.length === 0) {
        return generateNoContactsCircle();
    }

    let contactHTML = contactArray.slice(0, 4).map(generateContactCircle).join('');

    if (contactArray.length > 4) {
        contactHTML += generateMoreContactsCircle();
    }

    return contactHTML;
}



function updateTaskCategory(taskId, newCategory) {
    let taskElement = document.getElementById(taskId);
    let taskPath = taskElement.dataset.path;
    fetchTask(taskPath, null, 'GET').then(task => {
        task.taskCategory = newCategory;
        fetchTask(taskPath, task, 'PUT');
    }).catch(error => {
        console.error("Error updating task category:", error);
    });
}

function checkIfCategoryHasNoTasks() {
    removePlaceholders()
    categories.forEach(category => {
        if (category.element.children.length === 0) {
            category.element.innerHTML = `<div class="NoTaskToDo">${category.message}</div>`;
        }
    });
}

function removePlaceholders() {
    categories.forEach(category => {
        if (category.element.children.length > 0) {
            let placeholder = category.element.querySelector('.NoTaskToDo');
            if (placeholder) {
                placeholder.remove();
            }
        }
    });
}

function returnEqualMsg(category) {
    let categoryObj = categories.find(cat => cat.id === category);
    if (categoryObj) {
        return categoryObj.message;
    }
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

function insertSubtaskBar(taskId, subtasks) {
    if (!Array.isArray(subtasks) || subtasks.length === 0) {
        return '';
    } else {
        let completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
        return /*HTML*/`
        <div class="progressSection">
            <div class="progress-container">
                <div id="progress-bar-${taskId}" class="progress-bar" style="width: ${(completedSubtasks / subtasks.length) * 100}%"></div>
            </div>
            <div class="progress-text" id="progress-text-${taskId}">${completedSubtasks}/${subtasks.length} Subtasks</div>
        </div>
        `;
    }
}

function initializeProgressBarForTask(taskId) {
    let progressBar = document.getElementById(`progress-bar-${taskId}`);
    let progressText = document.getElementById(`progress-text-${taskId}`);

    let subTaskStates = JSON.parse(localStorage.getItem('subTasks_' + taskId)) || [];
    let totalSubtasks = subTaskStates.length;
    let completedSubtasks = subTaskStates.filter(state => state).length;

    if (progressBar && progressText && totalSubtasks > 0) {
        let progressPercentage = (completedSubtasks / totalSubtasks) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    }
}

function updateProgressBarForTask(taskId, completedSubtasks, totalSubtasks) {
    let progressPercentage = (completedSubtasks / totalSubtasks) * 100;
    let progressBar = document.getElementById(`progress-bar-${taskId}`);
    let progressText = document.getElementById(`progress-text-${taskId}`);

    if (progressBar && progressText && totalSubtasks > 0) {
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    }
}

function filterTasks() {
    let searchTerm = document.getElementById('userInput').value.toLowerCase();
    let tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        let title = task.querySelector('.title').textContent.toLowerCase();
        let description = task.querySelector('.description').textContent.toLowerCase();
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            task.style.display = 'block'; 
        } else {
            task.style.display = 'none'; 
        }
    });
}
document.getElementById('userInput').addEventListener('input', filterTasks);

window.addEventListener('load', includeHTML);
window.addEventListener('load', initRender);
window.addEventListener('load', setProfileCircleInitials);