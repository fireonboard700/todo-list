class Task {
    // TODO: think about if we want getters or setters. (we probably do)
    constructor({ title, priority, dueDate, description, listId }) {
        this.id = `uuid-${crypto.randomUUID()}`;
        this.title = title;
        this.priority = priority;
        this.dueDate = dueDate;
        this.description = description;
        this.isComplete = false;
        this.listId = listId;
    }

    info() {
        // deserialize task.
        return `${this.title}, ${this.priority}, ${this.dueDate}, ${this.description}, ${this.listId}`;
    }
}

class List {
    constructor(name) {
        this.id = `uuid-${crypto.randomUUID()}`;
        this.name = name;
        this.taskList = {};
    }

    addTask(task) {
        this.taskList[task["id"]] = task;
    }
}

const TaskManager = (function () {
    // Congratulations, this is the worst code ever to be written.
    const allLists = {};

    const createTask = ({ title, priority, dueDate, description, listId }) => {
        const task = new Task({
            title,
            priority,
            dueDate,
            description,
            listId,
        });
        allLists[listId].addTask(task);
        return task;
    };

    const setTaskProperty = (task, property, value) => {
        task[`${property}`] = value;
    };

    const deleteTask = (task) => {
        const list = task.list;
    };

    const createList = (listName) => {
        const list = new List(listName);
        allLists[list["id"]] = list;
        return list["id"];
    };

    const deleteList = (list) => {};

    return {
        allLists,
        createTask,
        deleteTask,
        setTaskProperty,
        createList,
        deleteList,
    };
})();

export { Task, List, TaskManager };
