let tasks = [];
let selectedStatus = 'none';
let subtasks = []
let taskPath;
let userID = checkLoginStatus();
let today = new Date().toISOString().split('T')[0];
document.getElementById('due-date').setAttribute('min', today);

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
    let dueDate = document.getElementById('due-date');
    let category = document.getElementById('category');
    let taskKey = generateUniqueKey();
    taskPath = `/${userID}/addedTasks/${taskKey}`;
    let task = {
        "title": title.value,
        "description": description.value,
        "assigned": returnSelectedContacts(),
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
    if (input.value !== '') {
        subtasks.push(input.value);
        renderSubtasks();
        input.value = '';
        input.blur();
    } else {
        alert('Please write something');
    }
}

function returnSelectedContacts() {
    return Array.from(document.querySelectorAll('.custom-option input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
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
    renderSubtasks();
}

function deleteSubtask(index) {
    subtasks.splice(index, 1);
    renderSubtasks();
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

document.addEventListener('DOMContentLoaded', function () {
    toggleInputIcons('subtasks', 'subtaskAdd', 'subtaskCancel', 'subtaskSave');
});

function getContacts() {
    let taskPath = `/${userID}/contacts`;
    let selectWrapper = document.querySelector('.custom-options');
    fetchTask(taskPath, null, 'GET').then(contacts => {
        let keys = Object.keys(contacts);
        let html = '';
        for (let i = 0; i < keys.length; i++) {
            let contact = contacts[keys[i]];
            html += /*HTML*/`
                <div class="custom-option" data-value="${contact.name}">
                    <div class="profileCircleAndName"> 
                        <div class="profile-circle" style="background-color: ${contact.color};">
                            ${getInitials(contact.name)}
                        </div>
                        <span>${contact.name}</span>
                    </div>
                    <input type="checkbox" value="${contact.name}">
                </div>
            `;
        }
        selectWrapper.innerHTML = html;


        document.querySelectorAll('.custom-option').forEach(option => {
            option.addEventListener('click', handleOptionClick);
        });
    });
}

function updateTriggerText(selected) {
    let trigger = document.querySelector('.custom-select-trigger');
    trigger.querySelector('span').textContent = selected.length > 0 ? '' : 'Select contacts to assign';
}

function addMoreIndicatorIfNeeded(selected, wrapper) {
    if (selected.length > 5) {
        wrapper.innerHTML += '<div class="more-indicator">...</div>';
    }
}

function renderSelectedContacts(selected, wrapper) {
    selected.forEach((contactName, index) => {
        if (index < 5) {
            let contactElement = document.querySelector(`.custom-option[data-value="${contactName}"]`);
            let color = contactElement.querySelector('.profile-circle').style.backgroundColor;
            let initials = contactElement.querySelector('.profile-circle').textContent;
            wrapper.innerHTML += `
                <div class="profile-circle" style="background-color: ${color};">
                    ${initials}
                </div>
            `;
        }
    });
}

function clearSelectedContacts(wrapper) {
    wrapper.innerHTML = '';
}

function getSelectedContacts() {
    let checkboxes = document.querySelectorAll('.custom-option input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

function updateSelectedContacts() {
    let selected = getSelectedContacts();
    let selectedContactsWrapper = document.querySelector('.selected-contacts');

    clearSelectedContacts(selectedContactsWrapper);
    renderSelectedContacts(selected, selectedContactsWrapper);
    addMoreIndicatorIfNeeded(selected, selectedContactsWrapper);
    updateTriggerText(selected);
}

function closeDropdownOnClickOutside(e) {
    let select = document.querySelector('.custom-select');
    let options = document.querySelector('.custom-options');

    if (!select.contains(e.target)) {
        options.classList.remove('open');
    }
}

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

function preventClickBubbling(e) {
    e.stopPropagation();
}

function toggleDropdown() {
    let options = document.querySelector('.custom-options');
    options.classList.toggle('open');
}

function initializeEventListeners() {
    let select = document.querySelector('.custom-select');
    let options = document.querySelector('.custom-options');
    let trigger = document.querySelector('.custom-select-trigger');

    trigger.addEventListener('click', toggleDropdown);
    options.addEventListener('click', preventClickBubbling);
    document.addEventListener('click', closeDropdownOnClickOutside);
}

document.addEventListener('DOMContentLoaded', initializeEventListeners);
window.addEventListener('load', getContacts);
window.addEventListener('load', checkLoginStatus);
window.addEventListener('load', setProfileCircleInitials);