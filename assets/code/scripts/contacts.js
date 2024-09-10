function init() {

}

function showOverlay() {
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('slide-out');
    overlay.style.display = 'normal';
    document.getElementById('d_none').classList.remove('d_none');
}

function hideOverlay() {
    let overlay = document.getElementById('overlay');
    overlay.classList.add('slide-out');

    setTimeout(() => {
        overlay.style.display = 'none';
        document.getElementById('d_none').classList.add('d_none');
    }, 500);
}

function getRandomColor() {
    let colors = [
        'rgba(255, 122, 0, 1)',
        'rgba(255, 94, 179, 1)',
        'rgba(110, 82, 255, 1)',
        'rgba(147, 39, 255, 1)',
        'rgba(255, 116, 94, 1)',
        'rgba(31, 215, 193, 1)',
        'rgba(0, 190, 232, 1)',
        'rgba(255, 199, 1, 1)',
        'rgba(252, 113, 255, 1)',
        'rgba(255, 163, 94, 1)',
        'rgba(255, 187, 43, 1)',
        'rgba(255, 70, 70, 1)',
        'rgba(255, 230, 43, 1)',
        'rgba(195, 255, 43, 1)',
        'rgba(0, 56, 255, 1)'
    ];

    return colors[Math.floor(Math.random() * colors.length)];
}

function showNotification() {
    let notification = document.getElementById('notification');
    notification.classList.add('show-notification');

    setTimeout(() => {
        notification.classList.remove('show-notification');
    }, 3000);
}

function createContact(event) {
    event.preventDefault();

    let name = document.querySelector('#inputName').value;
    let email = document.querySelector('#inputEmail').value;
    let phone = document.querySelector('#inputPhone').value;
    let color = getRandomColor();

    let contact = {
        name,
        email,
        phone,
        color,
        userId
    };

    saveContactToFirebase(contact).then(newContactId => {
        if (newContactId) {
            fetchContactsFromFirebase().then(() => {
                hideOverlay();
                document.getElementById('contactForm').reset();
                showNotification();
            });
        } else {
            console.error('Failed to create contact.');
        }
    }).catch(error => {
        console.error('Error creating contact:', error);
    });
}

function showContactDetailsLocal(name, email, phone, color) {
    document.getElementById('largeCardIcon').textContent = name.charAt(0);
    document.getElementById('largeCardIcon').style.backgroundColor = color;
    document.getElementById('largeCardName').textContent = name;
    document.getElementById('largeCardEmail').textContent = email;
    document.getElementById('largeCardPhone').textContent = phone;
    document.getElementById('largeCard').setAttribute('data-color', color);
    document.getElementById('largeCard').setAttribute('data-current-name', name);
    document.getElementById('largeCard').style.display = 'block';
    document.querySelector('.edit_button').setAttribute('onclick', `showEditOverlay('${name}', '${email}', '${phone}', '${color}')`);
}
function clearLargeCard() {
    document.getElementById('largeCardIcon').textContent = '';
    document.getElementById('largeCardIcon').style.backgroundColor = 'transparent';
    document.getElementById('largeCardName').textContent = '';
    document.getElementById('largeCardEmail').textContent = '';
    document.getElementById('largeCardPhone').textContent = '';
    document.getElementById('largeCard').style.display = 'none';
}

function showEditOverlay() {
    let initials = getInitials(currentNameForEditOverlay);
    let editOverlayIcon = document.getElementById('editOverlayIcon');
    editOverlayIcon.textContent = initials;
    editOverlayIcon.style.backgroundColor = currentColorForEditOverlay;

    document.getElementById('editName').value = currentNameForEditOverlay;
    document.getElementById('editEmail').value = currentEmailForEditOverlay;
    document.getElementById('editPhone').value = currentPhoneForEditOverlay;

    document.getElementById('editOverlayBackground').classList.remove('d_none');
    let editOverlay = document.getElementById('editOverlay');
    editOverlay.classList.remove('slide-out');
    editOverlay.style.display = 'flex';

    closeOptionsOverlay();
}

function closeOptionsOverlay() {
    let menu = document.getElementById('optionsMenu');
    let optionIcon = document.getElementById('option_normal');
    let optionIconBlue = document.getElementById('option_blue');
    menu.classList.remove('active');
    menu.classList.add('hide');
    optionIcon.style.display = 'block';
    optionIconBlue.style.display = 'none';
    document.removeEventListener('click', closeOptionsOverlayOnOutsideClick);
}


function hideEditOverlay() {
    let editOverlay = document.getElementById('editOverlay');
    editOverlay.classList.add('slide-out');
    setTimeout(() => {
        editOverlay.style.display = 'none';
        document.getElementById('editOverlayBackground').classList.add('d_none');
    }, 500);
}

function cancelEdit() {
    hideOverlay();
    document.getElementById('contactForm').reset();
}

