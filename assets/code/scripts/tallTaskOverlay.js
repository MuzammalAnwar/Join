let currentTaskId;
let currentTaskCategory = null
let newTaskCategory = '';

/**
 * Displays the tall task overlay with provided task details.
 * @param {number} taskId - The ID of the task.
 * @param {string} title - The title of the task.
 * @param {string} category - The category of the task.
 * @param {string} urgency - The urgency level of the task ('low', 'medium', 'urgent').
 * @param {string} dueDate - The due date of the task in a readable format.
 * @param {string} description - A description of the task.
 * @param {Array} subTasks - An array of subtasks associated with the task.
 */
function showTallTaskOverlay(taskId, title, category, urgency, dueDate, description, subTasks) {
    currentTaskId = taskId;
    if (!toggleOverlay(true)) return;
    updateContent(title, category, dueDate, description, subTasks);
    setUrgency(urgency);
    setCategoryClass(category);
    renderAssignedContactsInOverlay(taskId);
}

/**
 * Sets the current task category in the dropdown.
 * @param {string} status - The current task category (e.g., "To do", "In progress").
 */
function getCurrentTaskCategory(status) {
    currentTaskCategory = status
    let dropdown = document.getElementById('status-select');
    dropdown.value = currentTaskCategory;
}

/**
 * Updates the task's category based on the stored category.
 * Fetches the task, modifies its category, and saves it back.
 * Logs any errors encountered during the process.
 */
async function updateTaskCategoryFromDropdown(newCategory) {
    try {
        let taskPath = `/${userID}/addedTasks/${currentTaskId}`;
        let response = await fetchTask(taskPath, null, 'GET');
        let task = response;
        task.taskCategory = newCategory;
        await fetchTask(taskPath, task, 'PUT');
        initRender()
    } catch (error) {
        console.error("Error updating task category:", error);
    }
}

/**
 * Listens to changes in the dropdown and updates the current task category.
 */
let dropdown = document.getElementById('status-select');
dropdown.addEventListener('change', function () {
    let newTaskCategory = dropdown.value;
    currentTaskCategory = newTaskCategory;
    updateTaskCategoryFromDropdown(newTaskCategory)
});


/**
 * Toggles the visibility of the overlay.
 * @param {boolean} show - Whether to show or hide the overlay.
 * @returns {boolean} - Returns true if the overlay is toggled successfully.
 */
function toggleOverlay(show) {
    let overlay = document.getElementById('tall_task_overlay_background');
    if (!overlay) return console.error('Overlay not found');
    if (show) {
        overlay.style.display = 'flex';
        let tallOverlay = document.getElementById('tall_task_overlay');
        if (tallOverlay) {
            tallOverlay.classList.remove('slide-out');
            tallOverlay.classList.add('slide-in');
        }
    } else {
        overlay.style.display = 'none';
    }
    return true;
}

/**
 * Updates the content in the overlay based on the task details.
 * @param {string} title - The title of the task.
 * @param {string} category - The category of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} description - The description of the task.
 * @param {Array} subTasks - An array of subtasks.
 */
function updateContent(title, category, dueDate, description, subTasks) {
    setText('tall_task_overlay_title', title || '');
    setText('task_category', category || 'No category');
    setText('task_due_date', formatDate(dueDate) || '');
    setText('task_description', description || '');
    updateSubtasks(subTasks);
}

/**
 * Updates the list of subtasks in the overlay.
 * @param {Array} subTasks - An array of subtasks.
 */
function updateSubtasks(subTasks) {
    let container = document.getElementById('subtasks_container');
    if (!container) return console.error('Subtasks container not found');
    container.innerHTML = generateSubtaskList(subTasks);
    container.querySelectorAll('.checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => updateProgress(currentTaskId));
    });
}

/**
 * Sets the urgency level in the task overlay.
 * @param {string} urgency - The urgency level of the task ('low', 'medium', 'urgent').
 */
function setUrgency(urgency) {
    let urgencyMap = { 'medium': ['Medium', '../../img/mediumIcon.png'], 'urgent': ['Urgent', '../../img/urgentIcon.png'], 'low': ['Low', '../../img/lowIcon.png'] };
    let [prioText, prioIconPath] = urgencyMap[urgency] || urgencyMap['low'];
    setText('prio_name', prioText);
    document.getElementById('prio_icon').src = prioIconPath;
}

/**
 * Updates the text content of a DOM element.
 * @param {string} elementId - The ID of the DOM element.
 * @param {string} content - The text content to set.
 */
function setText(elementId, content) {
    let element = document.getElementById(elementId);
    if (element) element.textContent = content;
}

/**
 * Sets the CSS class for the task category.
 * @param {string} category - The category of the task.
 */
