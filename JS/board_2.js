
/**
 * Allow drop action
 * @param {tokenlist} ev Tokenlist from element to trop
 */
function allowDrop(ev) {
    ev.preventDefault();
    let target = ev.target;
    let targetColumn;

    if (target.classList.contains('content-column')) {
        targetColumn = target;
    } else {
        targetColumn = target.closest('.content-column');
    }

    if (targetColumn) {
        let noDropElement = targetColumn.querySelector('.noDrop');
        if (noDropElement && noDropElement.contains(target)) {
            targetColumn.classList.remove('highlight');
        } else {
            targetColumn.classList.add('highlight');
        }
    }
}

/**
 * Gets several values from draged element
 * @param {tokenlist} ev Tokenlist from dragged element
 */
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

/**
 * Drop content to column
 * @param {tokenlist} ev Tokenlist from element to drop
 */
function drop(ev) {
    let target = ev.target;
    let id = target.id;
    let targetColumn = document.getElementById(`${id}`);
    let data = ev.dataTransfer.getData("text");
    if (target.classList && target.classList.contains('noDrop')) {
        ev.preventDefault();
    } else {
        ev.preventDefault();
        ev.target.appendChild(document.getElementById(data));
        changeTaskLocation(data, target);
        checkParentDivsChildren(id);
        removeColumnPlaceholder();
        howManyTasksPerColumn();
        noTaskToDo();
        targetColumn.classList.remove('highlight');
    }
}

/**
 * Remove highlight when leaving the column
 * @param {Event} ev Event from element to leave
 */
function clearHighlight(ev) {
    let target = ev.target;
    let targetColumn;

    if (target.classList.contains('content-column')) {
        targetColumn = target;
    } else {
        targetColumn = target.closest('.content-column');
    }

    if (targetColumn) {
        targetColumn.classList.remove('highlight');
    }
}

/**
 * Remove img "No Task To Do" before getting amount of tasks per column
 * After rendering "No Task To Do" img, so that this img isn't countet as a task
 */
function removeColumnPlaceholder() {
    let locations = ['backlog', 'in-progress', 'await-feedback', 'done'];
    for (let i = 0; i < locations.length; i++) {
        let location = locations[i];
        checkParentDivsChildren(location);
    }
}

/**
 * After shifting a task into an other column (backlog, in-progress, await feedback and done)
 * save the location of the task. So it can be rendered in the correct column after body onload
 * @param {string} data Is the task name and number
 * @param {HTMLAllCollection} target Target is the collectio of the target row where the task should be dropped
 */
async function changeTaskLocation(data, target) {
    let columnId = target.id;
    let index = data.slice(-1);
    tasks[index]['Column-location'] = columnId;
    // await setItem('tasks', JSON.stringify(tasks));
}

/**
 * Check after body onload if column has taks inside when not
 * insert img no_task_in_column.svg
 *
 */
function noTaskToDo() {
    let locations = ['backlog', 'in-progress', 'await-feedback', 'done'];
    let getLocation;
    for (let t = 0; t < locations.length; t++) {
        let location = locations[t];
        getLocation = document.getElementById(location);
        if (getLocation.children.length === 0) {
            let nothingInside = document.createElement('img');
            nothingInside.src = './assets/img/no_task_in_column.svg';
            nothingInside.classList.add('noDrop', 'noTask');
            getLocation.appendChild(nothingInside);
        }
    }
}

/**
 * Check after drop event if target column has already children
 * when yes remove child element with class name no-task because task
 * was added to column then check again which column has no tasks to insert
 * img no_task_in_column.svg if necessary
 * @param {string} columnId Contains the id of the column where drop event occured
 */
function checkParentDivsChildren(columnId) {
    let targetColumn = document.getElementById(columnId);
    if (targetColumn.children.length > 0) {
        let childrenWithClass = targetColumn.getElementsByClassName('noTask');
        if (childrenWithClass.length > 0) {
            let child = childrenWithClass[0];
            targetColumn.removeChild(child);
        }
    }
}

/**
 * Search tasks depending on title or description and display them below search bar
 */
function searchTask() {
    let search = document.getElementById('search').value;
    let boardContainer = document.querySelector('.drag-drop');
    let displayResult = document.getElementById('display-searched-tasks');
    boardContainer.classList.add('d-none');
    displayResult.textContent = '';
    getTaskToBeSearched(search, boardContainer, displayResult);

}

