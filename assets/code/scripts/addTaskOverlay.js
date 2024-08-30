function showOverlay() {
    let overlay = document.getElementById('taskOverlay');
    overlay.style.display = 'flex';
    overlay.querySelector('.overlay').classList.remove('slide-out');
    overlay.querySelector('.overlay').classList.add('slide-in');
}

function hideOverlay() {
    let overlay = document.getElementById('taskOverlay');
    overlay.querySelector('.overlay').classList.remove('slide-in');
    overlay.querySelector('.overlay').classList.add('slide-out');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}

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

