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

            function pushMessage(n, time) {
                if (n == messages.length)
                    return;

                var message = messages[n];

                var messageTime = message.time;

                if (messageTime == undefined)
                    messageTime = time;

                //_.delay(function() {
                    broadcast(message);
                    pushMessage(n + 1, messageTime);
                //}, (messageTime - time) * 1000)
            }

            _.delay(function() { pushMessage(0, 0); }, 1000)
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
