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

var exampleTrace = [
    {"message":"connected"},
    {"message":"thread-created","parent":0,"child":1,"time":0.7391},
    {"to":1,"from":0,"message":"token-passed","time":0.763581,"arg":1},
    {"message":"thread-started","thread":1,"worker":"pool-7-thread-1","time":0.805363},
    {"message":"thread-created","parent":1,"child":2,"time":0.812707},
    {"message":"thread-created","parent":1,"child":3,"time":0.814458},
    {"to":3,"from":1,"message":"token-passed","time":0.81575,"arg":1},
    {"to":3,"from":1,"message":"token-passed","time":0.833093,"arg":2},
    {"message":"thread-finished","thread":1,"time":0.837326},
    {"message":"thread-started","thread":3,"worker":"pool-7-thread-2","time":0.843918},
    {"message":"thread-created","parent":3,"child":4,"time":1.477548},
    {"message":"thread-created","parent":3,"child":5,"time":1.478386},
    {"to":5,"from":3,"message":"token-passed","time":1.478416,"arg":1},
    {"to":5,"from":3,"message":"token-passed","time":1.478482,"arg":2},
    {"message":"thread-created","parent":3,"child":6,"time":1.479287},
    {"to":6,"from":3,"message":"token-passed","time":1.479314,"arg":1},
    {"to":6,"from":3,"message":"token-passed","time":1.480035,"arg":2},
    {"message":"thread-finished","thread":3,"time":1.480121},
    {"message":"thread-started","thread":5,"worker":"pool-7-thread-3","time":1.480921},
    {"message":"thread-started","thread":6,"worker":"pool-7-thread-4","time":1.48117},
    {"message":"thread-created","parent":6,"child":7,"time":2.184306},
    {"message":"thread-created","parent":6,"child":8,"time":2.184394},
    {"to":8,"from":6,"message":"token-passed","time":2.184427,"arg":1},
    {"to":8,"from":6,"message":"token-passed","time":2.1845,"arg":2},
    {"message":"thread-created","parent":6,"child":9,"time":2.1846},
    {"to":9,"from":6,"message":"token-passed","time":2.184629,"arg":1},
    {"to":9,"from":6,"message":"token-passed","time":2.184698,"arg":2},
    {"message":"thread-finished","thread":6,"time":2.184781},
    {"message":"thread-started","thread":8,"worker":"pool-7-thread-5","time":2.185798},
    {"message":"thread-started","thread":9,"worker":"pool-7-thread-6","time":2.186025},
    {"message":"thread-created","parent":5,"child":10,"time":2.312071},
    {"message":"thread-created","parent":5,"child":11,"time":2.312119},
    {"to":11,"from":5,"message":"token-passed","time":2.312141,"arg":1},
    {"to":11,"from":5,"message":"token-passed","time":2.31219,"arg":2},
    {"message":"thread-created","parent":5,"child":12,"time":2.312268},
    {"to":12,"from":5,"message":"token-passed","time":2.312288,"arg":1},
    {"to":12,"from":5,"message":"token-passed","time":2.312333,"arg":2},
    {"message":"thread-finished","thread":5,"time":2.312388},
    {"message":"thread-started","thread":11,"worker":"pool-7-thread-7","time":2.313083},
    {"message":"thread-started","thread":12,"worker":"pool-7-thread-8","time":2.313152},
    {"message":"thread-created","parent":11,"child":13,"time":2.679386},
    {"message":"thread-created","parent":11,"child":14,"time":2.679476},
    {"to":14,"from":11,"message":"token-passed","time":2.679509,"arg":1},
    {"to":14,"from":11,"message":"token-passed","time":2.679585,"arg":2},
    {"message":"thread-created","parent":11,"child":15,"time":2.679689},
    {"to":15,"from":11,"message":"token-passed","time":2.679719,"arg":1},
    {"to":15,"from":11,"message":"token-passed","time":2.679793,"arg":2},
    {"message":"thread-finished","thread":11,"time":2.679866},
    {"message":"thread-started","thread":14,"worker":"pool-7-thread-9","time":2.680947},
    {"message":"thread-started","thread":15,"worker":"pool-7-thread-10","time":2.681238},
    {"message":"thread-created","parent":8,"child":16,"time":2.710064},
    {"message":"thread-created","parent":8,"child":17,"time":2.710152},
    {"to":17,"from":8,"message":"token-passed","time":2.710184,"arg":1},
    {"to":17,"from":8,"message":"token-passed","time":2.71026,"arg":2},
    {"message":"thread-created","parent":8,"child":18,"time":2.710362},
    {"to":18,"from":8,"message":"token-passed","time":2.710392,"arg":1},
    {"to":18,"from":8,"message":"token-passed","time":2.710463,"arg":2},
    {"message":"thread-finished","thread":8,"time":2.710536},
    {"message":"thread-started","thread":17,"worker":"pool-7-thread-11","time":2.711611},
    {"message":"thread-started","thread":18,"worker":"pool-7-thread-12","time":2.711814},
    {"message":"thread-created","parent":9,"child":19,"time":3.120285},
    {"message":"thread-created","parent":9,"child":20,"time":3.120372},
    {"to":20,"from":9,"message":"token-passed","time":3.120405,"arg":1},
    {"to":20,"from":9,"message":"token-passed","time":3.120479,"arg":2},
    {"message":"thread-created","parent":9,"child":21,"time":3.120581},
    {"to":21,"from":9,"message":"token-passed","time":3.12061,"arg":1},
    {"to":21,"from":9,"message":"token-passed","time":3.120679,"arg":2},
    {"message":"thread-finished","thread":9,"time":3.120749},
    {"message":"thread-started","thread":20,"worker":"pool-7-thread-13","time":3.121788},
    {"message":"thread-started","thread":21,"worker":"pool-7-thread-14","time":3.122647},
    {"message":"thread-created","parent":12,"child":22,"time":3.231566},
    {"message":"thread-created","parent":12,"child":23,"time":3.231613},
    {"to":23,"from":12,"message":"token-passed","time":3.231635,"arg":1},
    {"to":23,"from":12,"message":"token-passed","time":3.231693,"arg":2},
    {"message":"thread-created","parent":12,"child":24,"time":3.231765},
    {"to":24,"from":12,"message":"token-passed","time":3.231784,"arg":1},
    {"to":24,"from":12,"message":"token-passed","time":3.231828,"arg":2},
    {"message":"thread-finished","thread":12,"time":3.231873},
    {"message":"thread-started","thread":23,"worker":"pool-7-thread-15","time":3.232401},
    {"message":"thread-started","thread":24,"worker":"pool-7-thread-16","time":3.232524},
    {"message":"thread-created","parent":20,"child":25,"time":3.384333},
    {"message":"thread-created","parent":20,"child":26,"time":3.384379},
    {"to":26,"from":20,"message":"token-passed","time":3.384401,"arg":1},
    {"to":26,"from":20,"message":"token-passed","time":3.384449,"arg":2},
    {"message":"thread-created","parent":20,"child":27,"time":3.384513},
    {"to":27,"from":20,"message":"token-passed","time":3.384531,"arg":1},
    {"to":27,"from":20,"message":"token-passed","time":3.384575,"arg":2},
    {"message":"thread-finished","thread":20,"time":3.384635},
    {"message":"thread-started","thread":26,"worker":"pool-7-thread-1","time":3.385116},
    {"message":"thread-started","thread":27,"worker":"pool-7-thread-2","time":3.385242},
    {"message":"thread-created","parent":17,"child":28,"time":3.51974},
    {"message":"thread-created","parent":15,"child":29,"time":3.519763},
    {"message":"thread-created","parent":17,"child":30,"time":3.519792},
    {"message":"thread-created","parent":15,"child":31,"time":3.519809},
    {"to":30,"from":17,"message":"token-passed","time":3.519823,"arg":1},
    {"to":31,"from":15,"message":"token-passed","time":3.51984,"arg":1},
    {"to":30,"from":17,"message":"token-passed","time":3.519878,"arg":2},
    {"to":31,"from":15,"message":"token-passed","time":3.519891,"arg":2},
    {"message":"thread-created","parent":17,"child":32,"time":3.519952},
    {"message":"thread-created","parent":15,"child":33,"time":3.51997},
    {"to":32,"from":17,"message":"token-passed","time":3.519985,"arg":1},
    {"to":33,"from":15,"message":"token-passed","time":3.520001,"arg":1},
    {"to":32,"from":17,"message":"token-passed","time":3.520036,"arg":2},
    {"to":33,"from":15,"message":"token-passed","time":3.520052,"arg":2},
    {"message":"thread-finished","thread":17,"time":3.52009},
    {"message":"thread-finished","thread":15,"time":3.520108},
    {"message":"thread-started","thread":31,"worker":"pool-7-thread-4","time":3.5206},
    {"message":"thread-started","thread":33,"worker":"pool-7-thread-3","time":3.520624},
    {"message":"thread-started","thread":30,"worker":"pool-7-thread-7","time":3.520768},
    {"message":"thread-started","thread":32,"worker":"pool-7-thread-5","time":3.520893},
    {"message":"thread-created","parent":14,"child":34,"time":3.530027},
    {"message":"thread-created","parent":14,"child":35,"time":3.530067},
    {"to":35,"from":14,"message":"token-passed","time":3.530086,"arg":1},
    {"to":35,"from":14,"message":"token-passed","time":3.530129,"arg":2},
    {"message":"thread-created","parent":14,"child":36,"time":3.530191},
    {"to":36,"from":14,"message":"token-passed","time":3.530208,"arg":1},
    {"to":36,"from":14,"message":"token-passed","time":3.53025,"arg":2},
    {"message":"thread-finished","thread":14,"time":3.530292},
    {"message":"thread-started","thread":35,"worker":"pool-7-thread-6","time":3.530818},
    {"message":"thread-started","thread":36,"worker":"pool-7-thread-8","time":3.530958},
    {"message":"thread-created","parent":18,"child":37,"time":3.626978},
    {"message":"thread-created","parent":18,"child":38,"time":3.627023},
    {"to":38,"from":18,"message":"token-passed","time":3.627044,"arg":1},
    {"to":38,"from":18,"message":"token-passed","time":3.627092,"arg":2},
    {"message":"thread-created","parent":18,"child":39,"time":3.627153},
    {"to":39,"from":18,"message":"token-passed","time":3.627171,"arg":1},
    {"to":39,"from":18,"message":"token-passed","time":3.627213,"arg":2},
    {"message":"thread-finished","thread":18,"time":3.627258},
    {"message":"thread-started","thread":38,"worker":"pool-7-thread-13","time":3.62775},
    {"message":"thread-started","thread":39,"worker":"pool-7-thread-10","time":3.62786},
    {"message":"thread-created","parent":33,"child":40,"time":3.81675},
    {"message":"thread-created","parent":33,"child":41,"time":3.816807},
    {"to":41,"from":33,"message":"token-passed","time":3.816832,"arg":1},
    {"to":41,"from":33,"message":"token-passed","time":3.816891,"arg":2},
    {"message":"thread-created","parent":33,"child":42,"time":3.81697},
    {"to":42,"from":33,"message":"token-passed","time":3.816992,"arg":1},
    {"to":42,"from":33,"message":"token-passed","time":3.817046,"arg":2},
    {"message":"thread-finished","thread":33,"time":3.817102},
    {"message":"thread-started","thread":41,"worker":"pool-7-thread-11","time":3.817676},
    {"message":"thread-started","thread":42,"worker":"pool-7-thread-9","time":3.817818},
    {"message":"thread-created","parent":32,"child":43,"time":3.882007},
    {"message":"thread-created","parent":32,"child":44,"time":3.882053},
    {"to":44,"from":32,"message":"token-passed","time":3.882074,"arg":1},
    {"to":44,"from":32,"message":"token-passed","time":3.882123,"arg":2},
    {"message":"thread-created","parent":32,"child":45,"time":3.882186},
    {"to":45,"from":32,"message":"token-passed","time":3.882216,"arg":1},
    {"to":45,"from":32,"message":"token-passed","time":3.88226,"arg":2},
    {"message":"thread-finished","thread":32,"time":3.882307},
    {"message":"thread-started","thread":44,"worker":"pool-7-thread-12","time":3.882781},
    {"message":"thread-started","thread":45,"worker":"pool-7-thread-3","time":3.882893},
    {"message":"thread-created","parent":21,"child":46,"time":4.067506},
    {"message":"thread-created","parent":21,"child":47,"time":4.067552},
    {"to":47,"from":21,"message":"token-passed","time":4.067572,"arg":1},
    {"to":47,"from":21,"message":"token-passed","time":4.067619,"arg":2},
    {"message":"thread-created","parent":21,"child":48,"time":4.067682},
    {"to":48,"from":21,"message":"token-passed","time":4.067699,"arg":1},
    {"to":48,"from":21,"message":"token-passed","time":4.067741,"arg":2},
    {"message":"thread-finished","thread":21,"time":4.067786},
    {"message":"thread-started","thread":47,"worker":"pool-7-thread-5","time":4.06836},
    {"message":"thread-started","thread":48,"worker":"pool-7-thread-14","time":4.068545},
    {"message":"thread-created","parent":31,"child":49,"time":4.073801},
    {"message":"thread-created","parent":31,"child":50,"time":4.073851},
    {"to":50,"from":31,"message":"token-passed","time":4.073874,"arg":1},
    {"to":50,"from":31,"message":"token-passed","time":4.073926,"arg":2},
    {"message":"thread-created","parent":31,"child":51,"time":4.074016},
    {"to":51,"from":31,"message":"token-passed","time":4.074043,"arg":1},
    {"to":51,"from":31,"message":"token-passed","time":4.074103,"arg":2},
    {"message":"thread-finished","thread":31,"time":4.074165},
    {"message":"thread-started","thread":50,"worker":"pool-7-thread-4","time":4.074919},
    {"message":"thread-created","parent":26,"child":52,"time":4.081118},
    {"message":"thread-created","parent":26,"child":53,"time":4.081213},
    {"to":53,"from":26,"message":"token-passed","time":4.081247,"arg":1},
    {"to":53,"from":26,"message":"token-passed","time":4.081327,"arg":2},
    {"message":"thread-created","parent":26,"child":54,"time":4.081401},
    {"to":54,"from":26,"message":"token-passed","time":4.08142,"arg":1},
    {"to":54,"from":26,"message":"token-passed","time":4.081464,"arg":2},
    {"message":"thread-finished","thread":26,"time":4.08151},
    {"message":"thread-started","thread":51,"worker":"pool-7-thread-1","time":4.082448},
    {"message":"thread-created","parent":24,"child":55,"time":4.138635},
    {"message":"thread-created","parent":24,"child":56,"time":4.138679},
    {"to":56,"from":24,"message":"token-passed","time":4.138698,"arg":1},
    {"to":56,"from":24,"message":"token-passed","time":4.138744,"arg":2},
    {"message":"thread-created","parent":24,"child":57,"time":4.138804},
    {"to":57,"from":24,"message":"token-passed","time":4.138821,"arg":1},
    {"to":57,"from":24,"message":"token-passed","time":4.138862,"arg":2},
    {"message":"thread-finished","thread":24,"time":4.138905},
    {"message":"thread-started","thread":53,"worker":"pool-7-thread-16","time":4.139667},
    {"message":"thread-created","parent":23,"child":58,"time":4.186502},
    {"message":"thread-created","parent":23,"child":59,"time":4.186544},
    {"to":59,"from":23,"message":"token-passed","time":4.186564,"arg":1},
    {"to":59,"from":23,"message":"token-passed","time":4.186611,"arg":2},
    {"message":"thread-created","parent":23,"child":60,"time":4.186673},
    {"to":60,"from":23,"message":"token-passed","time":4.18669,"arg":1},
    {"to":60,"from":23,"message":"token-passed","time":4.186743,"arg":2},
    {"message":"thread-finished","thread":23,"time":4.186788},
    {"message":"thread-started","thread":54,"worker":"pool-7-thread-15","time":4.187634},
    {"message":"thread-created","parent":30,"child":61,"time":4.229921},
    {"message":"thread-created","parent":30,"child":62,"time":4.229966},
    {"to":62,"from":30,"message":"token-passed","time":4.229985,"arg":1},
    {"to":62,"from":30,"message":"token-passed","time":4.230032,"arg":2},
    {"message":"thread-created","parent":30,"child":63,"time":4.230093},
    {"to":63,"from":30,"message":"token-passed","time":4.23011,"arg":1},
    {"to":63,"from":30,"message":"token-passed","time":4.230151,"arg":2},
    {"message":"thread-finished","thread":30,"time":4.230195},
    {"message":"thread-started","thread":56,"worker":"pool-7-thread-7","time":4.230954},
    {"to":25,"from":27,"message":"token-passed","time":4.231286,"arg":2},
    {"message":"thread-finished","thread":27,"time":4.231335},
    {"message":"thread-started","thread":57,"worker":"pool-7-thread-2","time":4.23138},
    {"message":"thread-created","parent":35,"child":64,"time":4.322931},
    {"message":"thread-created","parent":35,"child":65,"time":4.322975},
    {"to":65,"from":35,"message":"token-passed","time":4.322994,"arg":1},
    {"to":65,"from":35,"message":"token-passed","time":4.32304,"arg":2},
    {"message":"thread-created","parent":35,"child":66,"time":4.323101},
    {"to":66,"from":35,"message":"token-passed","time":4.323118,"arg":1},
    {"to":66,"from":35,"message":"token-passed","time":4.32316,"arg":2},
    {"message":"thread-finished","thread":35,"time":4.323204},
    {"message":"thread-started","thread":59,"worker":"pool-7-thread-6","time":4.323965},
    {"to":40,"from":42,"message":"token-passed","time":4.418901,"arg":2},
    {"message":"thread-finished","thread":42,"time":4.418979},
    {"message":"thread-started","thread":60,"worker":"pool-7-thread-9","time":4.419072},
    {"message":"thread-created","parent":36,"child":67,"time":4.47005},
    {"message":"thread-created","parent":36,"child":68,"time":4.470093},
    {"to":68,"from":36,"message":"token-passed","time":4.470113,"arg":1},
    {"to":68,"from":36,"message":"token-passed","time":4.470159,"arg":2},
    {"message":"thread-created","parent":36,"child":69,"time":4.470219},
    {"to":69,"from":36,"message":"token-passed","time":4.470236,"arg":1},
    {"to":69,"from":36,"message":"token-passed","time":4.470278,"arg":2},
    {"message":"thread-finished","thread":36,"time":4.470321},
    {"message":"thread-started","thread":62,"worker":"pool-7-thread-8","time":4.471055},
    {"message":"thread-created","parent":38,"child":70,"time":4.478445},
    {"message":"thread-created","parent":38,"child":71,"time":4.478487},
    {"to":71,"from":38,"message":"token-passed","time":4.478514,"arg":1},
    {"to":71,"from":38,"message":"token-passed","time":4.478555,"arg":2},
    {"message":"thread-created","parent":38,"child":72,"time":4.478628},
    {"to":72,"from":38,"message":"token-passed","time":4.478645,"arg":1},
    {"to":72,"from":38,"message":"token-passed","time":4.478686,"arg":2},
    {"message":"thread-finished","thread":38,"time":4.478727},
    {"message":"thread-started","thread":63,"worker":"pool-7-thread-13","time":4.479431},
    {"to":46,"from":48,"message":"token-passed","time":4.522604,"arg":2},
    {"message":"thread-finished","thread":48,"time":4.52268},
    {"message":"thread-started","thread":65,"worker":"pool-7-thread-14","time":4.522754},
    {"to":52,"from":54,"message":"token-passed","time":4.548699,"arg":2},
    {"message":"thread-finished","thread":54,"time":4.548775},
    {"message":"thread-started","thread":66,"worker":"pool-7-thread-15","time":4.548847},
    {"to":37,"from":39,"message":"token-passed","time":4.579932,"arg":2},
    {"message":"thread-finished","thread":39,"time":4.580001},
    {"message":"thread-started","thread":68,"worker":"pool-7-thread-10","time":4.580075},
    {"message":"thread-created","parent":50,"child":73,"time":4.644023},
    {"message":"thread-created","parent":50,"child":74,"time":4.644068},
    {"to":74,"from":50,"message":"token-passed","time":4.644088,"arg":1},
    {"to":74,"from":50,"message":"token-passed","time":4.644135,"arg":2},
    {"message":"thread-created","parent":50,"child":75,"time":4.644196},
    {"to":75,"from":50,"message":"token-passed","time":4.644222,"arg":1},
    {"to":75,"from":50,"message":"token-passed","time":4.644265,"arg":2},
    {"message":"thread-finished","thread":50,"time":4.64431},
    {"message":"thread-started","thread":69,"worker":"pool-7-thread-4","time":4.645358},
    {"to":43,"from":44,"message":"token-passed","time":4.655891,"arg":1},
    {"message":"thread-finished","thread":44,"time":4.656049},
    {"message":"thread-started","thread":71,"worker":"pool-7-thread-12","time":4.656122},
    {"to":49,"from":51,"message":"token-passed","time":4.667823,"arg":2},
    {"message":"thread-finished","thread":51,"time":4.667909},
    {"message":"thread-started","thread":72,"worker":"pool-7-thread-1","time":4.667971},
    {"to":43,"from":45,"message":"token-passed","time":4.699345,"arg":2},
    {"message":"thread-finished","thread":45,"time":4.699419},
    {"message":"thread-started","thread":74,"worker":"pool-7-thread-3","time":4.699502},
    {"message":"thread-created","parent":60,"child":76,"time":4.706155},
    {"message":"thread-created","parent":60,"child":77,"time":4.706198},
    {"to":77,"from":60,"message":"token-passed","time":4.706225,"arg":1},
    {"to":77,"from":60,"message":"token-passed","time":4.706267,"arg":2},
    {"message":"thread-created","parent":60,"child":78,"time":4.706328},
    {"to":78,"from":60,"message":"token-passed","time":4.706345,"arg":1},
    {"to":78,"from":60,"message":"token-passed","time":4.706386,"arg":2},
    {"message":"thread-finished","thread":60,"time":4.706428},
    {"message":"thread-started","thread":75,"worker":"pool-7-thread-9","time":4.707129},
    {"message":"thread-created","parent":56,"child":79,"time":4.7311},
    {"message":"thread-created","parent":56,"child":80,"time":4.731148},
    {"to":80,"from":56,"message":"token-passed","time":4.731168,"arg":1},
    {"to":80,"from":56,"message":"token-passed","time":4.731215,"arg":2},
    {"message":"thread-created","parent":56,"child":81,"time":4.731276},
    {"to":81,"from":56,"message":"token-passed","time":4.731293,"arg":1},
    {"to":81,"from":56,"message":"token-passed","time":4.731334,"arg":2},
    {"message":"thread-finished","thread":56,"time":4.731379},
    {"message":"thread-started","thread":43,"worker":"pool-7-thread-7","time":4.732129},
    {"to":46,"from":47,"message":"token-passed","time":4.760419,"arg":1},
    {"message":"thread-finished","thread":47,"time":4.7605},
    {"message":"thread-started","thread":77,"worker":"pool-7-thread-5","time":4.760583},
    {"message":"thread-created","parent":62,"child":82,"time":4.763136},
    {"message":"thread-created","parent":62,"child":83,"time":4.763176},
    {"to":83,"from":62,"message":"token-passed","time":4.763194,"arg":1},
    {"to":83,"from":62,"message":"token-passed","time":4.763236,"arg":2},
    {"message":"thread-created","parent":62,"child":84,"time":4.763296},
    {"to":84,"from":62,"message":"token-passed","time":4.763313,"arg":1},
    {"to":84,"from":62,"message":"token-passed","time":4.763354,"arg":2},
    {"message":"thread-finished","thread":62,"time":4.763396},
    {"message":"thread-started","thread":78,"worker":"pool-7-thread-8","time":4.764092},
    {"to":40,"from":41,"message":"token-passed","time":4.777761,"arg":1},
    {"message":"thread-finished","thread":41,"time":4.777839},
    {"message":"thread-started","thread":80,"worker":"pool-7-thread-11","time":4.777924},
    {"to":73,"from":75,"message":"token-passed","time":4.991206,"arg":2},
    {"message":"thread-finished","thread":75,"time":4.99128},
    {"message":"thread-started","thread":81,"worker":"pool-7-thread-9","time":4.99137},
    {"message":"thread-created","parent":59,"child":85,"time":4.996743},
    {"message":"thread-created","parent":59,"child":86,"time":4.996787},
    {"to":86,"from":59,"message":"token-passed","time":4.996807,"arg":1},
    {"to":86,"from":59,"message":"token-passed","time":4.996852,"arg":2},
    {"message":"thread-created","parent":59,"child":87,"time":4.996915},
    {"to":87,"from":59,"message":"token-passed","time":4.996932,"arg":1},
    {"to":87,"from":59,"message":"token-passed","time":4.996975,"arg":2},
    {"message":"thread-finished","thread":59,"time":4.997019},
    {"message":"thread-started","thread":46,"worker":"pool-7-thread-6","time":4.997797},
    {"to":52,"from":53,"message":"token-passed","time":5.067895,"arg":1},
    {"message":"thread-finished","thread":53,"time":5.067979},
    {"message":"thread-started","thread":83,"worker":"pool-7-thread-16","time":5.068073},
    {"to":55,"from":57,"message":"token-passed","time":5.074439,"arg":2},
    {"message":"thread-finished","thread":57,"time":5.074497},
    {"message":"thread-started","thread":84,"worker":"pool-7-thread-2","time":5.074569},
    {"to":70,"from":71,"message":"token-passed","time":5.107182,"arg":1},
    {"message":"thread-finished","thread":71,"time":5.107243},
    {"message":"thread-started","thread":40,"worker":"pool-7-thread-12","time":5.107313},
    {"to":76,"from":77,"message":"token-passed","time":5.189868,"arg":1},
    {"message":"thread-finished","thread":77,"time":5.189963},
    {"message":"thread-started","thread":86,"worker":"pool-7-thread-5","time":5.190054},
    {"to":61,"from":63,"message":"token-passed","time":5.238482,"arg":2},
    {"message":"thread-finished","thread":63,"time":5.238542},
    {"message":"thread-started","thread":87,"worker":"pool-7-thread-13","time":5.238616},
    {"message":"thread-created","parent":68,"child":88,"time":5.245903},
    {"message":"thread-created","parent":68,"child":89,"time":5.245948},
    {"to":89,"from":68,"message":"token-passed","time":5.245968,"arg":1},
    {"to":89,"from":68,"message":"token-passed","time":5.246015,"arg":2},
    {"message":"thread-created","parent":68,"child":90,"time":5.246078},
    {"to":90,"from":68,"message":"token-passed","time":5.246095,"arg":1},
    {"to":90,"from":68,"message":"token-passed","time":5.246138,"arg":2},
    {"message":"thread-finished","thread":68,"time":5.246183},
    {"message":"thread-started","thread":52,"worker":"pool-7-thread-10","time":5.246806},
    {"message":"thread-created","parent":65,"child":91,"time":5.247573},
    {"message":"thread-created","parent":65,"child":92,"time":5.247613},
    {"to":92,"from":65,"message":"token-passed","time":5.247631,"arg":1},
    {"to":92,"from":65,"message":"token-passed","time":5.247675,"arg":2},
    {"message":"thread-created","parent":65,"child":93,"time":5.247742},
    {"to":93,"from":65,"message":"token-passed","time":5.247759,"arg":1},
    {"to":93,"from":65,"message":"token-passed","time":5.247808,"arg":2},
    {"message":"thread-finished","thread":65,"time":5.247851},
    {"message":"thread-started","thread":89,"worker":"pool-7-thread-14","time":5.248413},
    {"to":76,"from":78,"message":"token-passed","time":5.257152,"arg":2},
    {"message":"thread-finished","thread":78,"time":5.257217},
    {"message":"thread-started","thread":90,"worker":"pool-7-thread-8","time":5.257302},
    {"to":70,"from":72,"message":"token-passed","time":5.291252,"arg":2},
    {"message":"thread-finished","thread":72,"time":5.291337},
    {"message":"thread-started","thread":92,"worker":"pool-7-thread-1","time":5.29143},
    {"to":82,"from":84,"message":"token-passed","time":5.325631,"arg":2},
    {"message":"thread-finished","thread":84,"time":5.325707},
    {"message":"thread-started","thread":93,"worker":"pool-7-thread-2","time":5.325779},
    {"to":29,"from":40,"message":"token-passed","time":5.372945,"arg":2},
    {"message":"thread-finished","thread":40,"time":5.373021},
    {"message":"thread-started","thread":76,"worker":"pool-7-thread-12","time":5.3731},
    {"message":"thread-created","parent":66,"child":94,"time":5.397992},
    {"message":"thread-created","parent":66,"child":95,"time":5.398037},
    {"to":95,"from":66,"message":"token-passed","time":5.398057,"arg":1},
    {"to":95,"from":66,"message":"token-passed","time":5.398104,"arg":2},
    {"message":"thread-created","parent":66,"child":96,"time":5.398165},
    {"to":96,"from":66,"message":"token-passed","time":5.398181,"arg":1},
    {"to":96,"from":66,"message":"token-passed","time":5.398223,"arg":2},
    {"message":"thread-finished","thread":66,"time":5.398268},
    {"message":"thread-started","thread":70,"worker":"pool-7-thread-15","time":5.398969},
    {"to":73,"from":74,"message":"token-passed","time":5.4114,"arg":1},
    {"message":"thread-finished","thread":74,"time":5.411503},
    {"message":"thread-started","thread":95,"worker":"pool-7-thread-3","time":5.41162},
    {"to":82,"from":83,"message":"token-passed","time":5.454169,"arg":1},
    {"message":"thread-finished","thread":83,"time":5.454235},
    {"message":"thread-started","thread":96,"worker":"pool-7-thread-16","time":5.454455},
    {"to":28,"from":43,"message":"token-passed","time":5.464495,"arg":2},
    {"message":"thread-finished","thread":43,"time":5.464569},
    {"message":"thread-started","thread":73,"worker":"pool-7-thread-7","time":5.464641},
    {"to":79,"from":80,"message":"token-passed","time":5.483919,"arg":1},
    {"message":"thread-finished","thread":80,"time":5.483994},
    {"message":"thread-started","thread":82,"worker":"pool-7-thread-11","time":5.484056},
    {"to":19,"from":46,"message":"token-passed","time":5.508613,"arg":2},
    {"message":"thread-finished","thread":46,"time":5.508687},
    {"to":67,"from":69,"message":"token-passed","time":5.635413,"arg":2},
    {"message":"thread-finished","thread":69,"time":5.635485},
    {"to":88,"from":90,"message":"token-passed","time":5.644842,"arg":2},
    {"message":"thread-finished","thread":90,"time":5.644898},
    {"to":79,"from":81,"message":"token-passed","time":5.686462,"arg":2},
    {"message":"thread-finished","thread":81,"time":5.686538},
    {"message":"thread-started","thread":79,"worker":"pool-7-thread-6","time":5.686785},
    {"to":94,"from":95,"message":"token-passed","time":5.814695,"arg":1},
    {"message":"thread-finished","thread":95,"time":5.814769},
    {"to":61,"from":82,"message":"token-passed","time":5.933674,"arg":1},
    {"message":"thread-finished","thread":82,"time":5.933757},
    {"message":"thread-started","thread":61,"worker":"pool-7-thread-4","time":5.934003},
    {"to":25,"from":52,"message":"token-passed","time":5.969899,"arg":1},
    {"message":"thread-finished","thread":52,"time":5.969957},
    {"message":"thread-started","thread":25,"worker":"pool-7-thread-8","time":5.970185},
    {"to":85,"from":87,"message":"token-passed","time":6.024678,"arg":2},
    {"message":"thread-finished","thread":87,"time":6.024763},
    {"to":37,"from":70,"message":"token-passed","time":6.151034,"arg":1},
    {"message":"thread-finished","thread":70,"time":6.151116},
    {"message":"thread-started","thread":37,"worker":"pool-7-thread-9","time":6.151358},
    {"to":88,"from":89,"message":"token-passed","time":6.162454,"arg":1},
    {"message":"thread-finished","thread":89,"time":6.162515},
    {"message":"thread-started","thread":88,"worker":"pool-7-thread-3","time":6.162749},
    {"message":"thread-created","parent":86,"child":97,"time":6.181162},
    {"message":"thread-created","parent":86,"child":98,"time":6.181205},
    {"to":98,"from":86,"message":"token-passed","time":6.181225,"arg":1},
    {"to":98,"from":86,"message":"token-passed","time":6.18127,"arg":2},
    {"message":"thread-created","parent":86,"child":99,"time":6.181331},
    {"to":99,"from":86,"message":"token-passed","time":6.181347,"arg":1},
    {"to":99,"from":86,"message":"token-passed","time":6.181388,"arg":2},
    {"message":"thread-finished","thread":86,"time":6.181432},
    {"message":"thread-started","thread":98,"worker":"pool-7-thread-11","time":6.181885},
    {"message":"thread-started","thread":99,"worker":"pool-7-thread-10","time":6.182017},
    {"to":55,"from":79,"message":"token-passed","time":6.189846,"arg":1},
    {"message":"thread-finished","thread":79,"time":6.189908},
    {"message":"thread-started","thread":55,"worker":"pool-7-thread-13","time":6.190065},
    {"to":91,"from":93,"message":"token-passed","time":6.222849,"arg":2},
    {"message":"thread-finished","thread":93,"time":6.22293},
    {"message":"thread-created","parent":92,"child":100,"time":6.246532},
    {"message":"thread-created","parent":92,"child":101,"time":6.246576},
    {"to":101,"from":92,"message":"token-passed","time":6.246595,"arg":1},
    {"to":101,"from":92,"message":"token-passed","time":6.24664,"arg":2},
    {"message":"thread-created","parent":92,"child":102,"time":6.246699},
    {"to":102,"from":92,"message":"token-passed","time":6.246714,"arg":1},
    {"to":102,"from":92,"message":"token-passed","time":6.246754,"arg":2},
    {"message":"thread-finished","thread":92,"time":6.246796},
    {"message":"thread-started","thread":101,"worker":"pool-7-thread-15","time":6.24727},
    {"message":"thread-started","thread":102,"worker":"pool-7-thread-14","time":6.247405},
    {"to":19,"from":25,"message":"token-passed","time":6.281246,"arg":1},
    {"message":"thread-finished","thread":25,"time":6.281309},
    {"message":"thread-started","thread":19,"worker":"pool-7-thread-5","time":6.281535},
    {"to":28,"from":61,"message":"token-passed","time":6.290523,"arg":1},
    {"message":"thread-finished","thread":61,"time":6.290588},
    {"message":"thread-started","thread":28,"worker":"pool-7-thread-6","time":6.29081},
    {"to":58,"from":76,"message":"token-passed","time":6.316187,"arg":2},
    {"message":"thread-finished","thread":76,"time":6.316263},
    {"to":49,"from":73,"message":"token-passed","time":6.406749,"arg":1},
    {"message":"thread-finished","thread":73,"time":6.406826},
    {"message":"thread-started","thread":49,"worker":"pool-7-thread-2","time":6.407064},
    {"to":94,"from":96,"message":"token-passed","time":6.429535,"arg":2},
    {"message":"thread-finished","thread":96,"time":6.429597},
    {"message":"thread-started","thread":94,"worker":"pool-7-thread-1","time":6.429831},
    {"to":22,"from":55,"message":"token-passed","time":6.451152,"arg":2},
    {"message":"thread-finished","thread":55,"time":6.451229},
    {"to":97,"from":98,"message":"token-passed","time":6.483135,"arg":1},
    {"message":"thread-finished","thread":98,"time":6.483206},
    {"to":97,"from":99,"message":"token-passed","time":6.53107,"arg":2},
    {"message":"thread-finished","thread":99,"time":6.531163},
    {"message":"thread-started","thread":97,"worker":"pool-7-thread-10","time":6.531373},
    {"to":100,"from":101,"message":"token-passed","time":6.59932,"arg":1},
    {"message":"thread-finished","thread":101,"time":6.599388},
    {"to":7,"from":19,"message":"token-passed","time":6.745651,"arg":2},
    {"message":"thread-finished","thread":19,"time":6.745829},
    {"to":16,"from":28,"message":"token-passed","time":6.775918,"arg":1},
    {"message":"thread-finished","thread":28,"time":6.775989},
    {"to":64,"from":94,"message":"token-passed","time":6.790993,"arg":2},
    {"message":"thread-finished","thread":94,"time":6.791066},
    {"to":85,"from":97,"message":"token-passed","time":6.856446,"arg":1},
    {"message":"thread-finished","thread":97,"time":6.856518},
    {"message":"thread-started","thread":85,"worker":"pool-7-thread-4","time":6.856716},
    {"to":67,"from":88,"message":"token-passed","time":6.864837,"arg":1},
    {"message":"thread-finished","thread":88,"time":6.864902},
    {"message":"thread-started","thread":67,"worker":"pool-7-thread-12","time":6.865118},
    {"to":16,"from":37,"message":"token-passed","time":6.918171,"arg":2},
    {"message":"thread-finished","thread":37,"time":6.918255},
    {"message":"thread-started","thread":16,"worker":"pool-7-thread-7","time":6.91848},
    {"to":100,"from":102,"message":"token-passed","time":7.092448,"arg":2},
    {"message":"thread-finished","thread":102,"time":7.092511},
    {"message":"thread-started","thread":100,"worker":"pool-7-thread-16","time":7.092735},
    {"to":7,"from":16,"message":"token-passed","time":7.239559,"arg":1},
    {"message":"thread-finished","thread":16,"time":7.23963},
    {"message":"thread-started","thread":7,"worker":"pool-7-thread-13","time":7.239852},
    {"to":29,"from":49,"message":"token-passed","time":7.345146,"arg":1},
    {"message":"thread-finished","thread":49,"time":7.345218},
    {"message":"thread-started","thread":29,"worker":"pool-7-thread-11","time":7.345444},
    {"to":34,"from":67,"message":"token-passed","time":7.681274,"arg":2},
    {"message":"thread-finished","thread":67,"time":7.681488},
    {"to":91,"from":100,"message":"token-passed","time":7.791009,"arg":1},
    {"message":"thread-finished","thread":100,"time":7.791094},
    {"message":"thread-started","thread":91,"worker":"pool-7-thread-8","time":7.791382},
    {"to":58,"from":85,"message":"token-passed","time":7.815533,"arg":1},
    {"message":"thread-finished","thread":85,"time":7.81566},
    {"message":"thread-started","thread":58,"worker":"pool-7-thread-15","time":7.81598},
    {"to":4,"from":7,"message":"token-passed","time":7.983674,"arg":2},
    {"message":"thread-finished","thread":7,"time":7.983775},
    {"to":13,"from":29,"message":"token-passed","time":8.251987,"arg":2},
    {"message":"thread-finished","thread":29,"time":8.252063},
    {"to":64,"from":91,"message":"token-passed","time":8.400422,"arg":1},
    {"message":"thread-finished","thread":91,"time":8.400516},
    {"message":"thread-started","thread":64,"worker":"pool-7-thread-5","time":8.40076},
    {"to":22,"from":58,"message":"token-passed","time":8.460051,"arg":1},
    {"message":"thread-finished","thread":58,"time":8.460122},
    {"message":"thread-started","thread":22,"worker":"pool-7-thread-6","time":8.460338},
    {"to":10,"from":22,"message":"token-passed","time":8.97495,"arg":2},
    {"message":"thread-finished","thread":22,"time":8.975121},
    {"to":34,"from":64,"message":"token-passed","time":9.09687,"arg":1},
    {"message":"thread-finished","thread":64,"time":9.096967},
    {"message":"thread-started","thread":34,"worker":"pool-7-thread-1","time":9.097188},
    {"to":13,"from":34,"message":"token-passed","time":9.735242,"arg":1},
    {"message":"thread-finished","thread":34,"time":9.735418},
    {"message":"thread-started","thread":13,"worker":"pool-7-thread-10","time":9.735712},
    {"to":10,"from":13,"message":"token-passed","time":10.536865,"arg":1},
    {"message":"thread-finished","thread":13,"time":10.537043},
    {"message":"thread-started","thread":10,"worker":"pool-7-thread-3","time":10.53733},
    {"to":4,"from":10,"message":"token-passed","time":11.28054,"arg":1},
    {"message":"thread-finished","thread":10,"time":11.280719},
    {"message":"thread-started","thread":4,"worker":"pool-7-thread-9","time":11.281025},
    {"to":2,"from":4,"message":"token-passed","time":11.832162,"arg":1},
    {"message":"thread-finished","thread":4,"time":11.832264},
    {"message":"thread-started","thread":2,"worker":"pool-7-thread-14","time":11.832541},
    {"message":"thread-finished","thread":2,"time":11.832713},
    {"message":"finished"}
];
