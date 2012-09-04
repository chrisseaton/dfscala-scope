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

function createModel(connection) {
    var threads = [0];
    var parents = {0: undefined};
    var children = {};
    var received = {};
    var sent = {};
    var startTime = {};
    var finishTime = {};
    var workers = [];

    var maxTime = 0;
    var finished = false;

    function onThreadCreated(message) {
        threads.push(message.child);

        parents[message.child] = message.parent;

        var c = children[message.parent];

        if (c == undefined) {
            c = [];
            children[message.parent] = c;
        }

        c.push(message.child);
    }

    function onThreadStarted(message) {
        startTime[message.thread] = message.time;

        if (!_.include(workers, message.worker))
            workers.push(message.worker);

        if (message.time > maxTime)
            maxTime = message.time;
    }

    function onThreadFinished(message) {
        finishTime[message.thread] = message.time;

        if (message.time > maxTime)
            maxTime = message.time;
    }

    function onTokenPassed(message) {
        var r = received[message.to];

        if (r == undefined) {
            r = [];
            received[message.to] = r;
        }

        r.push(message.from);

        var s = sent[message.from];

        if (s == undefined) {
            s = [];
            sent[message.from] = s;
        }

        s.push(message.to);
    }

    connection.addListener(function(message) {
        switch (message.message) {
            case 'thread-created':
                onThreadCreated(message);
                break;

            case 'thread-started':
                onThreadStarted(message);
                break;

            case 'token-passed':
                onTokenPassed(message);
                break;

            case 'thread-finished':
                onThreadFinished(message);
                break;

            case 'finished':
                finished = true;
                break;
        }
    });

    function getThreads() {
        return threads;
    }

    function getParent(thread) {
        return parents[thread];
    }

    function getChildren(thread) {
        var c = children[thread];

        if (c == undefined)
            c = [];

        return c;
    }
    
    function getReceived(thread) {
        var r = received[thread];

        if (r == undefined)
            r = [];

        return r;
    }
    
    function getSent(thread) {
        var s = sent[thread];

        if (s == undefined)
            s = [];

        return s;
    }

    function getStartTime(thread) {
        return startTime[thread];
    }

    function getFinishTime(thread) {
        return finishTime[thread];
    }

    function getState(thread) {
        if (thread == 0) {
            if (finished)
                return "finished";
            else
                return "running";
        } else {
            if (startTime[thread] == undefined)
                return "waiting";
            else if (finishTime[thread] == undefined)
                return "running";
            else
                return "finished";
        }
    }

    function getWorkers() {
        return workers;
    }

    function getMaxTime() {
        return maxTime;
    }

    return {
        getThreads: getThreads,
        getParent: getParent,
        getChildren: getChildren,
        getReceived: getReceived,
        getSent: getSent,
        getStartTime: getStartTime,
        getFinishTime: getFinishTime,
        getState: getState,
        getWorkers: getWorkers,
        getMaxTime: getMaxTime
    };
}
