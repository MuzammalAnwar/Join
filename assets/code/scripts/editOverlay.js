document.querySelector('.edit_button').addEventListener('click', function() {
    const taskId = currentTaskId; 
    const taskTitle = document.getElementById('tall_task_overlay_title').textContent; 
    const taskDescription = document.getElementById('task_description').textContent;
    const taskDueDate = document.getElementById('task_due_date').textContent;
    const taskPriority = document.getElementById('prio_name').textContent.toLowerCase();
    const assignedTo = [...document.querySelectorAll('.profile-circle')].map(el => el.textContent); 
    showEditOverlay(taskId, taskTitle, taskDescription, taskDueDate, taskPriority, assignedTo); 
});

function showEditOverlay(taskId, title, description, dueDate, priority, assignedTo) {
    hideTallTaskOverlay(); 
    
    let tallOverlay = document.getElementById('tall_task_overlay_background');
    if (tallOverlay) {
        tallOverlay.style.display = 'none'; 
    }
    
    let editOverlay = document.getElementById('edit_task_overlay_background');
    if (editOverlay) {
        editOverlay.style.display = 'flex'; 
        document.getElementById('edit_title').value = title || 'No title provided';
        document.getElementById('edit_description').value = description || 'No description provided';
        
        if (dueDate) {
            const localDate = new Date(dueDate);
            const offsetDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
            const formattedDate = offsetDate.toISOString().substr(0, 10);
            document.getElementById('edit_due_date').value = formattedDate;
        } else {
            document.getElementById('edit_due_date').value = ''; 
        }

        setPriorityInEditOverlay(priority);

        const assignedContainer = document.querySelector('.selected-contacts');
        assignedContainer.innerHTML = ''; 
        
        if (assignedTo && assignedTo.length > 0) {
            assignedTo.forEach(contact => {
                assignedContainer.innerHTML += `
                    <div class="profileCircleAndNameForFullTaskView"> 
                        <div class="profile-circle" style="background-color: ${getRandomRgbColor()};">
                            ${getInitials(contact)}
                        </div>
                        <span>${contact}</span>
                    </div>
                `;
            });
        } else {
            assignedContainer.innerHTML = `<p>No contacts assigned</p>`;
        }
    } else {
        console.error('Edit overlay element not found');
    }
}

function saveTaskChanges(event) {
    event.preventDefault();

    const selectedElement = document.querySelector('.urgent_selected, .medium_selected, .low_selected');
    let selectedPriority = '';
    if (selectedElement) {
        selectedPriority = selectedElement.classList[0].split('_')[0];
    } else {
        alert("Please select a priority before saving.");
        return;
    }

    const updatedTask = {
        title: document.getElementById('edit_title').value,
        description: document.getElementById('edit_description').value,
        dueDate: document.getElementById('edit_due_date').value,
        priority: selectedPriority,
        assignedTo: [...document.querySelectorAll('.selected-contacts .profile-circle')].map(el => el.textContent),
        subtasks: [...document.querySelectorAll('#edit_subtaskList li')].map(li => ({
            title: li.textContent,
            completed: li.classList.contains('completed')
        }))
    };

    const taskId = currentTaskId;

    console.log('Saving task:', taskId, updatedTask); 

    fetchTask(`/tasks/${taskId}`, updatedTask, 'PUT')
    .then(responseData => {
        console.log('Response data:', responseData); 
        updateTaskInBoard(taskId, updatedTask);
        hideEditOverlay();
    })
    .catch(error => {
        console.error('Fehler beim Speichern der Änderungen:', error);
        alert('Es gab einen Fehler beim Speichern der Änderungen. Bitte versuche es erneut.');
    });
}



function updateTaskInBoard(taskId, updatedTask) {
    const taskElement = document.getElementById(`task${taskId}`);
    if (taskElement) {
        taskElement.querySelector('.title').textContent = updatedTask.title;
        taskElement.querySelector('.description').textContent = updatedTask.description;
        taskElement.querySelector('#task_due_date').textContent = updatedTask.dueDate;
        taskElement.querySelector('#prio_name').textContent = updatedTask.priority;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('edit_urgentIcon').addEventListener('click', function() {
        setPriorityInEditOverlay('urgent');
    });

    document.getElementById('edit_mediumIcon').addEventListener('click', function() {
        setPriorityInEditOverlay('medium');
    });

    document.getElementById('edit_lowIcon').addEventListener('click', function() {
        setPriorityInEditOverlay('low');
    });
});

function setPriorityInEditOverlay(selectedPriority) {
    const priorityMapping = {
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

    Object.keys(priorityMapping).forEach(priority => {
        const button = document.getElementById(priorityMapping[priority].buttonId);
        button.classList.remove('edit_urgent_selected', 'edit_medium_selected', 'edit_low_selected');
        button.querySelector('img').src = priorityMapping[priority].defaultIcon;
    });

    const selectedButton = document.getElementById(priorityMapping[selectedPriority].buttonId);
    selectedButton.classList.add(priorityMapping[selectedPriority].selectedClass);
    selectedButton.querySelector('img').src = priorityMapping[selectedPriority].whiteIcon;
}

function getRandomRgbColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

function hideEditOverlay() {
    let editOverlay = document.getElementById('edit_task_overlay_background');
    if (editOverlay) {
        editOverlay.style.display = 'none'; 
    } else {
        console.error('Edit overlay element not found');
    }
}

