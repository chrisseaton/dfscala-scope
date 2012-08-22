function createWorkers(connection) {
    var workersDiv = $("#workerscanvas");
    var workersCanvas = Raphael("workerscanvas", 100, 100);

    var threadStartTimes = {};
    var threadFinishTimes = {};

    var maxTime = 0;

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

        if (message.time > maxTime)
            maxTime = message.time;

        paint();
    }

    function onThreadFinished(message) {
        threadFinishTimes[message.thread] = message.time;

        if (message.time > maxTime)
            maxTime = message.time;

        paint();
    }

    function onReset() {
        for (thread in threadStartTimes)
            delete threadStartTimes[thread];

        for (thread in threadFinishTimes)
            delete threadFinishTimes[thread];

        maxTime = 0;

        workers.length = 0;

        for (thread in workerThreads)
            delete workerThreads[thread];

        paint();
    }

    function drawTextAt(context, text, x, y, h) {
        var m = context.measureText(text);
        context.fillText(text, x - (m.width/2), y + (h/2) - 3);
    }

    function paint() {
        var w = workersDiv.width();
        var h = workersDiv.height();
        
        var marginTop = 5;
        var marginLeft = 5;
        var marginBottom = 20;
        var marginRight = 30;

        var workerH = (h - marginTop - marginBottom) / workers.length;
        var wPerSecond = (w - marginLeft - marginRight) / maxTime;

        workersCanvas.clear();

        var path = "";

        for (t = 1; t < maxTime; t++)
            path += "M" + String(t * wPerSecond) + ",0L" + String(t * wPerSecond) + "," + String(h);

        workersCanvas.path(path)

        workersCanvas.setStart();

        for (t = 1; t < maxTime; t++)
            var text = workersCanvas.text(t * wPerSecond + 5, h - marginBottom + 10, String(t) + "s")

        var set = workersCanvas.setFinish()
        set.attr("text-anchor", "start");

        for (n = 0; n < workers.length; n++) {
            var worker = workers[n];
            var threads = workerThreads[worker];

            for (i = 0; i < threads.length; i++) {
                var thread = threads[i];

                var start = threadStartTimes[thread];
                var finish = threadFinishTimes[thread];

                var duration;

                if (finish == undefined)
                    duration = maxTime - start;
                else
                    duration = finish - start;

                var tx = start * wPerSecond + marginLeft;
                var ty = n * workerH + marginTop;
                var tw = duration * wPerSecond;
                var th = workerH;

                var rect

                if (finish == undefined) {
                    console.log("M" + String(tx) + "," + String(ty) + "l" + String(tw) + ",0l" + String(marginRight - 3) + "," + String(th / 2) + "l" + String(-(marginRight - 3)) + "," + String(-(th / 2)) + "l" + String(-tw) + ",0l0," + String(-th) + "Z");
                    rect = workersCanvas.path("M" + String(tx) + "," + String(ty) + "l" + String(tw) + ",0l" + String(marginRight - 3) + "," + String(th / 2) + "l" + String(-(marginRight - 3)) + "," + String(th / 2) + "l" + String(-tw) + ",0l0," + String(-th) + "Z");
                } else
                    rect = workersCanvas.rect(tx, ty, tw, th);

                rect.attr("fill", threadColours[thread]);
            }
        }
    }


        /*context = workersCanvas[0].getContext("2d");

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
            _.map(deferText, apply);*/

    function sizeCanvas() {
        workersCanvas.setSize(workersDiv.width(), workersDiv.height());
        paint();
    }

    $(window).resize(sizeCanvas);
    sizeCanvas();

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
