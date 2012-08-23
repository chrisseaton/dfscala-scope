function createWorkers(scope, connection, model) {
    var workersDiv = $("#workerscanvas");
    var workersCanvas = Raphael("workerscanvas", 100, 100);

    var maxTime = 0;

    var workers = [];
    var workerThreads = {};

    var possibleColours = ["#edd400", "#f57900", "#c17d11", "#73d216",
        "#3465a4", "#75507b", "#cc0000"];

    var colourIndex = 0;

    var threadColours = {};

    var threadRects = {};

    function onThreadStarted(message) {
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
        if (message.time > maxTime)
            maxTime = message.time;

        paint();
    }

    function onReset() {
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

        threadRects = {};

        var set = workersCanvas.setFinish()
        set.attr("text-anchor", "start");

        for (n = 0; n < workers.length; n++) {
            var worker = workers[n];
            var threads = workerThreads[worker];

            for (i = 0; i < threads.length; i++) {
                var thread = threads[i];

                var start = model.getStartTime(thread);
                var finish = model.getFinishTime(thread);

                var duration;

                if (finish == undefined)
                    duration = maxTime - start;
                else
                    duration = finish - start;

                var tx = start * wPerSecond + marginLeft;
                var ty = n * workerH + marginTop;
                var tw = duration * wPerSecond;
                var th = workerH;

                var rect;

                if (finish == undefined)
                    rect = workersCanvas.path("M" + String(tx) + "," + String(ty) + "l" + String(tw) + ",0l" + String(marginRight - 3) + "," + String(th / 2) + "l" + String(-(marginRight - 3)) + "," + String(th / 2) + "l" + String(-tw) + ",0l0," + String(-th) + "Z");
                else
                    rect = workersCanvas.rect(tx, ty, tw, th);

                rect.baseColour = threadColours[thread];
                rect.attr("fill", rect.baseColour);
                rect.attr("cursor", "pointer");

                threadRects[thread] = rect;

                (function(thread, rect) {
                    rect.hover(function() {
                        var parent = model.getParent(thread);
                        var children = model.getChildren(thread);
                        var received = model.getReceived(thread);
                        var sent = model.getSent(thread);

                        var bright = _.uniq(_.flatten([thread, parent, children, received, sent]));
                        var dim = _.difference(model.getThreads(), bright);

                        _.each(dim, function(t) {
                            var r = threadRects[t];
                            r.attr("fill", fade(r.baseColour));
                            r.attr("stroke", "#bbbbbb");
                        });

                        _.each(bright, function(t) {
                            var r = threadRects[t];
                            r.toFront();
                        });
                    }, function() {
                        _.each(model.getThreads(), function(t) {
                            var r = threadRects[t];
                            r.attr("fill", r.baseColour);
                            r.attr("stroke", "black");
                        });
                    });

                    rect.click(function() {
                        scope.highlightThread(thread);
                    });
                })(thread, rect);
            }
        }
    }

    function fade(colour) {
        var rgb = Raphael.getRGB(colour);
        var hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b);
        return Raphael.hsl(hsl.h, hsl.s / 2, hsl.l * 2);
    }

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
