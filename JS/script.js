/* Declare global variables and arrays */
let guest = false;
let signUp = [];
let users = [];

/**
 * Init function called on body="onload" to load
 * first necessary functions
 */
async function init() {
    getTask();
    await includeHTML();
    await loadUsers();
    greetUser();
    loadLoginScreen();
    await loadContacts();
}

function getTask() {
    // console.log('Get task from tasks collection.');
}

/**
 * Forwarding to homepage summary.html
 */
function homePage() {
    window.location = 'summary.html';
}

/**
 * Changes background-color on activ link summary.html
 * add_task.html, board.html or contacts.html
 * @param {string} id Represents the current id of the active link 
 */
function markActiveLink(id) {
    let link = document.getElementById(`${id}`);
    link.classList.add('bgc-darkblue');
    link.classList.remove('menu-choose');
}

/**
 * Load login screen, effect with opacity 0.1 to 1 within 
 * 500ms and also translate effect from Join logo centered to 
 * top left window corner.
 *
 */
function loadLoginScreen() {
    let img = document.getElementById('capa-2');
    let loginWindow = document.getElementById('login');
    img.classList.add('x-translate-capa2');
    loginWindow.classList.remove('login-invisible');
    loginWindow.classList.add('login', 'z-ind-1');
}

/**
 * Load users from remote storage
 * 
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (error) {
        console.info('Could not load useres.');
    }
}

/**
 * Check users login data Email and Password
 */
function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    for (let u = 0; u < users.length; u++) {
        let user = users[u];
        if (user.Email == email.value && user.Password == password.value) {
            guestOrUserAccount(user);
        } else document.querySelector('.log-in').classList.add('login-error');
    }
}

/**
 * Check if its a existing user account or a guest logged in
 * @param {string} log string either 'guest' or 'account' as value
 */
async function guestOrUserAccount(log) {
    let login = { log };
    // await setItem('guestOrAccount', JSON.stringify(login));
    window.location.href = "summary.html";
}

/**
 * Function to open sign up and remove login section
 * 
 */
function openSignUpSection() {
    document.getElementById('login').classList.add('d-none');
    document.getElementById('sign-up').classList.remove('d-none');
    document.querySelector('.sign-up-section').classList.add('d-none');
}

/**
 * Function to remove sign up and open login section
 * 
 */
function closeSignUpSection() {
    document.getElementById('login').classList.remove('d-none');
    document.getElementById('sign-up').classList.add('d-none');
    document.querySelector('.sign-up-section').classList.remove('d-none');
}

/**
 * Removes or adds the d-none class depending on if menu is open or not. open --> add / close --> remove
 * 
 */
function openLogoutMenu() {
    let addClassList = document.getElementById('log-out');
    if (addClassList.classList.contains('x-translate'))
        addClassList.classList.remove('x-translate');
    else addClassList.classList.add('x-translate');
}

/**
 * Go back to previous page
 * 
 */
function goBack() {
    history.go(-1);
}

/**
 * Go to help.html page
 */
function goToHelp() {
    location.replace('help.html');
}

/**
 * This function is used to take information of the registration process
 * @param {string} name This is the name of the person registering
 * @param {string} email This is the email of the person registering 
 * @param {string} password This is the password of the person registering
 * @param {string} comparePassword This is the password to compare of the person registering
 * @param {boolean} checkBox True or false depending on if privacy policy is accepted or not
 */
async function addNewUser() {
    let checkbox = document.getElementById('sign-up-checkbox');
    if (checkbox.checked == true) {
        let name = document.getElementById("new-name");
        let email = document.getElementById("new-email");
        let password = document.getElementById("new-password");
        let comparePassword = document.getElementById("compare-password");
        checkbox.classList.remove('checkbox-checked');
        saveNewUser(name, email, password, comparePassword);
        // await setItem('users', JSON.stringify(users));
    } else markCheckbox();
}

/**
 * Show animation to checkbox in sign-up section if not checked
 * so the users should accept privacy policy
 * 
 */
function markCheckbox() {
    let div = document.getElementById('div-privavy-policy');
    div.classList.add('checkbox-hint');
    setTimeout(() => {
        div.classList.add('checkbox-default');
    }, 1000);
}

/**
 * Check if password set is the same with confirm passowrd field
 * then register new user
 * @param {string} name This is the name of the person registering
 * @param {string} email This is the email of the person registering 
 * @param {string} password This is the password of the person registering
 * @param {string} comparePassword This is the password to compare of the person registering
 */
function saveNewUser(name, email, password, comparePassword) {
    if (password.value == comparePassword.value) {
        users.push({
            "Name": name.value,
            "Email": email.value,
            "Password": password.value,
        });
        resetRegisterForm(name, email, password, comparePassword);
    }
}

/**
 * Function to clear register form
 * @param {string} n Variable with name in it
 * @param {string} e Variable with email in it
 * @param {string} p Variable with password in it
 * @param {string} cp Variable with password in it
 */
function resetRegisterForm(n, e, p, cp) {
    n.value = "";
    e.value = "";
    p.value = "";
    cp.value = "";
}

/**
 * Check if a input[type=checkbox] is checkd or not
 * @param {id} cB Contains the clicked id 
 */
function checkedCheckbox(cB) {
    let checkbox = document.getElementById(cB);
    if (!checkbox.classList.contains('checkbox-checked')) {
        checkbox.classList.add('checkbox-checked');
    } else if (checkbox.classList.contains('checkbox-checked')) {
        checkbox.classList.remove('checkbox-checked');
    }
}

/**
 * Deletes complet user account
 * 
 * How to use this function: Go to de body opening tag in login.html. There is the onload eventhander replace init(); with deleteUsers(1); and reload page. Then the storage with stored user profiles gets deleted. Afterwards remove deleteUsers(1); and insert init(); as original.
 * @param {variable} i
 */
async function deleteUsers(i) {
    users.splice(i, 1);
    // await setItem('users', JSON.stringify(users));
    // contacts = JSON.parse(await getItem('users'));
    window.location = window.location;
}