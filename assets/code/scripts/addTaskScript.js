let tasks = [];


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
        "subtasks": subTasks.value
    };

    tasks.push(task);
    console.log(tasks);
    
    title.value = '';
    description.value = '';
    assigned.value = '';
    dueDate.value = '';
    category.value = '';
    subTasks.value = '';
}