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

function createWorkers(scope, connection, model) {
    var workersDiv = $("#workerscanvas");
    var workersCanvas = Raphael("workerscanvas", 100, 100);

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
        }

        threads.push(message.thread);

        threadColours[message.thread] = possibleColours[colourIndex % possibleColours.length];
        colourIndex++;

        update();
    }

    function onThreadFinished(message) {
        update();
    }

    function drawTextAt(context, text, x, y, h) {
        var m = context.measureText(text);
        context.fillText(text, x - (m.width/2), y + (h/2) - 3);
    }

    var update = _.throttle(function() {
        var workers = model.getWorkers();
        var maxTime = model.getMaxTime();

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
                            if (r != null) {
                                r.attr("fill", fade(r.baseColour));
                                r.attr("stroke", "#bbbbbb");
                            }
                        });

                        _.each(bright, function(t) {
                            var r = threadRects[t];
                            if (r != null)
                                r.toFront();
                        });
                    }, function() {
                        _.each(model.getThreads(), function(t) {
                            var r = threadRects[t];
                            if (r != null) {
                                r.attr("fill", r.baseColour);
                                r.attr("stroke", "black");
                            }
                        });
                    });

                    rect.click(function() {
                        scope.highlightThread(thread);
                    });
                })(thread, rect);
            }
        }
    }, 250);

    function fade(colour) {
        var rgb = Raphael.getRGB(colour);
        var hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b);
        return Raphael.hsl(hsl.h, hsl.s / 2, hsl.l * 2);
    }

    function sizeCanvas() {
        workersCanvas.setSize(workersDiv.width(), workersDiv.height());
        update();
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
        }
    });

    return undefined;
}
