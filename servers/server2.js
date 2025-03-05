const server2 = {
    status_codes: {
        "ERROR_NOT_FOUND": 404,
        "ERROR_USER_DATA": 401,
        "ERROR_DATA_EXISTS": 402,
        "SUCCESS": 200
    },

    processRequest: function(method, file, data) {
        if (method === "GET") {
            return this.GET(file);
        } else if (method === "POST") {
            return this.POST(file, data);
        } else if (method === "PUT") {
            return this.PUT(file, data);
        } else if (method === "DELETE") {
            return this.DELETE(file, data);
        }
    },

    GET: function(file) {
        let dataToReturn = DB_API.get(file);

        if (dataToReturn) {
            return {"status": this.status_codes["SUCCESS"], "response": dataToReturn};
        } else {
            return {"status": this.status_codes["ERROR_NOT_FOUND"], "response": "ERROR_NOT_FOUND"}
        }
    },

    POST: function(file, data) {
        DB_API.add(file, data)
        return {"status": this.status_codes["SUCCESS"], "response": "SUCCESS"}; 
    },

    PUT: function(file, data) {
        DB_API.update(file, data)
        return {"status": this.status_codes["SUCCESS"], "response": "SUCCESS"};
    },

    DELETE: function(file, data = null) {
        DB_API.delete(file, data)
        return {"status": this.status_codes["SUCCESS"], "response": "SUCCESS"};
    }
};
