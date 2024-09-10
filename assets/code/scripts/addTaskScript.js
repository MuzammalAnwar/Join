let tasks = [];
let selectedStatus = 'none';
let subtasks = []
let taskPath;
let userID = checkLoginStatus();
let today = new Date().toISOString().split('T')[0];
document.getElementById('due-date').setAttribute('min', today);

/**
 * Initializes event listeners for urgency buttons.
 */
function initializeUrgencyButtons() {
    let urgencyButtons = document.querySelectorAll('.urgentStatus');
    urgencyButtons.forEach(button => {
        button.addEventListener('click', handleUrgencyButtonClick);
    });
}

/**
 * Handles click events on urgency buttons to toggle their selected status.
 *
 * @param {MouseEvent} event - The click event.
 */
function handleUrgencyButtonClick(event) {
    let button = event.currentTarget;
    let isSelected = button.classList.contains('urgent-selected') ||
        button.classList.contains('medium-selected') ||
        button.classList.contains('low-selected');
    if (isSelected) {
        deselectButton(button);
    } else {
        selectButton(button);
    }
}

/**
 * Deselects the clicked button and resets the selected status.
 *
 * @param {HTMLElement} button - The button to deselect.
 */
function deselectButton(button) {
    button.classList.remove('urgent-selected', 'medium-selected', 'low-selected');
    button.style.boxShadow = '';
    selectedStatus = 'none';
}

/**
 * Selects the clicked button and updates the selected status.
 *
 * @param {HTMLElement} button - The button to select.
 */
function selectButton(button) {
    let urgencyButtons = document.querySelectorAll('.urgentStatus');
    urgencyButtons.forEach(btn => {
        btn.classList.remove('urgent-selected', 'medium-selected', 'low-selected');
        btn.style.boxShadow = '';
    });
    selectedStatus = button.getAttribute('data-status');
    button.classList.add(getSelectedClass(selectedStatus));
    button.style.boxShadow = 'none';
}

/**
 * Gets the appropriate class for the selected urgency status.
 *
 * @param {string} status - The urgency status.
 * @returns {string} - The class name to add.
 */
function getSelectedClass(status) {
    switch (status) {
        case 'urgent': return 'urgent-selected';
        case 'medium': return 'medium-selected';
        case 'low': return 'low-selected';
        default: return '';
    }
}

/**
 * Handles the form submission to add a new task.
 *
 * @param {Event} event - The submit event.
 */
function addToTask(event) {
    event.preventDefault();
    let taskData = gatherTaskData();
    createAndAddTask(taskData);
    clearTaskForm();
    window.location = 'board.html';
}

/**
 * Gathers task input values from the form elements.
 *
 * @returns {Object} - An object containing the task data.
 */
function gatherTaskData() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let dueDate = document.getElementById('due-date').value;
    let category = document.getElementById('category').value;

    return {
        title,
        description,
        dueDate,
        category
    };
}

/**
 * Creates a new task object and adds it to the tasks array.
 *
 * @param {Object} taskData - The data of the task to be added.
 */
function createAndAddTask(taskData) {
    let taskKey = generateUniqueKey();
    let taskPath = `/${userID}/addedTasks/${taskKey}`;
    let task = {
        ...taskData,
        assigned: returnSelectedContacts(),
        subtasks,
        urgency: getUrgency(),
        path: taskPath,
        taskCategory: 'toDo'
    };
    tasks.push(task);
    fetchTask(taskPath, task, 'PUT');
}

/**
 * Returns the urgency level based on the selected status.
 *
 * @returns {string} - The urgency level ('medium', 'low', 'urgent', or 'none').
 */
function getUrgency() {
    return ['medium', 'low', 'urgent'].includes(selectedStatus) ? selectedStatus : 'none';
}

/**
 * Clears all input fields in the task form.
 */
function clearTaskForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('assigned').value = '';
    document.getElementById('due-date').value = '';
    document.getElementById('category').value = '';
}


function changeImgSource(id, src) {
    document.getElementById(id).src = src;
}

function addSubtask() {
    let input = document.getElementById('subtasks');
    if (input.value !== '') {
        subtasks.push(input.value);
        renderSubtasks();
        input.value = '';
        input.blur();
    } else {
        alert('Please write something');
    }
}

