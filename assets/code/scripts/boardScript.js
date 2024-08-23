let userID = checkLoginStatus();
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
                htmlContent.innerHTML += /*HTML*/ `
                <div class="task" draggable="true" ondragend="dragend(event)" ondragstart="drag(event)" id="task${taskKey_1}" data-path="${task.path}">
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

window.addEventListener('load', includeHTML);
window.addEventListener('load', initRender)

