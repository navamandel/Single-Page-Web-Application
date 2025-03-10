
document.addEventListener("DOMContentLoaded", () => {
    let user;
    let timeoutReached = false;
    
    getCurrentUser((res) => {
        if (res) {
            user = res;
            if (!timeoutReached) {
                clearTimeout(timeoutId); 
                loadHomePage();
            }
        }
    });
    
    const timeoutId = setTimeout(() => {
        timeoutReached = true;
        if (!user) {
            console.log("User not found, redirecting to login...");
            loadLoginPage();
        }
    }, 2000);
    
    
});


/**
 * Initializes the page by loading the given template and setting up UI components
 * @param {string} templateId - The ID of the template to load
 */
function initializePage(templateId) {
    console.log(templateId);
    
    const template = document.getElementById(`${templateId}-template`);
    const content = template.content.cloneNode(true);

    // Clear existing content and append the new page content
    document.getElementById("app").innerHTML = "";
    document.getElementById("app").appendChild(content);

    document.getElementById("modal-container").innerHTML = document.getElementById("modal-template").innerHTML;
    document.getElementById("modal-container").style.display="none"

    // Ensure modals are hidden by default
    document.getElementById("loading-overlay").style.display = "none";
    // Load common UI components
    if(templateId==="home" || templateId==="schedule" || templateId==="tasks" || templateId==="user" ){      

        document.getElementById("sidebar-container").innerHTML = document.getElementById("sidebar-template").innerHTML;
        document.getElementById("header-container").innerHTML = document.getElementById("header-template").innerHTML;
        document.getElementById("custom-modal").style.display = "none";
    }
   

}


//file : "users", "courses", "tasks"
//methods: "GET", "POST"-> add, "PUT" -> update, "DELETE"
function fajax(method, file, data = null) {
    
    let response_;
    const fxhr = new FXMLHttpRequest();
    fxhr.open(method, file);
    fxhr.send(data);
    
    fxhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200){
            response_ = this.response;
        } else if (this.readyState === 4 && this.status === 404) {
            return "ERROR not Found"
        }
    };

    return response_;
}


function updatePageTitle(title, description) {
    console.log(title, description);
    document.getElementById("page-title").textContent=title;
    document.getElementById("page-description").textContent = description;
} 

/**
 * Displays a no Items Message inside the given container
 * @param {HTMLElement} container - The container where the message should be displayed
 * @param {string} message - The message to display
 */
function noItemsMessage(container, message) {
    container.innerHTML = ""; // Clear previous content
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageElement.classList.add("empty-state-message");
    container.appendChild(messageElement);
}


function showCustomModal(title,message, onConfirm=null) {
    const container= document.getElementById("modal-container")
    const modal = document.getElementById("custom-modal");
    const modaltitle = document.getElementById("modal-title");
    const modalMessage = document.getElementById("modal-message");
    const confirmBtn = document.getElementById("confirm-btn");
    const cancelBtn = document.getElementById("cancel-btn");

    modaltitle.textContent=title;
    modalMessage.textContent = message;
    container.style.display="flex";
    modal.style.display = "flex";  
  if(onConfirm){
    confirmBtn.onclick = function () {
        container.style.display = "none";
        onConfirm();
    };

    cancelBtn.onclick = function () {
        container.style.display = "none";
    };
  }
else{
    confirmBtn.style.display="none";

    cancelBtn.onclick = function () {
        container.style.display = "none";
    };
}
}
/**
 * Displays an error message in the modal
 */
function showErrorMessage(message) {
    showCustomModal("Error", message, null);
}


// Show loader function
function showLoader() {
    document.getElementById("loading-overlay").style.display = "flex";
}

// Hide loader function
function hideLoader() {
    document.getElementById("loading-overlay").style.display = "none";
}