function returnSelectedContacts() {
    return Array.from(document.querySelectorAll('.custom-option input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
}

function renderSubtasks() {
    let subtaskList = document.getElementById('subtaskList');
    subtaskList.innerHTML = '';
    subtasks.forEach((subtask, i) => {
        subtaskList.innerHTML += /*HTML*/`
            <li class="subtaskListItem" id="subtaskListItem${i}">
                <p class="subtaskListText">${subtask}</p>
                <div class="subtaskIcons">
                    <img onclick="editSubtask(${i})" src="../../img/subtaskEditIcon.png" class="subtaskIcon" alt="Edit Icon">
                    <img onclick="deleteSubtask(${i})" src="../../img/subtaskTrashIcon.png" class="subtaskIcon" alt="Trash Icon">
                </div>
            </li>
        `;
    });
}

function editSubtask(index) {
    let subtaskListItem = document.getElementById(`subtaskListItem${index}`);
    let subtaskText = subtasks[index];

    subtaskListItem.innerHTML = /*HTML*/`
        <div class="subtaskEditContainer">
            <input class="editInput" type="text" value="${subtaskText}" class="subtaskEditInput" id="subtaskEditInput${index}">
            <div class="subtaskEditSeparator"></div>
            <div class="subtaskEditIcons">
                <img onclick="renderSubtasks()" src="../../img/subtaskTrashIcon.png" class="subtaskIcon" alt="Cancel Icon">
                <img onclick="saveSubtask(${index})" src="../../img/subtaskAddIcon.png" class="subtaskIcon" alt="Save Icon">
            </div>
        </div>
    `;
}

function saveSubtask(index) {
    let input = document.getElementById(`subtaskEditInput${index}`);
    subtasks[index] = input.value;
    renderSubtasks();
}

function deleteSubtask(index) {
    subtasks.splice(index, 1);
    renderSubtasks();
}

function handleButtonClick(clickedIconId, originalSrc, hoverSrc, otherIconIds) {
    otherIconIds.forEach(function (id) {
        let icon = document.getElementById(id);
        if (icon) {
            icon.src = id === 'urgentIcon' ? '../../img/urgentIcon.png' :
                id === 'mediumIcon' ? '../../img/mediumIcon.png' :
                    '../../img/lowIcon.png';
        }
    });
    toggleIcon(clickedIconId, originalSrc, hoverSrc);
}


function clearSubtasks() {
    document.getElementById('subtaskList').innerHTML = '';
    subtasks = [];
}

function toggleIcon(iconId, originalSrc, hoverSrc) {
    let icon = document.getElementById(iconId);
    let currentSrc = icon.src.split('/').pop();
    if (currentSrc === originalSrc.split('/').pop()) {
        icon.src = hoverSrc;
    } else {
        icon.src = originalSrc;
    }
}

function toggleInputIcons(inputId, addIconId, cancelIconId, saveIconId) {
    let input = document.getElementById(inputId);
    let addIcon = document.getElementById(addIconId);
    let cancelIcon = document.getElementById(cancelIconId);
    let saveIcon = document.getElementById(saveIconId);

    input.addEventListener('focus', function () {
        addIcon.classList.add('hidden');
        cancelIcon.classList.remove('hidden');
        saveIcon.classList.remove('hidden');
    });

    input.addEventListener('blur', function () {
        setTimeout(function () {
            addIcon.classList.remove('hidden');
            cancelIcon.classList.add('hidden');
            saveIcon.classList.add('hidden');
        }, 150);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    toggleInputIcons('subtasks', 'subtaskAdd', 'subtaskCancel', 'subtaskSave');
});

function getContacts() {
    let taskPath = `/${userID}/contacts`;
    let selectWrapper = document.querySelector('.custom-options');
    fetchTask(taskPath, null, 'GET').then(contacts => {
        let keys = Object.keys(contacts);
        let html = '';
        for (let i = 0; i < keys.length; i++) {
            let contact = contacts[keys[i]];
            html += /*HTML*/`
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
        selectWrapper.innerHTML = html;


        document.querySelectorAll('.custom-option').forEach(option => {
            option.addEventListener('click', handleOptionClick);
        });
    });
}

function updateTriggerText(selected) {
    let trigger = document.querySelector('.custom-select-trigger');
    trigger.querySelector('span').textContent = selected.length > 0 ? '' : 'Select contacts to assign';
}

function addMoreIndicatorIfNeeded(selected, wrapper) {
    if (selected.length > 5) {
        wrapper.innerHTML += '<div class="more-indicator">...</div>';
    }
}

function renderSelectedContacts(selected, wrapper) {
    selected.forEach((contactName, index) => {
        if (index < 5) {
            let contactElement = document.querySelector(`.custom-option[data-value="${contactName}"]`);
            let color = contactElement.querySelector('.profile-circle').style.backgroundColor;
            let initials = contactElement.querySelector('.profile-circle').textContent;
            wrapper.innerHTML += `
                <div class="profile-circle" style="background-color: ${color};">
                    ${initials}
                </div>
            `;
        }
    });
}

function clearSelectedContacts(wrapper) {
    wrapper.innerHTML = '';
}

function getSelectedContacts() {
    let checkboxes = document.querySelectorAll('.custom-option input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

function updateSelectedContacts() {
    let selected = getSelectedContacts();
    let selectedContactsWrapper = document.querySelector('.selected-contacts');

    clearSelectedContacts(selectedContactsWrapper);
    renderSelectedContacts(selected, selectedContactsWrapper);
    addMoreIndicatorIfNeeded(selected, selectedContactsWrapper);
    updateTriggerText(selected);
}

function closeDropdownOnClickOutside(e) {
    let select = document.querySelector('.custom-select');
    let options = document.querySelector('.custom-options');

    if (!select.contains(e.target)) {
        options.classList.remove('open');
    }
}

function handleOptionClick(e) {
    let option = e.currentTarget;
    let checkbox = option.querySelector('input[type="checkbox"]');

    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
        option.classList.add('selected');
    } else {
        option.classList.remove('selected');
    }

    updateSelectedContacts();
}

function preventClickBubbling(e) {
    e.stopPropagation();
}

function toggleDropdown() {
    let options = document.querySelector('.custom-options');
    options.classList.toggle('open');
}

function initializeEventListeners() {
    let select = document.querySelector('.custom-select');
    let options = document.querySelector('.custom-options');
    let trigger = document.querySelector('.custom-select-trigger');

    trigger.addEventListener('click', toggleDropdown);
    options.addEventListener('click', preventClickBubbling);
    document.addEventListener('click', closeDropdownOnClickOutside);
}

document.addEventListener('DOMContentLoaded', initializeEventListeners);
window.addEventListener('load', getContacts);
window.addEventListener('load', checkLoginStatus);
window.addEventListener('load', setProfileCircleInitials);
document.addEventListener('DOMContentLoaded', initializeUrgencyButtons);
