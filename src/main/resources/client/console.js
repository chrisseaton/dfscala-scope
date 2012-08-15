function createConsole(scope, connection) {
    var consoleList = $("#console ol");

    connection.addListener(function(message) {
        if (message.message == 'reset') {
            consoleList.empty();
            return;
        }

        var li = $("<li>");

        switch (message.message) {
            case 'connected':
                li.append("connected");
                break;

            case 'finished':
                li.append("dataflow program finished");
                break;

            case 'info':
                li.append("info: ");
                li.append(String(message.text));
                break;

            case 'error':
                li.append("error: ");
                li.append(String(message.text));
                break;

            case 'thread-created':
                li.append(scope.formatTime(message.time));
                li.append(" ");
                li.append(scope.formatThreadId(message.child));
                li.append(" created from ");
                li.append(scope.formatThreadId(message.parent));
                break;

            case 'token-passed':
                li.append(scope.formatTime(message.time));
                li.append(" ");
                li.append(scope.formatThreadId(message.from));
                li.append(" to ");
                li.append(scope.formatThreadId(message.to));
                li.append(" arg ");
                li.append(String(message.arg));
                break;

            case 'thread-started':
                li.append(scope.formatTime(message.time))
                li.append(" ");
                li.append(scope.formatThreadId(message.thread));
                li.append(" started");
                break;

            case 'thread-finished':
                li.append(scope.formatTime(message.time))
                li.append(" ");
                li.append(scope.formatThreadId(message.thread));
                li.append(" finished");
                break;
        }

        consoleList.prepend(li);
    });

    return undefined;
}
