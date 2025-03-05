function loadWeeklySchedule() {
    const template = document.getElementById(`schedule-template`);
    const content = template.content.cloneNode(true);
    document.getElementById("app").innerHTML = "";
    document.getElementById("app").appendChild(content);

    document.getElementById("sidebar-container").innerHTML = document.getElementById("sidebar-template").innerHTML;
    document.getElementById("header-container").innerHTML = document.getElementById("header-template").innerHTML;
    document.getElementById("modal-container").innerHTML = document.getElementById("modal-template").innerHTML;
    const modal = document.getElementById("custom-modal");
    modal.style.display="none"
    
    //SERVER-CHANGE
    let courses = JSON.parse(localStorage.getItem("weeklySchedule")) || [];
    let daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
   
    //setWeeklySampleData();
    displaySchedule(daysOfWeek);
    displayCourses(courses,daysOfWeek);

}

function displayCourses(courses,daysOfWeek){
    let sortedCourses = {};
    daysOfWeek.forEach(day => sortedCourses[day] = []);
    courses.forEach(course => sortedCourses[course.day].push(course));

    daysOfWeek.forEach(day => {
        sortedCourses[day].forEach((course, index) => {
            let courseSlot = document.querySelector(`.course-container[data-day='${day}'][data-time='${course.start}']`);
            if (courseSlot) {
                let courseBlock = document.createElement("div");
                courseBlock.classList.add("course-block-week");
                courseBlock.style.height = `${calculateDuration(course.start, course.end) * 50}px`;
                let courseContent = document.createElement("div");
            courseContent.classList.add("course-content");
            courseContent.innerHTML = `
                <strong>${course.name}</strong> 
                <br> 
                (${course.start} - ${course.end})
            `;

            let buttonContainer = document.createElement("div");
            buttonContainer.classList.add("course-buttons");

            let editBtn = document.createElement("button");
            editBtn.innerHTML = "✏️";
            editBtn.classList.add("edit-course");
            editBtn.onclick = () => openCourseModal(course, index);

            let deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "❌";
            deleteBtn.classList.add("delete-course");
            deleteBtn.onclick = () => openDeleteModal(course, index);

            buttonContainer.appendChild(editBtn);
            buttonContainer.appendChild(deleteBtn);

            courseBlock.appendChild(courseContent);
            courseBlock.appendChild(buttonContainer);

                courseSlot.appendChild(courseBlock);
            }
        });
    });
}

function displaySchedule(daysOfWeek){
    const weeklyGrid = document.getElementById("weekly-grid");
    weeklyGrid.innerHTML = ""; 
    let timeSlots = [];
    for (let hour = 8; hour <= 18; hour++) {
        let timeLabel = hour.toString().padStart(2, "0") + ":00";
        timeSlots.push(timeLabel);
    }

    let emptyHeader = document.createElement("div");
    weeklyGrid.appendChild(emptyHeader);
    daysOfWeek.forEach(day => {
        let dayHeader = document.createElement("div");
        dayHeader.classList.add("time-slot");
        dayHeader.style.fontWeight = "bold";
        dayHeader.textContent = day;
        weeklyGrid.appendChild(dayHeader);
    });

    timeSlots.forEach(time => {
        let timeDiv = document.createElement("div");
        timeDiv.classList.add("time-slot");
        timeDiv.textContent = time;
        weeklyGrid.appendChild(timeDiv);

        daysOfWeek.forEach(day => {
            let courseContainer = document.createElement("div");
            courseContainer.classList.add("course-container");
            courseContainer.dataset.day = day;
            courseContainer.dataset.time = time;
            weeklyGrid.appendChild(courseContainer);
        });
    });

}


function calculateDuration(start, end) {
    let [startHour, startMin] = start.split(":").map(Number);
    let [endHour, endMin] = end.split(":").map(Number);
    return (endHour + endMin / 60) - (startHour + startMin / 60);
}


function openDeleteModal(course) {
    
    let courses = JSON.parse(localStorage.getItem("weeklySchedule")) || [];
    const index = courses.findIndex(c => 
        c.name === course.name && 
        c.day === course.day && 
        c.start === course.start && 
        c.end === course.end
    );
    console.log(index);

    showCustomModal(
        'Delete',
        `Are you sure you want to delete "${course.name}" permanently?`, 
        function () {
            courses.splice(index, 1);
            localStorage.setItem("weeklySchedule", JSON.stringify(courses));
            loadWeeklySchedule();
        }
    );
}

function openCourseModal(course = null, index = null) {
    const modal = document.getElementById("custom-modal");
    const modalMessage = document.getElementById("modal-message");
    const modalTitle = document.getElementById("modal-title");
    const confirmBtn = document.getElementById("confirm-btn");
    const cancelBtn = document.getElementById("cancel-btn");

    console.log("im in openCourseModal");
    
    const isEditMode = course !== null;

    modalTitle.textContent = isEditMode ? "Edit Course" : "Add New Course";

    modalMessage.innerHTML = `
        <label for="course-name">Course Name:</label>
        <input type="text" id="course-name" value="${isEditMode ? course.name : ""}">

        <label for="course-day">Day:</label>
        <select id="course-day">
            ${generateDayOptions(isEditMode ? course.day : "Monday")}
        </select>

        <label for="course-start">Start Time:</label>
        <input type="time" id="course-start" value="${isEditMode ? course.start : ""}">

        <label for="course-end">End Time:</label>
        <input type="time" id="course-end" value="${isEditMode ? course.end : ""}">
    `;

    confirmBtn.onclick = function () {
        saveCourse(isEditMode, index);
    };
    cancelBtn.onclick = function () {
        modal.style.display = "none";
    };

    modal.style.display = "flex";  
}
function generateDayOptions(selectedDay = "Monday") {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days.map(day => `<option value="${day}" ${day === selectedDay ? "selected" : ""}>${day}</option>`).join("");
}


function saveCourse(isEditMode, index) {
    let courses = JSON.parse(localStorage.getItem("weeklySchedule")) || [];

    const updatedCourse = {
        name: document.getElementById("course-name").value.trim(),
        day: document.getElementById("course-day").value,
        start: document.getElementById("course-start").value,
        end: document.getElementById("course-end").value
    };
    console.log(updatedCourse);
    console.log(isEditMode);

    

    if (!updatedCourse.name || !updatedCourse.start || !updatedCourse.end) {
        alert("Please fill all fields!");
        return;
    }

    if (isEditMode) {
        courses.splice(index, 1);        
    }

    courses.push(updatedCourse); 


    localStorage.setItem("weeklySchedule", JSON.stringify(courses));

    document.getElementById("custom-modal").style.display = "none";
    loadWeeklySchedule();
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