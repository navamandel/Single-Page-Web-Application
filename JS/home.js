function loadHomePage() {
    const user = getCurrentUser(); // Retrieve the currently logged-in user

    // If no user is logged in, redirect to the login page
    if (!user) {
        navigateTo("login");
        return;
    }

    // Display the user's name on the home page
    document.getElementById("user-name").textContent = user.username || "Guest";

    // Set example statistics (to be replaced with real data later)
    document.getElementById("contact-count").textContent = 15;
    document.getElementById("task-count").textContent = 7;
    document.getElementById("meeting-count").textContent = 3;

    // Navigation event listeners
    document.getElementById("go-to-tasks").addEventListener("click", () => navigateTo("tasks"));
    document.getElementById("go-to-meetings").addEventListener("click", () => navigateTo("meetings"));
    document.getElementById("go-to-contacts").addEventListener("click", () => navigateTo("contacts"));

    // Logout event listener
    document.getElementById("logout-btn").addEventListener("click", logoutUser);
}
