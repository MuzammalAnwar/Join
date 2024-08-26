let currentTaskId;

async function showTallTaskOverlay(taskId, title, category, urgency, dueDate, description, subTasks) {
    currentTaskId = taskId;
    let overlay = document.getElementById('tall_task_overlay_background');
    if (overlay) {
        overlay.style.display = 'flex';
    } else {
        console.error('Overlay background element not found');
        return;
    }

    let tallOverlay = document.getElementById('tall_task_overlay');
    if (tallOverlay) {
        tallOverlay.classList.remove('slide-out');
        tallOverlay.classList.add('slide-in');
    } else {
        console.error('Tall overlay element not found');
        return;
    }

    document.getElementById('tall_task_overlay_title').textContent = title || 'No title provided';
    let categoryElement = document.getElementById('task_category');
    if (categoryElement) {
        categoryElement.textContent = category || 'No category';
    }
    
    document.getElementById('task_due_date').textContent = dueDate || 'No due date';
    document.getElementById('task_description').textContent = description || 'No description provided';
    
    let subtasksContainer = document.getElementById('subtasks_container');
    if (subtasksContainer) {
        subtasksContainer.innerHTML = generateSubtaskList(subTasks);
    } else {
        console.error('Element with ID "subtasks_container" not found');
    }

    let prioText = 'Low';
    let prioIconPath = '../../img/lowIcon.png';

    if (urgency === 'medium') {
        prioText = 'Medium';
        prioIconPath = '../../img/mediumIcon.png';
    } else if (urgency === 'urgent') {
        prioText = 'Urgent';
        prioIconPath = '../../img/urgentIcon.png';
    }

    document.getElementById('prio_name').textContent = prioText;
    document.getElementById('prio_icon').src = prioIconPath;

    if (categoryElement) {
        categoryElement.className = ''; // Remove all existing classes
        categoryElement.classList.remove('categoryTechnicalTaskOverlay', 'categoryUserStoryOverlay');
        if (category === 'Technical Task') {
            categoryElement.classList.add('categoryTechnicalTaskOverlay');
        } else if (category === 'User Story') {
            categoryElement.classList.add('categoryUserStoryOverlay');
        }
    }
}


function generateSubtaskList(subTasks) {
    console.log('Generating subtask list from:', subTasks); // Debugging line

    // Check if subTasks is a string with comma-separated values
    if (typeof subTasks === 'string') {
        // Split the string into an array
        subTasks = subTasks.split(',');
    }

    // Check if subTasks is a valid array
    if (!Array.isArray(subTasks) || subTasks.length === 0) {
        return '<p>No subtasks available</p>';
    }

    let subtaskHtml = '<ul class="subtask-list">';
    subTasks.forEach(subtask => {
        subtaskHtml += `
            <div class="sub_task_position">
                <input class="checkbox" type="checkbox">
                <label class="sub_task">${subtask}</label>
            </div>`;
    });
    subtaskHtml += '</ul>';

    return subtaskHtml;
}

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

        console.log(`Task ${currentTaskId} successfully deleted`);
    } catch (error) {
        console.error(`Failed to delete task ${currentTaskId}:`, error);
    }
}



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
        }, 500);
    } else {
        console.error('Tall overlay element not found');
    }
}
