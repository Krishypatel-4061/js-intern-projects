let title = document.getElementById("task-title");
let description = document.getElementById("task-description");
let status = document.getElementsByName("task-status");
let priority = document.getElementsByName("task-pri");
let id = 1;
let taskarr = [];


const task = {
    id: 1,
    title: "Exam",
    description: "Practical Js exam",
    status: "pending",
    priority: "high",
    time: "11:00"
};

function Task(id, title, description, status, priority) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.time = new Date();
}

taskarr.push(task);
localStorage.setItem("taskarr", JSON.stringify(taskarr));

function AddTasks() {
    if (title.value == "" || description.value == "" || status.value == "" || priority.value == "") {
        alert("Please fill all the fields");
        return;
    }
    id = id + 1;
    for (let i = 0; i < status.length; i++) {
        if (status[i].checked) {
            status = status[i].value;
            break;
        }
    }
    for (let i = 0; i < priority.length; i++) {
        if (priority[i].checked) {
            priority = priority[i].value;
            break;
        }
    }

    taskarr.push(new Task(id, title.value, description.value, status, priority));
    localStorage.setItem("taskarr", JSON.stringify(taskarr));
    ShowTasks();
    desiredoutput();
}

function ShowTasks() {
    let taskarrlist = JSON.parse(localStorage.getItem("taskarr"));
    let tasklist = document.getElementById("task-list");
    tasklist.innerHTML = "";
    taskarrlist.forEach(task => {
        let taskitem = document.createElement("li");
        taskitem.innerHTML = `
            <h4>${task.title}</h4>
            <p>${task.description}</p>
            <p>${task.status}</p>
            <p>${task.priority}</p>
            <p>${task.time}</p>
        `;
        tasklist.appendChild(taskitem);
    });
}

ShowTasks();

function UpdateTask() {
    let taskarrlist = JSON.parse(localStorage.getItem("taskarr"));
    console.log("Update called");
    let searchTask = document.getElementById("search-task");
    for (let i = 0; i < taskarrlist.length; i++) {
        if (taskarrlist[i].title == searchTask.value) {
            taskarrlist[i].title = document.getElementById("task-title").value;
            taskarrlist[i].description = document.getElementById("task-description").value;
            for (let i = 0; i < status.length; i++) {
                if (status[i].checked) {
                    status = status[i].value;
                    break;
                }
            }
            for (let i = 0; i < priority.length; i++) {
                if (priority[i].checked) {
                    priority = priority[i].value;
                    break;
                }
            }
            taskarrlist[i].status = status;
            taskarrlist[i].priority = priority;
        }
    }
    localStorage.setItem("taskarr", JSON.stringify(taskarrlist));
    ShowTasks();
    desiredoutput();
}

function DeleteTask() {
    let taskarrlist = JSON.parse(localStorage.getItem("taskarr"));
    console.log("Delete called");
    let searchTask = document.getElementById("search-task");
    taskarr.forEach(task => {
        if (task.title == searchTask.value) {
            taskarr.splice(task, 1);
            localStorage.setItem("taskarr", JSON.stringify(taskarr));
        }
    })
    ShowTasks();
    desiredoutput();
}

function FilterTask() {
    let taskarrlist = JSON.parse(localStorage.getItem("taskarr"));
    let taskpriority = document.getElementById("task-pri");
    let taskstatus = document.getElementById("task-status");
    let tasklist = document.getElementById("task-list");
    tasklist.innerHTML = "";
    taskarrlist.forEach(task => {
        if (task.priority == taskpriority.value && task.status == taskstatus.value) {
            let taskitem = document.createElement("li");
            taskitem.innerHTML = `
            <h4>${task.title}</h4>
            <p>${task.description}</p>
            <p>${task.status}</p>
            <p>${task.priority}</p>
            <p>${task.time}</p>
        `;
            tasklist.appendChild(taskitem);
        }
        if (taskpriority.value == "All" && task.status == taskstatus.value) {
            let taskitem = document.createElement("li");
            taskitem.innerHTML = `
            <h4>${task.title}</h4>
            <p>${task.description}</p>
            <p>${task.status}</p>
            <p>${task.priority}</p>
            <p>${task.time}</p>
        `;
            tasklist.appendChild(taskitem);
        }
        if (task.priority == taskpriority.value && taskstatus.value == "All") {
            let taskitem = document.createElement("li");
            taskitem.innerHTML = `
            <h4>${task.title}</h4>
            <p>${task.description}</p>
            <p>${task.status}</p>
            <p>${task.priority}</p>
            <p>${task.time}</p>
        `;
            tasklist.appendChild(taskitem);
        }
        if (taskpriority.value == "All" && taskstatus.value == "All") {
            let taskitem = document.createElement("li");
            taskitem.innerHTML = `
            <h4>${task.title}</h4>
            <p>${task.description}</p>
            <p>${task.status}</p>
            <p>${task.priority}</p>
            <p>${task.time}</p>
        `;
            tasklist.appendChild(taskitem);
        }
    });
}

