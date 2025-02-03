class FXMLHttpRequest {
    constructor() {
        this.status_ = 100;
        this.readyState_ = 0;
        this.serverRequest = null;
        this.response = null;
    }

    get status() {
        return this.status_;
    }

    get readyState() {
        return this.readyState_;
    }

    open(method, file) {
        this.serverRequest = {
            "method": method,
            "file": file
        };
    }

    readystatechange() {
        
    }

    send() {
        if (this.serverRequest["file"] === "users") {
            if (this.serverRequest["method"] === 'GET');
            this.readyState_ = 1;
            this.response = server1.GET();
            if (this.response) this.readyState_ = 4;
            if (!this.response) this.readyState_ = 3;
        }
    }

    
}