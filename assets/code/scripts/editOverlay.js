const iconPaths = {
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
let editSubtasks = []
let currentCardID;
document.querySelector('.edit_button').addEventListener('click', function () {
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
    currentCardID = taskId
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
    renderAssignedContactsInEditOverlay(taskId)
    renderExistingSubtasks(taskId)
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

function togglePriority(button, selectedClass, iconPaths) {
    const buttons = document.querySelectorAll('.urgency button');
    buttons.forEach(btn => {
        btn.classList.remove('edit_urgent_selected', 'edit_medium_selected', 'edit_low_selected');
        const img = btn.querySelector('img');
        img.src = iconPaths[btn.id].defaultIcon;
    });
    button.classList.add(selectedClass);
    const img = button.querySelector('img');
    img.src = iconPaths[button.id].hoverIcon;
}

function getRandomRgbColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
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

async function renderAssignedContactsInEditOverlay(taskID) {
    let selectWrapper = document.querySelector('.select-options');
    let html = '';
    let contacts = await fetchTask(`/${userID}/contacts`, null, 'GET');
    let assignedContacts = await highlightAlreadyAssignedContacts(taskID);

    if (contacts) {
        let keys = Object.keys(contacts);
        for (let i = 0; i < keys.length; i++) {
            let contact = contacts[keys[i]];
            let isAssigned = assignedContacts.includes(contact.name);
            html += /*HTML*/`
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
    } else {
        html = `No contacts available`;
    }
    selectWrapper.innerHTML = html;
    addCheckboxListeners();
}

function addCheckboxListeners() {
    let checkboxes = document.querySelectorAll('.custom-option input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            updateContactStyle(this);
        });
        updateContactStyle(checkbox);
    });
}

async function highlightAlreadyAssignedContacts(taskID) {
    let assignedContacts = await fetchTask(`/${userID}/addedTasks/${taskID}/assigned`, null, 'GET');
    return assignedContacts || [];
}

function returnStyleBasedOnContactAssignStatus(isAssigned) {
    return `background-color: ${isAssigned ? 'rgba(42, 54, 71, 1)' : 'white'}; color: ${isAssigned ? 'white' : 'black'}`;
}

function updateContactStyle(checkbox) {
    const customOption = checkbox.closest('.custom-option');
    if (checkbox.checked) {
        customOption.style.backgroundColor = 'rgba(42, 54, 71, 1)';
        customOption.style.color = 'white';
    } else {
        customOption.style.backgroundColor = 'white';
        customOption.style.color = 'black';
    }
}

async function updateAssignedContacts(taskID) {
    let checkedContacts = document.querySelectorAll('.custom-option input[type="checkbox"]:checked');
    let assignedContacts = [];
    checkedContacts.forEach(checkbox => {
        assignedContacts.push(checkbox.value);
    });
    try {
        await fetchTask(`/${userID}/addedTasks/${taskID}/assigned`, assignedContacts, 'PUT');
    } catch (error) {
        console.error('Error updating contacts:', error);
    }
}

async function getExistingSubtasks(taskID) {
    return await fetchTask(`/${userID}/addedTasks/${taskID}/subtasks`, null, 'GET');
}

async function renderExistingSubtasks(taskID) {
    let subtaskList = document.getElementById('edit_subtaskList');
    subtaskList.innerHTML = '';
    editSubtasks = await getExistingSubtasks(taskID);
    if (editSubtasks) {
        editSubtasks.forEach((subtask, i) => {
            subtaskList.innerHTML += /*HTML*/`
            <li class="subtaskListItem" id="editSubtaskListItem${i}">
                <p class="subtaskListText">${subtask}</p>
                <div class="subtaskIcons">
                    <img onclick="editSubtaskInEditOverlay(${i}, '${taskID}')" src="../../img/subtaskEditIcon.png" class="subtaskIcon" alt="Edit Icon">
                    <img onclick="deleteEditSubtask(${i},'${taskID}')" src="../../img/subtaskTrashIcon.png" class="subtaskIcon" alt="Trash Icon">
                </div>
            </li>
        `;
        });
    }
}

function editSubtaskInEditOverlay(index, taskID) {
    let subtaskListItem = document.getElementById(`editSubtaskListItem${index}`);
    let subtaskText = editSubtasks[index];
    subtaskListItem.innerHTML = /*HTML*/`
        <div class="subtaskEditContainer">
            <input class="editInput" type="text" value="${subtaskText}" class="subtaskEditInput" id="editSubtaskEditInput${index}">
            <div class="subtaskEditSeparator"></div>
            <div class="subtaskEditIcons">
                <img onclick="renderExistingSubtasks('${taskID}')" src="../../img/subtaskTrashIcon.png" class="subtaskIcon" alt="Cancel Icon">
                <img onclick="saveEditSubtask(${index},'${taskID}')" src="../../img/subtaskAddIcon.png" class="subtaskIcon" alt="Save Icon">
            </div>
        </div>
    `;
}

async function addEditSubtask() {
    const subtaskInput = document.getElementById('edit_subtasks');
    const newSubtask = subtaskInput.value.trim();
    if (newSubtask) {
        editSubtasks.push(newSubtask);
        await fetchTask(`/${userID}/addedTasks/${currentCardID}/subtasks`, editSubtasks, 'PUT');
        subtaskInput.value = '';
        await renderExistingSubtasks(currentCardID);
    }
}

async function saveEditSubtask(index, taskID) {
    let input = document.getElementById(`editSubtaskEditInput${index}`);
    editSubtasks[index] = input.value;
    await fetchTask(`/${userID}/addedTasks/${taskID}/subtasks`, editSubtasks, 'PUT');
    await renderExistingSubtasks(taskID);
}

async function deleteEditSubtask(index, taskID) {
    editSubtasks.splice(index, 1);
    await fetchTask(`/${userID}/addedTasks/${taskID}/subtasks`, editSubtasks, 'PUT');
    await renderExistingSubtasks(taskID);
}

document.querySelector('.select-trigger').addEventListener('click', function () {
    const selectBox = document.querySelector('.select-box');
    selectBox.classList.toggle('active');
});

window.addEventListener('click', function (e) {
    const selectBox = document.querySelector('.select-box');
    if (!selectBox.contains(e.target) && selectBox.classList.contains('active')) {
        selectBox.classList.remove('active');
    }
});

