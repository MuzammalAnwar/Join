let categories = [
    { id: 'toDo', element: document.getElementById('categoryToDo'), message: 'No tasks to do' },
    { id: 'inProgress', element: document.getElementById('categoryInProgress'), message: 'No tasks in progress' },
    { id: 'awaitFeedback', element: document.getElementById('categoryAwaitFeedback'), message: 'No tasks awaiting feedback' },
    { id: 'done', element: document.getElementById('categoryDone'), message: 'No tasks done' }
];

/**
 * Initializes the rendering of tasks across multiple categories.
 * Calls the `renderTasks` function for each category ('toDo', 'inProgress', 'awaitFeedback', 'done').
 * After all categories are rendered, it checks if any category has no tasks.
 * Logs any errors that occur during the initialization process.
 *
 * @returns {Promise<void>} A promise that resolves once all tasks are rendered and the check is complete.
 */
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


/**
 * Renders tasks of the specified category into the HTML element with the given ID.
 * Fetches tasks from the user task path and filters them by category.
 * If no tasks are found, it displays a message. Otherwise, it renders the tasks.
 *
 * @async
 * @param {string} category - The category of tasks to render (e.g., 'urgent', 'medium').
 * @param {string} id - The ID of the HTML element where the tasks will be rendered.
 */
async function renderTasks(category, id) {
    let htmlContent = getElementByIdAndClear(id);
    let taskPath = `/${userID}/addedTasks/`;
    try {
        let taskArray = await fetchTask(taskPath, null, 'GET');
        let filteredTasks = filterTasksByCategory(taskArray, category);
        if (filteredTasks.length === 0) {
            showNoTasksMessage(htmlContent, category);
        } else {
            renderFilteredTasks(filteredTasks, htmlContent, taskArray);
        }
    } catch (error) {
        console.error(`Error rendering tasks for category ${category}:`, error);
    }
}

/**
 * Retrieves an HTML element by its ID and clears its inner HTML content.
 *
 * @param {string} id - The ID of the HTML element.
 * @returns {HTMLElement} The HTML element with cleared content.
 */
function getElementByIdAndClear(id) {
    let element = document.getElementById(id);
    element.innerHTML = '';
    return element;
}

/**
 * Filters tasks by their category.
 *
 * @param {object} taskArray - The array of task objects.
 * @param {string} category - The category to filter tasks by.
 * @returns {Array<string>} An array of filtered task keys.
 */
function filterTasksByCategory(taskArray, category) {
    return Object.keys(taskArray).filter(taskKey => taskArray[taskKey].taskCategory === category);
}

/**
 * Displays a "No tasks" message when no tasks are found for the given category.
 *
 * @param {HTMLElement} htmlContent - The HTML element where the message will be displayed.
 * @param {string} category - The task category that has no tasks.
 */
function showNoTasksMessage(htmlContent, category) {
    htmlContent.innerHTML = `<div class="NoTaskToDo">${returnEqualMsg(category)}</div>`;
}

/**
 * Renders filtered tasks into the HTML element and initializes their progress bars.
 *
 * @param {Array<string>} filteredTasks - The keys of the filtered tasks.
 * @param {HTMLElement} htmlContent - The HTML element where the tasks will be rendered.
 */
function renderFilteredTasks(filteredTasks, htmlContent, taskArray) {
    filteredTasks.forEach(taskKey => {
        let task = taskArray[taskKey];
        htmlContent.innerHTML += renderTasksTemplate(taskKey, task);
        initializeProgressBarForTask(taskKey);
    });
}

function getContactArray(contacts) {
    return contacts ? Object.values(contacts) : [];
}

/**
 * Generates the HTML for contact circles based on the provided contacts array.
 * If there are more than 4 contacts, it displays a "more contacts" circle.
 * If no contacts are available, it returns a "no contacts" indicator.
 *
 * @param {Array<string>} contacts - The array of contacts.
 * @returns {string} The generated HTML for the contact circles.
 */
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

/**
 * Updates the task's category by fetching the task, modifying its category, and saving it back.
 * Logs any errors encountered during the process.
 *
 * @param {string} taskId - The ID of the task element.
 * @param {string} newCategory - The new category to assign to the task.
 */
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

/**
 * Checks if any task category has no tasks and adds a placeholder message if necessary.
 * Removes placeholder messages for categories that have tasks.
 */
