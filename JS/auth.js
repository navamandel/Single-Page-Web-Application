
// פונקציה ראשית לניהול משתמשים

// פונקציה לניהול חיבור המשתמש (Session)
function handleSession(action, user = null) {
    switch (action) {
        case "set":
            sessionStorage.setItem("currentUser", JSON.stringify(user));
            break;
        case "get":
            return JSON.parse(sessionStorage.getItem("currentUser"));
        case "remove":
            sessionStorage.removeItem("currentUser");
            break;
        default:
            console.error("פעולה לא מזוהה ב-handleSession");
    }
}

function getCurrentUser() {
    return handleSession("get");
}
 
function handleSession(action, user = null) {
    switch (action) {
        case "set":
            sessionStorage.setItem("currentUser", JSON.stringify(user));
            break;
        case "get":
            return JSON.parse(sessionStorage.getItem("currentUser"));
        case "remove":
            sessionStorage.removeItem("currentUser");
            break;
        default:
            console.error("פעולה לא מזוהה ב-handleSession");
    }
}
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
            console.error("פעולה לא מזוהה ב-manageUsers");
            return null;
    }
}

// קבלת רשימת משתמשים
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

// שמירת משתמשים ל-LocalStorage
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// אימות כניסת משתמש
function authenticateUser({ username, password }) {
    if (!username || !password) {
        alert("יש למלא שם משתמש וסיסמה!");
        return false;
    }

    const users = getUsers();
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        handleSession("set", user);
        return true;
    }

    alert("שם משתמש או סיסמה שגויים!");
    return false;
}

// הרשמת משתמש חדש
function registerUser({ username, password }) {
    console.log(username,password);
    
    if (!username || !password) {
        alert("יש למלא את כל השדות!");
        return false;
    }

    const users = getUsers();

    if (users.some(user => user.username === username)) {
        alert("שם משתמש זה כבר קיים! בחר שם אחר.");
        return false;
    }

    users.push({ username, password });
    saveUsers(users);
    alert("ההרשמה הצליחה! כעת ניתן להתחבר.");
    return true;
}

// קבלת המשתמש המחובר הנוכחי
function getCurrentUser() {
    return handleSession("get");
}

// יציאת משתמש
function logoutUser() {
    handleSession("remove");
    alert("התנתקת בהצלחה!");
    return true;
}


