const DB_API = {
    add: function(file, data) {
        let user = JSON.parse(this.get());
        let index;
        switch (file) {
            case "users":
                const users = JSON.parse(this.get(file));
                users[data.username] = data.password;
                this.handleData("Users", users, "set");
                this.handleData(data.username, data, "set");
                return 200;
            case "tasks":
                index = user.tasks.findIndex(task => task.date > data.date);
                index !== -1 ? user.tasks.splice(index-1, 0, data) : user.tasks.push(data);
                this.handleData(user.username, user, "set");
                return 200;
            case "courses":
                let temp = user.courses
                    .filter(cors => cors.day === data.day)
                    .find(cors => cors.time > data.time);
                temp ? index = user.courses.findIndex(temp) : index = null;
                index !== -1 ? user.courses.splice(index-1, 0, data) : user.courses.push(data);
                this.handleData(user.username, user, "set");
                return 200;
            default:
                return 404;
        }
    },

    get: function(file = null) {
        if (!localStorage.getItem("Users")) {
            this.handleData("Users", "", "set");
        }
        let curUser = this.handleData("user", "", "get", false);
        if (curUser) {
            curUser = JSON.parse(curUser);
            curUser = JSON.parse(this.handleData(curUser, "", "get"));
        } 

        let dataToReturn = file === "users" ? this.handleData("Users", "", "get")
            : file === "tasks" ? curUser.tasks
            : file === "courses" ? curUser.courses
            : !file ? curUser
            : "";
        
        if (!isJSON(dataToReturn)) dataToReturn = JSON.stringify(dataToReturn);

        return dataToReturn;

    },

    update: function(file, data) {
        let user = JSON.parse(this.get());
        let index;

        switch (file) {
            case "tasks":
                index = user.tasks
                    .findIndex(task => task.name === data.name && task.description === data.description);
                if (index === -1) return 404;
                user.tasks.splice(index, 1, data);
                this.handleData(user.username, user, "set");
                return 200;
            case "courses":
                index = user.courses.findIndex(cors => cors.name === data.name && cors.day === data.day);
                if (index === -1) return 404;
                user.courses.splice(index, 1, data);
                this.handleData(user.username, user, "set");
                return 200;
            case "users":
                const users = JSON.parse(this.get("users"));
                delete users[user.username];
                users[data.username] = data.password;
                this.handleData("Users", users, "set");
                
                user.username = data.username;
                user.password = data.password;
                this.update("curUser", user.username);
                this.handleData(user.username, user, "set");
                return 200;
            case "curUser":
                this.handleData("user", data, "set", false);
                return 200;
            default:
                return 404;
        }
    },

    delete: function(file, data) {
        const user = JSON.parse(this.get());
        let index;

        switch (file) {
            case "tasks":
                if (data) {
                    index = user.tasks.findIndex(task => task === data);
                    if (index === -1) return 404;
                    user.tasks.splice(index, 1);
                } else {
                    user.tasks = [];
                }
                this.handleData(user.username, user, "set");
                return 200;
            case "courses":
                if (data) {
                    index = user.courses.findIndex(cors => cors === data);
                    if (index === -1) return 404;
                    user.courses.splice(index, 1);
                } else {
                    user.courses = [];
                }
                this.handleData(user.username, user, "set");
                return 200;
            case "users":
                const users = JSON.parse(this.get());
                delete users[user.username];
                this.handleData("Users", users, "set");
                this.handleData(user.username, "", "remove");
                this.handleData("user", "", "remove", false);
                return 200;
            default:
                return 404;
        }
        
    },

    //---Helper Functions---
    handleData: function(key_, value_, method, isLS = true) {
        
        let key, value = prepData(key_, value_);

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
    
    prepData: function(key_, value_) {
        let key, value;
        if (!isJSON(key) ) {
            if (typeof key !== string) {
                key = JSON.stringify(key);
            } else {
                key = key.replace(/^'(.*)'$/, '"$1"');
            }
        }
        if (!isJSON(value) ) {
            if (typeof value !== string) {
                value = JSON.stringify(value);
            } else {
                value = value.replace(/^'(.*)'$/, '"$1"');
            }
        }
        return key, value;
    }
};

