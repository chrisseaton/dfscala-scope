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

function createThreads(scope, connection) {
    var threadsTable = $("#threads table");
    var threadsTableBody = $("#threads table tbody");

    var perThread = {};

    function onThreadCreated(message) {
        var tr = $("<tr>");

        var main = scope.formatThreadId(message.child);
        main.addClass("threadmain");
        tr.append($("<td>").append(main));

        tr.append($("<td>").append(scope.formatThreadId(message.parent)));
        
        var received = $("<td>");
        tr.append(received);

        var sent = $("<td>");
        tr.append(sent);

        var children = $("<td>");
        tr.append(children);

        tr.append($("<td>").append(scope.formatTime(message.time)));

        var started = $("<td>");
        tr.append(started);

        var finished = $("<td>");
        tr.append(finished);

        var duration = $("<td>");
        tr.append(duration);

        var state = $("<td>");
        state.append($("<span>").addClass("badge").addClass("badge-warning").append("waiting"));
        tr.append(state);

        threadsTableBody.append(tr);

        perThread[message.child] = {
            children: children,
            
            received: received,
            receivedSet: [],
            
            sent: sent,
            sentSet: [],

            started: started,
            startTime: 0,
            
            finished: finished,
            
            duration: duration,
            
            state: state,
        }

        if (message.parent != 0) {
            var parentEntry = perThread[message.parent];
            parentEntry.children.append(" ");
            parentEntry.children.append(scope.formatThreadId(message.child));
        }
    }

    function onThreadStarted(message) {
        var entry = perThread[message.thread];

        entry.started.append(scope.formatTime(message.time));
        entry.startTime = message.time;

        entry.state.empty();
        entry.state.append($("<span>").addClass("badge").addClass("badge-success").append("running"));
    }

    function onTokenPassed(message) {
        if (message.from != 0) {
            var fromEntry = perThread[message.from];
            
            if (!_.include(fromEntry.sentSet, message.to)) {
                fromEntry.sent.append(" ");
                fromEntry.sent.append(scope.formatThreadId(message.to));
                fromEntry.sentSet.push(message.to);
            }
        }

        if (message.to != 0) {
            var toEntry = perThread[message.to];

            if (!_.include(toEntry.receivedSet, message.from)) {
                toEntry.received.append(" ");
                toEntry.received.append(scope.formatThreadId(message.from));
                toEntry.receivedSet.push(message.from);
            }
        }
    }

    function onThreadFinished(message) {
        var entry = perThread[message.thread];

        entry.finished.append(scope.formatTime(message.time));
        entry.duration.append(scope.formatTime(message.time - entry.startTime));
        
        entry.state.empty();
        entry.state.append($("<span>").addClass("badge").addClass("badge-info").append("finished"));
    }

    connection.addListener(function(message) {
        switch (message.message) {
            case 'thread-created':
                onThreadCreated(message);
                break;

            case 'token-passed':
                onTokenPassed(message);
                break;

            case 'thread-started':
                onThreadStarted(message);
                break;

            case 'thread-finished':
                onThreadFinished(message);
                break;
        }
    });

    return undefined;
}
