// let userID = checkLoginStatus();
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
        const taskArray = await fetchTask(taskPath, null, 'GET');
        let filteredTasks = Object.keys(taskArray).filter(taskKey => taskArray[taskKey].taskCategory === category);
        if (filteredTasks.length === 0) {
            htmlContent.innerHTML = `<div class="NoTaskToDo">${returnEqualMsg(category)}</div>`;
        } else {
            filteredTasks.forEach(taskKey_1 => {
                let task = taskArray[taskKey_1];
                htmlContent.innerHTML += /*HTML*/ `
                <div class="task" draggable="true" ondragend="dragend(event)" ondragstart="drag(event)" id="task${taskKey_1}" data-path="${task.path}" onclick="showTallTaskOverlay('${task.title}', '${task.category}', '${task.urgency}', '${task["due-date"]}', '${task.description}')">
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
            });
        }
    } catch (error) {
        console.error(`Error rendering tasks for category ${category}:`, error);
    }
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

function showOverlay() {
    let overlay = document.getElementById('taskOverlay');
    overlay.style.display = 'flex';
    overlay.querySelector('.overlay').classList.remove('slide-out');
    overlay.querySelector('.overlay').classList.add('slide-in');
}

function hideOverlay() {
    let overlay = document.getElementById('taskOverlay');
    overlay.querySelector('.overlay').classList.remove('slide-in');
    overlay.querySelector('.overlay').classList.add('slide-out');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}

function showTallTaskOverlay(title, category, urgency, dueDate, description) {
    let overlay = document.getElementById('tall_task_overlay_background');
    overlay.style.display = 'flex';

    let tallOverlay = document.getElementById('tall_task_overlay');
    tallOverlay.classList.remove('slide-out');
    tallOverlay.classList.add('slide-in');

    document.getElementById('tall_task_overlay_title').textContent = title;
    document.getElementById('task_category').textContent = category;
    document.getElementById('task_due_date').textContent = dueDate || 'No due date';
    document.getElementById('task_description').textContent = description;

    let prioText = '';
    let prioIconPath = '';

    if (urgency === 'low') {
        prioText = 'Low';
        prioIconPath = '../../img/lowIcon.png';
    } else if (urgency === 'medium') {
        prioText = 'Medium';
        prioIconPath = '../../img/mediumIcon.png';
    } else if (urgency === 'urgent') {
        prioText = 'Urgent';
        prioIconPath = '../../img/urgentIcon.png';
    }

    document.getElementById('prio_name').textContent = prioText;
    document.getElementById('prio_icon').src = prioIconPath;

    let categoryElement = document.getElementById('task_category');
    categoryElement.className = '';
    categoryElement.classList.remove('categoryTechnicalTaskOverlay', 'categoryUserStoryOverlay');
    if (category === 'Technical Task') {
        categoryElement.classList.add('categoryTechnicalTaskOverlay');
    } else if (category === 'User Story') {
        categoryElement.classList.add('categoryUserStoryOverlay');
    }
}

function hideTallTaskOverlay() {
    let overlay = document.getElementById('tall_task_overlay_background');
    let tallOverlay = document.getElementById('tall_task_overlay');
    tallOverlay.classList.remove('slide-in');
    tallOverlay.classList.add('slide-out');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}

window.addEventListener('load', includeHTML);
window.addEventListener('load', initRender)