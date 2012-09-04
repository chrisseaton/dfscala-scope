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