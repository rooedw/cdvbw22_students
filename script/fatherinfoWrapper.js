import {bubbleChart} from "./bubbleChart.js";
import {wordCloud} from "./wordCloud.js";

export function wrapFatherinfo(width, height) {

    var svg2 = d3
        .select("#container-2 .graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var gs3 = d3
        .graphScroll()
        .container(d3.select("#container-2"))
        .graph(d3.selectAll("#container-2 .graph"))
        .sections(d3.selectAll("#container-2 .sections > div"))
        .on("active", function (i) {
            switch (i) {
                case 0:
                    wordCloud("#container-2 .graph", width, height);
                    break;
                case 1:
                    bubbleChart("#container-2 .graph", width, height);
                    break;
            }
        });
}
