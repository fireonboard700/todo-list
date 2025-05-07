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
}

class List {
    constructor(name) {
        this.id = `uuid-${crypto.randomUUID()}`;
        this.name = name;
        this.taskList = {};
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
        console.log(allLists[listId]);
        allLists[listId].taskList[task["id"]] = task;
        return task;
    };

    const setTaskProperty = (task, property, value) => {
        task[`${property}`] = value;
    };

    const deleteTask = (task) => {
        const list = allLists[task.listId];
        delete list.taskList[task.id];
    };

    const createList = (listName) => {
        const list = new List(listName);
        allLists[list["id"]] = list;
        return list["id"];
    };

    const deleteList = (listId) => {
        delete allLists[listId];
    };

    const serialize = () => {
        return JSON.stringify(allLists);
    };

    const deserialize = (cache) => {
        Object.assign(allLists, JSON.parse(cache));
    };

    return {
        allLists,
        createTask,
        deleteTask,
        setTaskProperty,
        createList,
        deleteList,
        serialize,
        deserialize,
    };
})();

export { Task, List, TaskManager };
