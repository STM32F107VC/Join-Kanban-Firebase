// let tasks = [];
let countUp = -1;
let getCategory;
let bgcCode;
let taskIndex;
let saveDate;

/**
 * Init function called on body="onload" to load
 * first necessary functions
 */
async function init_board(id) {
    await includeHTML();
    await loadContacts();
    loadTasks();
    markActiveLink(id);
    greetUser();
    getAddTaskMenu('overlay');
    assignContact('overlay');
    howManyTasksPerColumn();
}

//-------------------------------------
function howManyTasksPerColumn() {
    let prioHigh = 'high'
    let increment = 0;
    saveDate = [];
    let toDo = document.getElementById('backlog').children.length;
    let inProgress = document.getElementById('in-progress').children.length;
    let awaitFeedback = document.getElementById('await-feedback').children.length;
    let done = document.getElementById('done').children.length;
    let amountOfTasks = tasks.length;
    // console.log('Todo:' + toDo);
    // console.log('In-progress:' + inProgress);
    // console.log('Await-Feedback:' + awaitFeedback);
    // console.log('Done:' + done);
    // console.log('Total amount of tasks:' + amountOfTasks);

    //--- How many urgent value, the most urgent date and the most current date
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let prio = task['Prio'];

        // console.log(mostUrgentDate);
        // console.log(prio);
        if (prio == prioHigh) {
            increment++;
            // console.log(increment);


            let currentDate = task['Date'];
            saveDate.push({ date: new Date(currentDate) });

        }
    }

    let mostUrgentDate = saveDate.sort((objA, objB) => Number(objA.date) - Number(objB.date),).reverse();
    // let day = mostUrgentDate.getDate();
    // console.log(day);
    // console.log(mostUrgentDate);

    // console.log(mostUrgentDate[0]);



}

//-------------------------------------

/**
 * Load tasks from local storage ---------------- change to remote storage later!!
 */
async function loadTasks() {
    let tasksToString = localStorage.getItem('tasks');
    if (tasksToString) {
        let object = JSON.parse(tasksToString);
        tasks = object;
        loadToColumn();
    }
}

/**
 * Load tasks to matching column, which they were attached last
 */
function loadToColumn() {
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let getTaskLocation = task['Column-location'];
        let column = document.getElementById(`${getTaskLocation}`);
        column.innerHTML += taskTemplate(task, i);
        renderAssignedContacts(task, i, false);
    }
}

/**
 * Open add new task overlay menu
 * 
 */
