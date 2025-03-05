class Network{

    send(method, file, destination, data = null) {
        if (destination === "server1") {
            
            return server1.processRequest(method, data);
            
        }

        if (destination === "server2") {
            
            return server2.processRequest(method, file, data);
         
        }

    }
}
