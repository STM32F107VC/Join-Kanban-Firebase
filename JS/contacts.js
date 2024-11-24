/* Declare global variables and arrays */
let getBackgroundColor;
let bgcState = false;
let oldNumericId;
let oldLetterId;
let oldId;
let trackWindowWidth;

let contacts = [];

/**
 * Init function called on body="onload" to load
 * first necessary functions
 */
async function init_contacts(id) {
    await includeHTML();
    await loadUsers();
    await loadContacts();
    markActiveLink(id);
    greetUser();
    tackInitialScreenWidth();
}

/**
 * Track initial screen width to to show either basic contact book or add classesfor mobile
 */
function tackInitialScreenWidth() {
    trackWindowWidth = window.innerWidth;
    if (trackWindowWidth < 1100) {
        document.getElementById('contact-view-basic').classList.add('d-none');
    } else if (trackWindowWidth > 1100) {
        document.getElementById('contact-view-basic').classList.remove('d-none', 'contact-view-responsive');
        document.querySelector('.contacts-div').classList.remove('d-none');
    }
}

/**
 * Track the screen width to change design of contact book
 */
addEventListener("resize", (event) => {
    trackWindowWidth = window.innerWidth;
    let detailedContact = document.getElementById('contact-view-basic');
    let contactBook = document.querySelector('.contacts-div');
    if (window.location.href.includes('contacts.html')) {
        if (detailedContact !== null && contactBook !== null) {
            if (trackWindowWidth < 1100) {
                detailedContact.classList.add('d-none');
            } else if (trackWindowWidth > 1100) {
                detailedContact.classList.remove('d-none', 'contact-view-responsive');
                contactBook.classList.remove('d-none');
            }
        }
    }
});

/**
 * Load contacts from backend
 * 
 */
async function loadContacts() {
    try {
        // contacts = JSON.parse(await getItem('contacts'));
        getInitialLetterOfFirstname();
    } catch (error) { }
}

/**
 * Open contacts overlay menu
 * 
 */
