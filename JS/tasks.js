function loadTasksPage() {
    const template = document.getElementById(`tasks-template`);
    const content = template.content.cloneNode(true);
    document.getElementById("app").innerHTML = "";
    document.getElementById("app").appendChild(content);

    document.getElementById("sidebar-container").innerHTML = document.getElementById("sidebar-template").innerHTML;
    document.getElementById("header-container").innerHTML = document.getElementById("header-template").innerHTML;
    document.getElementById("modal-container").innerHTML = document.getElementById("modal-template").innerHTML;

    updatePageTitle(`My Tasks`, "Here is an overview of your tasks.");
    const modal = document.getElementById("custom-modal");
    modal.style.display = "none";

    const tasks = JSON.parse(localStorage.getItem("Tasks")) || [];
    displayTasks(tasks);
}

function displayTasks(tasks) {
    const newTaskList = document.getElementById("new-task-list");
    const inProgressTaskList = document.getElementById("in-progress-task-list");
    const completedTaskList = document.getElementById("completed-task-list");

    // Clear previous task lists
    newTaskList.innerHTML = "";
    inProgressTaskList.innerHTML = "";
    completedTaskList.innerHTML = "";

    // Categorize tasks based on status
    tasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item-list");

        const taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info-list");

        const taskTitle = document.createElement("h4");
        taskTitle.textContent = task.name;

        const taskDescription = document.createElement("p");
        taskDescription.textContent = task.description;
        taskDescription.classList.add("task-description-list");

        taskInfo.appendChild(taskTitle);
        taskInfo.appendChild(taskDescription);

        // Buttons container
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("task-buttons-list");

        const completeBtn = document.createElement("button");
        completeBtn.innerHTML = "✔️";
        completeBtn.classList.add("task-complete-list");
        completeBtn.disabled = task.status === "Completed";
        completeBtn.addEventListener("click", () => toggleTaskCompletion(index));

        const editBtn = document.createElement("button");
        editBtn.innerHTML = "✏️";
        editBtn.classList.add("task-edit-list");
        editBtn.addEventListener("click", () => openTaskModal(task, index));

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.classList.add("task-delete-list");
        deleteBtn.addEventListener("click", () => deleteTask(index));

        buttonContainer.appendChild(completeBtn);
        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(deleteBtn);

        taskItem.appendChild(taskInfo);
        taskItem.appendChild(buttonContainer);

        // Assign task to the correct category
        if (task.status === "New") {
            newTaskList.appendChild(taskItem);
        } else if (task.status === "In Progress") {
            inProgressTaskList.appendChild(taskItem);
        } else {
            taskItem.classList.add("completed");
            completedTaskList.appendChild(taskItem);
        }
    });
}

function openTaskModal(task = null, index = null) {
    const modal = document.getElementById("custom-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalMessage = document.getElementById("modal-message");
    const confirmBtn = document.getElementById("confirm-btn");

    // Determine if we are editing an existing task or adding a new one
    const isEditMode = task !== null;
    modalTitle.textContent = isEditMode ? "Edit Task" : "Add New Task";

    // Build the modal content (custom layout)
    modalMessage.innerHTML = `
        <div class="task-modal-content">
            <label for="task-name">Task Name:</label>
            <input type="text" id="task-name" class="task-input" value="${isEditMode ? task.name : ""}">

            <label for="task-desc">Description:</label>
            <textarea id="task-desc" class="task-textarea">${isEditMode ? task.description : ""}</textarea>

            <label for="task-status">Status:</label>
            <select id="task-status" class="task-select">
                ${generateStatusOptions(isEditMode ? task.status : "New")}
            </select>
        </div>
    `;

    // Set the action for the confirm button
    confirmBtn.onclick = function () {
        saveTask(isEditMode, index);
    };

    // Show the modal
    modal.style.display = "flex";
}


function generateStatusOptions(selectedStatus = "New") {
    const statuses = ["New", "In Progress", "Completed"];
    return statuses.map(status => `<option value="${status}" ${status === selectedStatus ? "selected" : ""}>${status}</option>`).join("");
}


function saveTask(isEditMode, index) {
    let tasks = JSON.parse(localStorage.getItem("Tasks")) || [];

    const updatedTask = {
        name: document.getElementById("task-name").value.trim(),
        description: document.getElementById("task-desc").value.trim(),
        status: document.getElementById("task-status").value
    };

    if (!updatedTask.name || !updatedTask.description) {
        alert("Please fill all fields!");
        return;
    }

    if (isEditMode) {
        tasks[index] = updatedTask;
    } else {
        tasks.push(updatedTask);
    }

    localStorage.setItem("Tasks", JSON.stringify(tasks));

    // Hide the modal
    document.getElementById("custom-modal").style.display = "none";
    loadTasksPage();
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("Tasks")) || [];

    showCustomModal(
        "Delete Task",
        `Are you sure you want to delete "${tasks[index].name}"?`,
        function () {
            tasks.splice(index, 1);
            localStorage.setItem("Tasks", JSON.stringify(tasks));
            loadTasksPage();
        }
    );
}
function toggleTaskCompletion(index) {
    let tasks = JSON.parse(localStorage.getItem("Tasks")) || [];

    showCustomModal(
        "Complete Task",
        `Mark "${tasks[index].name}" as complete?`,
        function () {
            tasks[index].status = "Completed";
            localStorage.setItem("Tasks", JSON.stringify(tasks));
            loadTasksPage();
        }
    );
}



