function loadHomePage(){
    const template = document.getElementById(`home-template`);
    const content = template.content.cloneNode(true);
    document.getElementById("app").innerHTML = "";
    document.getElementById("app").appendChild(content);

    document.getElementById("sidebar-container").innerHTML = document.getElementById("sidebar-template").innerHTML;
    document.getElementById("header-container").innerHTML = document.getElementById("header-template").innerHTML;
    document.getElementById("modal-container").innerHTML = document.getElementById("modal-template").innerHTML;

    currntUser= getCurrentUser();
    if(!currntUser)
        username="user";
    else{
        username=currntUser.username
    }
    updatePageTitle(`Welcome ${username}!`, "Here is an overview of your schedule for today.");
    document.getElementById("custom-modal").style.display = "none";

    //setWeeklySampleData();
   //setSampleTasks();
    loadTodayCourses();
    loadTodayTasks();
}

function loadTodayCourses() {

    //SERVER-CHANGE
    const allCourses = JSON.parse(localStorage.getItem("weeklySchedule")) || [];

    // Get the current day and filter today's courses
    const today = getCurrentDay();


    const todayCourses = allCourses.filter(course => course.day === today);
    // Clear the previous schedule display
    const timetableGrid = document.getElementById("timetable-grid");
    timetableGrid.innerHTML = "";

    if (todayCourses.length === 0) {
        const noCoursesMessage = document.createElement("p");
        noCoursesMessage.textContent = "No courses scheduled for today.";
        noCoursesMessage.style.fontSize = "25px";
        noCoursesMessage.style.gridColumn = "span 2";
        noCoursesMessage.style.fontWeight = "bold";
        noCoursesMessage.style.textAlign = "center";
        timetableGrid.appendChild(noCoursesMessage);
    } else {
       
 

    // Generate time slots and build the empty timetable
   
    let timeSlots = [];
    for (let hour = 8; hour <= 18; hour++) {
        let timeLabel = hour.toString().padStart(2, "0") + ":00";
        timeSlots.push(timeLabel);
    }
    
    timeSlots.forEach(time => {
        let timeDiv = document.createElement("div");
        timeDiv.classList.add("time-slot");
        timeDiv.textContent = time;

        let courseContainer = document.createElement("div");
        courseContainer.classList.add("course-container");
        courseContainer.dataset.time = time;

        timetableGrid.appendChild(timeDiv);
        timetableGrid.appendChild(courseContainer);
    });

    // Display today's courses
    displayTodayCourses(todayCourses);
  }
}

/**
 * Displays courses in the timetable
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
 * Returns the current day of the week in English
 */
function getCurrentDay() {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[new Date().getDay()];
}

function findTodayTasks() {
    //SERVER-CHANGE
    const tasks = JSON.parse(localStorage.getItem("Tasks")) || [];


    const today = new Date().toISOString().split("T")[0]; 
    const todayTasks = tasks.filter(task => task.date === today);
    return todayTasks;
}

function loadTodayTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    todayTasks=findTodayTasks();
    console.log(todayTasks);
    

    if (todayTasks.length === 0) {
        const noTasksMessage = document.createElement("p");
        noTasksMessage.textContent = "No tasks scheduled for today.";
        noTasksMessage.style.fontSize = "18px";
        noTasksMessage.style.fontWeight = "bold";
        noTasksMessage.style.textAlign = "center";
        noTasksMessage.style.gridColumn = "span 2"; 
        taskList.appendChild(noTasksMessage);
        return;
    }

    todayTasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        const taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info");

        const taskTitle = document.createElement("h4");
        taskTitle.textContent = task.name;

        const taskDescription = document.createElement("p");
        taskDescription.textContent = task.description;
        taskDescription.classList.add("task-description");

        const taskDate = document.createElement("p");
        taskDate.textContent = `Status: ${task.status}`;
        taskDate.classList.add("task-date");

        taskInfo.appendChild(taskTitle);
        taskInfo.appendChild(taskDescription);
        taskInfo.appendChild(taskDate);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("task-buttons");

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "Complete";
        completeBtn.classList.add("task-complete");
        completeBtn.addEventListener("click", () => toggleTaskCompletion(index));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("task-delete");
        deleteBtn.addEventListener("click", () => deleteTask(index));

        if (task.status === "Completed") {
            console.log("im in cumpleted",task);
            
            taskItem.classList.add("completed");
            completeBtn.disabled = true;
            completeBtn.style.opacity=0.5; 
        }

        buttonContainer.appendChild(completeBtn);
        buttonContainer.appendChild(deleteBtn);

        taskItem.appendChild(taskInfo);
        taskItem.appendChild(buttonContainer);

        taskList.appendChild(taskItem);
    });
}