function setCategoryClass(category) {
    let categoryElement = document.getElementById('task_category');
    if (!categoryElement) return;
    categoryElement.className = '';
    
    let categoryClass = '';
    if (category === 'Technical Task') {
        categoryClass = 'categoryTechnicalTaskOverlay';
    } else if (category === 'User Story') {
        categoryClass = 'categoryUserStoryOverlay';
    } else {
        categoryClass = 'defaultCategoryOverlay'; // Fallback-Klasse hinzufügen
    }

    if (categoryClass) {
        categoryElement.classList.add(categoryClass);
    }
}


/**
 * Generates the HTML list of subtasks.
 * @param {Array|string} subTasks - The subtasks array or a comma-separated string.
 * @returns {string} - The HTML string for the subtask list.
 */
function generateSubtaskList(subTasks) {
    if (typeof subTasks === 'string') {
        subTasks = subTasks.split(',').map(subtask => ({ name: subtask, completed: false }));
    } if (!Array.isArray(subTasks) || subTasks.length === 0) {
        return '<p>No subtasks available</p>';
    }
    let storedSubTaskStates = JSON.parse(localStorage.getItem('subTasks_' + currentTaskId)) || [];
    let completedSubtasks = 0;
    let subtaskHtml = '<ul class="subtask-list">';
    subTasks.forEach((subtask, index) => {
        let isChecked = storedSubTaskStates[index] ? 'checked' : (subtask.completed ? 'checked' : '');
        if (isChecked) {
            completedSubtasks++;
        } subtaskHtml += generateSubtaskListTemplate(isChecked, index, subtask);
    });
    subtaskHtml += '</ul>';
    return subtaskHtml;
}

/**
 * Initializes the progress bar based on subtasks.
 */
function initializeProgressBar() {
    let checkboxes = document.querySelectorAll('.sub_task_position .checkbox');
    let totalSubtasks = checkboxes.length;
    let completedSubtasks = 0;
    let subTaskStates = JSON.parse(localStorage.getItem('subTasks_' + currentTaskId)) || [];
    checkboxes.forEach((checkbox, index) => {
        if (subTaskStates[index]) {
            checkbox.checked = true;
            completedSubtasks++;
        }
    });
    updateProgressBar(completedSubtasks, totalSubtasks);
}

/**
 * Updates the progress bar based on the number of completed subtasks.
 * @param {number} completedSubtasks - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 */
function updateProgressBar(completedSubtasks, totalSubtasks) {
    let progressPercentage = (completedSubtasks / totalSubtasks) * 100;
    let progressBar = document.getElementById('progress-bar');
    let progressText = document.getElementById('progress-text');
    if (progressBar && progressText && totalSubtasks > 0) {
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    }
}

/**
 * Updates the progress for the current task.
 * @param {number} taskId - The ID of the task.
 */
function updateProgress(taskId) {
    let checkboxes = document.querySelectorAll(`#subtasks_container .checkbox`);
    let totalSubtasks = checkboxes.length;
    let completedSubtasks = 0;
    let subTaskStates = [];
    checkboxes.forEach((checkbox, index) => {
        let isChecked = checkbox.checked;
        subTaskStates.push(isChecked);
        if (isChecked) {
            completedSubtasks++;
        }
    });
    localStorage.setItem('subTasks_' + taskId, JSON.stringify(subTaskStates));
    updateProgressBarForTask(taskId, completedSubtasks, totalSubtasks);
}

/**
 * Deletes the current task from Firebase.
 */
async function deleteTaskFromFirebase() {
    try {
        let taskElement = document.getElementById('task' + currentTaskId);
        if (!taskElement) {
            console.error("Task element not found");
            return;
        }
        let taskPath = taskElement.dataset.path;
        await fetchTask(taskPath, null, 'DELETE');
        taskElement.remove();
        hideTallTaskOverlay();
        checkIfCategoryHasNoTasks();
    } catch (error) {
        console.error(`Failed to delete task ${currentTaskId}:`, error);
    }
}

/**
 * Hides the tall task overlay and updates the task's category.
 */
function hideTallTaskOverlay() {
    let overlay = document.getElementById('tall_task_overlay_background');
    let tallOverlay = document.getElementById('tall_task_overlay');
    if (tallOverlay) {
        tallOverlay.classList.remove('slide-in');
        tallOverlay.classList.add('slide-out');
        setTimeout(() => {
            if (overlay) {
                overlay.style.display = 'none';
            }
        }, 200);
    } else {
        console.error('Tall overlay element not found');
    }
}

/**
 * Fetches and renders the assigned contacts in the overlay.
 * @param {number} taskID - The ID of the task.
 */
function renderAssignedContactsInOverlay(taskID) {
    let inputContent = document.getElementById('assignedContactsContainer');
    inputContent.innerHTML = '';
    fetchTask(`/${userID}/addedTasks/${taskID}/assigned/`, null, 'GET').then(assignedContacts => {
        if (assignedContacts) {
            assignedContacts.forEach(contact => {
                inputContent.innerHTML += renderAssignedContactsInOverlayTemplate(contact);
            })
        }
        else {
            inputContent.innerHTML = `No contacts assigned`
        }
    })
}