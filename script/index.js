import {graph_network} from "./graph_network.js";
import {graph_example} from "./graph_example.js";
import { wrapGermany } from "./germanyWrapper.js";
import {wrapBursch} from "./burschWrapper.js";
import {wrapFatherinfo} from "./fatherinfoWrapper.js";
import {wrapStatistik} from "./statistikWrapper.js";

var oldWidth = 0
function render() {
    if (oldWidth === innerWidth) return
    oldWidth = innerWidth;


    var width = d3.select("#container-1 .graph").node().offsetWidth;
    var height = width;
    var r = 40;

    if (innerWidth <= 925) {
        width = innerWidth;
        height = innerHeight * .7;
    }


    // functions create/update graphs
    wrapStatistik(width, height);
    graph_network(width, height);
    //graph_example(width, height)
    wrapGermany(width, height * 1.5);
    wrapBursch(width*2, height*1.2);
    wrapFatherinfo(width * 1.25, height);

    d3.select('#source')
    .style('margin-bottom', window.innerHeight - 450 + 'px')
    .style('padding', '100px')    
}

render()
// d3.select(window).on('resize', render)