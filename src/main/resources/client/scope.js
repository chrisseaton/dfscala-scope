function createScope() {
    var highlighted = undefined;

    function formatThreadId(thread) {
        var node = $("<span>");
        node.addClass("badge");
        node.addClass("thread");
        node.addClass("thread" + String(thread));

        if (thread == 0) {
            node.append("root")
        } else {
            node.append("#");
            node.append(String(thread));
        }

        node.click(function() {
            highlightThread(thread);
        });

        return node;
    }

    function formatTime(time) {
        return time.toFixed(2) + "s";
    }

    function highlightThread(thread) {
        if (highlighted != undefined)
            $(".thread" + String(highlighted)).removeClass("badge-warning");

        $(".thread" + String(thread)).addClass("badge-warning");

        // This is out of place, really - should be in threads.js

        var firstThreadBadge = $("#threads .thread" + String(thread) + ".threadmain")[0];
        var firstThreadBadgeRow = firstThreadBadge.offsetParent;

        var container = $("#threads .well");

        if (firstThreadBadgeRow.offsetTop < container.scrollTop() || firstThreadBadgeRow.offsetTop > container.scrollTop() + container.height())
            container.scrollTop(firstThreadBadgeRow.offsetTop);

        highlighted = thread;
    }

    return {
        formatThreadId: formatThreadId,
        formatTime: formatTime,
        highlightThread: highlightThread
    };
}

$(document).ready(function() {
    var scope = createScope();
    var connection = createConnection();
    var model = createModel(connection);
    createStats(connection, model);
    createConsole(scope, connection);
    createThreads(scope, connection);
    createWorkers(scope, connection, model);

    var hostInput = $("#host_input");
    var connectButton = $("#connect_button");
    var exampleButton = $("#example_button");

    if (window.location.hostname != "")
        hostInput.val(window.location.hostname);

    connectButton.click(function () {
        hostInput.attr("disabled", "disabled");
        connectButton.attr("disabled", "disabled");
        exampleButton.attr("disabled", "disabled");
        connection.connect(hostInput.val());
    });

    exampleButton.click(function () {
        hostInput.val("example");
        connectButton.click();
    });
});
