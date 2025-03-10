class Network{
    
    constructor() {
        this.delay = Math.floor(Math.random() * 3) + 1;
        this.aborted = false;
        
    }

    send(method, file, destination, data, callback) {
        let response;
        if (this.aborted) return;

        setTimeout(() => {

            if (!this.aborted) {
                if (destination === "server1") {
                    console.log("in network, sending to server");
                    response = server1.processRequest(method,file, data);
                }
        
                if (destination === "server2") {
                    response = server2.processRequest(method, file, data);
                }
    
                callback(response);
            }
        
        }, this.delay*1000);
        
    }

    abort() {
        this.aborted = true;
    }
}
