function loadLoginPage() {
    const container = document.getElementById("container");
    const registerBtn = document.getElementById("register-btn");
    const loginBtn = document.getElementById("login-btn");

    if (!container || !registerBtn || !loginBtn) {
        console.error("Login elements not found");
        return;
    }

    // Toggle between login and registration forms
    registerBtn.addEventListener("click", () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener("click", () => {
        container.classList.remove("active");
    });

    // Handle form submission
    document.getElementById("app").addEventListener("submit", (event) => {
        event.preventDefault();
        const form = event.target;

        if (form.id === "login-form") {
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("pw").value.trim();

            if (window.authenticateUser(username, password)) {
                console.log("Login successful:", username);
                navigateTo("home");
            } 
        } else if (form.id === "register-form") {
            const newUsername = document.getElementById("newusername").value.trim();
            const newPassword = document.getElementById("newpw").value.trim();
            const confirmPassword = document.getElementById("confirmpw").value.trim();

            if (!newUsername || !newPassword) {
                alert("All fields are required!");
                return;
            }

            if (newPassword !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            if (window.registerUser(newUsername, newPassword)) {
                navigateTo("home");
            }
        }
    });
}

// Make function globally accessible
window.loadLoginPage = loadLoginPage;
