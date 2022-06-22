
import * as map from "../lib/mapGer.js"


export async function wrapGermany(width, height) {
  var svg2 = d3
    .select("#container-3 .graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  // await so that map and graphics are created before render
  await map.preLoadData();
  await map.makeMap("#container-3 .graph > svg", width, height);
  var gs2 = d3
    .graphScroll()
    .container(d3.select("#container-3"))
    .graph(d3.selectAll("#container-3 .graph"))
    .sections(d3.selectAll("#container-3 .sections > div"))
    .on("active", function (i) {
      switch (i) {
        case 0:
          map.removeData("deathCircle");
          map.hideMovement()
          map.removeData("birthCircle");
          break;
        case 1:
          map.removeData("deathCircle");
          map.hideMovement()
          map.renderCalls(2, 0);
          break;
        case 2:
          map.removeData("birthCircle");
          map.hideMovement()
          map.renderCalls(2, 1);
          break;
        case 3:
          map.hideMovement()
          map.renderCalls(2, 1);
          map.renderCalls(2, 0);
          break;
        case 4:
          map.removeData("deathCircle");
          map.removeData("birthCircle");
          map.showMovement();
          break;
      }
    });
}
