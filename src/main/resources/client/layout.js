$(document).ready(function() {
    var navbarDiv = $(".navbar");
    var consoleDiv = $("#console");
    var threadsDiv = $("#threads");
    var workersDiv = $("#workers");

    function layout() {
        var top = String(navbarDiv.height() + 10) + "px";
        var bottom = String(workersDiv.height() + 30) + "px";

        consoleDiv.css("top", top);
        consoleDiv.css("bottom", bottom);

        threadsDiv.css("top", top);
        threadsDiv.css("bottom", bottom);
    }

    $(window).resize(layout);
    layout();
})
