function createScope() {
    function formatThreadId(id) {
        var node = $("<span>");
        node.addClass("badge")

        if (id == 0) {
            node.append("root")
        } else {
            node.append("#");
            node.append(String(id));
        }

        return node;
    }

    function formatTime(time) {
        return time.toFixed(2) + "s";
    }

    return {
        formatThreadId: formatThreadId,
        formatTime: formatTime
    };
}

$(document).ready(function() {
    var scope = createScope();
    var connection = createConnection();
    var model = createModel(connection);
    createConsole(scope, connection);
    createThreads(scope, connection);
    createWorkers(connection, model);

    var hostInput = $("#host_input");
    var connectButton = $("#connect_button");
    var exampleButton = $("#example_button");
    var resetButton = $("#reset_button");

    if (window.location.hostname != "")
        hostInput.val(window.location.hostname);

    connectButton.click(function () {
        hostInput.attr("disabled", "disabled");
        connectButton.attr("disabled", "disabled");
        exampleButton.attr("disabled", "disabled");
        resetButton.removeAttr("disabled");
        connection.connect(hostInput.val());
    });

    exampleButton.click(function () {
        hostInput.val("example");
        connectButton.click();
    });

    resetButton.click(function () {
        hostInput.removeAttr("disabled");
        connectButton.removeAttr("disabled");
        exampleButton.removeAttr("disabled");
        resetButton.attr("disabled", "disabled");
        connection.reset();
    });
});
