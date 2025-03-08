const DB_API2 = {
    taskId: 1001,
    courseId: 1001,

    add: function(file, data) {
        const user = JSON.parse(DB_API1.get("currentUser"));
        let index;

        switch (file) {
            case "tasks":
                data.id = this.taskId++;
                index = user.tasks.findIndex(task => task.date > data.date);
                index !== -1 ? user.tasks.splice(index-1, 0, data) : user.tasks.push(data);
                return this.handleData(user.username, user, "set");
            case "courses":
                data.id = this.courseId++;
                let temp = user.courses
                    .filter(course => course.day === data.day)
                    .find(course => course.time > data.time);
                temp ? index = user.courses.findIndex(temp) : index = null;
                index !== -1 ? user.courses.splice(index-1, 0, data) : user.courses.push(data);
                return this.handleData(user.username, user, "set");
            default:
                return 404;
        }
    },

    get: function(file, id = null) {
        const user = JSON.parse(DB_API1.get("currentUser"));
        let dataToReturn;

        if (id) {
            dataToReturn = file === "tasks" ? user.tasks.find(task => task.id === id)
                : file === "courses" ? user.courses.find(course => course.id === id)
                : undefined;
        } else {
            dataToReturn = file === "tasks" ? user.tasks
                : file === "courses" ? user.courses
                : undefined;
        }
        
        if (!dataToReturn) return 404;
        return dataToReturn;
    },

    update: function(file, data) {
        const user = JSON.parse(DB_API1.get("currentUser"));
        let index;

        switch (file) {
            case "tasks":
                index = user.tasks.findIndex(task => task.id === data.id);
                if (index === -1) return 404;
                user.tasks.splice(index, 1, data);
                return this.handleData(user.username, user, "set")
            case "courses":
                index = user.courses.findIndex(cors => cors.id === data.id);
                if (index === -1) return 404;
                user.courses.splice(index, 1, data);
                return this.handleData(user.username, user, "set");
            default:
                return 404;
        }
    },

    delete: function(file, data) {
        const user = JSON.parse(DB_API1.get("currentUser"));
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