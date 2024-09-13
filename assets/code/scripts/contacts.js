/**
 * Array of colors used for random color selection.
 * @type {Array<string>}
 */
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

/**
 * Shows the overlay element.
 */
function showOverlay() {
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('slide-out');
    overlay.style.display = 'normal';
    document.getElementById('d_none').classList.remove('d_none');
}

/**
 * Hides the overlay element with a slide-out animation.
 */
function hideOverlay() {
    let overlay = document.getElementById('overlay');
    overlay.classList.add('slide-out');

    setTimeout(() => {
        overlay.style.display = 'none';
        document.getElementById('d_none').classList.add('d_none');
    }, 500);
}

/**
 * Returns a random color from the colors array.
 * @returns {string} A random color in rgba format.
 */
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Shows a notification element for 3 seconds.
 */
function showNotification() {
    let notification = document.getElementById('notification');
    notification.classList.add('show-notification');

    setTimeout(() => {
        notification.classList.remove('show-notification');
    }, 3000);
}

/**
 * Creates a new contact and saves it to Firebase.
 * @param {Event} event - The form submission event.
 */
function createContact(event) {
    event.preventDefault();
    let contact = {
        name: document.querySelector('#inputName').value,
        email: document.querySelector('#inputEmail').value,
        phone: document.querySelector('#inputPhone').value,
        color: getRandomColor(),
        userId
    };
    saveContactToFirebase(contact).then(newContactId => {
        if (!newContactId) return console.error('Failed to create contact.');
        fetchContactsFromFirebase().then(() => resetFormAndHideOverlay());
    }).catch(error => console.error('Error creating contact:', error));
}

/**
 * Resets the contact form and hides the overlay.
 */
function resetFormAndHideOverlay() {
    hideOverlay();
    document.getElementById('contactForm').reset();
    showNotification();
}

/**
 * Displays the details of a contact in a large card view.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} color - The background color for the contact.
 */
function showContactDetailsLocal(name, email, phone, color) {
    let largeCard = document.getElementById('largeCard');
    setTextAndColor('largeCardIcon', name.charAt(0), color);
    setText('largeCardName', name);
    setText('largeCardEmail', email);
    setText('largeCardPhone', phone);
    largeCard.setAttribute('data-color', color);
    largeCard.setAttribute('data-current-name', name);
    largeCard.style.display = 'block';
    document.querySelector('.edit_button')
        .setAttribute('onclick', `showEditOverlay('${name}', '${email}', '${phone}', '${color}')`);
}

/**
 * Sets the text content and background color for a given element.
 * @param {string} id - The ID of the element to update.
 * @param {string} text - The text content to set.
 * @param {string} color - The background color to set.
 */
function setTextAndColor(id, text, color) {
    let element = document.getElementById(id);
    element.textContent = text;
    element.style.backgroundColor = color;
}

/**
 * Clears the large card view of all content.
 */
function clearLargeCard() {
    document.getElementById('largeCardIcon').textContent = '';
    document.getElementById('largeCardIcon').style.backgroundColor = 'transparent';
    document.getElementById('largeCardName').textContent = '';
    document.getElementById('largeCardEmail').textContent = '';
    document.getElementById('largeCardPhone').textContent = '';
    document.getElementById('largeCard').style.display = 'none';
}

/**
 * Displays the edit overlay for editing contact details.
 */
