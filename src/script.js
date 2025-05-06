import "./styles.css";
import { Task, List, TaskManager } from "./task";

const createBtn = document.querySelector("#create-btn");
const defaultList = document.querySelector(".defaultlist");

createBtn.addEventListener("click", () => {
    const overlay = document.querySelector(".overlay");
    overlay.style.display = "flex";
});

// ============= //
// ============= //
//   Task Form   //
// ============= //
// ============= //

const taskForm = document.querySelector(".task-form");
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(taskForm);
    const taskData = Object.fromEntries(data.entries());

    const task = TaskManager.createTask(taskData);

    // add to list, and hide overlay.
    const div = document.createElement("div");
    div.classList.add("task");
    div.textContent = task.info();
    defaultList.append(div);

    const overlay = document.querySelector(".overlay");
    overlay.style.display = "none";
    taskForm.reset();
});
