function createWorkers(connection) {
    var workersDiv = $("#workers");
    var workersCanvas = $("#workers canvas");

    var threadStartTimes = {};
    var threadFinishTimes = {};

    var maxFinishTime = 0;

    var workers = [];
    var workerThreads = {};

    var possibleColours = ["#edd400", "#f57900", "#c17d11", "#73d216",
        "#3465a4", "#75507b", "#cc0000"];

    var colourIndex = 0;

    var threadColours = {};

    function onThreadStarted(message) {
        threadStartTimes[message.thread] = message.time;

        var threads = workerThreads[message.worker];

        if (threads == undefined) {
            threads = [];
            workerThreads[message.worker] = threads;
            workers.push(message.worker);
        }

        threads.push(message.thread);

        threadColours[message.thread] = possibleColours[colourIndex % possibleColours.length];
        colourIndex++;

        paint();
    }

    function onThreadFinished(message) {
        threadFinishTimes[message.thread] = message.time;

        if (message.time > maxFinishTime)
            maxFinishTime = message.time;

        paint();
    }

    function onReset() {
        for (thread in threadStartTimes)
            delete threadStartTimes[thread];

        for (thread in threadFinishTimes)
            delete threadFinishTimes[thread];

        maxFinishTime = 0;

        workers.length = 0;

        for (thread in workerThreads)
            delete workerThreads[thread];

        paint();
    }

    function drawTextAt(context, text, x, y, h) {
        var m = context.measureText(text);
        context.fillText(text, x - (m.width/2), y + (h/2) - 3);
    }

    var diagramMode = false;

    function paint() {
        context = workersCanvas[0].getContext("2d");

        var w = workersCanvas[0].width;
        var h = workersCanvas[0].height;

        var gutter = 20;

        var workerH = (h - gutter) / workers.length;
        var wPerSecond = w / maxFinishTime;

        context.clearRect(0, 0, w, h);

        context.beginPath();
        
        for (t = 1; t < maxFinishTime; t++) {
            context.moveTo(t * wPerSecond, 0);
            context.lineTo(t * wPerSecond, h);
        }

        if (diagramMode)
            context.strokeStyle = "#000000";
        else
            context.strokeStyle = "#babdb6";

        context.stroke();

        if (diagramMode)
            context.fillStyle = "#000000";
        else
            context.fillStyle = "#babdb6";

        for (t = 1; t < maxFinishTime; t++) {
            context.fillText(String(t) + "s", t * wPerSecond + 2, h - 2);
        }

        var deferText = [];

        for (n = 0; n < workers.length; n++) {
            var worker = workers[n];
            var threads = workerThreads[worker];

            for (i = 0; i < threads.length; i++) {
                (function(i) {
                    var thread = threads[i];

                    var start = threadStartTimes[thread];
                    var finish = threadFinishTimes[thread];

                    if (finish == undefined) {
                    } else {
                        var duration = finish - start;

                        var tx = start * wPerSecond;
                        var ty = n * workerH;
                        var tw = duration * wPerSecond;
                        var th = workerH;

                        if (tw < 5)
                            return;

                        context.fillStyle = threadColours[thread];
                        context.fillRect(tx, ty, tw, th);

                        context.strokeStyle = "#000000";
                        context.strokeRect(tx, ty, tw, th);

                        deferText.push(function() {
                            context.fillStyle = "#000000";
                            drawTextAt(context, "#" + String(thread), tx + (tw/2), ty + (th/2) + 2, 10);

                            context.fillStyle = "#ffffff";
                            drawTextAt(context, "#" + String(thread), tx + (tw/2), ty + (th/2) + 1, 10);
                        });
                    }
                })(i);
            }
        }

        function apply(f) {
            return f();
        }

        context.font = "bold 10px";

        if (!diagramMode)
            _.map(deferText, apply);
    }

    function sizeCanvas() {
        var w = workersDiv.width() - 40;
        var h = workersDiv.height() - 40;

        workersCanvas.attr("width", w);
        workersCanvas.attr("height", h);

        paint();
    }

    $(window).resize(sizeCanvas);
    sizeCanvas();

    window.diagramShot = function() {
        $("#workers div").removeClass("well");
        diagramMode = true;
        paint();
    }

    connection.addListener(function(message) {
        switch (message.message) {
            case 'thread-started':
                onThreadStarted(message);
                break;

            case 'thread-finished':
                onThreadFinished(message);
                break;

            case 'reset':
                onReset();
                break;
        }
    });

    return undefined;
}
