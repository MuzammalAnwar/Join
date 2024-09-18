let categoryForAddTask = '';

/**
 * Sets the priority in the task overlay by highlighting the selected priority.
 * It removes the selection from all other priority buttons and resets their icons to default.
 *
 * @param {string} [selectedPriority='medium'] - The priority to be selected (default is 'medium').
 */
function setPriorityInAddTaskOverlay(selectedPriority = 'medium') {
    unsetButtons()
    Object.keys(priorityMapping).forEach(priority => {
        const button = document.getElementById(priorityMapping[priority].buttonId);
        button.classList.remove('urgent-selected', 'medium-selected', 'low-selected');
        button.querySelector('img').src = priorityMapping[priority].defaultIcon;
    });
    let selectedButton = document.getElementById(priorityMapping[selectedPriority].buttonId);
    selectedButton.classList.add(priorityMapping[selectedPriority].selectedClass);
    selectedButton.querySelector('img').src = priorityMapping[selectedPriority].whiteIcon;
    let mediumButtonImg = document.getElementById('edit_mediumIcon');
    let lowButtonImg = document.getElementById('edit_lowIcon');
    let urgentButtonImg = document.getElementById('edit_urgentIcon');
    let mediumButton = document.getElementById('edit_mediumIcon');
    mediumButton.classList.add('medium-selected');
    mediumButtonImg.src = '../../img/mediumIconHover.png';
    urgentButtonImg.src = '../../img/urgentIcon.png';
    lowButtonImg.src = '../../img/lowIcon.png';
}

function unsetButtons() {
    let lowButtonImg = document.getElementById('edit_lowIcon');
    let urgentButtonImg = document.getElementById('edit_urgentIcon');
    lowButtonImg.className = 'urgentStatus';
    urgentButtonImg.className = 'urgentStatus';
}

/**
 * Displays the task overlay and sets the default priority to 'medium'.
 * It also resets any selected contacts within the overlay.
 */
function showOverlay() {
    let overlay = document.getElementById('taskOverlay');
    overlay.style.display = 'flex';
    overlay.querySelector('.overlay').classList.remove('slide-out');
    overlay.querySelector('.overlay').classList.add('slide-in');
    setPriorityInAddTaskOverlay('medium');
    resetSelectedContactsForOverlay();
}

/**
 * Sets the category for the task based on the icon selected from the UI.
 * This is used when clicking the "+" icon to add a task to a specific category.
 *
 * @param {string} selectedCategory - The category selected for the new task.
 */
function setCategoryForAddTaskBasedOnPlusIcon(selectedCategory) {
    categoryForAddTask = selectedCategory;
    console.log(categoryForAddTask);
}


/**
 * Resets all selected contacts in the dropdown menu, including background colors.
 */
function resetSelectedContactsForOverlay() {
    let selectedContactsContainer = document.querySelector('.selected-contacts');
    selectedContactsContainer.innerHTML = '';
    document.getElementById('overlayContactsText').innerText = 'Select contacts to assign';
    getContacts()
}

/**
 * Hides the task overlay by applying a slide-out animation and then hiding the element after a delay.
 * The element's display is set to 'none' after the animation completes (500ms).
 */
function hideOverlay() {
    let overlay = document.getElementById('taskOverlay');
    overlay.querySelector('.overlay').classList.remove('slide-in');
    overlay.querySelector('.overlay').classList.add('slide-out');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}

/**
 * Sets the selected priority in the edit overlay by updating the button styles and icons
 * based on the selected priority. It resets the styles of all other priority buttons.
 *
 * @param {string} selectedPriority - The key of the selected priority ('urgent', 'medium', 'low').
 */
function setPriorityInEditOverlay(selectedPriority) {
    Object.keys(priorityMapping).forEach(priority => {
        const button = document.getElementById(priorityMapping[priority].buttonId);
        button.classList.remove('edit_urgent_selected', 'edit_medium_selected', 'edit_low_selected');
        button.querySelector('img').src = priorityMapping[priority].defaultIcon;
    });
    let selectedButton = document.getElementById(priorityMapping[selectedPriority].buttonId);
    selectedButton.classList.add(priorityMapping[selectedPriority].selectedClass);
    selectedButton.querySelector('img').src = priorityMapping[selectedPriority].whiteIcon;
}
