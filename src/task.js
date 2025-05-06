class Task {
    // TODO: think about if we want getters or setters. (we probably do)
    constructor(title, priority, dueDate, description, list) {
        this.title = title;
        this.priority = priority;
        this.dueDate = dueDate;
        this.description = description;
        this.isComplete = false;
        this.list = list;
    }
}

class List {
    constructor() {
        this.taskList = [];
    }

    addTask(task) {
        this.taskList.push(task);
    }
}

const TaskManager = (function () {
    const createTask = (title, priority, dueDate, description, list) => {
        const task = new Task(title, priority, dueDate, description, list);
        list.addTask(task);
        return task;
    };

    const setTaskProperty = (task, property, value) => {
        task[`${property}`] = value;
    };

    return { createTask, setTaskProperty };
})();

export { TaskManager, List };
