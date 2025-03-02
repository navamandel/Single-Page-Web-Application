
document.addEventListener("DOMContentLoaded", () => {
    function navigateTo(view) {
        const template = document.getElementById(`${view}-template`);
        if (template) {
            const content = template.content.cloneNode(true);
            document.getElementById("app").innerHTML = "";
            document.getElementById("app").appendChild(content);

            // Dynamically load the correct JavaScript file based on the page
            switch (view) {
                case "home":
                    import("./home.js").then(module => module.loadHomePage());
                    break;
                case "tasks":
                    import("./tasks.js").then(module => module.loadTasksPage());
                    break;
                case "meetings":
                    import("./meetings.js").then(module => module.loadMeetingsPage());
                    break;
                case "contacts":
                    import("./contacts.js").then(module => module.loadContactsPage());
                    break;
                case "login":
                    window.loadLoginPage();
                    break;
                default:
                    console.error("Unknown page:", view);
            }
        }
    }

    // Check if the user is logged in
    if (getCurrentUser()) {
        navigateTo("home");
    } else {
        navigateTo("login");
    }

    // Make navigateTo globally accessible
    window.navigateTo = navigateTo;
});
