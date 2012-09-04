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
    */

    function addListener(listener) {
        listeners.push(listener);
    }

    var messageQueue = [];

    function broadcast(message) {
        messageQueue.push(message);
        broadcastQueue();
    }

    var broadcastQueue = _.throttle(function() {
        _.map(messageQueue, function(message) {
            _.map(listeners, function(listener) { listener(message); });
        });

        messageQueue.length = 0;
    }, 250);

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

                _.delay(function() {
                    broadcast(message);
                    pushMessage(n + 1, messageTime);
                }, (messageTime - time) * 1000)
            }

            _.delay(function() { pushMessage(0, 0); }, 1000)
        } else {
            var webSocket = new WebSocket("ws://" + host + ":8080/socket");

            webSocket.onmessage = function(message) {
                var object = JSON.parse(message.data)
                
                if (object.message != undefined)
                    broadcast(object)
            }
        }
    }

    return {
        addListener: addListener,
        connect: connect
    };
}
