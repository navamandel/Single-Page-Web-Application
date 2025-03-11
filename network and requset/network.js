class Network{
    
    constructor() {
        this.delay = Math.floor(Math.random() * 3) + 1;
        this.reqDropped = Math.random();
        this.aborted = this.reqDropped < 0.2;
    }

    send(method, file, destination, data, callback) {
        let response;
        if (this.aborted) callback({"status": 408, "status_text": "ERROR_REQUEST_TIMEOUT", "response": "ERROR_REQUEST_TIMEOUT"});

        setTimeout(() => {

            if (!this.aborted) {
                if (destination === "server1") {
                    response = server1.processRequest(method,file, data);
                }
        
                if (destination === "server2") {
                    response = server2.processRequest(method, file, data);
                }
    
                callback(response);
            }
        
        }, this.delay*1000);
        
    }

}
