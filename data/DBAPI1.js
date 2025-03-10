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

        if (user === "currentUser") {
            console.log("it's starting to get the current user ", user);
            let curUser = sessionStorage.getItem("currentUser");
            console.log("key from session storage: ", sessionStorage.getItem("currentUser"));
            let curUser_ = localStorage.getItem(curUser);
            console.log("current user trimmed: ", curUser.trim());
            //setTimeout(() => {
                console.log("fetching from local storage: ", localStorage.getItem("n"));
                console.log("fetching from local storage trimmed: ", localStorage.getItem(curUser_));
            //}, 1000);
            
            if (!curUser) return;
            //let curUser_ = JSON.parse(localStorage.getItem(curUser.trim()));
            
            
            let temp = {"firstname": curUser_.firstname,
                        "lastname": curUser_.lastname,
                        "username": curUser_.username,
                        "password": curUser_.password};
            return JSON.stringify(temp);
            
                
        } else if (user === "users") {
            return localStorage.getItem("Users");
        } else {
            console.log("does it return the correct thing?? ", curUser);
            return curUser_;
        }
            
    },
    
    update: function(data) {
        sessionStorage.setItem("currentUser", JSON.stringify(data));
        return 200;
    },

    delete: function(file, data) {
        const user = JSON.parse(this.get("currentUser"));
        sessionStorage.removeItem("currentUser");

        if (file !== "currentUser") {
            const users = JSON.parse(this.get());

            localStorage.removeItem(user.username);
            delete users[user.username];
            localStorage.setItem("Users", JSON.stringify(users));
        }
        
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

