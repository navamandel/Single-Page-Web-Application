function loadTasksPage() {
    // Load the template and update the page structure
    initializePage("tasks")
    updatePageTitle(`My Tasks`, "Here is an overview of your tasks.");

    document.getElementById("custom-modal").style.display = "none";

    // Fetch and display tasks from storage
    let tasks;// = fajax("GET", "tasks") || [];
    const fxhr = new FXMLHttpRequest();
    fxhr.open("GET", "tasks");
    showLoader();

    fxhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            hideLoader();

            if (this.status === 200) {
                tasks = JSON.parse(this.response);
                // Check if there are no tasks
                if (tasks.length === 0) {
                    noItemsMessage(document.getElementById("task-list-container"), "No tasks available.");
                } else {
                    displayTasks(tasks);
                }
            } else {
                //alert("Error");
            }
        }
    };
    fxhr.send();

    
}

function displayTasks(tasks) {
    // Get task category containers
    const newTaskList = document.getElementById("new-task-list");
    const inProgressTaskList = document.getElementById("in-progress-task-list");
    const completedTaskList = document.getElementById("completed-task-list");

    // Clear previous task lists
    newTaskList.innerHTML = "";
    inProgressTaskList.innerHTML = "";
    completedTaskList.innerHTML = "";

    // Loop through tasks and display them under the correct category
    tasks.forEach((task) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item-list");

        const taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info-list");

        // Task Title
        const taskTitle = document.createElement("h4");
        taskTitle.textContent = task.name;

        // Task Description
        const taskDescription = document.createElement("p");
        taskDescription.textContent = task.description;
        taskDescription.classList.add("task-description-list");

        // Task Date
        const taskDate = document.createElement("p");
        taskDate.textContent = `Due: ${task.date}`;
        taskDate.classList.add("task-date-list");

        taskInfo.appendChild(taskTitle);
        taskInfo.appendChild(taskDescription);
        taskInfo.appendChild(taskDate);

        // Buttons container
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("task-buttons-list");

        // Complete Button
        const completeBtn = document.createElement("button");
        completeBtn.innerHTML = "✔️";
        completeBtn.classList.add("task-complete-list");
        completeBtn.disabled = task.status === "Completed";
        completeBtn.addEventListener("click", () => toggleTaskCompletion(task));

        // Edit Button
        const editBtn = document.createElement("button");
        editBtn.innerHTML = "✏️";
        editBtn.classList.add("task-edit-list");
        editBtn.addEventListener("click", () => openTaskModal(task));

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.classList.add("task-delete-list");
        deleteBtn.addEventListener("click", () => deleteTask(task));

        // Append buttons
        buttonContainer.appendChild(completeBtn);
        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(deleteBtn);

        // Append all elements to task item
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

function openTaskModal(task = null) {
    const modal = document.getElementById("custom-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalMessage = document.getElementById("modal-message");
    const confirmBtn = document.getElementById("confirm-btn");

    // Determine if we are editing an existing task or adding a new one
    const isEditMode = task !== null;
    modalTitle.textContent = isEditMode ? "Edit Task" : "Add New Task";

    // Build the modal content
    modalMessage.innerHTML = `
        <div class="task-modal-content">
            <label for="task-name">Task Name:</label>
            <input type="text" id="task-name" class="task-input" value="${isEditMode ? task.name : ""}">

            <label for="task-desc">Description:</label>
            <textarea id="task-desc" class="task-textarea">${isEditMode ? task.description : ""}</textarea>

            <label for="task-date">Due Date:</label>
            <input type="date" id="task-date" value="${isEditMode ? task.date : ""}">

            <label for="task-status">Status:</label>
            <select id="task-status" class="task-select">
                ${generateStatusOptions(isEditMode ? task.status : "New")}
            </select>
        </div>
    `;

    // Set the action for the confirm button
    confirmBtn.onclick = function () {
        saveTask(isEditMode, task ? task.id : null);
    };

    // Show the modal
    modal.style.display = "flex";
}

function generateStatusOptions(selectedStatus = "New") {
    const statuses = ["New", "In Progress", "Completed"];
    return statuses.map(status => `<option value="${status}" ${status === selectedStatus ? "selected" : ""}>${status}</option>`).join("");
}

function saveTask(isEditMode, taskId) {

    const updatedTask = {
        id: isEditMode ? taskId : "", // Generate new ID for new tasks
        name: document.getElementById("task-name").value.trim(),
        description: document.getElementById("task-desc").value.trim(),
        date: document.getElementById("task-date").value,
        status: document.getElementById("task-status").value
    };

    if (!updatedTask.name || !updatedTask.description || !updatedTask.date) {
        alert("Please fill all fields!");
        return;
    }
    let method;

    if (isEditMode) {
        method = "PUT"; // Update existing task
    } else {
        method = "POST";
    }
    const fxhr = new FXMLHttpRequest();
    fxhr.open(method, "tasks");
    showLoader();

    fxhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            hideLoader();

            if (this.status === 200) {
                document.getElementById("custom-modal").style.display = "none";
                loadTasksPage();
            }
        }
    };
    fxhr.send(updatedTask);
    

    // Hide the modal and refresh the page
    //document.getElementById("custom-modal").style.display = "none";
    //loadTasksPage();
}

function deleteTask(task) {
    showCustomModal(
        "Delete Task",
        `Are you sure you want to delete "${task.name}"?`,
        function () {
            //fajax("DELETE", "tasks", task); // Send full task object for deletion
            const fxhr = new FXMLHttpRequest();
            fxhr.open("DELETE", "tasks");
            showLoader();

            fxhr.onreadystatechange = function() {
                if (this.readyState === 4) {
                    hideLoader();
                    if (this.status === 200) {
                        loadTasksPage();
                    }
                }
            };
            fxhr.send(task);
            
        }
    );
}

function toggleTaskCompletion(task) {
    showCustomModal(
        "Complete Task",
        `Mark "${task.name}" as complete?`,
        function () {
            task.status = "Completed";
            fajax("PUT", "tasks", task); // Update task status
            loadTasksPage();
        }
    );
}
