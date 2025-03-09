const DB_API1 = {

    add: function(file, data) {
        console.log(file, data);
        const users = JSON.parse(this.get());
        users[data.username] = data.password;
        localStorage.setItem("Users", JSON.stringify(users));
        localStorage.setItem(data.username, JSON.stringify(data));
    },

    get: function(user = null) {
        if (!localStorage.getItem("Users")) {
            console.log("in db setting the users");
            localStorage.setItem("Users", "{}")
            return "{}";
        } 

        if (user) {
            let curUser = this.handleData("user", "", "get", false);
            if (curUser) {
                curUser = JSON.parse(curUser);
                curUser = this.handleData(curUser, "", "get");
                let temp = {"firstname": curUser.firstname,
                        "lastname": curUser.lastname,
                        "username": curUser.username,
                        "password": curUser.password};
                return JSON.stringify(temp);
            } 
            return 404;
        }
        
        return localStorage.getItem("Users");
    },

    update: function(data) {
        sessionStorage.setItem("currentUser", JSON.stringify(data));

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

