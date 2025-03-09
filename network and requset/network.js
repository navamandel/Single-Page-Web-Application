class Network{
    delay = Math.floor(Math.random * 3) + 1;

    send(method, file, destination, data = null) {

        setTimeout(() => {
            if (destination === "server1") {
                console.log("in network, sending to server");
                return server1.processRequest(method, data);
            }
    
            if (destination === "server2") {
                return server2.processRequest(method, file, data);
            }
        }, this.delay*1000);
        

    }
}
