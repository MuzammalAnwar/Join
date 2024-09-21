let todayEditDate = new Date().toISOString().split('T')[0];
document.getElementById('edit_due_date').setAttribute('min', todayEditDate);

/**
 * A mapping object for priority icons. Contains default and hover states for urgent, medium, and low priorities.
 * This is used for dynamically setting icon paths based on priority.
 */
let iconPaths = {
    'edit_urgentIcon': {
        defaultIcon: '../../img/urgentIcon.png',
        hoverIcon: '../../img/urgentIconHover.png'
    },
    'edit_mediumIcon': {
        defaultIcon: '../../img/mediumIcon.png',
        hoverIcon: '../../img/mediumIconHover.png'
    },
    'edit_lowIcon': {
        defaultIcon: '../../img/lowIcon.png',
        hoverIcon: '../../img/lowIconHover.png'
    }
};

/**
 * A mapping object that links urgency levels (urgent, medium, low) to their respective button IDs,
 * selected CSS classes, and icons (default and white versions).
 */
let priorityMapping = {
    'urgent': {
        buttonId: 'edit_urgentIcon',
        selectedClass: 'edit_urgent_selected',
        whiteIcon: '../../img/Prio alta white.png',
        defaultIcon: '../../img/urgentIcon.png'
    },
    'medium': {
        buttonId: 'edit_mediumIcon',
        selectedClass: 'edit_medium_selected',
        whiteIcon: '../../img/Prio media white.png',
        defaultIcon: '../../img/mediumIcon.png'
    },
    'low': {
        buttonId: 'edit_lowIcon',
        selectedClass: 'edit_low_selected',
        whiteIcon: '../../img/Prio baja white.png',
        defaultIcon: '../../img/lowIcon.png'
    }
};

/**
 * Stores the list of current subtasks being edited in the overlay.
 * Used to manage and render subtasks in the edit overlay.
 */
let editSubtasks = [];

/**
 * Stores the ID of the current task being edited.
 */
let currentCardID;

/**
 * Stores the urgency level of the current task being edited.
 * Default is set to 'none'.
 */
let currentUrgency = 'none';

/**
 * Adds a click event listener to the edit button, triggering the display of the edit overlay.
 * Gathers task details and passes them to the overlay.
 */
document.querySelector('.edit_button').addEventListener('click', function () {
    let taskId = currentTaskId;
    let taskTitle = document.getElementById('tall_task_overlay_title').textContent;
    let taskDescription = document.getElementById('task_description').textContent;
    let taskDueDate = document.getElementById('task_due_date').textContent;
    let taskPriority = document.getElementById('prio_name').textContent.toLowerCase();
    let assignedTo = [...document.querySelectorAll('.profile-circle')].map(el => el.textContent);
    showEditOverlay(taskId, taskTitle, taskDescription, taskDueDate, taskPriority, assignedTo);
});

/**
 * Zeigt das Bearbeitungs-Overlay für eine Aufgabe an und füllt die Felder mit den übergebenen Werten.
 * @param {string} taskId - Die ID der Aufgabe.
 * @param {string} title - Der Titel der Aufgabe.
 * @param {string} description - Die Beschreibung der Aufgabe.
 * @param {string} dueDate - Das Fälligkeitsdatum der Aufgabe.
 * @param {string} priority - Die Priorität der Aufgabe.
 * @param {Array} assignedTo - Die Liste der zugewiesenen Kontakte.
 */
function showEditOverlay(taskId, title, description, dueDate, priority, assignedTo) {
    hideTallTaskOverlay();
    currentCardID = taskId;
    setOverlayDisplay('tall_task_overlay_background', 'none');
    setOverlayDisplay('edit_task_overlay_background', 'flex');
    setEditOverlayFields(title, description, dueDate);
    setPriorityInEditOverlay(priority);
    renderAssignedContacts(assignedTo);
    renderAssignedContactsInEditOverlay(taskId);
    renderExistingSubtasks(taskId);
    preselectPriority(priority);
}

/**
 * Sets the display style for a specific element by its ID.
 * @param {string} elementId - The ID of the HTML element to modify.
 * @param {string} displayValue - The CSS display value to set (e.g., 'none', 'block').
 */
function setOverlayDisplay(elementId, displayValue) {
    let element = document.getElementById(elementId);
    if (element) element.style.display = displayValue;
}

