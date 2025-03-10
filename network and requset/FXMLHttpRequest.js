class FXMLHttpRequest {

    constructor() {
        this.status_ = 100;
        this.status_text_ = "REQUEST_NOT_READY";
        this.readyState_ = 0;
        this.response_ = null;
        this.onreadystatechange = null;
        this.timeout = 2.7*10000000;
    }

    get status() {
        return this.status_;
    }

    get status_text() {
        return this.status_text_;
    }

    get readyState() {
        return this.readyState_;
    }

    get response() {
        return this.response_;
    }

    open(method, file) {
        this.method = method;
        this.file = file;
        this.readyState_ = 1;
    }

    send(data = null, callback) {
        this.readyState_ = 2;
        this.changeReadyStates("readystatechange");

        const sendToNetwork = new Network();
        
        this.readyState_ = 3;
        this.changeReadyStates("readystatechange");

        console.log(this.file);
        let destination = (this.file === "tasks" || this.file === "courses") ? "server2" : "server1";
            

        console.log("sending to network");

        setTimeout(() => {
            if (this.readyState !== 4) {
                this.status_ = 408;
                this.status_text_ = "REQUEST ABORTED";
                this.readyState_ = 4;
                this.changeReadyStates("readystatechange"); 
                console.log("timeout has occured ", this.timeout);

                sendToNetwork.abort();
            }
            
        }, this.timeout*1000);

        sendToNetwork.send(this.method, this.file, destination, data, (serverResponse) => {
            console.log(serverResponse);
            
            if (serverResponse) {
                console.log("received response from network");
                this.status_ = serverResponse["status"];
                this.status_text_ = serverResponse["status_text"];
                this.response_ = serverResponse["response"];

            }
            this.readyState_ = 4;
            this.changeReadyStates("readystatechange"); 
            console.log(this.method, this.file);
                
         });

        

            
    }

    changeReadyStates(eventName) {
        if (eventName === "readystatechange" && typeof this.onreadystatechange === "function") {
            this.onreadystatechange();
        }
    }  
}