function openContactsOverlay() {
    document.getElementById('add-contac-responsive').classList.add('d-none');
    document.getElementById('contacts').classList.add('d-none');
    document.getElementById('body-contacts').classList.add("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-contacts').classList.add("opacity", "z-ind--1");
    document.getElementById('overlay-contacts').classList.remove('d-none');
}

/**
 * Open edit contacts overlay menu
 * 
 */
function openEditContactForm() {
    document.getElementById('add-contac-responsive').classList.add('d-none');
    document.getElementById('contacts').classList.add('d-none');
    document.getElementById('body-contacts').classList.add("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-contacts').classList.add("opacity", "z-ind--1");
    document.getElementById('edit-contacts').classList.remove('d-none');
}

/**
 * Close contacts overlay menu
 * 
 */
function closeContactOverlay() {
    document.getElementById('add-contac-responsive').classList.remove('d-none');
    document.getElementById('contacts').classList.remove('d-none');
    document.getElementById('body-contacts').classList.remove("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-contacts').classList.remove("opacity", "z-ind--1");
    document.getElementById('overlay-contacts').classList.add('d-none');
}

/**
 * Close edit contacts overlay menu
 * 
 */
function closeEditContactForm() {
    document.getElementById('add-contac-responsive').classList.remove('d-none');
    document.getElementById('contacts').classList.remove('d-none');
    document.getElementById('body-contacts').classList.remove("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-contacts').classList.remove("opacity", "z-ind--1");
    document.getElementById('edit-contacts').classList.add('d-none');
}

/**
 * Add new contacts get values out of input fields
 * 
 */
async function addContact() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let phone = document.getElementById('number');
    let backgroundColor = randomNumber();
    contacts.push({
        'name': name.value,
        'email': email.value,
        'phone': phone.value,
        'background-color': backgroundColor
    });
    // await setItem('contacts', JSON.stringify(contacts));
    getInitialLetterOfFirstname();
    resetAddContactsForm(name, email, phone);
    location.replace('contacts.html');
}

/**
 * Clear add contacts form
 * @param {variable} n Name of contact
 * @param {variable} e E-mail of contact
 * @param {variable} p Phone number of contact
 */
function resetAddContactsForm(n, e, p) {
    n.value = '';
    e.value = '';
    p.value = '';
}

/**
 * Iterate each contact JSON out of contacts array
 * 
 */
function getInitialLetterOfFirstname() {
    for (let j = 0; j < contacts.length; j++) {
        let contact = contacts[j];
        let array = buildAcronymContact(contact, false);
        let name = contact['name'];
        let email = contact['email'];
        let phone = contact['phone'];
        let backgroundColor = contact['background-color'];
        checkRegister(j, array[1], name, email, array[0], phone, backgroundColor);
    }
}

/**
 * Function to generate acronym
 * @param {JSON} contact Includes the name of the user or new added contact
 * @param {flag} flag Indicates from where the function was called
 * @returns 
 */
function buildAcronymContact(contact, flag) {
    if (!flag) {
        let str = contact['name'].match(/\b(\w)/g);
        let acronymUpperCase = str.join('').toUpperCase();
        let initialLetter = contact['name'].charAt(0)[0].toUpperCase();
        return [acronymUpperCase, initialLetter];
    } else if (flag) {
        let str = contact.match(/\b(\w)/g);
        let acronymUpperCase = str.join('').toUpperCase();
        return acronymUpperCase;
    }
}

/**
 * 
 * @param {variable} letter Initial letter of first name
 * @param {variable} n Contact name
 * @param {variable} e Contact email adress
 * @param {variable} auc Contact acronym
 */
function checkRegister(j, letter, n, e, auc, p, bgc) {
    let contactBook = document.getElementById('contact-book');
    let children = contactBook.children;
    for (let i = 0; i < children.length; i++) {
        let id = contactBook.getElementsByTagName('tr')[i].id;
        let dataCell = contactBook.getElementsByTagName('td');
        let child = children[i];
        if (id === letter) {
            child.innerHTML += renderContacts(j, id, n, e, auc, p, bgc);
            dataCell[i].classList.remove('d-none');
        }
    }
}

/**
 * Show contact book when screen width is < 1100px
 */
function showContactBook() {
    let completeDivDetails = document.getElementById('contact-view-basic');
    let contactBook = document.querySelector('.contacts-div');
    let backArrow = document.getElementById('back-to-contacts');
    if (trackWindowWidth < 1100) backArrow.classList.add('d-none');
    completeDivDetails.classList.remove('contact-view-responsive');
    completeDivDetails.classList.add('d-none');
    contactBook.classList.remove('d-none');
}

/**
 * Function to show contact details
 * @param {variable} n Contact name
 * @param {variable} e Contact email adress
 * @param {variable} auc Contact acronym
 * @param {variable} p Contact phone number
 * @param {variable} id Contact specific id
 * @param {variable} j J is the index number for accessing a contact in the contacts array
 */
function contactDetails(n, e, auc, p, id, j) {
    let completeDivDetails = document.getElementById('contact-view-basic');
    let divDetails = document.getElementById('contact-details');
    let contactBook = document.querySelector('.contacts-div');
    let backArrow = document.getElementById('back-to-contacts');
    let contact = document.getElementById(`${id}${j}`);
    let currentId = id + j;
    if (!contact.classList.contains('bg-dark-blue', 'col-white') && currentId) {
        addContactClasses(contact, divDetails, currentId);
        if (trackWindowWidth < 1100) responsiveContactBook(backArrow, completeDivDetails, contactBook, contact);
    } else {
        defaultContactSelection(contact, divDetails);
    }
    divDetails.innerHTML = renderContactDetails(n, e, auc, p, id, j);
    oldId = currentId;
}

/**
 * Function to set several classes
 * @param {Element} bA Is the back arrow icon
 * @param {Element} cDD Div with with detailed informations of a contact 
 * @param {Element} cB The contact book with all selectable contacts 
 * @param {Element} c The current contact
 */
function responsiveContactBook(bA, cDD, cB, c) {
    bA.classList.remove('d-none');
    cDD.classList.add('contact-view-responsive');
    cDD.classList.remove('d-none');
    cB.classList.add('d-none');
    c.classList.remove('bg-dark-blue', 'col-white');
    c.classList.add('contactHover');
}

/**
 * When contact is selected and it is clicked again, set default classes
 * @param {Element} c The current contact
 * @param {Element} dD The detailed contact informations of the current selected contact
 */
function defaultContactSelection(c, dD) {
    c.classList.remove('bg-dark-blue', 'col-white');
    c.classList.remove('contactHover');
    dD.classList.add('x-translate');
}

/**
 * Add classes background-color and text color for contacts if its selected
 * @param {div} contact Contact informations
 * @param {div} divDetails Biger contact view when contact is selected
 * @param {variable} currentId Id of current selected contact
 */
function addContactClasses(contact, divDetails, currentId) {
    contact.classList.add('bg-dark-blue', 'col-white');
    contact.classList.remove('contactHover');
    divDetails.classList.remove('x-translate');
    if (currentId !== oldId) {
        if (oldId === undefined) {
            oldId = currentId;
        } else {
            let oldContact = document.getElementById(`${oldId}`);
            oldContact.classList.remove('bg-dark-blue', 'col-white');
            oldContact.classList.add('contactHover');
        }
    }
}

/**
 * Shows detailed information about a contact
 * @param {variable} j J is the index number for accessing a contact in the contacts array
 */
function editContact(j, auc) {
    getBackgroundColor = contacts[j]['background-color'];
    let editContactForm = document.getElementById('delete-part');
    let avatar = document.getElementById('edit-Overlay-Menu-Avatar');
    avatar.innerHTML = renderEditOverlayAvatar(auc);
    editContactForm.innerHTML = renderDeletePart(j);
    openEditContactForm();
    getContactValues(j);
}

/**
 * Get values out of contacts JSON array and show them in the input fields to check
 * @param {variable} j J is the index number for accessing a contact in the contacts array
 */
function getContactValues(j) {
    let name = contacts[j]['name'];
    let email = contacts[j]['email'];
    let phone = contacts[j]['phone'];
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-number').value = phone;
}

/**
 * Safes changes which were made on a contact
 * @param {variable} j J is the index number for accessing a contact in the contacts array
 */
async function saveEditContactChanges(j) {
    document.getElementById('safe-btn').disabled = true;
    let name = document.getElementById('edit-name').value;
    let email = document.getElementById('edit-email').value;
    let phone = document.getElementById('edit-number').value;
    contacts.splice(j, 1);
    contacts.push({
        'name': name,
        'email': email,
        'phone': phone,
        'background-color': getBackgroundColor
    });
    // await setItem('contacts', JSON.stringify(contacts));
    document.getElementById('safe-btn').disabled = false;
    location.replace('contacts.html');
}

/**
 * Deletes a complet contact
 * @param {variable} j J is the index number for accessing a contact in the contacts array
 */
async function deleteContact(j) {
    contacts.splice(j, 1);
    // await setItem('contacts', JSON.stringify(contacts));
    // contacts = JSON.parse(await getItem('contacts'));
    checkRegister();
    location.replace('contacts.html');
}

/**
 * Function to generate ranndom number to set ranom background color
 * with 16 bit hex number
 * @returns Returns the random generated number to set it as background-color
 */
function randomNumber() {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return n.slice(0, 6);
}