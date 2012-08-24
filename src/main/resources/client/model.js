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
        getWorkers: getWorkers,
        getMaxTime: getMaxTime
    };
}