function checkIfCategoryHasNoTasks() {
    removePlaceholders();
    categories.forEach(category => {
        if (category.element.children.length === 0) {
            category.element.innerHTML = `<div class="NoTaskToDo">${category.message}</div>`;
        }
    });
}

/**
 * Removes placeholder messages from categories that have tasks.
 */
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

/**
 * Returns the placeholder message for an empty task category.
 *
 * @param {string} category - The category ID for which to return the message.
 * @returns {string} The placeholder message for the specified category.
 */
function returnEqualMsg(category) {
    let categoryObj = categories.find(cat => cat.id === category);
    if (categoryObj) {
        return categoryObj.message;
    }
}

/**
 * Generates an image HTML based on the task's urgency level.
 *
 * @param {string} urgency - The urgency level of the task ('none', 'urgent', 'medium', 'low').
 * @returns {string} The HTML for the corresponding urgency icon.
 */
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

/**
 * Returns the corresponding CSS class for the given task category.
 *
 * @param {string} category - The category of the task ('Technical Task', 'User Story', etc.).
 * @returns {string} The CSS class for the task's category.
 */
function returnClass(category) {
    if (category === 'Technical Task') {
        return 'categoryTechnicalTask';
    } else if (category === 'User Story') {
        return 'categoryUserStory';
    } else {
        return '';
    }
}

/**
 * Inserts a subtask progress bar for the given task based on completed subtasks.
 * If no subtasks are present, it returns an empty string.
 *
 * @param {string} taskId - The ID of the task.
 * @param {Array<Object>} subtasks - An array of subtasks, each containing a 'completed' property.
 * @returns {string} The HTML string for the progress bar.
 */
function insertSubtaskBar(taskId, subtasks) {
    if (!Array.isArray(subtasks) || subtasks.length === 0) {
        return '';
    }
    let completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
    return insertSubtaskBarTemplate(taskId, completedSubtasks, subtasks.length);
}

/**
 * Initializes the progress bar for a given task by retrieving subtask states from localStorage.
 *
 * @param {string} taskId - The ID of the task.
 */
function initializeProgressBarForTask(taskId) {
    let subTaskStates = getStoredSubtaskStates(taskId);
    let totalSubtasks = subTaskStates.length;
    let completedSubtasks = subTaskStates.filter(state => state).length;
    updateProgressBarForTask(taskId, completedSubtasks, totalSubtasks);
}

/**
 * Retrieves the subtask states for a task from localStorage.
 *
 * @param {string} taskId - The ID of the task.
 * @returns {Array<boolean>} An array of boolean values representing the completion state of each subtask.
 */
function getStoredSubtaskStates(taskId) {
    return JSON.parse(localStorage.getItem('subTasks_' + taskId)) || [];
}

/**
 * Updates the progress bar and progress text for the given task.
 *
 * @param {string} taskId - The ID of the task.
 * @param {number} completedSubtasks - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 */
function updateProgressBarForTask(taskId, completedSubtasks, totalSubtasks) {
    let progressPercentage = (completedSubtasks / totalSubtasks) * 100;
    let progressBar = document.getElementById(`progress-bar-${taskId}`);
    let progressText = document.getElementById(`progress-text-${taskId}`);

    if (progressBar && progressText && totalSubtasks > 0) {
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    }
}

/**
 * Filters tasks based on a search term entered by the user.
 * Only tasks whose title or description match the search term are displayed.
 */
function filterTasks() {
    let searchTerm = document.getElementById('userInput').value.toLowerCase();
    document.querySelectorAll('.task').forEach(task => {
        let title = task.querySelector('.title').textContent.toLowerCase();
        let description = task.querySelector('.description').textContent.toLowerCase();
        task.style.display = (title.includes(searchTerm) || description.includes(searchTerm)) ? 'block' : 'none';
    });
}

/**
 * Hides the task overlay if the screen width is less than 1000 pixels.
 */
function checkScreenSize() {
    let element = document.getElementById('taskOverlay');
    if (window.innerWidth < 1000) {
        element.style.display = 'none';
    }
}

window.onload = checkScreenSize;
window.onresize = checkScreenSize;
document.getElementById('userInput').addEventListener('input', filterTasks);
window.addEventListener('load', includeHTML);
window.addEventListener('load', initRender);
window.addEventListener('load', setProfileCircleInitials);