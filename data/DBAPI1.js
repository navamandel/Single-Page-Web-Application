const DB_API1 = {

    add: function(file, data) {
        console.log(file, data);
        const users = JSON.parse(this.get("users"));
        users[data.username] = data.password;
        localStorage.setItem("Users", JSON.stringify(users));
        localStorage.setItem(data.username, JSON.stringify(data));
        return 200;
    },

    get: function(user = null) {
        console.log("it's in db1 ", user);
        if (!localStorage.getItem("Users")) {
            console.log("in db setting the users");
            localStorage.setItem("Users", "{}")
            return "{}";
        } 
        if (user === "users") {
            return localStorage.getItem("Users");
        }

        let curUser = sessionStorage.getItem("currentUser");
        if (!curUser) return;
        let curUser_ = JSON.parse(localStorage.getItem(curUser));

        if (user === "currentUser") {
            
            
            let temp = {"firstname": curUser_.firstname,
                        "lastname": curUser_.lastname,
                        "username": curUser_.username,
                        "password": curUser_.password};
            return JSON.stringify(temp);
            
                
        } else {
            return curUser_;
        }
            
    },
    
    update: function(file, data) {
        if (file === "currentUser") {
            sessionStorage.setItem("currentUser", data);
            return 200;
        }
        
        let users = JSON.parse(this.get("users"));
        let user = this.get("user");
        let data_ = JSON.parse(data);

        if (user.username !== data_.username) {
            if (data_.password) {
                users[data_.username] = data_.password;
                user.password = data_.password;
            } else {
                users[data_.username] = user.password
            }
            delete users[user.username];
            localStorage.removeItem(user.username);
            sessionStorage.setItem("currentUser", data_.username);
            user.username = data_.username;
            localStorage.setItem("Users", JSON.stringify(users));
        } else if (data_.password) {
            user.password = data_.password;
            users[user.username] = data_.password;
            localStorage.setItem("Users", JSON.stringify(users));
        }

        user.firstname = data_.firstname;
        user.lastname = data_.lastname;
        
        localStorage.setItem(user.username, JSON.stringify(user));
        return 200;
    },

    delete: function(file, data) {
        const user = this.get("user");
        sessionStorage.removeItem("currentUser");
        if (file === "users") {
            const users = JSON.parse(this.get("users"));
            delete users[user.username];
            localStorage.setItem("Users", JSON.stringify(users));
            localStorage.removeItem(user.username);
        } 
        return 200;
    },

    //---Helper Functions---
    handleData: function(key, value, method, isLS = true) {
        
        //let { key, value } = this.prepData(key_, value_);
        //console.log({ key, value });

        if (!isLS) {
            switch (method) {
                case "set":
                    sessionStorage.setItem(key, value);
                    return 200;
                case "get":
                    return sessionStorage.getItem(key);
                case "remove":
                    sessionStorage.removeItem(key);
                    return 200;
                default:
                    return 401;
            }
        } else {
            switch (method) {
                case "set":
                    localStorage.setItem(key, value);
                    return 200;
                case "get":
                    return localStorage.getItem(key);
                case "remove":
                    localStorage.removeItem(key);
                    return 200;
                default:
                    return 401;
            }
        }
    },

    prepData: function(data) {

        /*let key = key_;
        let value = value_;

        if (typeof key_ !== "string") {
            key = JSON.stringify(key_);
        } else if (/^'/.test(key_)) {
            key = key_.replace(/^'(.*)'$/, '"$1"');
        }

        if (value_ === "") {
            value = value_;
        } else if (typeof value_ !== "string") {
            value = JSON.stringify(value_);
        } else if (/^'/.test(value_)) {
            value = value_.replace(/^'(.*)'$/, '"$1"');
        }

        return { key, value };*/
    }
};

