let tasks = [];
let selectedStatus = 'none';
let subtasks = []
let taskPath;
let userID = checkLoginStatus();

document.addEventListener('DOMContentLoaded', function () {
    let urgencyButtons = document.querySelectorAll('.urgentStatus');
    urgencyButtons.forEach(button => {
        button.addEventListener('click', function () {
            let isSelected = this.classList.contains('urgent-selected') ||
                this.classList.contains('medium-selected') ||
                this.classList.contains('low-selected');
            if (isSelected) {
                this.classList.remove('urgent-selected', 'medium-selected', 'low-selected');
                this.style.boxShadow = '';
                selectedStatus = 'none';
            } else {
                urgencyButtons.forEach(btn => {
                    btn.classList.remove('urgent-selected', 'medium-selected', 'low-selected');
                    btn.style.boxShadow = '';
                });
                selectedStatus = this.getAttribute('data-status');
                if (selectedStatus === 'urgent') {
                    this.classList.add('urgent-selected');
                } else if (selectedStatus === 'medium') {
                    this.classList.add('medium-selected');
                } else if (selectedStatus === 'low') {
                    this.classList.add('low-selected');
                }
                this.style.boxShadow = 'none';
            }
        });
    });
});

function addToTask(event) {
    event.preventDefault();

    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let assigned = document.getElementById('assigned');
    let dueDate = document.getElementById('due-date');
    let category = document.getElementById('category');
    let taskKey = generateUniqueKey();
    taskPath = `/${userID}/addedTasks/${taskKey}`;
    let task = {
        "title": title.value,
        "description": description.value,
        "assigned": assigned.value,
        "dueDate": dueDate.value,
        "category": category.value,
        "subtasks": subtasks,
        "urgency": selectedStatus == 'medium' || selectedStatus == 'low' || selectedStatus == 'urgent' ? selectedStatus : 'none',
        "path": taskPath,
        "taskCategory": 'toDo'
    };

    tasks.push(task);
    console.log(tasks);

    title.value = '';
    description.value = '';
    assigned.value = '';
    dueDate.value = '';
    category.value = '';

    fetchTask(taskPath, task, 'PUT');
}

function changeImgSource(id, src) {
    document.getElementById(id).src = src;
}

function addSubtask() {
    let input = document.getElementById('subtasks');
    let subtaskList = document.getElementById('subtaskList');
    if (input.value !== '') {
        subtaskList.innerHTML = '';
        subtasks.push(input.value);
        renderSubtasks();
        input.value = '';
    } else {
        alert('Write something');
    }
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

    // Replace the text with an input field and icons
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
    renderSubtasks(); // Re-render the list with the updated value
}

function deleteSubtask(index) {
    subtasks.splice(index, 1);
    renderSubtasks(); // Re-render the list after deleting the item
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
    const input = document.getElementById(inputId);
    const addIcon = document.getElementById(addIconId);
    const cancelIcon = document.getElementById(cancelIconId);
    const saveIcon = document.getElementById(saveIconId);

    input.addEventListener('focus', function () {
        addIcon.classList.add('hidden');
        cancelIcon.classList.remove('hidden');
        saveIcon.classList.remove('hidden');
    });

    input.addEventListener('blur', function () {
        addIcon.classList.remove('hidden');
        cancelIcon.classList.add('hidden');
        saveIcon.classList.add('hidden');
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
        for (let i = 0; i < keys.length; i++) {
            let contact = contacts[keys[i]];
            // Create the option div
            let option = document.createElement('div');
            option.classList.add('custom-option');
            option.setAttribute('data-value', contact.name);

            // Create the checkbox element
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = contact.name;

            // Create a span to hold the contact name
            let label = document.createElement('span');
            label.textContent = contact.name;

            // Append the label and checkbox to the option
            option.appendChild(label);
            option.appendChild(checkbox);

            // Append the option to the select wrapper
            selectWrapper.appendChild(option);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const select = document.querySelector('.custom-select');
    const options = document.querySelector('.custom-options');
    const trigger = document.querySelector('.custom-select-trigger');

    trigger.addEventListener('click', function (e) {
        options.classList.toggle('open');
    });

    options.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent event from bubbling up
    });

    options.addEventListener('click', function (e) {
        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
            options.classList.add('open');
            updateSelectedContacts();
        }
    });

    document.addEventListener('click', function (e) {
        if (!select.contains(e.target)) {
            options.classList.remove('open');
        }
    });

    function updateSelectedContacts() {
        const selected = Array.from(document.querySelectorAll('.custom-option input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);
        trigger.querySelector('span').textContent = selected.length > 0 ? selected.join(', ') : 'Select contacts to assign';
    }
});

window.addEventListener('load', getContacts);
window.addEventListener('load', checkLoginStatus);