function SortTask() {
    let taskarrlist = JSON.parse(localStorage.getItem("taskarr"));
    let taskSort = document.getElementById("task-sort");
    let order = document.getElementById("order");
    let tasklist = document.getElementById("task-list");
    if (order.value == "asc") {
        for (let i = 0; i < taskarrlist.length; i++) {
            for (let j = 0; j < taskarrlist.length - i - 1; j++) {
                if (taskSort.value == "title") {
                    if (taskarrlist[j].title > taskarrlist[j + 1].title) {
                        let temp = taskarrlist[j];
                        taskarrlist[j] = taskarrlist[j + 1];
                        taskarrlist[j + 1] = temp;
                    }
                }
                if (taskSort.value == "description") {
                    if (taskarrlist[j].description > taskarrlist[j + 1].description) {
                        let temp = taskarrlist[j];
                        taskarrlist[j] = taskarrlist[j + 1];
                        taskarrlist[j + 1] = temp;
                    }
                }
                if (taskSort.value == "status") {
                    if (taskarrlist[j].status > taskarrlist[j + 1].status) {
                        let temp = taskarrlist[j];
                        taskarrlist[j] = taskarrlist[j + 1];
                        taskarrlist[j + 1] = temp;
                    }
                }
                if (taskSort.value == "priority") {
                    if (taskarrlist[j].priority > taskarrlist[j + 1].priority) {
                        let temp = taskarrlist[j];
                        taskarrlist[j] = taskarrlist[j + 1];
                        taskarrlist[j + 1] = temp;
                    }
                }
                if (taskSort.value == "time") {
                    if (taskarrlist[j].time > taskarrlist[j + 1].time) {
                        let temp = taskarrlist[j];
                        taskarrlist[j] = taskarrlist[j + 1];
                        taskarrlist[j + 1] = temp;
                    }
                }
            }
        }
        if (order.value == "desc") {
            for (let i = 0; i < taskarrlist.length; i++) {
                for (let j = 0; j < taskarrlist.length - i - 1; j++) {
                    if (taskSort.value == "title") {
                        if (taskarrlist[j].title < taskarrlist[j + 1].title) {
                            let temp = taskarrlist[j];
                            taskarrlist[j] = taskarrlist[j + 1];
                            taskarrlist[j + 1] = temp;
                        }
                    }
                    if (taskSort.value == "description") {
                        if (taskarrlist[j].description < taskarrlist[j + 1].description) {
                            let temp = taskarrlist[j];
                            taskarrlist[j] = taskarrlist[j + 1];
                            taskarrlist[j + 1] = temp;
                        }
                    }
                    if (taskSort.value == "status") {
                        if (taskarrlist[j].status < taskarrlist[j + 1].status) {
                            let temp = taskarrlist[j];
                            taskarrlist[j] = taskarrlist[j + 1];
                            taskarrlist[j + 1] = temp;
                        }
                    }
                    if (taskSort.value == "priority") {
                        if (taskarrlist[j].priority < taskarrlist[j + 1].priority) {
                            let temp = taskarrlist[j];
                            taskarrlist[j] = taskarrlist[j + 1];
                            taskarrlist[j + 1] = temp;
                        }
                    }
                    if (taskSort.value == "time") {
                        if (taskarrlist[j].time < taskarrlist[j + 1].time) {
                            let temp = taskarrlist[j];
                            taskarrlist[j] = taskarrlist[j + 1];
                            taskarrlist[j + 1] = temp;
                        }
                    }
                }
            }
        }
        localStorage.setItem("taskarr", JSON.stringify(taskarrlist));
        ShowTasks();
        desiredoutput();
    }
}

function SearchTask() {
    let taskarrlist = JSON.parse(localStorage.getItem("taskarr"));
    let searchTask = document.getElementById("search-task");
    let tasklist = document.getElementById("task-list");
    document.getElementById("task-title").value = `${task.title}`
    document.getElementById("task-description").value = `${task.description}`
    for (let i = 0; i < status.length; i++) {
        if (status[i].checked) {
            document.getElementsByName("task-status")[i].checked = true;
            break;
        }
    }
    for (let i = 0; i < priority.length; i++) {
        if (priority[i].checked) {
            document.getElementsByName("task-pri")[i].checked = true;
            break;
        }
    }
    tasklist.innerHTML = "";
    taskarrlist.forEach(task => {
        if (task.title == searchTask.value) {
            let taskitem = document.createElement("li");
            taskitem.innerHTML = `
            <h4>${task.title}</h4>
            <p>${task.description}</p>
            <p>${task.status}</p>
            <p>${task.priority}</p>
            <p>${task.time}</p>
            `;
            tasklist.appendChild(taskitem);
        }
    });
}

function desiredoutput() {
    let taskarrlist = JSON.parse(localStorage.getItem("taskarr"));
    let totaltask = document.getElementById("total-task");
    let completedtask = document.getElementById("completed-task");
    let pendingtask = document.getElementById("pending-task");
    let total = taskarrlist.length;
    let completed = taskarrlist.filter(task => task.status == "completed").length;
    let pending = taskarrlist.filter(task => task.status == "pending").length;
    totaltask.innerHTML = total;
    completedtask.innerHTML = completed;
    pendingtask.innerHTML = pending;
}

desiredoutput();