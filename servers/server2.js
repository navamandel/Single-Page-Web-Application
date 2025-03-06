const server2 = {
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
            return {"status": 200, 
                    "status_text": this.status_codes[200], 
                    "response": dataToReturn};
        } else {
            return {"status": 404, 
                    "status_text": this.status_codes[404],
                    "response": this.status_codes[404]};
    }
    },

    POST: function(file, data) {
        let status = DB_API.add(file, data);
        return {"status": status, 
                "status_text": this.status_codes[status], 
                "response": this.status_codes[status]};
    },

    PUT: function(file, data) {
        let status = DB_API.update(file, data);
        return {"status": status, 
                "status_text": this.status_codes[status], 
                "response": this.status_codes[status]};
    },

    DELETE: function(file, data = null) {
        let status = DB_API.delete(file, data)
        return {"status": status, 
                "status_text": this.status_codes[status], 
                "response": this.status_codes[status]};
    }
};
