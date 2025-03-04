function loadWeeklySchedule() {
    let courses = JSON.parse(localStorage.getItem("weeklySchedule")) || [];

    // אם courses הוא אובייקט במקום מערך, נמיר אותו למבנה החדש
    if (!Array.isArray(courses)) {
        courses = convertOldScheduleFormat(courses);
        localStorage.setItem("weeklySchedule", JSON.stringify(courses));
    }

    const weeklyGrid = document.getElementById("weekly-grid");
    weeklyGrid.innerHTML = ""; // ניקוי התוכן הקודם

    document.getElementById("course-modal").style.display = "none";
    document.getElementById("delete-modal").style.display = "none";
    document.getElementById("add-course-modal").style.display = "none";


    let daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let timeSlots = [];
    for (let hour = 8; hour <= 18; hour++) {
        let timeLabel = hour.toString().padStart(2, "0") + ":00";
        timeSlots.push(timeLabel);
    }

    // יצירת כותרות עם שמות הימים
    let emptyHeader = document.createElement("div");
    weeklyGrid.appendChild(emptyHeader);
    daysOfWeek.forEach(day => {
        let dayHeader = document.createElement("div");
        dayHeader.classList.add("time-slot");
        dayHeader.style.fontWeight = "bold";
        dayHeader.textContent = day;
        weeklyGrid.appendChild(dayHeader);
    });

    // יצירת שעות + ריבועים לכל יום
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

    // מיון קורסים לפי יום ושעה
    let sortedCourses = {};
    daysOfWeek.forEach(day => sortedCourses[day] = []);
    courses.forEach(course => sortedCourses[course.day].push(course));

    // הצגת קורסים בטבלה
    daysOfWeek.forEach(day => {
        sortedCourses[day].forEach((course, index) => {
            let courseSlot = document.querySelector(`.course-container[data-day='${day}'][data-time='${course.start}']`);
            if (courseSlot) {
                let courseBlock = document.createElement("div");
                courseBlock.classList.add("course-block");
                courseBlock.style.height = `${calculateDuration(course.start, course.end) * 50}px`;
                courseBlock.textContent = `${course.name} (${course.start} - ${course.end})`;

                // אירוע עריכה בלחיצה כפולה
                courseBlock.addEventListener("dblclick", () => openEditModal(course, index));

                // כפתור מחיקה
                let deleteBtn = document.createElement("button");
                deleteBtn.textContent = "X";
                deleteBtn.classList.add("delete-course");
                deleteBtn.addEventListener("click", () => openDeleteModal(course, index));

                courseBlock.appendChild(deleteBtn);
                courseSlot.appendChild(courseBlock);
            }
        });
    });
}
function convertOldScheduleFormat(oldSchedule) {
    let newFormat = [];
    Object.keys(oldSchedule).forEach(day => {
        oldSchedule[day].forEach(course => {
            newFormat.push({
                name: course.name,
                day: day,
                start: course.start,
                end: course.end
            });
        });
    });
    return newFormat;
}

function calculateDuration(start, end) {
    let [startHour, startMin] = start.split(":").map(Number);
    let [endHour, endMin] = end.split(":").map(Number);
    return (endHour + endMin / 60) - (startHour + startMin / 60);
}

function openEditModal(course, index) {
    document.getElementById("course-name").value = course.name;
    document.getElementById("course-day").value = course.day;
    document.getElementById("course-start").value = course.start;
    document.getElementById("course-end").value = course.end;
    let courses = JSON.parse(localStorage.getItem("weeklySchedule")) || [];

    courses.splice(index, 1);
    localStorage.setItem("courses", JSON.stringify(courses));
          document.getElementById("save-btn").onclick = function (event) {
        event.preventDefault( );

        courses.push  ({
            name: document.getElementById("course-name").value,
            day: document.getElementById("course-day").value,
            start: document.getElementById("course-start").value,
            end: document.getElementById("course-end").value
        });

        localStorage.setItem("weeklySchedule", JSON.stringify(courses));
        closeModal();
        loadWeeklySchedule();
    };

    document.getElementById("course-modal").style.display = "flex";
}

function openDeleteModal(course, index) {
    document.getElementById("delete-modal").style.display = "flex";

    document.getElementById("confirm-delete").onclick = function () {
        let courses = JSON.parse(localStorage.getItem("weeklySchedule")) || [];
        courses.splice(index, 1);
        localStorage.setItem("weeklySchedule", JSON.stringify(courses));
        closeModal();
        loadWeeklySchedule();
    };
}

function addNewCourse() {
    document.getElementById("course-name").value = "";
    document.getElementById("course-day").value = "Monday";
    document.getElementById("course-start").value = "";
    document.getElementById("course-end").value = "";

    document.getElementById("save-btn").onclick = function (event) {
        event.preventDefault();
        let courses = JSON.parse(localStorage.getItem("weeklySchedule")) || [];

        courses.push({
            name: document.getElementById("course-name").value,
            day: document.getElementById("course-day").value,
            start: document.getElementById("course-start").value,
            end: document.getElementById("course-end").value
        });

        localStorage.setItem("weeklySchedule", JSON.stringify(courses));
        closeModal();
        loadWeeklySchedule();
    };

    document.getElementById("course-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("course-modal").style.display = "none";
    document.getElementById("delete-modal").style.display = "none";
}
function openAddCourseModal() {
    document.getElementById("add-course-modal").style.display = "flex";
}
function saveNewCourse() {
    const name = document.getElementById("new-course-name").value.trim();
    const day = document.getElementById("new-course-day").value;
    const start = document.getElementById("new-course-start").value;
    const end = document.getElementById("new-course-end").value;

    if (!name || !start || !end) {
        alert("Please fill all fields!");
        return;
    }

    let courses = JSON.parse(localStorage.getItem("weeklyCourses")) || [];
    
    courses.push({ name, day, start, end });

    localStorage.setItem("weeklyCourses", JSON.stringify(courses));

    closeModal();
    loadWeeklySchedule(); // נטען מחדש את הלוז
}


// מגדיר את הפונקציות ישירות ל-window
window.loadWeeklySchedule = loadWeeklySchedule;
window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;
window.addNewCourse = addNewCourse;
window.closeModal = closeModal;