/**
 * Populates the edit overlay fields with the given values.
 * @param {string} title - The task title.
 * @param {string} description - The task description.
 * @param {string} dueDate - The task due date.
 */
function setEditOverlayFields(title, description, dueDate) {
    document.getElementById('edit_title').value = title || '';
    document.getElementById('edit_description').value = description || '';
    setDueDateField(dueDate);
}

/**
 * Sets the due date in the edit overlay.
 * @param {string} dueDate - The due date of the task.
 */
function setDueDateField(dueDate) {
    if (dueDate) {
        let formattedDate = formatDateToLocal(dueDate);
        document.getElementById('edit_due_date').value = formattedDate;
    } else {
        document.getElementById('edit_due_date').value = '';
    }
}

/**
 * Converts a date string to a local date string format.
 * @param {string} date - The date to format.
 * @returns {string} - The formatted date string in YYYY-MM-DD format.
 */
function formatDateToLocal(date) {
    let localDate = new Date(date);
    let offsetDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().substr(0, 10);
}

/**
 * Renders the assigned contacts in the task edit overlay.
 * @param {Array<string>} assignedTo - List of assigned contacts' names.
 */
function renderAssignedContacts(assignedTo) {
    let assignedContainer = document.querySelector('.selected-contacts');
    assignedContainer.innerHTML = '';
    if (assignedTo && assignedTo.length > 0) {
        assignedTo.forEach(contact => {
            assignedContainer.innerHTML += renderAssignedContactsTemplate(contact);
        });
    } else {
        assignedContainer.innerHTML = `<p>No contacts assigned</p>`;
    }
}

/**
 * Speichert alle Änderungen an einer Aufgabe, indem mehrere Funktionen parallel aufgerufen werden.
 * @async
 * @returns {Promise<void>} Eine Promise, die auf die erfolgreiche Speicherung wartet.
 */
async function saveTaskChanges() {
    try {
        await saveAllTaskChanges();
        hideEditOverlay();
        initRender();
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}


/**
 * Saves all changes made to the task by calling multiple functions in parallel.
 * @async
 * @returns {Promise<void>} - A promise that resolves when all changes have been successfully saved.
 */
async function saveAllTaskChanges() {
    if (!validateDate()) {
        console.log("Date validation failed, changes not saved.");
        return;
    }

    // Proceed to save if the date is valid
    return Promise.all([
        saveEditTitleToFirebase(),
        saveEditDescriptionToFirebase(),
        saveEditDateToFirebase(),
        saveEditSubtasksToFirebase(),
        saveEditPrioToFirebase(),
        updateAssignedContacts(currentCardID)
    ]);
}

/**
 * Enables or disables the submit button based on the date validation.
 * If the date is valid, it removes the inline background color to allow CSS hover effects.
 * If the date is invalid, it disables the button and sets the background to gray.
 */
function toggleSubmitButton() {
    const submitButton = document.querySelector('.ok_button');

    if (validateDate()) {
        submitButton.disabled = false;
        submitButton.style.removeProperty('background-color'); // Remove inline background color to allow CSS to take over
    } else {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = 'gray'; // Set background color for disabled state
    }
}

/**
 * Prevents form submission unless the date is valid.
 * If the date is invalid, the submission is prevented.
 * @param {Event} e - The event object for the form submission.
 * @returns {Promise<void>} - A promise that resolves after the task changes are saved.
 */
document.getElementById('editTaskForm').addEventListener('submit', async function (e) {
    if (!validateDate()) {
        e.preventDefault(); // Prevent form submission if the date is invalid
        return;
    }
    await saveAllTaskChanges();
});

/**
 * Adds an event listener for real-time validation during input.
 * The submit button state is toggled based on the validation.
 */
document.getElementById('edit_due_date').addEventListener('input', toggleSubmitButton);

/**
 * Adds an event listener for real-time validation during input.
 * This ensures the date input is validated on every input change.
 */
document.getElementById('edit_due_date').addEventListener('input', validateDate);


function preselectPriority(priority) {
    console.log(priority);
    const urgentButton = document.getElementById('edit_urgentIcon');
    const mediumButton = document.getElementById('edit_mediumIcon');
    const lowButton = document.getElementById('edit_lowIcon');
    urgentButton.className = 'urgentStatus';
    mediumButton.className = 'urgentStatus';
    lowButton.className = 'urgentStatus';
    if (priority == 'urgent') {
        togglePriority(urgentButton, 'edit_urgent_selected', iconPaths, 'urgent')
    } else if (priority === 'medium') {
        mediumButton.classList.add('edit_medium_selected');
    } else if (priority === 'low') {
        lowButton.classList.add('edit_low_selected');
    }
}

/**
 * Validates the due date input to ensure it is not in the past.
 * Displays an error message and marks the input as invalid if the date is invalid.
 * Removes the error and marks the input as valid if the date is correct.
 * @returns {boolean} - Returns true if the date is valid, false otherwise.
 */
function validateDate() {
    let dueDateInput = document.getElementById('edit_due_date');
    let selectedDate = new Date(dueDateInput.value);
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
        document.getElementById('date-error').style.display = 'block';
        dueDateInput.setCustomValidity("Invalid date");
        return false; // Invalid date
    } else {
        document.getElementById('date-error').style.display = 'none';
        dueDateInput.setCustomValidity("");
        return true; // Valid date
    }
}

