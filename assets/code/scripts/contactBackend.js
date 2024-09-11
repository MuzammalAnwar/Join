let userId = checkLoginStatus();
let firebaseUrl = `https://join-301-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/contacts.json`;
let currentNameForEditOverlay = '';
let currentEmailForEditOverlay = '';
let currentPhoneForEditOverlay = '';
let currentInitialsForEditOverlay = '';
let currentColorForEditOverlay = '';

/**
 * Saves a contact to Firebase. Creates a new contact if no ID is provided, or updates an existing one if an ID is provided.
 * 
 * @param {Object} contact - The contact data to be saved.
 * @param {string|null} [id=null] - The ID of the contact to update. If null, a new contact will be created.
 * @returns {Promise<string|null>} - The ID of the saved contact, or null if the operation failed.
 */
async function saveContactToFirebase(contact, id = null) {
    let url = id ? `${firebaseUrl.replace('.json', '')}/${id}.json` : firebaseUrl;
    let method = id ? 'PUT' : 'POST';
    try {
        let response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        });
        if (response.ok) {
            let responseData = await response.json();
            return id || responseData.name;
        } else {
            console.error('Failed to save contact:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error saving contact:', error);
        return null;
    }
}

/**
 * Fetches contacts from Firebase and updates the contact list.
 * 
 * @returns {Promise<void>}
 */
async function fetchContactsFromFirebase() {
    try {
        let response = await fetch(firebaseUrl);
        if (response.ok) {
            const contacts = await response.json();
            updateContactList(contacts);
        } else {
            console.error('Failed to fetch contacts:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
}

/**
 * Handles the creation of a new contact, saving it to Firebase, and updating the contact list.
 * 
 * @param {Event} event - The form submit event.
 */
function createContact(event) {
    event.preventDefault();
    let contact = {
        name: getInputValue('#inputName'),
        email: getInputValue('#inputEmail'),
        phone: getInputValue('#inputPhone'),
        color: getRandomColor(),
        userId
    };
    saveContactToFirebase(contact)
        .then(fetchContactsFromFirebase)
        .finally(() => {
            resetForm();
            hideOverlay();
            showNotification();
        });
}

/**
 * Gets the value of an input field.
 * 
 * @param {string} selector - The CSS selector for the input field.
 * @returns {string} - The value of the input field.
 */
function getInputValue(selector) {
    return document.querySelector(selector).value;
}

/**
 * Resets the contact form.
 */
function resetForm() {
    document.getElementById('contactForm').reset();
}

/**
 * Updates and renders the contact list, sorting contacts alphabetically and grouping them by initial letter.
 * 
 * @param {Object} contacts - The contacts object with contact details.
 */
function updateContactList(contacts) {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    let sortedContacts = Object.keys(contacts).sort((a, b) => contacts[a].name.localeCompare(contacts[b].name));
    let currentLetter = '';
    sortedContacts.forEach(id => {
        let contact = contacts[id];
        let firstLetter = contact.name.charAt(0).toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            contactList.innerHTML += createAlphabeticalIndexTemplate(currentLetter);
        }
        contactList.innerHTML += createContactCardTemplate(contact, id);
    });
}


/**
 * Displays contact details in a large card overlay.
 * 
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} color - The background color of the contact icon.
 * @param {string} id - The unique ID of the contact.
 */
function showContactDetails(name, email, phone, color, id) {
    let largeCard = document.getElementById('largeCard');
    let icon = document.getElementById('largeCardIcon');
    icon.textContent = getInitials(name);
    icon.style.backgroundColor = color;
    document.getElementById('largeCardName').textContent = name;
    document.getElementById('largeCardEmail').textContent = email;
    document.getElementById('largeCardPhone').textContent = phone;
    largeCard.dataset.color = color;
    largeCard.dataset.currentName = name;
    largeCard.dataset.contactId = id;
    largeCard.style.display = 'block';
    document.querySelector('.edit_button').onclick = () => showEditOverlay(name, email, phone, color);
}

/**
 * Saves current contact details for editing.
 * 
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} color - The background color of the contact icon.
 */
function saveCurrentInfos(name, email, phone, color) {
    currentNameForEditOverlay = name;
    currentEmailForEditOverlay = email;
    currentPhoneForEditOverlay = phone;
    currentColorForEditOverlay = color;
}

/**
 * Deletes a contact from Firebase.
 * 
 * @param {string} contactId - The ID of the contact to delete.
 * @returns {Promise<void>} - A promise that resolves when the deletion is complete.
 */
async function deleteContactFromFirebase(contactId) {
    try {
        let url = `${firebaseUrl.replace('.json', '')}/${contactId}.json`;
        await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error deleting contact from Firebase:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchContactsFromFirebase);
window.addEventListener('load', checkLoginStatus)
window.addEventListener('load', setProfileCircleInitials);
