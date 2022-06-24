import {blue, cyan, darkRed, gray, green, lightRed, orange, pink} from "./graph_network.js";

export function wrapStatistik(width, height) {

    var margin = {top: 10, right: 30, bottom: 30, left: 30}
    //var    width = 460 - margin.left - margin.right
    //var    height = 400 - margin.top - margin.bottom
    const faecher = [
        ["Philosophie", "Theologie", "Konviktler", "Seminarist"],
        ["Jura", "Regiminalistik", "Kameralwissenschaft", "Forstwissenschaft"],
        ["Medizin", "Pharmazie", "Naturwissenschaft"]
    ]
    const data_url = 'data/allgemein/allgemeine_statistik.json'
    const graphObjs = load_graphs(data_url)
    var graph_width = width - margin.left
    var graph_height = height
    const color = [blue, cyan, darkRed, gray, green, lightRed, orange, pink, blue, orange, darkRed, green]
    var legend_colors = color
    const legend_edges = [true, true, true, true, true, true, true, false, false]



    async function load_graphs(data_url) {
        let data = d3.json(data_url);
        console.log(data)
        return data;
    }

    async function draw_graph(svg, i, width, height) {

        console.log(faecher, i)
        let height_part = height

        let data = await (await graphObjs)
        let fach = faecher[i-1] // (i-1) wegen leeren platzhalter
        //let graph_data = data[fach[0]]['studies_pro_jahr']
        //console.log(fach, graph_data)
        /*
        svg.html('')
            .domain(fach)
            .range(d3.schemeCategory10);
        */
        // X-Axis
        var x = d3.scaleLinear()
            .domain([1830, 1910])         // This is the min and the max of the data: 0 to 100 if percentages
            .range([0, width]);
        var xAxis = svg.append("g")
            .attr("transform", "translate("+margin.left+"," + (height_part + margin.top) + ")")
            .call(d3.axisBottom(x).ticks(5))

        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height_part - 10)
            .text("Jahr");

        // Y-Axis
        var y = d3.scaleLinear()
          .domain([0, 700])
          .range([ height_part, 0]);

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", margin.left + 5)
            .attr("y", 20 )
            .text("Studierende")
            .attr("text-anchor", "start")

        // Add Y axis
        svg.append("g")
            .call(d3.axisLeft(y).ticks(5))
            .attr("transform",
              "translate("+margin.left+", "+margin.top+")");

        // Add the line
        if (i>0) {
            for (let j = 0; j < faecher[i-1].length; j++){
                fach = faecher[i-1][j]
                svg.append("path")
                    .datum(data[fach]['studies_pro_jahr'])
                    .attr("class", "line" + fach)
                    .attr("fill", "none")
                    .attr("stroke", color[j])
                    .attr("stroke-width", 1.5)
                    .attr("transform",
                        "translate(" + margin.left + ", " + 0 + ")")
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d[0])
                        })
                        .y(function (d) {
                            return y(d[1])
                        })
                    )

                //transition
                let trans_length = 2000
                let totalLength = svg.select('.line' + fach).node().getTotalLength();

                svg.select('.line' + fach)
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition() // Call Transition Method
                    .duration(trans_length) // Set Duration timing (ms)
                    .ease(d3.easeLinear) // Set Easing option
                    .delay(trans_length * j)
                    .attr("stroke-dashoffset", 0);


            }

            // Legend
            draw_legend(svg_graph_legend, legend_width, legend_height, 2, faecher[i-1])
        }

    }

    function draw_legend(svg_graph_legend, legend_width, legend_height, num_columns, legend_names) {
        var entries_per_column = Math.ceil(legend_names.length / num_columns)
        var height_per_entry = Math.floor(legend_height / entries_per_column)
        var width_per_column = Math.floor(width / num_columns)
        var y_pos = []
        for (let i = 0; i < entries_per_column; i++) {
            y_pos.push(i * height_per_entry + height_per_entry / 2)
        }
        var x_pos = []
        for (let i = 0; i < num_columns; i++) {
            x_pos.push(i * width_per_column + 20)
        }

        for (let i = 0; i < legend_names.length; i++) {
            var row_index = i % entries_per_column
            var column_index = Math.floor(i / entries_per_column)
            svg_graph_legend.append("line").attr("x1", x_pos[column_index] - 10).attr("y1", y_pos[row_index]).attr("x2", x_pos[column_index] + 10).attr("y2", y_pos[row_index]).attr("stroke", legend_colors[i]).attr("stroke-width", 5)
            /*
            if (legend_edges[i]) {
                // edge
                svg_graph_legend.append("line").attr("x1", x_pos[column_index] - 10).attr("y1", y_pos[row_index]).attr("x2", x_pos[column_index] + 10).attr("y2", y_pos[row_index]).attr("stroke", legend_colors[i]).attr("stroke-width", 5)
            } else {
                // node
                svg_graph_legend.append("circle").attr("cx", x_pos[column_index]).attr("cy", y_pos[row_index]).attr("r", 6).style("fill", legend_colors[i])
            }
            */
            svg_graph_legend
                .append("text")
                .attr("x", x_pos[column_index] + 20)
                .attr("y", y_pos[row_index])
                .text(legend_names[i])
                .style("font-size", "12px")
                .attr("alignment-baseline", "middle")
        }
    }

    let svg_graph = d3.select("#container-5 .graph")
        .html('')
        .append("svg")
        .attr("width", graph_width)
        .attr("height", graph_height * 0.5)

    var svg_graph_legend = d3
        .select("#container-5 .graph")
        .append("svg")
        .attr("width", graph_width)
        .attr("height", 100)

        let legend_width = graph_width
        let legend_height = 50


/*
    let svg_conf = d3.select("#container-5 .graph")
        //.html('')
        .append("svg")
        .attr("width", graph_width)
        .attr("height", graph_height * 0.5)
*/
    let graph_scroll = d3
        .graphScroll()
        .container(d3.select("#container-5"))
        .graph(d3.selectAll("#container-5 .graph"))
        // .eventId('uniqueId1')  // namespace for scroll and resize events
        .sections(d3.selectAll("#container-5 .sections > div"))
        .on('active', function (i) {
            let old_graph = d3.selectAll("#container-5 .graph svg")
            old_graph.selectAll("*").remove()
            draw_graph(svg_graph, i, width - margin.left - margin.right, (0.5 * height) - margin.top - margin.bottom)
        });

}