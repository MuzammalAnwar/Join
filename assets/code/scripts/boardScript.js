function initRender() {
    renderTasks('toDo', 'categoryToDo');
    renderTasks('inProgress', 'categoryInProgress');
    renderTasks('awaitFeedback', 'categoryAwaitFeedback');
    renderTasks('done', 'categoryDone');
}

function renderTasks(category, id) {
    let htmlContent = document.getElementById(id);
    htmlContent.innerHTML = '';
    let userID = checkLoginStatus();
    let taskPath = `/${userID}/addedTasks/${category}/`;
    fetchTask(taskPath, null, 'GET').then(taskArray => {
        if (!taskArray) {
            console.error(`No tasks found for category: ${category}`);
            return;
        }

        let keys = Object.keys(taskArray);
        for (let i = 0; i < keys.length; i++) {
            let task = taskArray[keys[i]];
            htmlContent.innerHTML += /*HTML*/`
                <div class="task" draggable="true" ondragstart="drag(event)" id="task-${task.id}" 
                     onclick="showTallTaskOverlay('${task.title}', '${task.category}', '${task.urgency}', '${task["due-date"]}', '${task.description}')">
                    <p id="category" class='${returnClass(task.category)}'>${task.category}</p>
                    <div class="taskTitleAndDescription">
                        <p class="title">${task.title}</p>
                        <p class="description">${task.description}</p>
                    </div>
                    ${insertSubtaskBar(task.subtasks)}
                    <div class="overlay_user_position">
                        <div>
                           ${generateImage(task.urgency)}
                        </div>
                        <div id="user" class="contact_icon_overlay">MB</div>
                    </div>
                </div>
            `;
        }
    }).catch(error => {
        console.error('Error fetching tasks:', error);
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

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    let taskId = event.dataTransfer.getData("text");
    let taskElement = document.getElementById(taskId);

    // Find the closest .task or .taskContainer
    let dropTarget = event.target.closest('.task, .taskContainer');

    if (dropTarget.classList.contains('task')) {
        // If dropping on another task, insert before it
        dropTarget.parentNode.insertBefore(taskElement, dropTarget);
    } else if (dropTarget.classList.contains('taskContainer')) {
        // If dropping on the container (or bottom), append it
        dropTarget.appendChild(taskElement);
    }

    // Update the task's category
    updateTaskCategory(taskId, dropTarget.closest('.taskContainer').id);
}

function updateTaskCategory(taskId, newCategoryId) {
    // This is where you would implement logic to update the task's category.
    // E.g., you could make an API call to update the task's category in the database.
    console.log(`Task ${taskId} moved to ${newCategoryId}`);
}

window.addEventListener('load', includeHTML);
window.addEventListener('load', initRender)

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
