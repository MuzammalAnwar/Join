/**
 * Allows a drop event to happen by preventing the default behavior.
 * Highlights the drop target if it is a valid drop area.
 *
 * @param {DragEvent} event - The drag event that is triggered when an item is dragged over a potential drop target.
 */
function allowDrop(event) {
    event.preventDefault();
    let dropTarget = event.target.closest('.taskContainer');
    if (dropTarget) {
        dropTarget.classList.add('drop-highlight');
        dropTarget.classList.add('drop-active');
    }
}

/**
 * Handles the dragenter event by highlighting the valid drop target.
 *
 * @param {DragEvent} event - The event triggered when an item is dragged into a potential drop target.
 */
function dragenter(event) {
    event.preventDefault();
    let dropTarget = event.currentTarget;
    if (dropTarget && dropTarget.classList.contains('taskContainer')) {
        dropTarget.classList.add('drop-highlight');
        dropTarget.classList.add('drop-active');
    }
}

/**
 * Sets the dragged element's ID into the data transfer object for retrieval when dropped.
 *
 * @param {DragEvent} event - The drag event triggered when an item starts being dragged.
 */
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

/**
 * Handles the dragleave event by removing the highlight from the drop target when the dragged item leaves it.
 *
 * @param {DragEvent} event - The event triggered when a dragged item leaves a potential drop target.
 */
function dragleave(event) {
    let dropTarget = event.target.closest('.taskContainer');
    if (dropTarget) {
        dropTarget.classList.remove('drop-highlight');
        dropTarget.classList.remove('drop-active');
    }
}

/**
 * Handles the drop event. Moves the dragged element to the drop target and updates its category.
 * Removes the drop highlight from all containers after the drop.
 *
 * @param {DragEvent} event - The event triggered when an item is dropped into a valid drop target.
 */
function drop(event) {
    event.preventDefault();
    document.querySelectorAll('.taskContainer').forEach(container => {
        container.classList.remove('drop-highlight');
        container.classList.remove('drop-active');
    });
    let taskId = event.dataTransfer.getData("text");
    let taskElement = document.getElementById(taskId);
    let dropTarget = event.target.closest('.taskContainer');
    if (dropTarget) {
        dropTarget.appendChild(taskElement);
        let newCategory = dropTarget.id.replace('category', '');
        newCategory = newCategory.charAt(0).toLowerCase() + newCategory.slice(1);
        updateTaskCategory(taskId, newCategory);
    }
}

/**
 * Handles the dragend event by removing the drop highlight from all containers after dragging ends.
 * Checks if any category is left with no tasks.
 *
 * @param {DragEvent} event - The event triggered when dragging ends.
 */
function dragend(event) {
    document.querySelectorAll('.taskContainer').forEach(container => {
        container.classList.remove('drop-highlight');
        container.classList.remove('drop-active');
    });
    checkIfCategoryHasNoTasks();
}

/**
 * Initializes event listeners for drag events.
 */
function initializeEventListeners() {
    document.querySelectorAll('.taskContainer').forEach(container => {
        container.addEventListener('dragover', allowDrop);
        container.addEventListener('dragenter', dragenter);
        container.addEventListener('dragleave', dragleave);
        container.addEventListener('drop', drop);
        container.addEventListener('dragend', dragend);
    });
}

document.addEventListener('DOMContentLoaded', initializeEventListeners);