async function openAddTaskOverlay() {
    document.getElementById('add-tasks-overlay-view').classList.remove('d-none');
    document.getElementById('main-div-board').classList.add('d-none');
    document.getElementById('body-board').classList.add("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-board').classList.add("opacity", "z-ind--1");
}

/**
 * Close add new task overlay menu
 * 
 */
function closeAddTaskOverlay() {
    document.getElementById('add-tasks-overlay-view').classList.add('d-none');
    document.getElementById('main-div-board').classList.remove('d-none');
    document.getElementById('body-board').classList.remove("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-board').classList.remove("opacity", "z-ind--1");
    document.getElementById('displaySelectedContacts-overlay').innerHTML = '';
    assignedContacts = [];
    window.location.reload();
}

/**
 * Close tasks overlay menu
 * 
 */
function closeShowTaskOverlay() {
    document.getElementById('displaySubtasks-edit-overlay').innerHTML = '';
    document.getElementById('assigned-edit-overlay').innerHTML = '';
    document.getElementById('displaySelectedContacts-edit-overlay').innerHTML = '';
    document.getElementById('tasks-overlay-view').classList.add('d-none');
    document.getElementById('main-div-board').classList.remove('d-none');
    document.getElementById('body-board').classList.remove("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-board').classList.remove("opacity", "z-ind--1");
    document.getElementById('edit-task-overlay-view').classList.add('d-none');
    assignedContacts = [];
    subtasks = [];
}

/**
 * Render tasks to board
 * @param {JSON} task JSON with all informations of a task
 * @returns Returns the rendered task
 */
function taskTemplate(task, i) {
    return /*html*/`
                    <div id="task${i}" onclick="showTaskOverlay(${i})" class="task flex flex-column ft-general noDrop" id="drag1" draggable='true'  ondragstart='drag(event)'>
                        <div id="category${i}" style="background-color:${task['Bgc-Code']}" class="task-category x-start col-white fs-16px fw-400 mb-24px noDrop">${task['Category']}</div>
                        <div id="taskTitle${i}" class="task-title fs-16px fw-700 mb-8px noDrop">${task['Title']}</div>
                        <div id="taskDescription${i}" class="flex x-start mb-24px fs-16px col-grey noDrop">${task['Description']}</div>
                        <div id="progress${i}" class="flex x-space-betw y-center fs-12px mb-24px noDrop">
                            <progress id="progressBar${i}" class="noDrop" value="${getAmounTOfSubtasks(task)}" max="100"></progress> 
                            <span class="noDrop">${getSubtasks(task)}/2 Subtasks</span>
                        </div>
                        <div class="flex x-space-betw noDrop">
                            <div id="assignedContact${i}" class="flex pl-6px noDrop"></div>
                            ${renderPrioImg(task, i)}
                        </div>
                    </div>`;
}

/**
 * Show big view of a task
 * @param {variable} i Is the task index
 */
function showTaskOverlay(i) {
    document.getElementById('main-div-board').classList.add('d-none');
    document.getElementById('body-board').classList.add("flex", "x-center", "y-center");
    document.getElementById('side-and-topbar-board').classList.add("opacity", "z-ind--1");

    taskIndex = i;

    let task = tasks[i];
    let str = task['Prio'];
    let priority;
    if (str !== undefined) {
        priority = str.charAt(0).toUpperCase() + str.slice(1);
    }

    // console.log(tasks[i]);

    let div = document.getElementById('tasks-overlay-view');
    div.classList.remove('d-none');

    div.innerHTML = /*html*/`
        <div class="ft-general">
            <div class="flex x-space-betw y-center">
                <div id="category${i}" style="background-color:${task['Bgc-Code']}" class="task-category x-start col-white fs-23px fw-400">${task['Category']}</div>
                <div class="close-cross p-zero"><img onclick="closeShowTaskOverlay()" class="p-8px"
                        src="assets/img/close.png" alt="close"></div>
                </div>
            </div>
            <div class="fs-61px fw-700">${task['Title']}</div>
            <div class="fs-20px fw-400">${task['Description']}</div>
            <div><span class="col-grey-blue">Due date:</span>&nbsp;&nbsp;&nbsp;${task['Date']}</div>
            <div id='priority-state-overlay' class="flex y-center">
                <span class="col-grey-blue">Priority:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${priority}&nbsp;
                <img src="assets/img/prio-indicator-${priority}.svg" alt="prio-${priority}">
            </div>
            <div id="assignedContactPreView${i}">
                <div class="mb-8px col-grey-blue">Assigned To:</div>
            </div>
            <div>
                <div class="mb-8px col-grey-blue">Subtasks</div>
                <div id="renderSubtask${i}-overlay"></div>
            </div>

            <div class="flex x-end gap-16px remove-margin">
                    <img onclick="deleteTask(${i});" class="delete c-pointer" src="/assets/img/delete_default.png" alt="delete">
                    <img src="/assets/img/subtasks_vector.svg" alt="separator">
                    <img onclick="showEditTaskOverlay('${i}')" class="edit c-pointer" src="/assets/img/edit_default.png" alt="edit">
            </div>
        </div>
    `;

    if (str == undefined) {
        document.getElementById('priority-state-overlay').classList.add('d-none');
    }
    renderAssignedContacts(task, i, true);
    renderSubtask(task, i, 'overlay');
}

/**
 * Delete tasks from board
 * @param {variable} j Is the task index 
 */
function deleteTask(j) {
    tasks.splice(j, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    tasks = localStorage.getItem('tasks');
    location.replace('board.html');
}

/**
 * Get div for rendering in information to edit a task and hide normal overlay view
 * @param {*} i Is the task index
 */
function showEditTaskOverlay(i) {
    let divBigViewTask = document.getElementById('tasks-overlay-view');
    let divEditTask = document.getElementById('edit-task-overlay-view');
    divBigViewTask.classList.add('d-none');
    divEditTask.classList.remove('d-none');
    renderOkBtn(i);
    assignContact('edit-overlay');
    getTaskValues(i);
}

/**
 * 
 * @param {variable} i Is the task index 
 */
function getTaskValues(i) {
    let task = tasks[i];
    let title = task['Title'];
    let description = task['Description'];
    let date = task['Date'];
    getCategory = task['Category'];
    bgcCode = task['Bgc-Code'];
    // let getSubtasks = task['Subtasks'];
    oldImg = task['Prio'];
    // let contact = task['Contacts'];

    renderAssignedContacts(task, i, 'edit-overlay');

    let renderSubtasks = document.getElementById('displaySubtasks-edit-overlay');
    for (let k = 0; k < task['Subtasks'].length; k++) {
        let subtask = task['Subtasks'][k];
        countUp += 1;
        let location = 'edit-overlay';
        subtasks.push(subtask);
        renderSubtasks.innerHTML += subtaskTemplate(countUp, subtask, location);

        // subtasks = [];

        // let editImg = document.getElementById(`edite${state}-${location}`);
        // editImg.addEventListener('click', clickHandlerEdit);
        // clearSubtasks(inputValue);
    }

    document.getElementById('prio-low-edit-overlay').src = 'assets/img/prio-default-low.png';
    document.getElementById('prio-medium-edit-overlay').src = 'assets/img/prio-default-medium.png';
    document.getElementById('prio-high-edit-overlay').src = 'assets/img/prio-default-high.png';

    let prioState = document.getElementById(`prio-${task['Prio']}-edit-overlay`);
    prioState.src = `assets/img/prio-${task['Prio']}.svg`;

    oldImg = undefined;

    document.getElementById('title-editable').value = title;
    document.getElementById('textarea-editable').value = description;
    document.getElementById('date-editable').value = date;
}

/**
 * Safes changes which were made on a task
 * @param {variable} j J is the index number for accessing a task in the tasks array
 */
function saveEditTaskChanges(taskIndex) {
    document.getElementById('edit-overlay-ok-btn').disabled = true;

    let title = document.getElementById('title-editable');
    let description = document.getElementById('textarea-editable');
    let date = document.getElementById('date-editable');
    let columnLocation = tasks[taskIndex]['Column-location'];
    tasks.splice(taskIndex, 1);
    tasks.push({
        "Title": title.value,
        "Description": description.value,
        "Assigned-to": assignedContacts,
        "Date": date.value,
        "Prio": oldImg,
        "Category": getCategory,
        "Bgc-Code": bgcCode,
        "Subtasks": subtasks,
        "Column-location": columnLocation
    });
    setToLocalStorage(tasks);
    document.getElementById('edit-overlay-ok-btn').disabled = false;
    location.reload();
}


/**
 * Get contacts to render in another step
 * @param {JSON} t Includes a complete task
 * @param {variable} i Is the contact index
 */
function renderAssignedContacts(t, i, flag) {
    let showContacts;
    if (!flag) showContacts = document.getElementById(`assignedContact${i}`);
    else if (flag == true) showContacts = document.getElementById(`assignedContactPreView${i}`);
    else if (flag == 'edit-overlay') showContacts = document.getElementById(`displaySelectedContacts-${flag}`);

    for (let j = 0; j < t['Assigned-to'].length; j++) {
        let contact = t['Assigned-to'][j];
        let array = buildAcronym(contact);
        let acronymUpperCase = array[0];
        let bgc = array[1];
        if (!flag) showContacts.innerHTML += assigneContactsTemplate(acronymUpperCase, i, bgc);
        else if (flag == true) showContacts.innerHTML += assigneContactsTemplatePreview(contact, acronymUpperCase, i, bgc);
        else if (flag == 'edit-overlay') {
            assignedContacts.push(contact);
            showContacts.innerHTML += renderSelectedContact(acronymUpperCase, i, bgc);
        }
    }
}

/**
 * Render subtasks in big task view
 * @param {JSON} t Includes a complete task
 * @param {variable} i Is the contact index
 */
function renderSubtask(t, i, location) {
    // renderSubtask${i}-${overlay}
    let div = document.getElementById(`renderSubtask${i}-${location}`);
    let subtasks = t['Subtasks'];
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        div.innerHTML += /*html*/`
            <div class="subtasks flex gap-16px">
                <input onclick="showOrHidSubtask('${taskIndex}', '${i}')" type="checkbox" id="subtasks${i}">
                <div>${subtask}</div>
            </div>`;
    }
}

/**
 * Render contacts
 * @param {variable} aUC Includes the acronym of contact
 * @param {variable} i Is the contact index
 * @param {string} bgc Is the background-color code
 * @returns Rendered contact info sign includes acronym and
 *          a background color in a circle
 */
function assigneContactsTemplate(aUC, i, bgc) {
    return /*html*/`
                    <div id='${aUC}${i}' class="acronym acronym-dimensions-small flex x-center y-center fs-12px noDrop" style="background-color: #${bgc}">${aUC}
                    </div>`;
}

/**
* Render contacts
 * @param {variable} aUC Includes the acronym of contact
 * @param {variable} i Is the contact index
 * @param {string} bgc Is the background-color code
 * @returns Rendered contact info sign includes acronym and
 *          a background color in a circle
 */
function assigneContactsTemplatePreview(c, aUC, i, bgc) {
    return /*html*/`
                <div  class="flex y-center contacts-padding">
                    <div id='${aUC}${i}' class="acronym acronym-dimensions-medium flex x-center y-center fs-12px" style="background-color: #${bgc}">${aUC}
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>${c['name']}</span>
                </div>`;
}

/**
 * Generate acronym for example, Max Mustermann => MM
 * @param {JSON} contact JSON with all values a contact contains
 * @returns Returns the built acronym and background-color
 */
function buildAcronym(contact) {
    let bgc = contact['background-color'];
    let str = contact['name'].match(/\b(\w)/g);
    let acronymUpperCase = str.join('').toUpperCase();
    return [acronymUpperCase, bgc];
}

/**
 * Check if a priority state is selected. When selected, insert priority img,
 * when no state selected, render image and hide to edit later and add a priotity state.
 * @param {JSON} t Is a JSON with all feature of one task in it 
 * @param {variable} i Index of current JSON-array place
 * @returns Returns the rendered img
 */
function renderPrioImg(t, i) {
    if (t['Prio'] !== undefined) {
        return /*html*/`<img class="noDrop" src="assets/img/prio-indicator-${t['Prio']}.svg" alt="prio-${t['Prio']}">`;
    } else {
        return /*html*/`<img class="d-none noDrop" src="assets/img/prio-indicator-${t['Prio']}.svg" alt="prio-${t['Prio']}">`;
    }
}

/**
 * Check if there are one or two subtasks to return
 * the number for progress bar. 1 Subtask: value = 50;
 * 2. Subtask: value = 100;
 * @param {JSON} t Is a JSON with all feature of one task in it 
 * @returns Returns the percent value
 */
function getAmounTOfSubtasks(t) {
    let length = t['Subtasks'].length;
    // getPercentage(length);
    if (length == 1) {
        let percent = 50;
        return percent;
    } else if (length == 2) {
        let percent = 100;
        return percent;
    }
}

function getPercentage(length) {
    if (length == 1) {
        let percent = 50;
        return percent;
    } else if (length == 2) {
        let percent = 100;
        return percent;
    }
}

/**
 * 
 * @param {variable} taskIndex Is the index of the current task
 * @param {*} i Is the number depending on the amount of subtasks 
 *              i = 0 => 1 subtask | i = 1 => 2 subtasks
 */
function showOrHidSubtask(taskIndex, i) {
    let progressBar = document.getElementById(`progressBar${taskIndex}`);
    let percent;
    if (i == 0) {
        i++;
        percent = getPercentage(i);
    } else if (i == 1) {
        i = 2;
        percent = getPercentage(i);
    }
    progressBar.value = percent;
}

/**
 * Check length of subtask array and return it as a number
 * Possible numbers 0, 1 and 2. 
 * If it's 1 there is 1 additional subtask added to the task.
 * If it's 2 there are two additional subtasks added to the task.
 * If it's 0 there is no additional subtak added to the task.
 */
function getSubtasks(t) {
    return t['Subtasks'].length;
}

/**
 * Allow drop action
 * @param {} ev 
 */
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    let target = ev.target;
    let data = ev.dataTransfer.getData("text");
    if (target.classList && target.classList.contains('noDrop')) {
        ev.preventDefault();
    } else {
        ev.preventDefault();
        ev.target.appendChild(document.getElementById(data));
        changeTaskLocation(data, target);
    }
}

/**
 * After shifting a task into an other column (backlog, in-progress, await feedback and done)
 * save the location of the task. So it can be rendered in the correct column after body onload
 * @param {string} data Is the task name and number
 * @param {HTMLAllCollection} target Target is the collectio of the target row where the task should be dropped
 */
function changeTaskLocation(data, target) {
    let columnId = target.id;
    let index = data.slice(-1);
    tasks[index]['Column-location'] = columnId;
    setToLocalStorage(tasks);
    howManyTasksPerColumn();
}