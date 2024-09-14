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

document.addEventListener('DOMContentLoaded', initializeUrgencyButtons);
document.addEventListener('DOMContentLoaded', function () {
    toggleInputIcons('subtasks', 'subtaskAdd', 'subtaskCancel', 'subtaskSave');
});

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

/**
 * Changes the source of an image element by updating its `src` attribute.
 *
 * @param {string} id - The ID of the image element to change.
 * @param {string} src - The new source URL for the image.
 */
function changeImgSource(id, src) {
    document.getElementById(id).src = src;
}

/**
 * Adds a new subtask to the list if the input field is not empty.
 * After adding, it renders the updated subtask list and clears the input field.
 * If the input is empty, it alerts the user to enter a value.
 */
function addSubtask() {
    let input = document.getElementById('subtasks');
    if (input.value !== '') {
        subtasks.push(input.value);
        renderSubtasks();
        input.value = '';
        input.blur();
    } else {
        document.getElementById('subtasks').classList.add('errorFeedbackForInput')
        setTimeout(() => { document.getElementById('subtasks').classList.remove('errorFeedbackForInput') }, 1000)
    }
}

/**
 * Returns an array of selected contact values from the checkboxes
 * inside elements with the class 'custom-option'.
 *
 * @returns {Array<string>} An array of values of the selected checkboxes.
 */
