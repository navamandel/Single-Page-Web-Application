class FXMLHttpRequest {

    constructor() {
        this.status_ = 100;
        this.readyState_ = 0;
        this.response_ = null;
        this.onreadystatechange = null;
    }

    get status() {
        return this.status_;
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

    send(data = null) {
        this.readyState_ = 2;
        this.changeReadyStates("readystatechange");

        const sendToNetwork = new Network();
        
        setTimeout(() => {
            this.readyState_ = 3;
            this.changeReadyStates("readystatechange");

            let destination;
            if (this.file === "users") {
                destination = "server1";
            } else {
                destination = "server2";
            }
            

            let serverResponse = sendToNetwork.send(this.method, this.file, destination, data);
            
            if (serverResponse) {
                this.status_ = serverResponse["status"];
                this.response_ = JSON.stringify(serverResponse["response"]);

                this.readyState_ = 4;
                this.changeReadyStates("readystatechange");
            }
            
        }, 500);
    }

    changeReadyStates(eventName) {
        if (eventName === "readystatechange" && typeof this.onreadystatechange === "function") {
            this.onreadystatechange();
        }
    }  
}