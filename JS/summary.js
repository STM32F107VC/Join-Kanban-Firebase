/* Declare global variables and arrays */


/**
 * Init function called on body="onload" to load
 * first necessary functions
 */
async function init_summary(id) {
    await includeHTML();
    await loadContacts();
    await getFromRemoteStorage();
    markActiveLink(id);
    greetUser('summary');
    dayGreeting();
}

/**
 * Load tasks from backend
 */
async function getFromRemoteStorage() {
    try {
        // tasks = JSON.parse(await getItem('tasks'));
        // let informationObj = JSON.parse(await getItem('summary-informations'));
        loadSummaryInformations(informationObj);
    } catch (error) { }
}

/**
 * Get elements for setting: How many tasks in each column, urgent tasks, most urgent deadline
 * @param {JSON} informations 
 */
function loadSummaryInformations(informations) {
    let totalAmount = document.getElementById('total-tasks');
    let totalUrgent = document.getElementById('urgent');
    let awaitFeedback = document.getElementById('feedback');
    let date = document.getElementById('upcoming-deadline');
    let done = document.getElementById('done');
    let inProgress = document.getElementById('progress');
    let toDo = document.getElementById('to-do');
    setSummaryInformations(informations, totalAmount, totalUrgent, awaitFeedback, date, done, inProgress, toDo);
}

/**
 * Get current time number between 0 - 24 and greet make day greeting depeneding on number value
 */
function dayGreeting() {
    let greet = document.getElementById('day-greeting');
    var d = new Date();
    var time = d.getHours();
    if (time < 6 || time > 18) greet.textContent = 'Good Evening';
    else if (time < 12) greet.textContent = 'Good Morning';
    else if (time > 12) greet.textContent = 'Good Afternoon';
}

/**
 * Set informaitons for summary: How many tasks in each column, total tasks,
 * urgent tasks, most urgent deadline
 * @param {variable} tA Total amount of tasks
 * @param {variable} tU Total amount of urgent tasks
 * @param {variable} aF Tasks in await feedback column
 * @param {variable} date Most urgent date of urgent tasks
 * @param {variable} done Task in done column
 * @param {variable} iP Tasks in in porgress column
 * @param {variable} toDo Task in to do column
 */
function setSummaryInformations(inf, tA, tU, aF, date, done, iP, toDo) {
    tA.innerHTML = inf['Amount-Of-Tasks'];
    done.innerHTML = inf['Done'];
    toDo.innerHTML = inf['To-Do'];
    tU.innerHTML = inf['Amount-Of-Urgent-Tasks'];
    date.innerHTML = inf['Date'];
    iP.innerHTML = inf['In-Progress'];
    aF.innerHTML = inf['Await-Feedback'];
}

/**
 * Check if its a user account or a guest login. Then greet the user
 */
async function greetUser(location) {
    let greetingText = document.getElementById('greet-user');
    let acronym = document.getElementById('acronym');
    // let user = JSON.parse(await getItem('guestOrAccount'));
    let name = user['log']['Name'];
    user = user['log'];
    if (user === 'guest') {
        acronym.textContent = 'G';
        if (location === 'summary') greetingText.textContent = 'Guest';
    } else {
        let acronymUpperCase = buildAcronymContact(name, true);
        acronym.textContent = acronymUpperCase;
        if (location === 'summary') greetingText.textContent = name;
    }
}

/**
 * Forwarding to board.html
 */
function forwardingToBoard() {
    window.location.href = 'board.html';
}