/**
 * Iterate through tasks array and find matching task(s)
 */
function getTaskToBeSearched(search, boardContainer, displayResult) {
    for (let k = 0; k < tasks.length; k++) {
        let task = tasks[k];
        let title = task['Title'];
        let description = task['Description'];
        if (title.includes(search) || description.includes(search)) {
            boardContainer.classList.add('d-none');
            displayResult.classList.remove('d-none');
            displayResult.innerHTML += taskTemplate(task, k);
        }
        if (search === '') {
            boardContainer.classList.remove('d-none');
            displayResult.classList.add('d-none');
        }
    }
}

/**
 * Render subtasks in big task view
 * @param {JSON} t Includes a complete task
 * @param {variable} k Is the index of the subtask
 * @param {variable} i Is the contact index
 */
function renderSubtask(t, k, location) {
    let div = document.getElementById(`renderSubtask${k}-${location}`);
    let subtasks = t['Subtasks'];
    for (let i = 0; i < subtasks.length; i++) {
        percentage = subtasks.length;
        let subtask = subtasks[i];
        div.innerHTML += renderActiveSubtask(k, i, subtask);
        loadActiveSubtasks(t, k, i);
    }
}

/**
 * Check or uncheck subtask depending on if its activ or not
 * @param {JSON} t Includes a complete task
 * @param {variable} k Is the index of the subtask
 * @param {variable} i Is the contact index
 */
function loadActiveSubtasks(t, k, i) {
    let activeSubtask = t['Active-Subtasks'][i];
    let subtask = document.getElementById(`subtasks${k}${i}`);
    if (activeSubtask == 1) {
        subtask.classList.add('checkbox-checked');
    } else if (activeSubtask == 0) {
        subtask.classList.remove('checkbox-checked');
    }
}

/**
 * Checks the checkbox of the subtask 
 * @param {variable} k Is the contact index
 * @param {variable} i Is the index of the subtak
 */
async function activeSubtasks(k, i) {
    let task = tasks[k];
    let subtask = document.getElementById(`subtasks${k}${i}`);
    let completeSubtaskStatus = task['Active-Subtasks'];
    isSubtaskCheckboxChecked(subtask, completeSubtaskStatus, i);
    task['Active-Subtasks'] = completeSubtaskStatus;
    task['Progressbar-Value'] = getAmounTOfSubtasks(task);
    tasks.splice(k, 1);
    tasks.push(task);
    // await setItem('tasks', JSON.stringify(tasks));
}

/**
 * If subtask is checked
 * @param {div} subtask Is the div of one of this two subtasks divs
 * @param {array} completeSubtaskStatus Shows if a subtask is active or not
 * @param {variable} i Is the index of the subtak
 * @returns 
 */
function isSubtaskCheckboxChecked(subtask, completeSubtaskStatus, i) {
    if (!subtask.classList.contains('checkbox-checked')) {
        subtask.classList.add('checkbox-checked');
        return completeSubtaskStatus[i] = 1;
    } else if (subtask.classList.contains('checkbox-checked')) {
        subtask.classList.remove('checkbox-checked');
        return completeSubtaskStatus[i] = 0;
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
    let length = t['Active-Subtasks'];
    let firstVar = [0, 0];
    let secondVar = [1, 0];
    let thirdVar = [0, 1];
    let fourthVar = [1, 1];
    if (length[0] == firstVar[0] && length[1] == firstVar[1]) {
        percent = 0;
        return 0;
    } else if ((length[0] == secondVar[0] && length[1] == secondVar[1]) ||
        (length[0] == thirdVar[0] && length[1] == thirdVar[1])) {
        percent = 50;
        return percent;
    } else if (length[0] == fourthVar[0] && length[1] == fourthVar[1]) {
        percent = 100;
        return percent;
    }
}

/**
 * Check length of subtask array and return it as a number
 * Possible numbers 0, 1 and 2. 
 * If it's 1 there is 1 additional subtask added to the task.
 * If it's 2 there are two additional subtasks added to the task.
 * If it's 0 there is no additional subtak added to the task.
 */
function getSubtasks(t) {
    subtasksLength = t['Subtasks'].length;
    return subtasksLength;
}