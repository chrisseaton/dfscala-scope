function createGraph(scope, connection) {
    function onThreadCreated(message) {
    }

    function onTokenPassed(message) {
    }

    connection.addListener(function(message) {
        switch (message.message) {
            case 'thread-created':
                onThreadCreated(message);
                break;

            case 'token-passed':
                onTokenPassed(message);
                break;
        }
    });

    return undefined;
}
