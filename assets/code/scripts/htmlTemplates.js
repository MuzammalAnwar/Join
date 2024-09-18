/**
 * Generates the HTML structure for a task based on its details.
 *
 * @param {string} taskKey - The unique key of the task.
 * @param {object} task - The task object containing its details.
 * @returns {string} The generated HTML string for the task.
 */
function renderTasksTemplate(taskKey, task) {
    return /*HTML*/ `
        <div class="task" draggable="true" ondragend="dragend(event)" ondragstart="drag(event)" id="task${taskKey}" data-path="${task.path}" 
            onclick="showTallTaskOverlay('${taskKey}', '${task.title}', '${task.category}', '${task.urgency}', '${task.dueDate}', '${task.description}', '${returnSubtasksArr(task.subtasks)}'); getCurrentTaskCategory('${task.taskCategory}')">
            <div class="categoryPlacement">
                <p id="category" class='${returnClass(task.category)}'>${task.category}</p>
            </div>
            <div class="taskTitleAndDescription">
                <p class="title">${task.title}</p>
                <p class="description">${task.description}</p>
            </div>
            ${insertSubtaskBar(taskKey, task.subtasks)}
            <div class="contactsAndUrgencyInfo">
                ${generateImage(task.urgency)}
                <div id="contactCircles">${generateContactCircles(task.assigned)}</div>
            </div>
        </div>
    `;
}

function returnSubtasksArr(array) {
    if (array) {
        return array
    }
    return 'false'
}

/**
 * Generates the HTML for a subtask progress bar.
 * 
 * @param {string} taskId - The ID of the task.
 * @param {number} completedSubtasks - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 * @returns {string} The HTML string for the progress bar.
 */
function insertSubtaskBarTemplate(taskId, completedSubtasks, totalSubtasks) {
    return /*HTML*/ `
        <div class="progressSection">
            <div class="progress-container">
                <div id="progress-bar-${taskId}" class="progress-bar" style="width: ${(completedSubtasks / totalSubtasks) * 100}%"></div>
            </div>
            <div class="progress-text" id="progress-text-${taskId}">${completedSubtasks}/${totalSubtasks} Subtasks</div>
        </div>
    `;
}

/**
 * Generates an HTML string for a contact circle with a random background color.
 * The circle displays the initials of the given contact.
 *
 * @param {string} contact - The name or identifier of the contact.
 * @returns {string} The HTML string for the contact circle.
 */
function generateContactCircle(contact) {
    return `
        <div class="profile-circleSmall" style="background-color: ${getRandomRgbColor()};">
            ${getInitials(contact)}
        </div>
    `;
}

/**
 * Generates an HTML string for a "more contacts" circle.
 * This circle is shown when there are additional contacts not being displayed.
 *
 * @returns {string} The HTML string for the "more contacts" circle.
 */
function generateMoreContactsCircle() {
    return `
        <div class="profile-circleSmall more-contacts" style="background-color: #cccccc;">
            ...
        </div>
    `;
}

/**
 * Generates an HTML string for a "no contacts" indicator.
 * This is shown when no contacts are available, displaying "N/A" inside.
 *
 * @returns {string} The HTML string for the "no contacts" indicator.
 */
function generateNoContactsCircle() {
    return `
        <div class="no-contacts">
            N/A
        </div>
    `;
}

/**
 * Generates the HTML for a subtask list item.
 *
 * @param {number} index - The index of the subtask.
 * @param {string} subtask - The text of the subtask.
 * @returns {string} The HTML string for the subtask list item.
 */
function createSubtaskListItemTemplate(index, subtask) {
    return /*HTML*/ `
        <li class="subtaskListItem" id="subtaskListItem${index}">
            <p class="subtaskListText">${subtask}</p>
            <div class="subtaskIcons">
                <img onclick="editSubtask(${index})" src="../../img/subtaskEditIcon.png" class="subtaskIcon" alt="Edit Icon">
                <img onclick="deleteSubtask(${index})" src="../../img/subtaskTrashIcon.png" class="subtaskIcon" alt="Trash Icon">
            </div>
        </li>
    `;
}

/**
 * Generates the HTML for the subtask edit view.
 *
 * @param {number} index - The index of the subtask.
 * @param {string} subtaskText - The current text of the subtask.
 * @returns {string} The HTML string for the subtask edit view.
 */
function createSubtaskEditTemplate(index, subtaskText) {
    return /*HTML*/ `
        <div class="subtaskEditContainer">
            <input class="editInput" type="text" value="${subtaskText}" id="subtaskEditInput${index}">
            <div class="subtaskEditSeparator"></div>
            <div class="subtaskEditIcons">
                <img onclick="renderSubtasks()" src="../../img/subtaskTrashIcon.png" class="subtaskIcon" alt="Cancel Icon">
                <img onclick="saveSubtask(${index})" src="../../img/subtaskAddIcon.png" class="subtaskIcon" alt="Save Icon">
            </div>
        </div>
    `;
}

/**
 * Generates the HTML for a contact circle element.
 *
 * @param {string} color - The background color of the contact circle.
 * @param {string} initials - The initials to display inside the contact circle.
 * @returns {string} The HTML string for the contact circle element.
 */
function createContactCircleTemplate(color, initials) {
    return `
        <div class="profile-circle" style="background-color: ${color};">
            ${initials}
        </div>
    `;
}

