let tasks = [];
let pathIndex = 1;
let selectedStatus = 'none';

document.addEventListener('DOMContentLoaded', function () {
    const urgencyButtons = document.querySelectorAll('.urgentStatus');

    urgencyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const isSelected = this.classList.contains('urgent-selected') ||
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
    let subTasks = document.getElementById('subtasks');

    let task = {
        "title": title.value,
        "description": description.value,
        "assigned": assigned.value,
        "due-date": dueDate.value,
        "category": category.value,
        "subtasks": subTasks.value,
        "urgency": selectedStatus == 'medium' || selectedStatus == 'low' || selectedStatus == 'urgent' ? selectedStatus : 'none'
    };

    tasks.push(task);
    console.log(tasks);

    title.value = '';
    description.value = '';
    assigned.value = '';
    dueDate.value = '';
    category.value = '';
    subTasks.value = '';

    fetchTask(("/addedTasks/toDo/task" + pathIndex), task, 'PUT')
    pathIndex++;
}

function reset() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('assigned').value = '';
    document.getElementById('due-date').value = '';
    document.getElementById('category').value = '';
    document.getElementById('subtasks').value = '';
}