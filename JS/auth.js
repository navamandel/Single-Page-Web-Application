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
    console.log(data);
    
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
   //let response= fajax("GET", "users") || [];
   //console.log(response);
   
   //return response;

   const fxhr = new FXMLHttpRequest();
   fxhr.open("GET", "users");
   fxhr.send();

   fxhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            return JSON.parse(this.response);
        }
   };
}

// Save a new user (used in registration)
function saveUser(user) {
    //fajax("POST", "users", user);
    const fxhr = new FXMLHttpRequest();
    fxhr.open("POST", "users");
    fxhr.send(user, fxhr.onreadystatechange);

    fxhr.onreadystatechange = function() {
        if (this.readyState === 4) return;
        console.log(this.response);
    };
}

// Authenticate user login
function authenticateUser({ username, password }) {
    if (!username || !password) {
        alert("Username and password are required!");
        return false;
    }

    let users;
    const fxhr = new FXMLHttpRequest();
    fxhr.open("GET", "users");
    fxhr.send(null, fxhr.onreadystatechange);

    fxhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
             users = JSON.parse(this.response);
             let usernames = Object.keys(users);
             console.log(usernames);
    
            const user = usernames.find(user => user === username);
            console.log(user);

            if (user && users[user] === password) {
                fajax("PUT", "currentUser", user); // Save current session user
                return true;
            }

            alert("Invalid username or password!");
            return false;
        }
        console.log(this.response, this.readyState, this.status);
   };

    /*console.log(users);
    
    const user = users.find(user => user.username === username && user.password === password);
    console.log(user);

    if (user) {
        fajax("PUT", "currentUser", user); // Save current session user
        return true;
    }

    alert("Invalid username or password!");
    return false;*/
}

// Register a new user
function registerUser({ firstname, lastname, username, password }) {
    console.log("im in here");
    if (!firstname || !lastname || !username || !password) {
        alert("All fields are required!");
        return false;
    }

    const fxhr = new FXMLHttpRequest();
    fxhr.open("GET", "users");

    fxhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let users = this.response;
                if (users) {
                    users = Object.keys(JSON.parse(users));
                    if (users.some(user => user.username === username)) {
                        alert("Username already exists! Choose a different one.");
                        return false;
                    }
                }
                const newUser = User(firstname, lastname, username, password);
                saveUser(newUser);
                alert("Registration successful! You can now log in.");
                return true; 
            } else {
                alert("Error problem with server");
                return false;
            }
        }
    }

    fxhr.send(null, fxhr.onreadystatechange);
/*
    const users = getUsers();
    if (users.some(user => user.username === username)) {
        alert("Username already exists! Choose a different one.");
        return false;
    }

    const newUser = User(firstname, lastname, username, password);
    saveUser(newUser);
    alert("Registration successful! You can now log in.");
    return true;*/
}

// Logout the current user
function logoutUser() {
    //fajax("DELETE", "currentUser"); // Remove session

    const fxhr = new FXMLHttpRequest();
    fxhr.open("DELETE", "currentUser");

    fxhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            alert("You have successfully logged out!");
            return true;
        }
    }

    fxhr.send(null, fxhr.onreadystatechange);

    return false;
    
}
