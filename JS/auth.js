// Retrieve the current logged-in user
function getCurrentUser(callback) {
    //return fajax("GET", "currentUser") || null;
    const fxhr = new FXMLHttpRequest();
    fxhr.open("GET", "currentUser");
    showLoader();

    fxhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                if (callback) callback(JSON.parse(this.response));
            } else {
                showErrorMessage("Error retrieving user data.");
                return null;
            }
        }
    };

    fxhr.send(null);
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
function manageUsers(action, data, callback) {
    
    switch (action) {
        case "register":
            registerUser(data, callback);
            break;
        case "login":
            authenticateUser(data, callback);
            break;
        case "logout":
            logoutUser(callback);
            break;
        case "getCurrentUser":
            getCurrentUser();
            break;
        case "updateInfo":
            updateInfo(data, callback);
            break;
        default:
            console.error("Unknown action in manageUsers");
            if (callback) callback(null);
    }
}

// Retrieve all users
function getUsers(callback) {
   //let response= fajax("GET", "users") || [];
   //console.log(response);
   
   //return response;

   const fxhr = new FXMLHttpRequest();
   fxhr.open("GET", "users");
   showLoader();

   fxhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            hideLoader();
            if (callback) callback(JSON.parse(this.response));
        } else if (this.readyState === 4) {
            hideLoader();
            showErrorMessage(this.status_text);
        }
        
   };
   fxhr.send();
}

// Save a new user (used in registration)
function saveUser(user) {
    //fajax("POST", "users", user);
    const fxhr = new FXMLHttpRequest();
    fxhr.open("POST", "users");
    showLoader();

    fxhr.send(user, fxhr.onreadystatechange);

    fxhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            hideLoader();
            return
        };
        console.log(this.response);
    };
}

function setCurrentUser(user, callback) {
    const fxhr = new FXMLHttpRequest();
    fxhr.open("PUT", "currentUser");

    fxhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
             if (callback) callback(true);
        } else if (this.readyState === 4 && this.status === 408) {
            hideLoader();
           showErrorMessage("plase refresh try again")
        }
       
   };

   fxhr.send(user);
}

// Authenticate user login
function authenticateUser({ username, password }, callback) {
    if (!username || !password) {
        showErrorMessage("Username and password are required!")
        if (callback) callback(false);
        return;
    }

    let users;
    const fxhr = new FXMLHttpRequest();
    fxhr.open("GET", "users");
    showLoader();

    fxhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            hideLoader();
             users = JSON.parse(this.response);
             let usernames = Object.keys(users);
             console.log(usernames);
    
            const user = usernames.find(user => user === username);
            console.log(user);

            if (user && users[user] === password) {
                // Save current session user
                setCurrentUser(user, (res) => {
                    if (res) return true;
                });
                if (callback) callback(true);
            } else {
                console.log("im in here");
                
                showErrorMessage("Invalid username or password!")
                if (callback) callback(false);
            }
        }else if(this.readyState === 4 ){
            hideLoader();
            showErrorMessage(this.status_text)
        }

   };

   fxhr.send(null, fxhr.onreadystatechange);

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
function registerUser({ firstname, lastname, username, password }, callback) {
    console.log("im in here");
    if (!firstname || !lastname || !username || !password) {
        showErrorMessage("All fields are required!")
        return false;
    }

    const fxhr = new FXMLHttpRequest();
    fxhr.open("GET", "users");
    showLoader();

    fxhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            hideLoader();
            if (this.status === 200) {
                let users = this.response;
                if (users) {
                    users = Object.keys(JSON.parse(users));
                    if (users.some(user => user.username === username)) {
                        showErrorMessage("Username already exists! Choose a different one.")
                        if (callback) callback(false);
                    }
                }
                const newUser = User(firstname, lastname, username, password);
                saveUser(newUser);
                showCustomModal("Done","Registration successful! You can now log in.")
                if (callback) callback(true);
            } else {
                showErrorMessage("plese refresh and try again")
                if (callback) callback(false);
            }
        }
    }

    fxhr.send(null);
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
function logoutUser(callback) {
    //fajax("DELETE", "currentUser"); // Remove session

    const fxhr = new FXMLHttpRequest();
    fxhr.open("DELETE", "currentUser");
    showLoader();

    fxhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(true);
            hideLoader();
            return true;
        }
        else if(this.readyState === 4 ){
         showErrorMessage("plese refresh and try again")
        }
    }

    fxhr.send(null, fxhr.onreadystatechange);

    return false;
    
}

function updateInfo(data, callback) {
    let users, user;

    getUsers((res) => {if (res) users = res});
    const interval1 = setInterval(() => {
        if (users) {
            clearInterval(interval1);
        }
    }, 500);

    getCurrentUser((res) => {if (res) user = res});
    const interval2 = setInterval(() => {
        if (user) {
            clearInterval(interval2);
        }
    }, 500);

    if (user.username !== data.username) {
        if (users.some(user => user.username === data.username)) {
            showErrorMessage("Username already exists! Choose a different one.")
            if (callback) callback(false);
        }
    }

    const fxhr = new FXMLHttpRequest();
    fxhr.open("PUT", "user");
    showLoader();

    fxhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            hideLoader();
            if (callback) callback(true);
        }else if(this.readyState===4){
            hideLoader();
            showErrorMessage(this.status_text)
        }
    };
    fxhr.send(user);
}
