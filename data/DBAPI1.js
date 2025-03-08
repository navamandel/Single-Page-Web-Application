const DB_API1 = {

    add: function(file, data) {
        const users = JSON.parse(this.get(file));
        users[data.username] = data.password;
        let status = this.handleData("Users", users, "set");
        if (status !== 200) return status;
        status = this.handleData(data.username, data, "set");
        return status;
    },

    get: function(user = null) {

        if (user) {
            let curUser = this.handleData("user", "", "get", false);
            if (curUser) {
                curUser = JSON.parse(curUser);
                return this.handleData(curUser, "", "get");
            } 
            return 404;
        }

        if (!localStorage.getItem("Users")) {
            this.handleData("Users", "", "set"); 
        } 
        
        return this.handleData("Users", "", "get");
    },

    update: function(data) {
        let user = JSON.parse(this.get());
        
        const users = JSON.parse(this.get("users"));
        delete users[user.username];
        users[data.username] = data.password;
        let status = this.handleData("Users", users, "set");
        if (status !== 200) return status;
              
        user.username = data.username;
        user.password = data.password;
        this.update("currentUser", user.username);
        status = this.handleData(user.username, user, "set");
        if (status !== 200) return status;

        status = this.handleData("user", data, "set", false);
        
        return status;
    },

    delete: function(file, data) {
        const user = JSON.parse(this.get());
        const users = JSON.parse(this.get());

        delete users[user.username];
        let status = this.handleData("Users", users, "set");
        if (status !== 200) return status;
        status = this.handleData(user.username, "", "remove");
        if (status !== 200) return status;
        status = this.handleData("user", "", "remove", false);
        return status;
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
        if (!isJSON(key_) ) {
            if (typeof key_ !== string) {
                key = JSON.stringify(key_);
            } else {
                key = key_.replace(/^'(.*)'$/, '"$1"');
            }
        }
        if (!isJSON(value_) ) {
            if (typeof value_ !== string) {
                value = JSON.stringify(value_);
            } else {
                value = value_.replace(/^'(.*)'$/, '"$1"');
            }
        }
        return key, value;
    }
};