/**
 * Saves the edited title of the task to Firebase.
 * @async
 * @returns {Promise<Response>} The fetch response from Firebase.
 */
async function saveEditTitleToFirebase() {
    let title = document.getElementById('edit_title').value;
    return fetchTask(`/addedTasks/${currentCardID}/title`, title, 'PUT');
}

/**
 * Saves the edited description of the task to Firebase.
 * @async
 * @returns {Promise<Response>} The fetch response from Firebase.
 */
async function saveEditDescriptionToFirebase() {
    let description = document.getElementById('edit_description').value;
    return fetchTask(`/addedTasks/${currentCardID}/description`, description, 'PUT');
}

/**
 * Saves the edited due date of the task to Firebase.
 * @async
 * @returns {Promise<Response>} The fetch response from Firebase.
 */
async function saveEditDateToFirebase() {
    let dueDate = document.getElementById('edit_due_date').value;
    return fetchTask(`/addedTasks/${currentCardID}/dueDate`, dueDate, 'PUT');
}

/**
 * Updates the assigned contacts for a task in Firebase.
 * @async
 * @param {string} taskID - The ID of the task whose contacts are to be updated.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
async function updateAssignedContacts(taskID) {
    let checkedContacts = document.querySelectorAll('.custom-option input[type="checkbox"]:checked');
    let assignedContacts = Array.from(checkedContacts).map(checkbox => checkbox.value);
    try {
        await fetchTask(`/addedTasks/${taskID}/assigned`, assignedContacts, 'PUT');
    } catch (error) {
        console.error('Error updating contacts:', error);
    }
}

/**
 * Saves the edited subtasks of the task to Firebase.
 * @async
 * @returns {Promise<Response>} The fetch response from Firebase.
 */
async function saveEditSubtasksToFirebase() {
    let response = await fetchTask(`/addedTasks/${currentCardID}/subtasks`, editSubtasks, 'PUT');
    await renderExistingSubtasks(currentCardID);
    return response;
}

/**
 * Saves the edited priority level of the task to Firebase if it's not 'none'.
 * @async
 * @returns {Promise<Response|null>} The fetch response from Firebase, or null if no update was made.
 */
async function saveEditPrioToFirebase() {
    if (currentUrgency !== 'none') {
        return fetchTask(`/addedTasks/${currentCardID}/urgency`, currentUrgency, 'PUT');
    }
    return null;
}

/**
 * Sets up event listeners for priority icons when the DOM is fully loaded.
 * This ensures that clicking on any priority icon will update the task's priority in the edit overlay.
 */
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('edit_urgentIcon').addEventListener('click', function () {
        setPriorityInEditOverlay('urgent');
    });

    document.getElementById('edit_mediumIcon').addEventListener('click', function () {
        setPriorityInEditOverlay('medium');
    });

    document.getElementById('edit_lowIcon').addEventListener('click', function () {
        setPriorityInEditOverlay('low');
    });
});

/**
 * Sets the priority icon and style in the edit overlay based on the selected priority.
 * @param {string} selectedPriority - The selected priority (e.g., 'urgent', 'medium', 'low').
 */
