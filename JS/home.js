/**
 * Loads the homepage with user details, schedule, and tasks
 */
function loadHomePage() {
    initializePage("home");
    // Retrieve current user
    let currentUser;  
    const fxhr = new FXMLHttpRequest();
    fxhr.open("GET", "currentUser");
    fxhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                currentUser = JSON.parse(this.response);
                console.log("Current User: ", currentUser);
                const username = currentUser ? currentUser.username : "User";

                updatePageTitle(`Welcome ${username}!`, "Here is an overview of your schedule for today.");
                document.getElementById("custom-modal").style.display = "none";

                // Load today's courses and tasks
                loadTodayCourses();
                loadTodayTasks();
            }
        }
    };
    fxhr.send(null, fxhr.onreadystatechange);

    /*const username = currentUser ? currentUser.username : "User";

    updatePageTitle(`Welcome ${username}!`, "Here is an overview of your schedule for today.");
    document.getElementById("custom-modal").style.display = "none";

    // Load today's courses and tasks
    loadTodayCourses();
    loadTodayTasks();*/
}

/**
 * Fetches and displays today's courses
 */
function loadTodayCourses() {
    let allCourses; // = fajax("GET", "courses") || [];
    const fxhr = new FXMLHttpRequest(); 
    fxhr.open("GET", "courses");
    fxhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                allCourses = JSON.parse(this.response);

                const today = getCurrentDay();
                const todayCourses = allCourses.filter(course => course.day === today);

                // Clear previous timetable
                const timetableGrid = document.getElementById("timetable-grid");
                timetableGrid.innerHTML = "";

                if (todayCourses.length === 0) {
                    noItemsMessage(timetableGrid, "No courses scheduled for today.");
                } else {
                    generateTimeSlots(timetableGrid);
                    displayTodayCourses(todayCourses);
                }
            }
        }
    };
    fxhr.send(null, fxhr.onreadystatechange);

    /*const today = getCurrentDay();
    const todayCourses = allCourses.filter(course => course.day === today);

    // Clear previous timetable
    const timetableGrid = document.getElementById("timetable-grid");
    timetableGrid.innerHTML = "";

    if (todayCourses.length === 0) {
        noItemsMessage(timetableGrid, "No courses scheduled for today.");
    } else {
        generateTimeSlots(timetableGrid);
        displayTodayCourses(todayCourses);
    }*/
}



/**
 * Generates time slots in the timetable
 */
function generateTimeSlots(container) {
    let timeSlots = [];
    for (let hour = 8; hour <= 18; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    timeSlots.forEach(time => {
        let timeDiv = document.createElement("div");
        timeDiv.classList.add("time-slot");
        timeDiv.textContent = time;

        let courseContainer = document.createElement("div");
        courseContainer.classList.add("course-container");
        courseContainer.dataset.time = time;

        container.appendChild(timeDiv);
        container.appendChild(courseContainer);
    });
}

/**
 * Displays today's courses in the timetable
 */
function displayTodayCourses(courses) {
    courses.forEach(course => {
        let courseSlot = document.querySelector(`.course-container[data-time='${course.start}']`);
        if (courseSlot) {
            let courseBlock = document.createElement("div");
            courseBlock.classList.add("course-block");
            courseBlock.style.height = `${calculateDuration(course.start, course.end) * 50}px`;
            courseBlock.textContent = `${course.name} (${course.start} - ${course.end})`;

            courseSlot.style.position = "relative";
            courseBlock.style.position = "absolute";
            courseBlock.style.top = "0";
            courseBlock.style.width = "100%";

            courseSlot.appendChild(courseBlock);
        }
    });
}

/**
 * Calculates the duration of a course in hours
 */
function calculateDuration(start, end) {
    let [startHour, startMin] = start.split(":").map(Number);
    let [endHour, endMin] = end.split(":").map(Number);
    return (endHour + endMin / 60) - (startHour + startMin / 60);
}

/**
 * Returns the current day of the week
 */
function getCurrentDay() {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[new Date().getDay()];
}

/**
 * Finds today's tasks
 */
function findTodayTasks(callback) {
    let tasks; // = fajax("GET", "tasks") || [];
    const fxhr = new FXMLHttpRequest();
    fxhr.open("GET", "tasks");
    fxhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                tasks = JSON.parse(this.response);
                const today = new Date().toISOString().split("T")[0];
                if (callback) callback(tasks.filter(task => task.date === today));
            } else {
                if (callback) callback(false);
            }
        }
    };
    fxhr.send(null, fxhr.onreadystatechange);

    //const today = new Date().toISOString().split("T")[0];
    //return tasks.filter(task => task.date === today);
}

/**
 * Loads and displays today's tasks
 */
function loadTodayTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    let todayTasks;
    findTodayTasks((res) => {
        if (res) todayTasks = res;
    });
    console.log(todayTasks);

    if (todayTasks.length === 0) {
        noItemsMessage(taskList, "No tasks scheduled for today.");
    } else {
        todayTasks.forEach(task => taskList.appendChild(createTaskElement(task)));
    }
}

/**
 * Creates a task element
 */
function createTaskElement(task) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    const taskInfo = document.createElement("div");
    taskInfo.classList.add("task-info");

    const taskTitle = document.createElement("h4");
    taskTitle.textContent = task.name;

    const taskDescription = document.createElement("p");
    taskDescription.textContent = task.description;
    taskDescription.classList.add("task-description");

    const taskStatus = document.createElement("p");
    taskStatus.textContent = `Status: ${task.status}`;
    taskStatus.classList.add("task-status");

    taskInfo.appendChild(taskTitle);
    taskInfo.appendChild(taskDescription);
    taskInfo.appendChild(taskDate);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("task-buttons");

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Complete";
    completeBtn.classList.add("task-complete");
    completeBtn.addEventListener("click", () => toggleTaskCompletion(task));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("task-delete");
    deleteBtn.addEventListener("click", () => deleteTask(task));

    if (task.status === "Completed") {
        taskItem.classList.add("completed");
        completeBtn.disabled = true;
        completeBtn.style.opacity = 0.5;
    }

    buttonContainer.appendChild(completeBtn);
    buttonContainer.appendChild(deleteBtn);

    taskItem.appendChild(taskInfo);
    taskItem.appendChild(buttonContainer);

    return taskItem;
}

/**
 * Toggles a task's completion status
 */
function toggleTaskCompletion(task) {
    showCustomModal(
        "Task Completed",
        `Are you sure you want to mark "${task.name}" as completed?`,
        function () {
            task.status = "Completed";
            fajax("PUT", "tasks", task);
            loadTodayTasks();
        }
    );
}

/**
 * Deletes a task after confirmation
 */
function deleteTask(task) {
    showCustomModal(
        "Delete Task",
        `Are you sure you want to delete "${task.name}" permanently?`,
        function () {
            fajax("DELETE", "tasks", task);
            loadTodayTasks();
        }
    );
}