/**
 * Generates the HTML for a contact option in the custom select dropdown.
 * 
 * @param {Object} contact - The contact object containing name and color.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.color - The background color for the contact circle.
 * @returns {string} - The HTML string for the contact option.
 */
function createContactOptionTemplate(contact) {
    return `
        <div class="custom-option" data-value="${contact.name}">
            <div class="profileCircleAndName"> 
                <div class="profile-circle" style="background-color: ${contact.color};">
                    ${getInitials(contact.name)}
                </div>
                <span>${contact.name}</span>
            </div>
            <input type="checkbox" value="${contact.name}">
        </div>
    `;
}

/**
 * Creates HTML for a contact card.
 * 
 * @param {Object} contact - The contact details.
 * @param {string} id - The contact ID.
 * @returns {string} - The HTML string for the contact card.
 */
function createContactCardTemplate(contact, id) {
    return `
        <div class="contact_small_card" data-contact-id="${id}" onclick="showContactDetails('${contact.name}', '${contact.email}', '${contact.phone}', '${contact.color}', '${id}'); saveCurrentInfos('${contact.name}', '${contact.email}', '${contact.phone}', '${contact.color}');">
            <p class="contact_icon" style="background-color: ${contact.color}">${getInitials(contact.name)}</p>
            <div>
                <p class="m0">${contact.name}</p>
                <p class="font_color_blue m0">${contact.email}</p>
            </div>
        </div>
    `;
}

/**
 * Creates HTML for an alphabetical index.
 * 
 * @param {string} letter - The letter to display in the index.
 * @returns {string} - The HTML string for the alphabetical index.
 */
function createAlphabeticalIndexTemplate(letter) {
    return `
        <div class="alphabetical_index">
            <div class="letter">${letter}</div>
        </div>
        <div class="separator"></div>
    `;
}


/**
 * Creates a template for a subtask list item.
 * @param {number} index - The index of the subtask.
 * @param {string} subtask - The text of the subtask.
 * @param {string} taskID - The ID of the task.
 * @returns {string} - The HTML template for the subtask list item.
 */
function createSubtaskListItemTemplateForEdit(index, subtask, taskID) {
    return /*HTML*/`
        <li class="subtaskListItem" id="editSubtaskListItem${index}">
            <p class="subtaskListText">${subtask}</p>
            <div class="subtaskIcons">
                <img onclick="editSubtaskInEditOverlay(${index}, '${taskID}')" src="../../img/subtaskEditIcon.png" class="subtaskIcon" alt="Edit Icon">
                <img onclick="deleteEditSubtask(${index},'${taskID}')" src="../../img/subtaskTrashIcon.png" class="subtaskIcon" alt="Trash Icon">
            </div>
        </li>
    `;
}

/**
 * Creates a template for a subtask edit container.
 * @param {number} index - The index of the subtask.
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} taskID - The ID of the task.
 * @returns {string} - The HTML template for the subtask edit container.
 */
function createSubtaskEditTemplateForEdit(index, subtaskText, taskID) {
    return /*HTML*/`
        <div class="subtaskEditContainer">
            <input class="editInput" type="text" value="${subtaskText}" class="subtaskEditInput" id="editSubtaskEditInput${index}">
            <div class="subtaskEditSeparator"></div>
            <div class="subtaskEditIcons">
                <img onclick="renderExistingSubtasks('${taskID}')" src="../../img/subtaskTrashIcon.png" class="subtaskIcon" alt="Cancel Icon">
                <img onclick="saveEditSubtask(${index})" src="../../img/subtaskAddIcon.png" class="subtaskIcon" alt="Save Icon">
            </div>
        </div>
    `;
}


/**
 * Generates the HTML for a contact option in the edit overlay.
 * 
 * @param {Object} contact - The contact object containing name and color.
 * @param {boolean} isAssigned - True if the contact is already assigned.
 * @returns {string} - The HTML string for the contact option.
 */
function renderAssignedContactsInEditOverlayTemplate(contact, isAssigned) {
    return `
        <div class="custom-option" data-value="${contact.name}" style="${returnStyleBasedOnContactAssignStatus(isAssigned)}">
            <div class="profileCircleAndName">
                <div class="profile-circle" style="background-color: ${contact.color};">
                    ${getInitials(contact.name)}
                </div>
                <span>${contact.name}</span>
            </div>
            <input type="checkbox" value="${contact.name}" ${isAssigned ? 'checked' : ''}>
        </div>
    `;
}

function renderAssignedContactsTemplate(contact) {
    return ` <div class="profileCircleAndNameForFullTaskView"> 
                    <div class="profile-circle" style="background-color: ${getRandomRgbColor()};">
                        ${getInitials(contact)}
                    </div>
                    <span>${contact}</span>
                </div>`;
}

function renderAssignedContactsInOverlayTemplate(contact) {
    return `<div class="profileCircleAndNameForFullTaskView"> 
                        <div class="profile-circle" style="background-color: ${getRandomRgbColor()};">
                            ${getInitials(contact)}
                        </div>
                        <span>${contact}</span>
                    </div>`;
}

function generateSubtaskListTemplate(isChecked, index, subtask) {
    return `
        <div class="sub_task_position">
            <input class="checkbox-subtask checkbox" type="checkbox" ${isChecked} data-index="${index}" onchange="updateProgress()">
            <label class="sub_task">${subtask.name}</label>
        </div>`;
}
