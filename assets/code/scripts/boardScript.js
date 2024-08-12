function initRender() {
    renderTasks()
}

function renderTasks() {
    let categoryToDo = document.getElementById('categoryToDo')
    // let categoryInProgress = document.getElementById('categoryInProgress')
    // let categoryAwaitFeedback = document.getElementById('categoryAwaitFeedback')
    // let categoryDone = document.getElementById('categoryDone')
    fetchTask('/addedTasks/toDo/', null, 'GET').then(taskArray => {
        let keys = Object.keys(taskArray);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let task = taskArray[key];
            categoryToDo.innerHTML += /*HTML*/`
                <div class="task">
                    <p>${task.title}</p>
                </div>
            `;
        }
    });
}

window.addEventListener('load', includeHTML);
window.addEventListener('load', initRender)
