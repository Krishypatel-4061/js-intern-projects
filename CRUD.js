let tasks = JSON.parse(localStorage.getItem("crudTasks")) || [];
let currentFilter = "all"; // all, active, completed

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("task-count");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterBtns = document.querySelectorAll(".filter-btn");

const editModal = document.getElementById("edit-modal");
const editInput = document.getElementById("edit-input");
const cancelEditBtn = document.getElementById("cancel-edit");
const saveEditBtn = document.getElementById("save-edit");
let editTaskId = null;

function saveTasks() {
    localStorage.setItem("crudTasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";
    
    let filteredTasks = tasks;
    if (currentFilter === "active") {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(t => t.completed);
    }

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<div class="empty-state">No tasks found.</div>`;
    } else {
        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.className = `task-item ${task.completed ? "completed" : ""}`;
            
            li.innerHTML = `
                <div class="checkbox ${task.completed ? "checked" : ""}" data-id="${task.id}">
                    <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="action-btn edit-btn" data-id="${task.id}" title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="action-btn delete delete-btn" data-id="${task.id}" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;
            
            taskList.appendChild(li);
        });
    }

    // Attach events
    document.querySelectorAll(".checkbox").forEach(el => {
        el.addEventListener("click", () => toggleTask(el.dataset.id));
    });
    document.querySelectorAll(".edit-btn").forEach(el => {
        el.addEventListener("click", () => openEditModal(el.dataset.id));
    });
    document.querySelectorAll(".delete-btn").forEach(el => {
        el.addEventListener("click", () => deleteTask(el.dataset.id));
    });

    updateFooter();
}

function updateFooter() {
    const activeTasks = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    
    const completedTasks = tasks.filter(t => t.completed).length;
    if (completedTasks > 0) {
        clearCompletedBtn.classList.remove("hidden");
    } else {
        clearCompletedBtn.classList.add("hidden");
    }
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
        id: Date.now().toString(),
        text: text,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
}

// Edit Flow
function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        editTaskId = id;
        editInput.value = task.text;
        editModal.classList.remove("hidden");
        editInput.focus();
    }
}

function closeEditModal() {
    editModal.classList.add("hidden");
    editTaskId = null;
}

function saveEdit() {
    const newText = editInput.value.trim();
    if (newText && editTaskId) {
        const task = tasks.find(t => t.id === editTaskId);
        if (task) {
            task.text = newText;
            saveTasks();
            renderTasks();
        }
    }
    closeEditModal();
}

// Event Listeners
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

cancelEditBtn.addEventListener("click", closeEditModal);
saveEditBtn.addEventListener("click", saveEdit);
editInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") saveEdit();
});

// Initial Render
renderTasks();