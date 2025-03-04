
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
                    window.loadHomePage();
                    break;
                case "tasks":
                    window.loadTasksPage();
                    break;
                case "schedule":
                    window.loadWeeklySchedule();
                    break;
                case "login":
                    window.loadLoginPage();
                    break;
                default:
                    console.error("Unknown page:", view);
            }
        }
    }
    //navigateTo("login");

   // Check if the user is logged in
   if (getCurrentUser()) {
      //  navigateTo("home");
        navigateTo("schedule");
console.log("hiiii");


    } else {
        navigateTo("login");
    }  

    // Make navigateTo globally accessible
    window.navigateTo = navigateTo;
});
