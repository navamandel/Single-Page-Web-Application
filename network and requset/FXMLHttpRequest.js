class FXMLHttpRequest {

    constructor() {
        this.status_ = 100;
        this.status_text_ = "REQUEST_NOT_READY";
        this.readyState_ = 0;
        this.response_ = null;
        this.onreadystatechange = null;
        this.delay = Math.floor(Math.random * 3) + 1;
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
        console.log("fajax");
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
            if (this.file === ("tasks" || "courses")) {
                destination = "server2";
            } else {
                destination = "server1";
            }

            console.log("sending to network");
            let serverResponse = sendToNetwork.send(this.method, this.file, destination, data);
            
            if (serverResponse) {
                console.log("received response from network");
                this.status_ = serverResponse["status"];
                this.status_text_ = serverResponse["status_text"];
                this.response_ = serverResponse["response"];

                this.readyState_ = 4;
                this.changeReadyStates("readystatechange");
            }
            
        }, this.delay*1000);
    }

    changeReadyStates(eventName) {
        if (eventName === "readystatechange" && typeof this.onreadystatechange === "function") {
            this.onreadystatechange();
        }
    }  
}
