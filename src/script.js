import "./styles.css";
import { Task, List, TaskManager } from "./task";

// ============= //
// ============= //
//   List Form   //
// ============= //
// ============= //

const lists = document.querySelector(".lists");
const listForm = document.querySelector(".list-form");

function createListElement(listName) {
    const div = document.createElement("div");
    div.classList.add("list", `${listName}`);
    div.textContent = `${listName}`;

    lists.appendChild(div);
    listForm.reset();
}

listForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(listForm);
    console.log(data);
    const listName = data.get("listName");
    TaskManager.createList(listName);
    console.log(TaskManager);

    createListElement(listName);
});

// ============= //
// ============= //
//   Task Form   //
// ============= //
// ============= //

function createtaskUI(task) {
    const { title, priority, dueDate, description, list } = task;
    const container = document.createElement("div");
    container.classList.add("task");

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
    taskCompleted.classList.add("task-completed");

    taskCompleted.addEventListener("click", (e) => {
        e.stopPropagation();
        taskCompleted.classList.toggle("completed");
        task.isComplete = !task.isComplete;
        console.log(task);
    });

    const taskTitle = document.createElement("div");
    const taskDueDate = document.createElement("div");
    taskTitle.textContent = title;
    taskDueDate.textContent = dueDate;

    taskHeadLeft.append(taskCompleted);
    taskHeadLeft.append(taskTitle);

    taskHead.append(taskHeadLeft);
    taskHead.append(taskDueDate);

    // task description, click to expand

    const taskDescription = document.createElement("div");
    taskDescription.classList.add("task-description", "hidden");
    taskDescription.textContent = description;

    container.append(taskHead);
    container.append(taskDescription);

    // add event listeners

    container.addEventListener("click", () => {
        taskDescription.classList.toggle("hidden");
    });

    const listDiv = document.querySelector(`.${list}`);
    console.log(listDiv);
    listDiv.appendChild(container);
}

const taskForm = document.querySelector(".task-form");
const overlay = document.querySelector(".overlay");

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(taskForm);
    const taskData = Object.fromEntries(data.entries());

    const task = TaskManager.createTask(taskData);

    // add to list, and hide overlay.
    createtaskUI(task);
    overlay.classList.toggle("hidden");
    taskForm.reset();
});

// ============= //
// ============= //
//   Modal Logic //
// ============= //
// ============= //

document.querySelector("#create-btn").addEventListener("click", () => {
    const overlay = document.querySelector(".overlay");
    overlay.classList.toggle("hidden");
});

overlay.addEventListener("click", () => {
    overlay.classList.toggle("hidden");
});

document
    .querySelector(".modal")
    .addEventListener("click", (e) => e.stopPropagation());
