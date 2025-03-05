
document.addEventListener("DOMContentLoaded", () => {
    function navigateTo(view) {
        const template = document.getElementById(`${view}-template`);
        if (template) {
            const content = template.content.cloneNode(true);
            document.getElementById("app").innerHTML = "";
            document.getElementById("app").appendChild(content);
            console.log("hii");

            // Dynamically load the correct JavaScript file based on the page
            switch (view) {
                case "home":
                    loadHomePage();
                    break;
                case "tasks":
                    window.loadTasksPage();
                    break;
                case "schedule":
                    window.loadWeeklySchedule();
                    break;
                case "login":
                    loadLoginPage();
                    break;
                default:
                    console.error("Unknown page:", view);
            }
        }
    }
    navigateTo("login");
    //navigateTo("home");

   
   // Check if the user is logged in
   /* if (getCurrentUser()) {
      //  navigateTo("home");
        navigateTo("schedule");
console.log("hiiii");


    } else {
        navigateTo("login");
    }  

    // Make navigateTo globally accessible
    window.navigateTo = navigateTo; */
});

// Generic function to handle localStorage and sessionStorage
function handleStorage(type, action, key, value = null) {
    const storage = type === "session" ? sessionStorage : localStorage;
    switch (action) {
        case "set":
            storage.setItem(key, JSON.stringify(value));
            break;
        case "get":
            return JSON.parse(storage.getItem(key));
        case "remove":
            storage.removeItem(key);
            break;
        default:
            console.error(`Unknown action in handleStorage: ${action}`);
            return null;
    }
}

function updatePageTitle(title, description) {
    document.getElementById("page-title").textContent = title;
    document.getElementById("page-description").textContent = description;
} 


function showCustomModal(title,message, onConfirm) {
    const modal = document.getElementById("custom-modal");
    const modaltitle = document.getElementById("modal-title");
    const modalMessage = document.getElementById("modal-message");
    const confirmBtn = document.getElementById("confirm-btn");
    const cancelBtn = document.getElementById("cancel-btn");

    modaltitle.textContent=title;
    modalMessage.textContent = message;
    modal.style.display = "flex";  

    confirmBtn.onclick = function () {
        modal.style.display = "none";
        onConfirm();
    };

    cancelBtn.onclick = function () {
        modal.style.display = "none";
    };
}


