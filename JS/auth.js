

// Manage user session
function handleSession(action, user = null) {
    return handleStorage("session", action, "currentUser", user);
}

// Retrieve the current logged-in user
function getCurrentUser() {
    return handleSession("get");
}

// User management (register, login, logout, retrieve user)
function manageUsers(action, data) {
    switch (action) {
        case "register":
            return registerUser(data);
        case "login":
            return authenticateUser(data);
        case "logout":
            return logoutUser();
        case "getCurrentUser":
            return getCurrentUser();
        default:
            console.error("Unknown action in manageUsers");
            return null;
    }
}

// Retrieve all users from localStorage
function getUsers() {
    return handleStorage("local", "get", "users") || [];
}

// Save users to localStorage
function saveUsers(users) {
    handleStorage("local", "set", "users", users);
}

// Authenticate user login
function authenticateUser({ username, password }) {
    if (!username || !password) {
        alert("Username and password are required!");
        return false;
    }

    const users = getUsers();
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        handleSession("set", user);
        return true;
    }

    alert("Invalid username or password!");
    return false;
}

// Register a new user
function registerUser({ username, password }) {
    if (!username || !password) {
        alert("All fields are required!");
        return false;
    }

    const users = getUsers();
    if (users.some(user => user.username === username)) {
        alert("Username already exists! Choose a different one.");
        return false;
    }

    users.push({ username, password });
    saveUsers(users);
    alert("Registration successful! You can now log in.");
    return true;
}

// Logout user
function logoutUser() {
    handleSession("remove");
    alert("You have successfully logged out!");
    return true;
}

