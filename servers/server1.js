const server1 = {
    status_codes: {
        "ERROR_NOT_FOUND": 404,
        "ERROR_USER_DATA": 401,
        "ERROR_DATA_EXISTS": 402,
        "SUCCESS": 200
    },

    processRequest: function(method, data) {
        
        if (method === "GET") {
            return this.GET(data);
        } else if (method === "POST") {
            return this.POST(data);
        } else if (method === "PUT") {
            return this.PUT(data);
        } else if (method === "DELETE") {
            return this.DELETE(data);
        } 
        
    },

    GET: function(data) {
        const users = DB_API.get("users");
        if (users) {
            console.log("it's in server");
            return {"status": this.status_codes["SUCCESS"], "response": users};
        } else {
            return {"status": this.status_codes["ERROR_NOT_FOUND"], "response": "ERROR_NOT_FOUND"};
        }
    },

    POST: function(data) {
        
        DB_API.add("users", data);
        return {"status": this.status_codes["SUCCESS"], "response": "SUCCESS"};
        
    },

    PUT: function(data) {
        const users = DB_API.get("users");
        if (data.updated.username && users.find(usr => usr === data.updated.username)) {
            return {"status": this.status_codes["ERROR_DATA_EXISTS"], "response": "ERROR_DATA_EXISTS"}; 
        } else {
            DB_API.update("users", data);
            return {"status": this.status_codes["SUCCESS"], "response": "SUCCESS"};
        }
    },

    DELETE: function(data) {
        DB_API.delete("users", data);
        return {"status": this.status_codes["SUCCESS"], "response": "SUCCESS"};
    }
};
