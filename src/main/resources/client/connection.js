function createConnection() {
    var connected = false;

    var listeners = [];

    /*
        Messages are of the form:

            {message: 'connected'}
            {message: 'finished'}
            {message: 'info', message: s}
            {message: 'error', message: s}
            {message: 'thread-created', parent: i, child: i, time: t}
            {message: 'token-passed', from: i, to: i, arg: n, time: t}
            {message: 'thread-started', thread: i, worker: w, time: t}
            {message: 'thread-finished', thread: i, time: t}
            {message: 'reset'}
    */

    function addListener(listener) {
        listeners.push(listener);
    }

    function broadcast(message) {
        _.map(listeners, function(listener) {
            listener(message)
        })
    }

    function info(message) {
        broadcast({message: 'info', text: message});
    }

    function error(message) {
        broadcast({message: 'error', text: message});
    }

    function connect(host) {
        info("connecting to " + host);

        if (host == "example") {
            var messages = exampleTrace;

            for (n = 0; n < messages.length; n++) {
                (function(n) {
                    _.delay(function() { broadcast(messages[n]) }, 1500 + n * 100);
                })(n);
            }
        } else {
            var webSocket = new WebSocket("ws://" + host + ":8080/socket");

            webSocket.onmessage = function(message) {
                var object = JSON.parse(message.data)
                
                if (object.message != undefined)
                    broadcast(object)
            }

            addListener(function(message) {
                if (message.message == 'reset') {
                    webSocket.disconnect
                }
            });
        }
    }

    function reset() {
        broadcast({message: 'reset'});
    }

    return {
        addListener: addListener,
        connect: connect,
        reset: reset
    };
}
