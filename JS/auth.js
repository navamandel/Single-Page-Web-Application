// Retrieve the current logged-in user
function getCurrentUser() {
    return fajax("GET", "currentUser") || null;
}

// Constructor function for a new user
function User(firstname, lastname, username, password) {
    return {
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password,
        courses: [],
        tasks: [],
    };
}

// Manage user actions (register, login, logout, retrieve user)
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

// Retrieve all users
function getUsers() {
   let response= fajax("GET", "users") || [];
   console.log(response);
   
   return response
}

// Save a new user (used in registration)
function saveUser(user) {
    fajax("POST", "users", user);
}

// Authenticate user login
function authenticateUser({ username, password }) {
    if (!username || !password) {
        alert("Username and password are required!");
        return false;
    }

    const users = getUsers();
    console.log(users);
    
    const user = users.find(user => user.username === username && user.password === password);
console.log(user);

    if (user) {
        fajax("PUT", "currentUser", user); // Save current session user
        return true;
    }

    alert("Invalid username or password!");
    return false;
}

// Register a new user
function registerUser({ firstname, lastname, username, password }) {
    if (!firstname || !lastname || !username || !password) {
        alert("All fields are required!");
        return false;
    }

    const users = getUsers();
    if (users.some(user => user.username === username)) {
        alert("Username already exists! Choose a different one.");
        return false;
    }

    const newUser = User(firstname, lastname, username, password);
    saveUser(newUser);
    alert("Registration successful! You can now log in.");
    return true;
}

// Logout the current user
function logoutUser() {
    fajax("DELETE", "currentUser"); // Remove session
    alert("You have successfully logged out!");
    return true;
}
