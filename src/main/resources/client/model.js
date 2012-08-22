function createModel(connection) {
    var parents = {};
    var children = {};
    var received = {};
    var sent = {};
    var startTime = {};
    var finishTime = {};

    function onThreadCreated(message) {
        parents[message.child] = message.parent;
    }

    function onThreadStarted(message) {
        startTime[message.thread] = message.time;
    }

    function onThreadFinished(message) {
        finishTime[message.thread] = message.time;
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

    function onReset() {
        parents = {};
        children = {};
        receeived = {};
        sent = {};
        startTime = {};
        endTime = {};
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

            case 'reset':
                onReset();
                break;
        }
    });

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

    return {
        getParent: getParent,
        getChildren: getChildren,
        getReceived: getReceived,
        getSent: getSent,
        getStartTime: getStartTime,
        getFinishTime: getFinishTime
    };
}