function showEditOverlayMobile() {
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

function showEditOverlay(name, email, phone, color) {
    let initials = getInitials(name);  
    let editOverlayIcon = document.getElementById('editOverlayIcon');
    editOverlayIcon.textContent = initials;  
    editOverlayIcon.style.backgroundColor = color;  
    document.getElementById('editName').value = name;  
    document.getElementById('editEmail').value = email;  
    document.getElementById('editPhone').value = phone; 
    document.getElementById('editOverlayBackground').classList.remove('d_none');  
    document.getElementById('editOverlay').classList.remove('slide-out');  
    document.getElementById('editOverlay').style.display = 'flex';  
}

/**
 * Closes the options overlay.
 */
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

/**
 * Hides the edit overlay with a slide-out animation.
 */
function hideEditOverlay() {
    let editOverlay = document.getElementById('editOverlay');
    editOverlay.classList.add('slide-out');
    setTimeout(() => {
        editOverlay.style.display = 'none';
        document.getElementById('editOverlayBackground').classList.add('d_none');
    }, 500);
}

/**
 * Cancels the edit process and resets the contact form.
 */
function cancelEdit() {
    hideOverlay();
    document.getElementById('contactForm').reset();
}

/**
 * Saves contact details (new or existing) to Firebase.
 * @param {Event} event - The form submission event.
 */
function saveContact(event) {
    event.preventDefault();
    let contact = {
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        color: document.getElementById('largeCardIcon').style.backgroundColor
    };
    let contactId = document.getElementById('largeCard').getAttribute('data-contact-id');
        if (contactId) {
        updateExistingContact(contact, contactId).then(() => {
            reloadContacts();
        });
    } else {
        addNewContact(contact).then(() => {
            reloadContacts();
        });
    }
    hideEditOverlay();
}

/**
 * Updates an existing contact's details in Firebase and the UI.
 * @param {Object} contact - The contact details to update.
 * @param {string} contactId - The ID of the contact to update.
 */
function updateExistingContact(contact, contactId) {
    return saveContactToFirebase(contact, contactId).then(() => {
        let card = document.querySelector(`.contact_small_card[data-contact-id="${contactId}"]`);
        updateCardDetails(card, contact); 
        showContactDetails(contact.name, contact.email, contact.phone, contact.color, contactId);
    });
}

/**
 * Updates the details of a contact card in the user interface.
 *
 * @param {HTMLElement} card - The HTML element of the contact card to be updated.
 * @param {Object} contact - An object containing the new contact information.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.email - The email address of the contact.
 * @param {string} contact.color - The background color of the contact icon.
 */
function updateCardDetails(card, contact) {
    card.querySelector('.contact_icon').textContent = getInitials(contact.name);
    card.querySelector('.contact_icon').style.backgroundColor = contact.color; 
    card.querySelector('.m0').textContent = contact.name; 
    card.querySelector('.font_color_blue').textContent = contact.email; 
}

/**
 * Reloads the contacts from Firebase and updates the contact list in the UI.
 * Fetches the contacts from the Firebase database for the current user
 * and updates the displayed contact list. If the request fails, it logs an error message.
 * 
 * @async
 * @returns {Promise<void>} - A promise that resolves once the contacts are reloaded and displayed.
 */
async function reloadContacts() {
    try {
        let response = await fetch(`https://join-301-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/contacts.json`);
        if (response.ok) {
            let contacts = await response.json();
            updateContactList(contacts);  
        } else {
            console.error('Failed to reload contacts:', response.statusText);
        }
    } catch (error) {
        console.error('Error reloading contacts:', error);
    }
}

/**
 * Adds a new contact to Firebase and updates the UI.
 * @param {Object} contact - The contact details to add.
 */
function addNewContact(contact) {
    return saveContactToFirebase(contact).then(newContactId => {
        addCardToList(contact, newContactId);  
    });
}

/**
 * Deletes the selected contact from Firebase and reloads the page.
 */
function deleteContact() {
    let contactId = document.getElementById('largeCard').getAttribute('data-contact-id');
    if (contactId) {
        deleteContactFromFirebase(contactId).then(() => {
            window.location.reload();
        }).catch(error => {
            console.error('Error deleting contact:', error);
        });
    } else {
        console.error('No contact ID found for deletion');
    }
    clearLargeCard();
    hideEditOverlay();
}

/**
 * Removes a contact card by its name.
 * @param {string} name - The name of the contact to remove.
 */
function removeContactCard(name) {
    document.querySelectorAll('.contact_small_card').forEach(card => {
        if (card.querySelector('.m0').textContent === name) card.remove();
    });
}

/**
 * Returns the initials of a contact's name.
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials of the contact.
 */
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

/**
 * Toggles the display of the contact button.
 */
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

/**
 * Toggles the display of the option button.
 */
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

/**
 * Resets the option button when clicked outside.
 * @param {Event} event - The click event.
 */
function resetButtonOnClickOutside(event) {
    let button = document.getElementById('option_normal');
    let buttonActive = document.getElementById('option_blue');
    if (!button.contains(event.target) && !buttonActive.contains(event.target)) {
        button.style.display = 'block';
        buttonActive.style.display = 'none';
        document.removeEventListener('click', resetButtonOnClickOutside);
    }
}

/**
 * Toggles the options overlay menu.
 * @param {Event} event - The click event.
 */
function toggleOptionsOverlay(event) {
    event.stopPropagation();
    let [menu, optionIcon, optionIconBlue] = [
        document.getElementById('optionsMenu'),
        document.getElementById('option_normal'),
        document.getElementById('option_blue')
    ];
    let isHidden = menu.classList.toggle('hide');
    menu.classList.toggle('active', !isHidden);
    optionIcon.style.display = isHidden ? 'block' : 'none';
    optionIconBlue.style.display = isHidden ? 'none' : 'block';
    document.addEventListener('click', closeOptionsOverlayOnOutsideClick);
}

/**
 * Closes the options overlay when clicked outside.
 * @param {Event} event - The click event.
 */
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

/**
 * Resets the contact button to its default state.
 */
function resetButtonColor() {
    let button = document.getElementById('contactButton');
    let buttonActive = document.getElementById('contactButtonActive');
    button.style.display = 'block';
    buttonActive.style.display = 'none';
}

/**
 * Hides the overlay and resets the contact button color.
 */
function hideOverlay() {
    document.getElementById('d_none').classList.add('d_none');
    resetButtonColor();
}

/**
 * Hides the contact view element.
 */
function hideContactView() {
    let contactView = document.getElementById('contactView');
    if (contactView) {
        contactView.classList.add('d_none_contacts');
        contactView.style.display = 'none';  
    }
}

/**
 * Shows the contact view element.
 */
function showContactView() {
    let contactView = document.getElementById('contactView');
    if (contactView) {
        contactView.classList.remove('d_none_contacts');
        contactView.style.display = 'block';  
    }
}