function setPriorityInEditOverlay(selectedPriority) {
    Object.keys(priorityMapping).forEach(priority => {
        let button = document.getElementById(priorityMapping[priority].buttonId);
        button.classList.remove('edit_urgent_selected', 'edit_medium_selected', 'edit_low_selected');
        button.querySelector('img').src = priorityMapping[priority].defaultIcon;
    });

    let selectedButton = document.getElementById(priorityMapping[selectedPriority]?.buttonId);
    if (selectedButton) {
        selectedButton.classList.add(priorityMapping[selectedPriority]?.selectedClass);
        selectedButton.querySelector('img').src = priorityMapping[selectedPriority]?.whiteIcon;
    }
}

/**
 * Toggles the priority button selection and updates the UI with new priority settings.
 * @param {HTMLElement} button - The button element that was clicked.
 * @param {string} selectedClass - The CSS class for the selected button.
 * @param {Object} iconPaths - The paths for the default and hover icons.
 * @param {string} urgency - The urgency level ('urgent', 'medium', 'low').
 */
function togglePriority(button, selectedClass, iconPaths, urgency) {
    currentUrgency = urgency;
    let buttons = document.querySelectorAll('.urgency button');
    buttons.forEach(btn => {
        btn.classList.remove('edit_urgent_selected', 'edit_medium_selected', 'edit_low_selected');
        let img = btn.querySelector('img');
        img.src = iconPaths[btn.id].defaultIcon;
    });
    button.classList.add(selectedClass);
    let img = button.querySelector('img');
    img.src = iconPaths[button.id].hoverIcon;
}

/**
 * Returns a random RGB color.
 * @returns {string} - A random RGB color string.
 */
function getRandomRgbColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Returns the initials of a contact name.
 * @param {string} name - The full name of the contact.
 * @returns {string} - The initials of the contact.
 */
function getInitials(name) {
    return name === '' ? null : name.split(' ').map(word => word[0]).join('').toUpperCase();
}


/**
 * Hides the edit overlay.
 */
function hideEditOverlay() {
    let editOverlay = document.getElementById('edit_task_overlay_background');
    if (editOverlay) {
        editOverlay.style.display = 'none';
    } else {
        console.error('Edit overlay element not found');
    }
}

/**
 * Renders the assigned contacts in the edit overlay, fetching the full list of contacts and marking the already assigned ones.
 * 
 * @async
 * @param {string} taskID - The ID of the task to render assigned contacts for.
 * @returns {Promise<void>} - A promise that resolves when the rendering is complete.
 */
async function renderAssignedContactsInEditOverlay(taskID) {
    let selectWrapper = document.querySelector('.select-options');
    let contacts = await fetchTask(`/contacts`, null, 'GET') || {};
    let assignedContacts = await highlightAlreadyAssignedContacts(taskID);

    if (contacts && contacts !== 'N/A') {
        selectWrapper.innerHTML = Object.values(contacts).map(contact => {
            let isAssigned = assignedContacts.includes(contact.name);
            return renderAssignedContactsInEditOverlayTemplate(contact, isAssigned);
        }).join('') || 'No contacts available';
        addContactOptionListeners();
    }
}

/**
 * Adds event listeners to all checkboxes in the contact selection list.
 */
function addCheckboxListeners() {
    let checkboxes = document.querySelectorAll('.custom-option input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            updateContactStyle(this);
        });
        updateContactStyle(checkbox);
    });
}

/**
 * Fetches the already assigned contacts for a given task.
 * @async
 * @param {string} taskID - The ID of the task to get the assigned contacts for.
 * @returns {Promise<Array>} - A promise that resolves with the list of assigned contacts.
 */
async function highlightAlreadyAssignedContacts(taskID) {
    let assignedContacts = await fetchTask(`/addedTasks/${taskID}/assigned`, null, 'GET');
    return assignedContacts || [];
}

/**
 * Returns the appropriate CSS style for a contact based on whether they are assigned or not.
 * @param {boolean} isAssigned - Whether the contact is already assigned.
 * @returns {string} - The appropriate CSS style string for the contact.
 */
function returnStyleBasedOnContactAssignStatus(isAssigned) {
    return `background-color: ${isAssigned ? 'rgba(42, 54, 71, 1)' : 'white'}; color: ${isAssigned ? 'white' : 'black'}`;
}

/**
 * Adds event listeners to both containers and checkboxes to toggle selection.
 */
