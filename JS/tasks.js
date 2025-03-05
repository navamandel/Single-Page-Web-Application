function loadTasksPage() {

    const template = document.getElementById(`tasks-template`);
    const content = template.content.cloneNode(true);
    document.getElementById("app").innerHTML = "";
    document.getElementById("app").appendChild(content);


    const tasks = JSON.parse(localStorage.getItem("allTasks")) || [];
    const taskList = document.getElementById("full-task-list");
    taskList.innerHTML = ""; // ניקוי נתונים ישנים

    tasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        const taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info");

        const taskTitle = document.createElement("h4");
        taskTitle.textContent = task.name;

        const taskDescription = document.createElement("p");
        taskDescription.textContent = task.description;
        taskDescription.classList.add("task-description");

        taskInfo.appendChild(taskTitle);
        taskInfo.appendChild(taskDescription);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("task-buttons");

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "Complete";
        completeBtn.classList.add("task-complete");
        completeBtn.disabled = task.completed;
        completeBtn.addEventListener("click", () => toggleTaskCompletion(index));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("task-delete");
        deleteBtn.addEventListener("click", () => deleteTask(index));

        buttonContainer.appendChild(completeBtn);
        buttonContainer.appendChild(deleteBtn);

        taskItem.appendChild(taskInfo);
        taskItem.appendChild(buttonContainer);

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        taskList.appendChild(taskItem);
    });
}
function openTaskModal() {
    document.getElementById("task-modal").style.display = "flex";
}

function saveNewTask() {
    const name = document.getElementById("new-task-name").value.trim();
    const description = document.getElementById("new-task-desc").value.trim();

    if (!name || !description) {
        alert("Please fill all fields!");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("Tasks")) || [];
    
    tasks.push({ name, description, completed: false });

    localStorage.setItem("Tasks", JSON.stringify(tasks));

    closeModal();
    loadTasksPage(); // נטען מחדש את העמוד
}
/* function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
        let tasks = JSON.parse(localStorage.getItem("Tasks")) || [];
        tasks.splice(index, 1);
        localStorage.setItem("Tasks", JSON.stringify(tasks));
        loadTasksPage();
    }
}
function toggleTaskCompletion(index) {
    let tasks = JSON.parse(localStorage.getItem("Tasks")) || [];

    if (confirm(`Mark "${tasks[index].name}" as complete?`)) {
        tasks[index].completed = true;
        localStorage.setItem("Tasks", JSON.stringify(tasks));
        loadTasksPage();
    }
}
 */