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

function createConsole(scope, connection) {
    var consoleList = $("#console ol");

    connection.addListener(function(message) {
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
