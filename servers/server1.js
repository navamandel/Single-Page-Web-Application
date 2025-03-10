const server1 = {
    status_codes: {
        404: "ERROR_NOT_FOUND",
        401: "ERROR_USER_DATA",
        402: "ERROR_DATA_EXISTS",
        200: "SUCCESS"
    },

    processRequest: function(method, file, data) {
        
        if (method === "GET") {
            return this.GET(file);
        } else if (method === "POST") {
            return this.POST(data);
        } else if (method === "PUT") {
            return this.PUT(data);
        } else if (method === "DELETE") {
            return this.DELETE(data);
        } 
        
    },

    GET: function(data) {
        console.log("in server, getting data from db");
        const users = DB_API1.get(data);
        if (users) {
            return {"status": 200, 
                    "status_text": this.status_codes[200], 
                    "response": users};
        } else {
            return {"status": 404, 
                    "status_text": this.status_codes[404],
                    "response": this.status_codes[404]};
        }
    },

    POST: function(data) {
        let status = DB_API1.add("users", data);
        return {"status": status, 
                "status_text": this.status_codes[status], 
                "response": this.status_codes[status]};
        
    },

    PUT: function(data) {
        /*const users = DB_API.get("users");
        if (data.updated.username && users.find(usr => usr === data.updated.username)) {
            return {"status": this.status_codes["ERROR_DATA_EXISTS"], "response": "ERROR_DATA_EXISTS"}; 
        } else {
            DB_API.update("users", data);
            return {"status": this.status_codes["SUCCESS"], "response": "SUCCESS"};
        }*/

       let status = DB_API1.update(data);
       return {"status": status, 
               "status_text": this.status_codes[status], 
               "response": this.status_codes[status]};
    },

    DELETE: function(data) {
        let status = DB_API1.delete("users", data);
        return {"status": status, 
                "status_text": this.status_codes[status], 
                "response": this.status_codes[status]};
    }
};
