let firebaseUrl = 'https://join-301-default-rtdb.europe-west1.firebasedatabase.app/user/contacts.json';
let userId = 'someUserId';


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
                let newContactId = responseData.name;
                console.log("Generated contact ID:", newContactId);
                document.getElementById('largeCard').setAttribute('data-contact-id', newContactId);
            }

            showNotification('Contact saved successfully!');

            window.location.reload();

        } else {
            console.error('Failed to save contact:', response.statusText);
            showNotification('Failed to save contact.');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error saving contact.');
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
        console.error('Error:', error);
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

    saveContactToFirebase(contact);
    hideOverlay();
    document.getElementById('contactForm').reset();
}

function updateContactList(contacts) {
    let contactList = document.getElementById('contactList');

    for (let id in contacts) {
        let contact = contacts[id];
        let initials = getInitials(contact.name);
        contactList.innerHTML += `
            <div class="contact_small_card" data-contact-id="${id}" onclick="showContactDetails('${contact.name}', '${contact.email}', '${contact.phone}', '${contact.color}', '${id}')">
                <p class="contact_icon" style="background-color: ${contact.color}">${initials}</p>
                <div>
                    <p class="m0">${contact.name}</p>
                    <p class="font_color_blue m0">${contact.email}</p>
                </div>
            </div>
        `;
    }
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

document.addEventListener('DOMContentLoaded', fetchContactsFromFirebase);


async function deleteContactFromFirebase(contactId) {
    try {
        let url = `${firebaseUrl.replace('.json', '')}/${contactId}.json`;
        let response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('Contact deleted successfully from Firebase.');
        } else {
            console.error('Failed to delete contact from Firebase:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting contact from Firebase:', error);
    }
}