function addContactOptionListeners() {
    let options = document.querySelectorAll('.custom-option');
    options.forEach(option => {
        let checkbox = option.querySelector('input[type="checkbox"]');
        option.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            updateContactStyle(checkbox);
        });
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            updateContactStyle(checkbox);
        });
        updateContactStyle(checkbox);
    });
}

/**
 * Updates the visual style of a contact in the list based on whether the checkbox is checked or not.
 * 
 * @param {HTMLInputElement} checkbox - The checkbox element for the contact.
 */
function updateContactStyle(checkbox) {
    let customOption = checkbox.closest('.custom-option');
    if (checkbox.checked) {
        customOption.style.backgroundColor = 'rgb(9, 25, 49)';
        customOption.style.color = 'white';
    } else {
        customOption.style.backgroundColor = 'white';
        customOption.style.color = 'black';
    }
}
/**
 * Fetches existing subtasks for a task by task ID.
 * @param {string} taskID - The task ID to fetch subtasks for.
 * @returns {Promise<Array>} - A promise that resolves with the list of subtasks.
 */
async function getExistingSubtasks(taskID) {
    return await fetchTask(`/addedTasks/${taskID}/subtasks`, null, 'GET');
}

/**
 * Renders the existing subtasks for the given task ID.
 * @param {string} taskID - The ID of the task whose subtasks are to be rendered.
 */
async function renderExistingSubtasks(taskID) {
    let subtaskList = document.getElementById('edit_subtaskList');
    subtaskList.innerHTML = '';
    editSubtasks = await getExistingSubtasks(taskID);
    if (editSubtasks) {
        editSubtasks.forEach((subtask, i) => {
            subtaskList.innerHTML += createSubtaskListItemTemplateForEdit(i, subtask, taskID);
        });
    }
}

/**
 * Edits a subtask in the edit overlay by replacing its HTML content with an editable form.
 * @param {number} index - The index of the subtask to edit.
 * @param {string} taskID - The ID of the task containing the subtask.
 */
function editSubtaskInEditOverlay(index, taskID) {
    let subtaskListItem = document.getElementById(`editSubtaskListItem${index}`);
    let subtaskText = editSubtasks[index];
    subtaskListItem.innerHTML = createSubtaskEditTemplateForEdit(index, subtaskText, taskID);
}

/**
 * Adds a new subtask to the list and updates Firebase.
 * @async
 */
async function addEditSubtask() {
    let subtaskInput = document.getElementById('edit_subtasks');
    let newSubtask = subtaskInput.value.trim();
    if (!editSubtasks) {
        editSubtasks = [];
    }
    if (newSubtask) {
        editSubtasks.push(newSubtask);
        await fetchTask(`/addedTasks/${currentCardID}/subtasks`, editSubtasks, 'PUT');
        subtaskInput.value = '';
        await renderExistingSubtasks(currentCardID);
    }
}

/**
 * Saves the edited subtask value into the `editSubtasks` array.
 * @param {number} index - The index of the subtask to save.
 */
function saveEditSubtask(index) {
    let input = document.getElementById(`editSubtaskEditInput${index}`);
    editSubtasks[index] = input.value;
    saveEditSubtasksToFirebase()
    renderExistingSubtasks(currentCardID)
}

/*
 * Deletes a subtask from the list and updates the backend.
 * 
 * @param {number} index - The index of the subtask to delete.
 * @param {string} taskID - The ID of the task to which the subtask belongs.
 * @returns {Promise<void>} A promise that resolves once the subtask is deleted and the UI is updated.
 */
async function deleteEditSubtask(index, taskID) {
    editSubtasks.splice(index, 1);
    await fetchTask(`/addedTasks/${taskID}/subtasks`, editSubtasks, 'PUT');
    await renderExistingSubtasks(taskID);
}

/**
 * Toggles the visibility of the select box when the select trigger is clicked.
 */
document.querySelector('.select-trigger').addEventListener('click', function () {
    let selectBox = document.querySelector('.select-box');
    selectBox.classList.toggle('active');
});

/**
 * Closes the select box if a click is detected outside of it.
 * 
 * @param {Event} e - The click event.
 */
window.addEventListener('click', function (e) {
    let selectBox = document.querySelector('.select-box');
    if (!selectBox.contains(e.target) && selectBox.classList.contains('active')) {
        selectBox.classList.remove('active');
    }
});