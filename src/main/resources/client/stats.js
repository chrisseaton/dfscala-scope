function createStats(connection, model) {
    var utilPc = $("#stats .util .pc");
    var utilBar = $("#stats .util .prog .progress .bar");

    var update = _.throttle(function() {
        var util = calcUtil();
        var utilPercentage = (util * 100).toFixed(2) + "%";
        
        utilPc.empty();
        utilPc.append(utilPercentage);

        utilBar.css("width", utilPercentage);
    }, 250);

    function calcUtil() {
        var times = _.map(model.getThreads(), function(thread) {
            var finish = model.getFinishTime(thread);
            var start = model.getStartTime(thread);

            if (finish != undefined && start != undefined)
                return finish - start;
            else
                return 0;
        });

        var totalTime = _.reduce(times, function(a, b) { return a + b; }, 0);

        var availableTime = model.getMaxTime() * model.getWorkers().length;

        return totalTime / availableTime;
    }

    connection.addListener(function(message) {
        switch (message.message) {
            case 'thread-started':
            case 'thread-finished':
                update();
                break;
        }
    });

    return undefined;
}