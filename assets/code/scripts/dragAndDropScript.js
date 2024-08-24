function allowDrop(event) {
    event.preventDefault();
    let dropTarget = event.target.closest('.taskContainer');
    if (dropTarget) {
        dropTarget.classList.add('drop-highlight');
    }
}

function dragenter(event) {
    event.preventDefault();
    let dropTarget = event.currentTarget;
    if (dropTarget && dropTarget.classList.contains('taskContainer')) {
        dropTarget.classList.add('drop-highlight');
    }
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function dragleave(event) {
    let dropTarget = event.target.closest('.taskContainer');
    if (dropTarget) {
        dropTarget.classList.remove('drop-highlight');
    }
}

function drop(event) {
    event.preventDefault();
    document.querySelectorAll('.taskContainer').forEach(container => {
        container.classList.remove('drop-highlight');
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

function dragend(event) {
    document.querySelectorAll('.taskContainer').forEach(container => {
        container.classList.remove('drop-highlight');
    });
    checkIfCategoryHasNoTasks();
}
