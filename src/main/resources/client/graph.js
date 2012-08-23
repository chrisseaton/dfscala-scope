function createGraph(scope, connection, model) {
    var graphDiv = $("#graphcanvas");
    var graphCanvas = Raphael("graphcanvas", 100, 100);

    var update = _.throttle(function() {
        var threads = model.getThreads();
        var previous = [0];

        var groups = [];

        while (previous.length < threads.length) {
            var group = nextGroup(threads, previous);
            groups.push(group);
            _.each(group, function(t) { previous.push(t) } );
        }

        var w = graphDiv.width();
        var h = graphDiv.height();

        var margin = 10;

        var nodeXCount = _.max(_.map(groups, function(g) { return g.length; }));
        var nodeYCount = groups.length;

        var nodeWidth = (w - margin) / (nodeXCount + margin);
        var nodeHeight = (h - margin) / (nodeYCount + margin * 4);

        graphCanvas.clear();

        var edgeOut = {};

        for (var groupN = 0; groupN < groups.length; groupN++) {
            var group = groups[groupN];

            var y = margin + groupN * (nodeHeight + margin * 4);

            for (var threadN = 0; threadN < group.length; threadN++) {
                var thread = group[threadN];

                var cellW = w / group.length;
                var x = threadN * cellW + cellW / 2;

                graphCanvas.rect(x, y, nodeWidth, nodeHeight);

                var edgeIn = "L" + String(x + nodeWidth / 2) + "," + String(y);

                var threadsIn = _.uniq(_.flatten([model.getParent(thread), model.getReceived(thread)]));

                _.each(threadsIn, function(threadIn) {
                    graphCanvas.path(edgeOut[threadIn] + edgeIn);
                });

                edgeOut[thread] = "M" + String(x + nodeWidth / 2) + "," + String(y + nodeHeight);
            }
        }
    }, 250);

    function nextGroup(threads, previous) {
        var remaining = _.difference(threads, previous);

        return _.filter(remaining, function(thread) {
            var before = _.flatten([model.getParent(thread), model.getReceived(thread)]);
            return _.all(before, function(b) { return _.include(previous, b) } );
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
                update();
                break;
        }
    });

    return undefined;
}