function saveContact(event) {
    event.preventDefault();

    let name = document.getElementById('editName').value;
    let email = document.getElementById('editEmail').value;
    let phone = document.getElementById('editPhone').value;
    let color = document.getElementById('largeCardIcon').style.backgroundColor;

    let contact = {
        name,
        email,
        phone,
        color
    };

    let contactId = document.getElementById('largeCard').getAttribute('data-contact-id');

    let initials = getInitials(name);

    if (contactId) {
        saveContactToFirebase(contact, contactId);

        let existingCard = document.querySelector(`.contact_small_card[data-contact-id="${contactId}"]`);
        if (existingCard) {
            existingCard.querySelector('.contact_icon').style.backgroundColor = color;
            existingCard.querySelector('.contact_icon').textContent = initials;
            existingCard.querySelector('.m0').textContent = name;
            existingCard.querySelector('.font_color_blue').textContent = email;
            existingCard.setAttribute('onclick', `showContactView(); showContactDetails('${name}', '${email}', '${phone}', '${color}', '${contactId}')`);
        }
    } else {
        saveContactToFirebase(contact).then(newContactId => {
            let contactList = document.getElementById('contactList');
            contactList.innerHTML += `
                <div class="contact_small_card" data-contact-id="${newContactId}" onclick="showContactView(); showContactDetails('${name}', '${email}', '${phone}', '${color}', '${newContactId}')">
                    <p class="contact_icon" style="background-color: ${color}">${initials}</p>
                    <div>
                        <p class="m0">${name}</p>
                        <p class="font_color_blue m0">${email}</p>
                    </div>
                </div>
            `;
            window.location.reload();
        });
    }

    showContactDetails(name, email, phone, color, contactId);
    hideEditOverlay();
}

function deleteContact() {
    let currentName = document.getElementById('largeCard').getAttribute('data-current-name');
    let contactId = document.getElementById('largeCard').getAttribute('data-contact-id');

    if (contactId) {
        deleteContactFromFirebase(contactId);
    }

    let contactCards = document.querySelectorAll('.contact_small_card');
    contactCards.forEach(card => {
        if (card.querySelector('.m0').textContent === currentName) {
            card.remove();
        }
    });

    clearLargeCard();
    hideEditOverlay();
}

function getInitials(name) {
    let names = name.trim().split(' ');
    let initials = '';
    if (names.length > 0) {
        initials += names[0].charAt(0);
    }

    if (names.length > 1) {
        initials += names[names.length - 1].charAt(0);
    }
    return initials.toUpperCase();
}

function toggleButtonColor() {
    let button = document.getElementById('contactButton');
    let buttonActive = document.getElementById('contactButtonActive');

    if (button.style.display !== 'none') {
        button.style.display = 'none';
        buttonActive.style.display = 'block';
    } else {
        button.style.display = 'block';
        buttonActive.style.display = 'none';
    }

    showOverlay();
}

function toggleOptionButton() {
    let button = document.getElementById('option_normal');
    let buttonActive = document.getElementById('option_blue');
    if (button.style.display !== 'none') {
        button.style.display = 'none';
        buttonActive.style.display = 'block';
    } else {
        button.style.display = 'block';
        buttonActive.style.display = 'none';
    }
    document.addEventListener('click', resetButtonOnClickOutside);
}

function resetButtonOnClickOutside(event) {
    let button = document.getElementById('option_normal');
    let buttonActive = document.getElementById('option_blue');
    if (!button.contains(event.target) && !buttonActive.contains(event.target)) {
        button.style.display = 'block';
        buttonActive.style.display = 'none';
        document.removeEventListener('click', resetButtonOnClickOutside);
    }
}

function toggleOptionsOverlay(event) {
    event.stopPropagation();

    let menu = document.getElementById('optionsMenu');
    let optionIcon = document.getElementById('option_normal');
    let optionIconBlue = document.getElementById('option_blue');
    if (menu.classList.contains('hide')) {
        menu.classList.remove('hide');
        menu.classList.add('active');
        optionIcon.style.display = 'none';
        optionIconBlue.style.display = 'block';
    } else {
        menu.classList.remove('active');
        menu.classList.add('hide');
        optionIcon.style.display = 'block';
        optionIconBlue.style.display = 'none';
    }
    document.addEventListener('click', closeOptionsOverlayOnOutsideClick);
}

function closeOptionsOverlayOnOutsideClick(event) {
    let menu = document.getElementById('optionsMenu');
    let optionIcon = document.getElementById('option_normal');
    let optionIconBlue = document.getElementById('option_blue');

    if (!menu.contains(event.target) && !event.target.closest('#optionButton')) {
        menu.classList.remove('active');
        menu.classList.add('hide');
        optionIcon.style.display = 'block';
        optionIconBlue.style.display = 'none';
        document.removeEventListener('click', closeOptionsOverlayOnOutsideClick);
    }
}

function resetButtonColor() {
    let button = document.getElementById('contactButton');
    let buttonActive = document.getElementById('contactButtonActive');

    button.style.display = 'block';
    buttonActive.style.display = 'none';
}

function hideOverlay() {
    document.getElementById('d_none').classList.add('d_none');
    resetButtonColor();
}

function hideContactView() {
    let contactView = document.getElementById('contactView');
    if (contactView) {
        contactView.classList.add('d_none_contacts');
        contactView.style.display = 'none';  // Versteckt das Element
    }
}

function showContactView() {
    let contactView = document.getElementById('contactView');
    if (contactView) {
        contactView.classList.remove('d_none_contacts');
        contactView.style.display = 'block';  // Zeigt das Element an
    }
}

window.addEventListener('load', init)
