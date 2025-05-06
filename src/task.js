class Task {
    // TODO: think about if we want getters or setters. (we probably do)
    constructor({ title, priority, dueDate, description, list }) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.priority = priority;
        this.dueDate = dueDate;
        this.description = description;
        this.isComplete = false;
        this.list = list;
    }

    info() {
        // deserialize task.
        return `${this.title}, ${this.priority}, ${this.dueDate}, ${this.description}, ${this.list}`;
    }
}

class List {
    constructor(name) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.taskList = [];
    }

    addTask(task) {
        this.taskList.push(task);
    }
}

const TaskManager = (function () {
    const createTask = (title, priority, dueDate, description, list) => {
        const task = new Task(title, priority, dueDate, description, list);
        // list.addTask(task);
        return task;
    };

    const setTaskProperty = (task, property, value) => {
        task[`${property}`] = value;
    };

    const createList = () => {
        return new List();
    };

    return { createTask, setTaskProperty };
})();

export { Task, List, TaskManager };
