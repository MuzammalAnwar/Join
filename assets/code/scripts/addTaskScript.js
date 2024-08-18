let tasks = [];
let selectedStatus = 'none';
let subtasks = []

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
    let userID = localStorage.getItem('loggedInUserID');
    let taskKey = generateUniqueKey();
    let taskPath = `/${userID}/addedTasks/toDo/${taskKey}`;
    if (!userID) {
        alert('User not logged in.');
        return;
    }
    let task = {
        "title": title.value,
        "description": description.value,
        "assigned": assigned.value,
        "due-date": dueDate.value,
        "category": category.value,
        "subtasks": subtasks,
        "urgency": selectedStatus == 'medium' || selectedStatus == 'low' || selectedStatus == 'urgent' ? selectedStatus : 'none',
        "path": taskPath,
    };

    tasks.push(task);
    console.log(tasks);

    title.value = '';
    description.value = '';
    assigned.value = '';
    dueDate.value = '';
    category.value = '';

    fetchTask(taskPath, task, 'PUT')
    // renderTasks('toDo', 'categoryToDo');
}

function changeImgSource(id, src) {
    document.getElementById(id).src = src;
}

function addSubtask() {
    let input = document.getElementById('subtasks')
    let subtaskList = document.getElementById('subtaskList')
    if (input.value !== '') {
        subtaskList.innerHTML = '';
        subtasks.push(input.value)
        for (let i = 0; i < subtasks.length; i++) {
            subtaskList.innerHTML += /*HTML*/`
            <ul>
                <li><p>${subtasks[i]}</p></li>
            </ul>
            `;
        }
        input.value = '';
    } else {
        alert('Write something')
    }
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

function toggleIcon(iconId, originalSrc, hoverSrc) {
    let icon = document.getElementById(iconId);
    let currentSrc = icon.src.split('/').pop();
    if (currentSrc === originalSrc.split('/').pop()) {
        icon.src = hoverSrc;
    } else {
        icon.src = originalSrc;
    }

}

function clearSubtasks() {
    document.getElementById('subtaskList').innerHTML = '';
    subtasks = [];
}

function checkLoginStatus() {
    if (localStorage.getItem('loggedInUserID')) {
        return;
    } else {
        window.location.href = 'loadingSpinner.html';
    }
}

window.addEventListener('load', checkLoginStatus);