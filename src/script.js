import "./styles.css";
import { Task, List, TaskManager } from "./task";

// TODO - fix bug with edit task.

// ============= //
// ============= //
//   List Form   //
// ============= //
// ============= //

const lists = document.querySelector(".lists");
const listForm = document.querySelector(".list-form");
const overlay = document.querySelector(".overlay");

const cache = localStorage.getItem("cache");
if (cache) {
    TaskManager.deserialize(cache);
    for (let list of Object.values(TaskManager.allLists)) {
        createListUI(list.name, list.id);
        for (let task of Object.values(list.tasks)) {
            createtaskUI(task);
        }
    }
}

function createListUI(listName, listId) {
    const div = document.createElement("div");
    const listHead = document.createElement("div");
    listHead.classList.add("list-head");

    const listHeadLeft = document.createElement("div");
    listHeadLeft.classList.add("list-head-left");
    listHeadLeft.textContent = `${listName}`;

    const deleteListBtn = document.createElement("button");
    deleteListBtn.textContent = "Delete";
    deleteListBtn.classList.add("edit-button");
    deleteListBtn.addEventListener("click", () => {
        TaskManager.deleteList(listId);
        div.remove();
        console.log(TaskManager.allLists);
        localStorage.setItem("cache", TaskManager.serialize());
    });

    listHead.append(listHeadLeft);
    listHead.append(deleteListBtn);

    div.classList.add("list");
    div.id = `${listId}`;

    div.appendChild(listHead);

    lists.appendChild(div);
    listForm.reset();

    const select = document.querySelector("select");
    const option = document.createElement("option");
    option.value = `${listId}`;
    option.textContent = listName;

    select.appendChild(option);
}

listForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(listForm);
    const listName = data.get("listName");
    const listId = TaskManager.createList(listName);
    console.log(TaskManager);

    createListUI(listName, listId);
    localStorage.setItem("cache", TaskManager.serialize());
});

// ============= //
// ============= //
//   Task Form   //
// ============= //
// ============= //

let taskToEdit = null;

function updatetaskUI(container, taskData) {
    //ugly, duplicated code, but I just want to be done.
    const { title, priority, dueDate, description, listId } = taskData;

    const hue = 50 - (priority - 1) * 5;
    container.style.setProperty("--hue", hue);

    const taskTitle = container.querySelector(".task-title");
    const taskDueDate = container.querySelector(".task-duedate");
    const taskDescription = container.querySelector(".task-description");

    taskTitle.textContent = title;
    taskDueDate.textContent = dueDate;
    taskDescription.textContent = description;

    const listDiv = document.querySelector(`#${listId}`);
    listDiv.appendChild(container);

    overlay.classList.toggle("hidden");
    document.querySelector(".form-submit button").textContent = "Create";
}

function createtaskUI(task) {
    const { id, title, priority, dueDate, description, isComplete, listId } =
        task;
    const container = document.createElement("div");
    container.classList.add("task");
    container.id = id;

    const hue = 50 - (priority - 1) * 5;
    container.style.setProperty("--hue", hue);

    // head of container
    // UGLY HORRIBLE CANNOT MAINTAIN WHAT WERE YOU THINKING
    // -screams from future me
    const taskHead = document.createElement("div");
    taskHead.classList.add("task-head");

    const taskHeadLeft = document.createElement("div");
    taskHeadLeft.classList.add("task-head-left");

    const taskCompleted = document.createElement("button");
    taskCompleted.textContent = "✓";
    taskCompleted.classList.add("task-completed");

    if (isComplete) {
        taskCompleted.classList.add("completed");
    }

    const taskTitle = document.createElement("div");
    taskTitle.classList.add("task-title");
    const taskDueDate = document.createElement("div");
    taskDueDate.classList.add("task-duedate");

    taskTitle.textContent = title;
    taskDueDate.textContent = dueDate;

    taskCompleted.addEventListener("click", (e) => {
        e.stopPropagation();
        taskCompleted.classList.toggle("completed");
        container.classList.toggle("completed");
        taskTitle.classList.toggle("strikethrough");
        task.isComplete = !task.isComplete;
    });

    taskHeadLeft.append(taskCompleted);
    taskHeadLeft.append(taskTitle);

    taskHead.append(taskHeadLeft);
    taskHead.append(taskDueDate);

    // task description, click to expand

    const taskBody = document.createElement("div");
    taskBody.classList.add("task-body", "hidden");

    const taskDescription = document.createElement("div");
    taskDescription.classList.add("task-description");
    taskDescription.textContent = description;

    const buttons = document.createElement("div");
    buttons.classList.add("buttons");

    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", (e) => {
        e.stopPropagation();
        //editing mode
        taskToEdit = task;
        updateModalUI(taskToEdit);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("edit-button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        //delete
        TaskManager.deleteTask(task);
        container.remove();
        localStorage.setItem("cache", TaskManager.serialize());
    });

    buttons.appendChild(editButton);
    buttons.appendChild(deleteButton);

    taskBody.appendChild(taskDescription);
    taskBody.appendChild(buttons);

    container.append(taskHead);
    container.append(taskBody);

    container.addEventListener("click", () => {
        taskBody.classList.toggle("hidden");
    });

    const listDiv = document.querySelector(`#${listId}`);
    listDiv.appendChild(container);
}

const taskForm = document.querySelector(".task-form");

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(taskForm);
    const taskData = Object.fromEntries(data.entries());
    console.log(taskData);

    if (!taskToEdit) {
        const task = TaskManager.createTask(taskData);
        createtaskUI(task);
        overlay.classList.toggle("hidden");
    } else {
        TaskManager.updateTask(taskToEdit, taskData);
        const containerToEdit = document.querySelector(`#${taskToEdit["id"]}`);
        updatetaskUI(containerToEdit, taskData);
        taskToEdit = null;
    }

    console.log(TaskManager.allLists);
    localStorage.setItem("cache", TaskManager.serialize());
    taskForm.reset();
});

// ============= //
// ============= //
//   Modal Logic //
// ============= //
// ============= //

function updateModalUI(task) {
    document.querySelector(".form-submit button").textContent = "Edit";

    overlay.classList.toggle("hidden");
    const inputs = document.querySelectorAll(".form-input input");
    for (let input of inputs) {
        input.value = task[input.id];
    }
    const textarea = document.querySelector(".form-input textarea");
    textarea.value = task["description"];

    const select = document.querySelector(".form-input select");
    select.value = task["listId"];
}

document.querySelector("#create-btn").addEventListener("click", () => {
    document.querySelector(".form-submit button").textContent = "Create";
    overlay.classList.toggle("hidden");
});

overlay.addEventListener("click", () => {
    if (taskToEdit) taskForm.reset();
    taskToEdit = null;
    overlay.classList.toggle("hidden");
});

document
    .querySelector(".modal")
    .addEventListener("click", (e) => e.stopPropagation());
