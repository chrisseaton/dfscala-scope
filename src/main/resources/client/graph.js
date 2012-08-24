function createGraph(scope, connection, model) {
    var graphDiv = $("#graphcanvas");
    var graphCanvas = Raphael("graphcanvas", 100, 100);

    var stateColour = {
        waiting: "#F89406",
        running: "#468847",
        finished: "#3A87AD"
    }

    var update = _.throttle(function() {
        var threads = model.getThreads();

        var before = {};

        _.each(threads, function(thread) {
            var parent = model.getParent(thread);
            var received = model.getReceived(thread);
            before[thread] = _.uniq(_.without(_.flatten([parent, received]), undefined));
        });

        var previous = [];
        var groups = [];

        while (previous.length < threads.length) {
            var group = nextGroup(threads, previous, before);
            groups.push(group);
            _.each(group, function(t) { previous.push(t) } );
        }

        var w = graphDiv.width();
        var h = graphDiv.height();

        var margin = 10;

        var nodeXCount = _.max(_.map(groups, function(g) { return g.length; }));
        var nodeYCount = groups.length;

        var nodeCellWidth = (w - 2 * margin) / nodeXCount;
        var nodeCellHeight = (h - 2 * margin) / nodeYCount;

        var nodeWidth = 0.75 * nodeCellWidth;
        var nodeHeight = (1/3) * nodeCellHeight;

        graphCanvas.clear();

        var edgesOut = {};

        for (var groupN = 0; groupN < groups.length; groupN++) {
            var group = groups[groupN];

            var y = margin + groupN * nodeCellHeight;

            var threadWeights = {};

            _.each(group, function(thread) {
                var threadBefore = before[thread];
                threadWeights[thread] = median(_.map(threadBefore, function(b) { return edgesOut[b].x }));
            });

            var sortedGroup = _.sortBy(group, function(t) { return threadWeights[t]; });

            for (var threadN = 0; threadN < sortedGroup.length; threadN++) {
                var thread = sortedGroup[threadN];

                var rowNodeCellWidth = (w - 2 * margin) / sortedGroup.length;
                var x = threadN * rowNodeCellWidth + rowNodeCellWidth / 2 - nodeWidth / 2;

                var node = graphCanvas.rect(x, y, nodeWidth, nodeHeight);
                node.attr("fill", stateColour[model.getState(thread)]);

                var edgeIn = {x: x + nodeWidth / 2, y: y};

                _.each(before[thread], function(threadIn) {
                    var out = edgesOut[threadIn];
                    graphCanvas.path("M" + String(out.x) + "," + String(out.y) + "L" + String(edgeIn.x) + "," + String(edgeIn.y));
                });

                edgesOut[thread] = {x: x + nodeWidth / 2, y : y + nodeHeight};
            }
        }
    }, 250);

    function sum(l) {
        return _.reduce(l, function(a, b) { return a + b; }, 0);
    }

    function mean(l) {
        return sum(l) / l.length;
    }

    function median(l) {
        var m = Math.floor(l.length / 2);

        if (l.length % 2 == 0)
            return mean([l[m], l[m + 1]]);
        else
            return l[m];
    }

    function nextGroup(threads, previous, before) {
        var remaining = _.difference(threads, previous);

        return _.filter(remaining, function(thread) {
            return _.all(before[thread], function(b) { return _.include(previous, b) } );
        });
    }

    function sizeCanvas() {
        graphCanvas.setSize(graphDiv.width(), graphDiv.height());
        update();
    }

    $(window).resize(sizeCanvas);
    sizeCanvas();

    connection.addListener(function(message) {
        switch (message.message) {
            case 'thread-created':
            case 'thread-started':
            case 'token-passed':
            case 'thread-finished':
                update();
                break;
        }
    });

    return undefined;
}
