$(document).ready(function() {
    var navbarDiv = $(".navbar");
    var statsDiv = $("#stats");
    var consoleDiv = $("#console");
    var threadsDiv = $("#threads");
    var workersDiv = $("#workers");

    function layout() {
        var top = String(navbarDiv.height() + 10) + "px";
        var bottom = String(workersDiv.height() + 30) + "px";

        statsDiv.css("top", top);

        consoleDiv.css("top", String(navbarDiv.height() + 10 + statsDiv.height() + 10) + "px");
        consoleDiv.css("bottom", bottom);

        threadsDiv.css("top", top);
        threadsDiv.css("bottom", bottom);
    }

    $(window).resize(layout);
    layout();
})
