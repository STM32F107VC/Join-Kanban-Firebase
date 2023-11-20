/* Declare variables and arrays */
let contacts = [];


/**
 * Load contacts from backend
 * 
 */
async function loadContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
        getInitialLetterOfFirstname();
    } catch (error) {
        console.info('Could not load contacts.');
    }
}

/**
 * Open contacts overlay menu
 * 
 */
function openContactsOverlay() {
    document.getElementById('contacts').classList.add('d-none');
    document.getElementById('body-contacts').classList.add("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-contacts').classList.add("opacity", "z-ind--1");
    document.getElementById('overlay-contacts').classList.remove('d-none');
}

/**
 * Close contacts overlay menu
 * 
 */
function closeContactOverlay() {
    document.getElementById('contacts').classList.remove('d-none');
    document.getElementById('body-contacts').classList.remove("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-contacts').classList.remove("opacity", "z-ind--1");
    document.getElementById('overlay-contacts').classList.add('d-none');
}

/**
 * Add new contacts
 * 
 */
async function addContact() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let phone = document.getElementById('number');
    contacts.push({
        'name': name.value,
        'email': email.value,
        'phone': phone.value,
    });
    resetAddContactsForm(name, email, phone);
    await setItem('contacts', JSON.stringify(contacts));
}

/**
 * 
 */
function getInitialLetterOfFirstname() {
    for (let j = 0; j < contacts.length; j++) {
        let contact = contacts[j];
        let str = contact['name'].match(/\b(\w)/g);
        let acronymUpperCase = str.join('').toUpperCase();
        let initialLetter = contact['name'].charAt(0)[0].toUpperCase();
        let name = contact['name'];
        let email = contact['email'];
        let phone = contact['phone'];
        checkRegister(j, initialLetter, name, email, acronymUpperCase, phone);
    }
}

/**
 * 
 * @param {*} letter 
 * @param {*} n 
 * @param {*} e 
 * @param {*} auc 
 */
function checkRegister(j, letter, n, e, auc, p) {
    let contactBook = document.getElementById('contact-book');
    let children = contactBook.children;
    for (let i = 0; i < children.length; i++) {
        let id = contactBook.getElementsByTagName('tr')[i].id;
        let dataCell = contactBook.getElementsByTagName('td');
        let child = children[i];
        if (id === letter) {
            child.innerHTML += renderContacts(j, id, n, e, auc, p);
            dataCell[i].classList.remove('d-none');
        }
    }
}

/**
 * ${n}, ${e}, ${auc}
 * @param {*} id 
 * @param {*} n 
 * @param {*} e 
 * @param {*} auc 
 * @returns 
 */
function renderContacts(j, id, n, e, auc, p) {
    return /*html*/`
        <div id="${id}${j}" onclick="contactDetails('${n}', '${e}', '${auc}', ${p}, '${id}', '${j}')" class="contact mb-24px">
            <div class="flex y-center gap-35px">
                <div style="background-color: #${randomNumber()}" class="flex x-center y-center p-12px acronym">${auc}</div>
                <div>
                    <div class="ft-general fs-20px fw-400 mb-5px">${n}</div>
                    <div><a class="ft-general fw-400 fs-16px" href="mailto: ${e}">${e}</a></div>
                </div>
            </div>
        </div>`;
}

function contactDetails(n, e, auc, p, id, j) {
    let divDetails = document.getElementById('contact-details');
    divDetails.innerHTML = renderContactDetails(n, e, auc, p, id, j);
}

function renderContactDetails(n, e, auc, p, id, j) {
    return /*html*/`
        <div class="edit-contact flex y-center mb-24px">
            <div class="mr-54px">
                <span>${auc}</span>
            </div>
            <div>
                <div class="ft-general fs-47px fw-500 mb-12px">${n}</div>
                <div class="flex gap-16px">
                        <div onclick="editContact('${id}', '${j}')" class="flex col-black y-center gap-8px">
                            <img src="/assets/img/edit.png" alt="Edit">
                            <span class="dark-blue">Edit</span>
                        </div>
                        <div onclick="deleteContact('${j}')" class="flex col-black y-center gap-8px">
                            <img src="/assets/img/delete.png" alt="Delete">
                            <span class="dark-blue">Delete</span>
                        </div>
                </div>
            </div>
        </div>

        <div class="flex flex-column">
            <span class="ft-general fs-20px fw-400 mb-64px mt-24px">Contact Information</span>
            <div class="flex flex-column">
                <span class="ft-general fs-16px fw-700 mb-16px">Email</span>
                <a class="mb-24px" href="mailto:${e}">${e}</a>

                <span class="ft-general fs-16px fw-700 mb-16px">Phone</span>
                <a href="phone:${p}">${p}</a>
            </div>
        </div>
      `;
}

function editContact(id, j) {
    let contact = document.getElementById(`${id},${j}`);
}

async function deleteContact(j) {
    contacts.splice(j, 1);
    await setItem('contacts', JSON.stringify(contacts));
    contacts = JSON.parse(await getItem('contacts'));
    checkRegister();
    location.replace('contacts.html');

}

/**
 * Function to generate ranndom number to set ranom background color
 * with 16 bit hex number
 * @returns Returns the random generated number to set it as background-color
 */
function randomNumber() {
    numberRandom = Math.floor((Math.random() * 16777216)).toString(16);
    let colWhite = 0xFFFFFFF;
    let colBlack = 0x0000000;
    if ((numberRandom != colBlack) || (numberRandom != colWhite)) {
        return numberRandom;
    } else { randomNumber(); }
}

/**
 * Clear add contacts form
 * @param {*} n 
 * @param {*} e 
 * @param {*} p 
 */
function resetAddContactsForm(n, e, p) {
    n.value = '';
    e.value = '';
    p.value = '';
}