// Function to get users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

// Function to save users to localStorage
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// Authenticate user login
function authenticateUser(username, password) {
    if (!username || !password) {
        alert("Username and password are required!");
        return false;
    }

    const users = getUsers();
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user)); // Store logged-in user
        return true;
    }

    alert("Invalid username or password!");
    return false;
}

// Register a new user
function registerUser(username, password) {
    if (!username || !password) {
        alert("All fields are required!");
        return false;
    }

    const users = getUsers();

    // Check if the username already exists
    if (users.some(user => user.username === username)) {
        alert("Username already exists! Please choose another.");
        return false;
    }

    users.push({ username, password });
    saveUsers(users);
    alert("Registration successful! You can now log in.");
    return true;
}

// Get the currently logged-in user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

// Logout function
function logoutUser() {
    localStorage.removeItem("currentUser");
    navigateTo("login"); // Redirect to login page
}

// Expose functions globally
window.registerUser = registerUser;
window.authenticateUser = authenticateUser;
window.getCurrentUser = getCurrentUser;
window.logoutUser = logoutUser;
