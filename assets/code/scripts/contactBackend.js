let userId = checkLoginStatus();
let firebaseUrl = `https://join-301-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/contacts.json`;
let currentNameForEditOverlay = '';
let currentEmailForEditOverlay = '';
let currentPhoneForEditOverlay = '';
let currentInitialsForEditOverlay = '';
let currentColorForEditOverlay = '';

async function saveContactToFirebase(contact, id = null) {
    try {
        let url = id ? `${firebaseUrl.replace('.json', '')}/${id}.json` : `${firebaseUrl}`;
        let method = id ? 'PUT' : 'POST';

        let response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });

        if (response.ok) {
            let responseData = await response.json();
            if (!id) {
                return responseData.name;
            } else {
                return id;
            }
        } else {
            console.error('Failed to save contact:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error saving contact:', error);
        return null;
    }
}


async function fetchContactsFromFirebase() {
    try {
        let response = await fetch(firebaseUrl);
        if (response.ok) {
            let contacts = await response.json();
            updateContactList(contacts);
        } else {
            console.error('Failed to fetch contacts:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
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


    saveContactToFirebase(contact).then(() => {
        fetchContactsFromFirebase();
    });
    hideOverlay();
    document.getElementById('contactForm').reset();
    showNotification();
}

function updateContactList(contacts) {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    let sortedContacts = Object.keys(contacts).sort((a, b) => {
        return contacts[a].name.localeCompare(contacts[b].name);
    });
    let currentLetter = '';
    sortedContacts.forEach((id, index) => {
        let contact = contacts[id];
        let firstLetter = contact.name.charAt(0).toUpperCase();

        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            contactList.innerHTML += `
                <div class="alphabetical_index">
                    <div class="letter">${currentLetter}</div>
                </div>
                <div class="separator"></div> <!-- Trennlinie direkt unter dem Buchstaben -->
            `;
        }
        let initials = getInitials(contact.name);
        contactList.innerHTML += `
            <div class="contact_small_card" data-contact-id="${id}" onclick="showContactDetails('${contact.name}', '${contact.email}', '${contact.phone}', '${contact.color}', '${id}'); saveCurrentInfos('${contact.name}', '${contact.email}','${contact.phone}', '${contact.color}')">
                <p class="contact_icon" style="background-color: ${contact.color}">${initials}</p>
                <div>
                    <p class="m0">${contact.name}</p>
                    <p class="font_color_blue m0">${contact.email}</p>
                </div>
            </div>
        `;
    });
}

function showContactDetails(name, email, phone, color, id) {
    let initials = getInitials(name);
    document.getElementById('largeCardIcon').textContent = initials;
    document.getElementById('largeCardIcon').style.backgroundColor = color;
    document.getElementById('largeCardName').textContent = name;
    document.getElementById('largeCardEmail').textContent = email;
    document.getElementById('largeCardPhone').textContent = phone;
    document.getElementById('largeCard').setAttribute('data-color', color);
    document.getElementById('largeCard').setAttribute('data-current-name', name);
    document.getElementById('largeCard').setAttribute('data-contact-id', id);
    document.getElementById('largeCard').style.display = 'block';
    document.querySelector('.edit_button').setAttribute('onclick', `showEditOverlay('${name}', '${email}', '${phone}', '${color}')`);
}

function saveCurrentInfos(name, email, phone, color) {
    currentNameForEditOverlay = name
    currentEmailForEditOverlay = email
    currentPhoneForEditOverlay = phone
    currentColorForEditOverlay = color
}

async function deleteContactFromFirebase(contactId) {
    try {
        let url = `${firebaseUrl.replace('.json', '')}/${contactId}.json`;
        let response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error deleting contact from Firebase:', error);
    }
}


document.addEventListener('DOMContentLoaded', fetchContactsFromFirebase);
window.addEventListener('load', checkLoginStatus)
window.addEventListener('load', setProfileCircleInitials);
