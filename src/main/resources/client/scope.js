/*

Copyright (c) 2012, The University of Manchester
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of The University of Manchester nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE UNIVERSITY OF MANCHESTER BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

function createScope() {
    var highlighted = undefined;

    function formatThreadIdString(thread) {
        if (thread == 0)
            return "root";
        else
            return "#" + String(thread);
    }

    function formatThreadId(thread) {
        var node = $("<span>");
        node.append(formatThreadIdString(thread));
        node.addClass("badge");
        node.addClass("thread");
        node.addClass("thread" + String(thread));

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
        formatThreadIdString: formatThreadIdString,
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
    createGraph(scope, connection, model);
    createWorkers(scope, connection, model);

    var hostInput = $("#host_input");

    if (window.location.hostname != "")
        hostInput.val(window.location.hostname);

    var connectButton = $("#connect_button");
    var exampleButton = $("#example_button");

    var tableButton = $("#table_button");
    var graphButton = $("#graph_button");

    tableButton.click(function() {
        tableButton.addClass("active");
        graphButton.removeClass("active");
        $("#threads").css("z-index", "1");
        $("#graph").css("z-index", "0");
    });

    graphButton.click(function() {
        tableButton.removeClass("active");
        graphButton.addClass("active");
        $("#threads").css("z-index", "0");
        $("#graph").css("z-index", "1");
    });

    tableButton.click();

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
