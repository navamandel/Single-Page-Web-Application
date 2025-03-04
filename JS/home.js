function loadHomePage(){
    console.log("🚀 Page Loaded"); // Debug Log
    currntUser= getCurrentUser();
    document.getElementById("user-name").textContent = currntUser.username;
        document.getElementById("custom-modal").style.display = "none";

    //loadUserData();
    loadTodayCourses();
    loadTodayTasks();

}

function loadTodayCourses() {
    const schedule = JSON.parse(localStorage.getItem("todaySchedule")) || [];
    const timetableGrid = document.getElementById("timetable-grid");
    timetableGrid.innerHTML = ""; // ניקוי התוכן הקודם

    let timeSlots = [];
    for (let hour = 8; hour <= 18; hour++) {
        let timeLabel = hour.toString().padStart(2, "0") + ":00";
        timeSlots.push(timeLabel);
    }

    // יצירת שעות
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

    // מיפוי קורסים לפי השעות שלהם
    schedule.forEach(course => {
        let startTime = course.start;
        let endTime = course.end;
        console.log(course.name+" "+ startTime)
        console.log(course.name+" "+ endTime)



        let [startHour, startMin] = course.start.split(":").map(Number);
        let [endHour, endMin] = course.end.split(":").map(Number);

        // מחשבים את משך הקורס בצורה מדויקת כולל חצאי שעות
        let duration = (endHour + endMin / 60) - (startHour + startMin / 60); 
        let courseSlot = document.querySelector(`.course-container[data-time='${startTime}']`);
        if (courseSlot) {
            let courseBlock = document.createElement("div");
            courseBlock.classList.add("course-block");
            console.log(course.name+" "+ duration)
            courseBlock.style.height = `${duration * 50}px`; // מתאים גובה לפי שעות
            courseBlock.textContent = `${course.name} (${startTime} - ${endTime})`;

            courseSlot.style.position = "relative";
            courseBlock.style.position = "absolute";
            courseBlock.style.top = "0"; 
            courseBlock.style.width = "100%";

            courseSlot.appendChild(courseBlock);
        }
    });
}
function loadTodayTasks() {
    const tasks = JSON.parse(localStorage.getItem("todayTasks")) || [];
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // ניקוי נתונים ישנים

    tasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        // יצירת בלוק מידע המשימה
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
        completeBtn.addEventListener("click", () => toggleTaskCompletion(index));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("task-delete");
        deleteBtn.addEventListener("click", () => deleteTask(index));

        if(tasks[index].completed==true){
            taskItem.classList.add("completed") 
            deleteBtn.disabled=true;
            completeBtn.disabled=true;
        }
        buttonContainer.appendChild(completeBtn);
        buttonContainer.appendChild(deleteBtn);

        // הוספת כל החלקים ל-task-item
        taskItem.appendChild(taskInfo);
        taskItem.appendChild(buttonContainer);

        taskList.appendChild(taskItem);

    });
}

function showCustomModal(message, onConfirm) {
    const modal = document.getElementById("custom-modal");
    const modalMessage = document.getElementById("modal-message");
    const confirmBtn = document.getElementById("confirm-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    document.getElementById("custom-modal").style.display = "none";

    modalMessage.textContent = message;
    modal.style.display = "flex";  // מופיע רק בלחיצה

    confirmBtn.onclick = function () {
        modal.style.display = "none";
        onConfirm();
    };

    cancelBtn.onclick = function () {
        modal.style.display = "none";
    };
}


function toggleTaskCompletion(index) {
    let tasks = JSON.parse(localStorage.getItem("todayTasks")) || [];

    showCustomModal(`Mark "${tasks[index].name}" as ${tasks[index].completed ? 'incomplete' : 'complete'}?`, function () {
        tasks[index].completed = true;
        localStorage.setItem("todayTasks", JSON.stringify(tasks));
        loadTodayTasks();
    });
}
function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("todayTasks")) || [];

    showCustomModal(`Delete "${tasks[index].name}" permanently?`, function () {
        tasks.splice(index, 1);
        localStorage.setItem("todayTasks", JSON.stringify(tasks));
        loadTodayTasks();
    });
}


window.loadHomePage = loadHomePage;


