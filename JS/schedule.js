/**
 * Loads the weekly schedule page and initializes content.
 */
function loadWeeklySchedule() {
    initializePage("schedule") 

    updatePageTitle(`Weekly Schedule`, "Here is an overview of your weekly schedule.");


    // Fetch courses from storage
    let courses;   // = fajax("GET", "courses") || [];
    let daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const fxhr = new FXMLHttpRequest();
    fxhr.open("GET", "courses");
    fxhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                courses = JSON.parse(this.response);
                // Check if there are no courses
                if (courses.length === 0) {
                    noItemsMessage(document.getElementById("weekly-grid"), "No courses scheduled for this week.");
                } 

                displaySchedule(daysOfWeek);
                displayCourses(courses, daysOfWeek);
            }
        }
    }
    fxhr.send(null, fxhr.onreadystatechange);
}

/**
 * Displays courses in the weekly schedule.
 */
function displayCourses(courses, daysOfWeek) {
    let sortedCourses = {};
    
    // Group courses by day
    daysOfWeek.forEach(day => sortedCourses[day] = []);
    courses.forEach(course => sortedCourses[course.day].push(course));

    // Iterate through each day and display courses
    daysOfWeek.forEach(day => {
        sortedCourses[day].forEach(course => {
            let courseSlot = document.querySelector(`.course-container[data-day='${day}'][data-time='${course.start}']`);
            if (courseSlot) {
                let courseBlock = document.createElement("div");
                courseBlock.classList.add("course-block-week");
                courseBlock.style.height = `${calculateDuration(course.start, course.end) * 50}px`;

                // Course details
                let courseContent = document.createElement("div");
                courseContent.classList.add("course-content");
                courseContent.innerHTML = `<strong>${course.name}</strong><br> (${course.start} - ${course.end})`;

                // Action buttons (edit & delete)
                let buttonContainer = document.createElement("div");
                buttonContainer.classList.add("course-buttons");

                let editBtn = document.createElement("button");
                editBtn.innerHTML = "✏️";
                editBtn.classList.add("edit-course");
                editBtn.onclick = () => openCourseModal(course);

                let deleteBtn = document.createElement("button");
                deleteBtn.innerHTML = "❌";
                deleteBtn.classList.add("delete-course");
                deleteBtn.onclick = () => openDeleteModal(course);

                buttonContainer.appendChild(editBtn);
                buttonContainer.appendChild(deleteBtn);

                courseBlock.appendChild(courseContent);
                courseBlock.appendChild(buttonContainer);
                courseSlot.appendChild(courseBlock);
            }
        });
    });
}

/**
 * Displays the weekly schedule layout.
 */
function displaySchedule(daysOfWeek) {
    const weeklyGrid = document.getElementById("weekly-grid");
    weeklyGrid.innerHTML = "";
    let timeSlots = [];

    // Generate hourly time slots
    for (let hour = 8; hour <= 18; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    // Create day headers
    let emptyHeader = document.createElement("div");
    weeklyGrid.appendChild(emptyHeader);

    daysOfWeek.forEach(day => {
        let dayHeader = document.createElement("div");
        dayHeader.classList.add("time-slot-day");
        dayHeader.style.fontWeight = "bold";
        dayHeader.textContent = day;
        weeklyGrid.appendChild(dayHeader);
    });

    // Create grid cells for each time slot and day
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

/**
 * Calculates the duration of a course in hours.
 */
function calculateDuration(start, end) {
    let [startHour, startMin] = start.split(":").map(Number);
    let [endHour, endMin] = end.split(":").map(Number);
    return (endHour + endMin / 60) - (startHour + startMin / 60);
}

/**
 * Opens a delete confirmation modal for a specific course.
 */
function openDeleteModal(course) {
    showCustomModal(
        'Delete Course',
        `Are you sure you want to delete "${course.name}" permanently?`,
        function () {
            fajax("DELETE", "courses",course);
            loadWeeklySchedule();
        }
    );
}

/**
 * Opens a modal to edit an existing course or add a new one.
 */
function openCourseModal(course = null, index = null) {
    const modal = document.getElementById("custom-modal");
    const modalMessage = document.getElementById("modal-message");
    const modalTitle = document.getElementById("modal-title");
    const confirmBtn = document.getElementById("confirm-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    
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
        saveCourse(isEditMode, course ? course.id : null);
    };
    cancelBtn.onclick = function () {
        modal.style.display = "none";
    };

    modal.style.display = "flex";  
}

/**
 * Generates dropdown options for course days.
 */
function generateDayOptions(selectedDay = "Monday") {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days.map(day => `<option value="${day}" ${day === selectedDay ? "selected" : ""}>${day}</option>`).join("");
}

/**
 * Saves a course (either updating an existing one or adding a new one).
 */
function saveCourse(isEditMode, courseId = null) {
    let courseData = {
        id: isEditMode ? courseId: "",
        name: document.getElementById("course-name").value.trim(),
        day: document.getElementById("course-day").value,
        start: document.getElementById("course-start").value,
        end: document.getElementById("course-end").value
    };

    // Validate required fields
    if (!courseData.name || !courseData.start || !courseData.end) {
        alert("Please fill all fields!");
        return;
    }

    let method;
    // Perform API call based on action type
    if (isEditMode) {
        courseData.id = courseId;
        method = "PUT";
    } else {
        method = "POST";
    }

    const fxhr = new FXMLHttpRequest();
    fxhr.open(method, "courses");
    fxhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                document.getElementById("custom-modal").style.display = "none";
                loadWeeklySchedule();
            }
        }
    };
    fxhr.send(courseData);

}
