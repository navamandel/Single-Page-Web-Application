const DB_API = {
    add: function(file, data) {
        let user = this.get();
        let index;
        switch (file) {
            case "users":
                const users = this.get(file);
                users[data.username] = data.password;
                localStorage.setItem("Users", JSON.stringify(users));
                localStorage.setItem(data.username, JSON.stringify(data));
                break;
            case "meetings":
                index = user.meetings.findIndex(mtg => mtg.date > data.date);
                user.meetings.splice(index-1, 0, data);
                localStorage.setItem(user.username, JSON.stringify(user));
                break;
            case "contacts":
                index = user.contacts.findIndex(con => con.name > data.name);
                user.contacts.splice(index-1, 0, data);
                localStorage.setItem(user.username, JSON.stringify(user));
                break;
            case "todos":
                index = user.toDos.findIndex(todo => (todo.priority === data.priority && todo.date > data.date));
                user.toDos.splice(index-1, 0, data);
                localStorage.setItem(user.username, JSON.stringify(user));
                break;
        }
    },

    get: function(file = null) {
        let currUser = sessionStorage.getItem("user");
        if (currUser) {
            currUser = JSON.parse(currUser);
        }

        switch (file) {
            case "users":
                const users = localStorage.getItem("Users")
                if (users) {
                    return users;
                } else {
                    localStorage.setItem("Users", "[]");
                    return "[]";
                }
            case "meetings":
                return currUser.meetings;
            case "contacts": 
                return currUser.contacts;
            case "toDos":
                return currUser.toDos;
            default:
                return currUser;
        }
    },

    update: function(file, data) {
        let user = this.get();

        if (file === ("meetings" || "contacts" || "toDos")) {
            this.delete(file, data.original);
            this.add(file, data.updated);
        } else {
            let dataToUpdate = Object.keys(data.updated);
            for (const update of dataToUpdate) {
                user[update] = data.updated[update];
            }
            localStorage.setItem(user.username, JSON.stringify(user));
        }
    },

    delete: function(file, data) {
        const user = this.get();
        let index;
        if (file !== ("meetings" || "contacts" || "toDos")) {
            const users = this.get("users");
            index = users.findIndex(usr => usr === file);
            users.splice(index, 1);
            localStorage.setItem("Users", JSON.stringify);
            return;
        }

        switch (file) {
            case "meetings":
                if (data) {
                    index = user.meetings.findIndex(mtg => mtg === data);
                    user.meetings.splice(index, 1);
                } else {
                    user.meetings = [];
                }
                break;
            case "contacts":
                if (data) {
                    index = user.contacts.findIndex(con => con === data);
                    user.contacts.splice(index, 1);
                } else {
                    user.contacts = [];
                }
                break;
            case "toDos":
                if (data) {
                    index = user.toDos.findIndex(todo => todo === data);
                    user.toDos.splice(index, 1);
                } else {
                    user.toDos = [];
                }
                break;
        }
        localStorage.setItem(user.username, JSON.stringify(user));
    }
};