function returnSelectedContacts() {
    return Array.from(document.querySelectorAll('.custom-option input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
}

/**
 * Renders the list of subtasks by updating the HTML content of the subtask list element.
 */
function renderSubtasks() {
    let subtaskList = document.getElementById('subtaskList');
    subtaskList.innerHTML = '';
    subtasks.forEach((subtask, i) => {
        subtaskList.innerHTML += createSubtaskListItemTemplate(i, subtask);
    });
}

/**
 * Replaces the content of a subtask list item with an edit view.
 *
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtask(index) {
    let subtaskListItem = document.getElementById(`subtaskListItem${index}`);
    let subtaskText = subtasks[index];

    subtaskListItem.innerHTML = createSubtaskEditTemplate(index, subtaskText);
}

/**
 * Saves the edited subtask text from the input field.
 *
 * @param {number} index - The index of the subtask to save.
 */
function saveSubtask(index) {
    let input = document.getElementById(`subtaskEditInput${index}`);
    subtasks[index] = input.value;
    renderSubtasks();
}

/**
 * Deletes a subtask from the list based on its index.
 *
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtask(index) {
    subtasks.splice(index, 1);
    renderSubtasks();
}

/**
 * Handles button click events by toggling icon images.
 *
 * @param {string} clickedIconId - The ID of the clicked icon.
 * @param {string} originalSrc - The original source URL of the icon.
 * @param {string} hoverSrc - The source URL of the icon when hovered.
 * @param {Array<string>} otherIconIds - An array of IDs for other icons to reset.
 */
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

/**
 * Clears all subtasks from the list and resets the subtasks array.
 */
function clearSubtasks() {
    document.getElementById('subtaskList').innerHTML = '';
    subtasks = [];
}

/**
 * Toggles the source URL of an icon between its original and hover states.
 *
 * @param {string} iconId - The ID of the icon to toggle.
 * @param {string} originalSrc - The original source URL of the icon.
 * @param {string} hoverSrc - The source URL of the icon when hovered.
 */
function toggleIcon(iconId, originalSrc, hoverSrc) {
    let icon = document.getElementById(iconId);
    let currentSrc = icon.src.split('/').pop();
    if (currentSrc === originalSrc.split('/').pop()) {
        icon.src = hoverSrc;
    } else {
        icon.src = originalSrc;
    }
}

/**
 * Toggles the visibility of input-related icons based on focus and blur events.
 *
 * @param {string} inputId - The ID of the input field.
 * @param {string} addIconId - The ID of the add icon.
 * @param {string} cancelIconId - The ID of the cancel icon.
 * @param {string} saveIconId - The ID of the save icon.
 */
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

/**
 * Fetches and renders the contact options into the custom select dropdown.
 * 
 * @async
 */
async function getContacts() {
    let taskPath = `/${userID}/contacts`;
    let selectWrapper = document.querySelector('.custom-options');
    try {
        let contacts = await fetchTask(taskPath, null, 'GET');
        if (contacts) {
            let keys = Object.keys(contacts);
            let html = '';
            for (let i = 0; i < keys.length; i++) {
                let contact = contacts[keys[i]];
                html += createContactOptionTemplate(contact);
            }
            selectWrapper.innerHTML = html;
            document.querySelectorAll('.custom-option').forEach(option => {
                option.addEventListener('click', handleOptionClick);
            });
        }
    } catch (error) {
        console.error("Error fetching contacts:", error);
    }
}

/**
 * Updates the text of the custom select trigger based on the number of selected contacts.
 * 
 * @param {Array<string>} selected - The list of selected contact names.
 */
function updateTriggerText(selected) {
    let trigger = document.querySelector('.custom-select-trigger');
    trigger.querySelector('span').textContent = selected.length > 0 ? '' : 'Select contacts to assign';
}

/**
 * Adds a more-indicator element to the wrapper if the number of selected contacts exceeds 5.
 * 
 * @param {Array<string>} selected - The list of selected contact names.
 * @param {HTMLElement} wrapper - The wrapper element to append the more-indicator to.
 */
function addMoreIndicatorIfNeeded(selected, wrapper) {
    if (selected.length > 5) {
        wrapper.innerHTML += '<div class="more-indicator">...</div>';
    }
}

/**
 * Renders the selected contacts inside the given wrapper element.
 *
 * @param {Array<string>} selected - The list of selected contact names.
 * @param {HTMLElement} wrapper - The wrapper element to append the contact elements to.
 */
function renderSelectedContacts(selected, wrapper) {
    selected.forEach((contactName, index) => {
        if (index < 5) {
            let contactElement = document.querySelector(`.custom-option[data-value="${contactName}"]`);
            let color = contactElement.querySelector('.profile-circle').style.backgroundColor;
            let initials = contactElement.querySelector('.profile-circle').textContent;
            wrapper.innerHTML += createContactCircleTemplate(color, initials);
        }
    });
}

/**
 * Clears all selected contacts from the given wrapper element.
 *
 * @param {HTMLElement} wrapper - The wrapper element to clear.
 */
function clearSelectedContacts(wrapper) {
    wrapper.innerHTML = '';
}

/**
 * Gets the values of all selected contact checkboxes.
 *
 * @returns {Array<string>} - An array of selected contact values.
 */
function getSelectedContacts() {
    let checkboxes = document.querySelectorAll('.custom-option input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

/**
 * Updates the selected contacts display and other related elements.
 */
function updateSelectedContacts() {
    let selected = getSelectedContacts();
    let selectedContactsWrapper = document.querySelector('.selected-contacts');
    clearSelectedContacts(selectedContactsWrapper);
    renderSelectedContacts(selected, selectedContactsWrapper);
    addMoreIndicatorIfNeeded(selected, selectedContactsWrapper);
    updateTriggerText(selected);
}

/**
 * Closes the dropdown if a click occurs outside of the select element.
 *
 * @param {Event} e - The click event.
 */
function closeDropdownOnClickOutside(e) {
    let select = document.querySelector('.custom-select');
    let options = document.querySelector('.custom-options');
    if (!select.contains(e.target)) {
        options.classList.remove('open');
    }
}

/**
 * Toggles the selection of an option when clicked.
 *
 * @param {Event} e - The click event.
 */
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

/**
 * Prevents the click event from propagating to parent elements.
 *
 * @param {Event} e - The click event.
 */
function preventClickBubbling(e) {
    e.stopPropagation();
}

/**
 * Toggles the visibility of the dropdown options.
 */
function toggleDropdown() {
    let options = document.querySelector('.custom-options');
    options.classList.toggle('open');
}

/**
 * Initializes event listeners for the custom select dropdown.
 */
function initializeEventListeners() {
    let select = document.querySelector('.custom-select');
    let options = document.querySelector('.custom-options');
    let trigger = document.querySelector('.custom-select-trigger');

    trigger.addEventListener('click', toggleDropdown);
    options.addEventListener('click', preventClickBubbling);
    document.addEventListener('click', closeDropdownOnClickOutside);
}
/**
 * Resets all selected contacts in the dropdown menu, including background colors.
 */
function resetSelectedContacts() {
    let selectedContactsContainer = document.querySelector('.selected-contacts');
    selectedContactsContainer.innerHTML = '';
    getContacts()
}


document.addEventListener('DOMContentLoaded', initializeEventListeners);
window.addEventListener('load', getContacts);
window.addEventListener('load', checkLoginStatus);
window.addEventListener('load', setProfileCircleInitials);