function toggleTaskCompletion(index) {
    let tasks = findTodayTasks();

    showCustomModal(
        'Task Completed',
        `Are you sure you want to mark "${tasks[index].name}" as completed?`, 
        function () {
            
            tasks[index].status = "Completed";
            localStorage.setItem("Tasks", JSON.stringify(tasks));
            loadTodayTasks();
        }
    );
}

function deleteTask(index) {
    let tasks = findTodayTasks();
    showCustomModal(
        'Delete',
        `Are you sure you want to delete "${tasks[index].name}" permanently?`, 
        function () {
            tasks.splice(index, 1);
            localStorage.setItem("Tasks", JSON.stringify(tasks));
            loadTodayTasks();
        }
    );
}

function setWeeklySampleData() {
    const sampleSchedule = [
        { name: "Mathematics", day: "Monday", start: "08:00", end: "10:00" },
        { name: "Physics", day: "Monday", start: "12:00", end: "14:00" },
        { name: "Computer Science", day: "Tuesday", start: "09:00", end: "11:00" },
        { name: "Software Engineering", day: "Tuesday", start: "15:00", end: "16:30" },
        { name: "Statistics", day: "Wednesday", start: "10:00", end: "12:00" },
        { name: "Machine Learning", day: "Wednesday", start: "13:00", end: "14:30" },
        { name: "AI Ethics", day: "Thursday", start: "08:30", end: "10:30" },
        { name: "Cyber Security", day: "Thursday", start: "14:00", end: "15:30" },
        { name: "Data Structures", day: "Friday", start: "10:00", end: "12:00" }
    ];

    localStorage.setItem("weeklySchedule", JSON.stringify(sampleSchedule));
    console.log("Sample weekly schedule data has been saved to localStorage.");
}
function setSampleTasks() {
    const sampleTasks = [
        { 
            name: "Submit Assignment", 
            description: "Finish and submit the math assignment.", 
            date: "2025-03-04", 
            status: "New"
        },
        { 
            name: "Team Meeting", 
            description: "Discuss project progress and next steps.", 
            date: "2025-03-04", 
            status: "In Progress"
        },
        { 
            name: "Grocery Shopping", 
            description: "Buy milk, eggs, and bread for the week.", 
            date: "2025-03-04",
            status: "New"
        },
        { 
            name: "Prepare Presentation", 
            description: "Work on slides for the upcoming tech talk.", 
            date: "2025-03-05",
            status: "In Progress"
        },
        { 
            name: "Call Mom", 
            description: "Check in with mom and see how she's doing.", 
            date: "2025-03-04",
            status: "Completed"
        },
        { 
            name: "Doctor's Appointment", 
            description: "Routine check-up at the clinic.", 
            date: "2025-03-07",
            status: "New"
        },
        { 
            name: "Workout Session", 
            description: "Go to the gym for strength training.", 
            date: "2025-03-08",
            status: "Completed"
        },
        { 
            name: "Read a Book", 
            description: "Finish reading the last two chapters of the novel.", 
            date: "2025-03-09",
            status: "New"
        },
        { 
            name: "Fix Bug in Code", 
            description: "Debug and resolve the issue in the login system.", 
            date: "2025-03-10",
            status: "In Progress"
        },
        { 
            name: "Dinner with Friends", 
            description: "Meet up with old friends for dinner.", 
            date: "2025-03-11",
            status: "New"
        }
    ];

    localStorage.setItem("Tasks", JSON.stringify(sampleTasks));
    console.log("Sample tasks have been saved to localStorage.");
}

