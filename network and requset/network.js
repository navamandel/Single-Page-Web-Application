class Network{
    delay = Math.floor(Math.random() * 3) + 1;

    send(method, file, destination, data, callback) {
        let response;

        setTimeout(() => {
            if (destination === "server1") {
                console.log("in network, sending to server");
                response = server1.processRequest(method,file, data);
            }
    
            if (destination === "server2") {
                response = server2.processRequest(method, file, data);
            }

            if (callback) callback(response);
        }, this.delay*1000);
        

    }
}
