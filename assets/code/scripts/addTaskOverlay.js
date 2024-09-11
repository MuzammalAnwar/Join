/**
 * Displays the task overlay by showing the overlay element and animating it with a slide-in effect.
 * The element is displayed in a 'flex' layout.
 */
function showOverlay() {
    let overlay = document.getElementById('taskOverlay');
    overlay.style.display = 'flex';
    overlay.querySelector('.overlay').classList.remove('slide-out');
    overlay.querySelector('.overlay').classList.add('slide-in');
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
