document.querySelector('.edit_button').addEventListener('click', function() {
    const taskId = currentTaskId; 
    const taskTitle = document.getElementById('tall_task_overlay_title').textContent; 
    const taskDescription = document.getElementById('task_description').textContent;
    const taskDueDate = document.getElementById('task_due_date').textContent;
    const taskPriority = document.getElementById('prio_name').textContent.toLowerCase();
    const assignedTo = [...document.querySelectorAll('.profile-circle')].map(el => el.textContent); // Abrufen der zugewiesenen Personen

    console.log("Task Title:", assignedTo); // Überprüfen, ob der Titel korrekt abgerufen wurde
    showEditOverlay(taskId, taskTitle, taskDescription, taskDueDate, taskPriority, assignedTo); 
});

function showEditOverlay(taskId, title, description, dueDate, priority, assignedTo) {
    console.log("showEditOverlay function called with taskId: ", taskId);
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
        
        // Datum setzen
        if (dueDate) {
            const localDate = new Date(dueDate);
            const offsetDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
            const formattedDate = offsetDate.toISOString().substr(0, 10);
            document.getElementById('edit_due_date').value = formattedDate;
        } else {
            document.getElementById('edit_due_date').value = ''; 
        }

        // Priorität setzen
        const priorityMapping = {
            'urgent': 'edit_urgentIcon',
            'medium': 'edit_mediumIcon',
            'low': 'edit_lowIcon'
        };
        
        if (priorityMapping[priority]) {
            handleButtonClick(priorityMapping[priority], `../../img/${priority}Icon.png`, `../../img/${priority}IconHover.png`, 
                Object.values(priorityMapping).filter(id => id !== priorityMapping[priority]));
        }

        // Zugewiesene Personen setzen
        const assignedContainer = document.querySelector('.selected-contacts');
        assignedContainer.innerHTML = ''; // Vorherige Einträge entfernen
        
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

