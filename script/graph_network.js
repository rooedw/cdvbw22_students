export const lightRed = "#f19191";
export const darkRed = "#b41f1f";
export const green = "#4ecb00";
export const blue = "#1f77b4";
export const orange = "#ff7b29";
export const black = "#000000";
export const pink = "#c639e3";
export const cyan = "#5f8d8b";
export const gray = "#3f404b";

export function graph_network(width, height) {

    const graphs = ["graph_0.json", "graph_2.json", "graph_4.json", "graph_7.json", "graph_9.json"];
    const graphObjs = load_graphs(graphs);
    var graph_width = width
    var graph_height = 4 * height / 5
    var legend_width = width
    var legend_height = height - graph_height
    const legend_colors = [lightRed, green, blue, orange, pink, cyan, gray, darkRed, blue]
    const legend_names = ["Schwager", "(Halb-)Bruder", "Vater", "Schwiegervater", "Cousin", "Onkel", "Großvater", "Student", "Nicht Student"]
    const legend_edges = [true, true, true, true, true, true, true, false, false]
    const legend_num_columns = 3

    const Tooltip = makeTooltip();

    async function load_graphs(urls) {
        // console.log(urls)
        const graphs = {};
        for (const url of urls) {
          graphs[url] = d3.json(`data/relationships/${String(url)}`);
        }
        return graphs;
      }

    async function draw_graph(svg, file_name, width, height) {

        svg.html('')

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const simulation = d3
            .forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        let graph = await (await graphObjs)[file_name]
        var link = svg
            .append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter()
            .append("line")
            .attr("stroke-width", function (d) {
                return Math.sqrt(d.value);
            })
            .style("stroke", function (d) {
                switch (d["verwandtschaftsgrad"]) {
                    case "Schwager":
                        return lightRed;
                    case "Bruder":
                        return green;
                    case "Vater":
                        return blue;
                    case "Schwiegervater":
                        return orange;
                    case "Cousin":
                        return pink;
                    case "Onkel":
                        return cyan;
                    case "Halbbruder":
                        return green;
                    case "Großvater":
                        return gray;
                    default:
                        return black;
                }
            });

        var node = svg
            .append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(graph.nodes)
            .enter()
            .append("g");

        node
            .append("circle")
            .attr("r", 5)
            .style("fill", function (d) {
                return d['student'] ? darkRed : color(d.group);
            });

        // Create a drag handler and append it to the node object instead
        var drag_handler = d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);

        drag_handler(node);

        simulation.nodes(graph.nodes).on("tick", ticked);

        simulation.force("link").links(graph.links);

        function ticked() {
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

                node
                    .on("mouseover", function (event, d) {
                        d3.select("#div_template").append("div");
                        Tooltip.style("opacity", "1")
                            .style("left", event.pageX + 5 + "px")
                            .style("top", event.pageY + "px");
                    })
                    .on("mousemove", (event, d) => {
                        const name = d["Vorname"] ? d["Vorname"] + d["Nachname"] : d["id"];
                        const fatherJob = d["year_of_birth"] ? "Geburtsjahr: " + d["year_of_birth"] : "Vaterberuf: " + d["Vater_Beruf"];
                        const birthday = d["Geburtsdatum"] ? "Geburtsdatum: " + d["Geburtsdatum"] : fatherJob;
                        const relatives = d['student'] ? `<br>Sohn von: ${d['Vater_name']}` : '';
                        Tooltip.html(`Name: ${d["name"] ? d["name"] : name}<br>${birthday}<br> ${d["Fach"] ? "Studienfach: " + d["Fach"] : ""}${relatives}`)
                            .style("left", event.pageX + 5 + "px")
                            .style("top", event.pageY + "px")
                            .style("max-width", "20rem");
                    })
                    .on("mouseleave", function (event, d) {
                        Tooltip.style("opacity", "0");
                        d3.select(this).style("stroke", "none");
                    })
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
            }
    }

    function draw_legend(svg_graph_legend, legend_width, legend_height, num_columns) {
        var entries_per_column = Math.ceil(legend_colors.length / num_columns)
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

        for (let i = 0; i < legend_colors.length; i++) {
            var row_index = i % entries_per_column
            var column_index = Math.floor(i / entries_per_column)
            if (legend_edges[i]) {
                // edge
                svg_graph_legend.append("line").attr("x1", x_pos[column_index] - 10).attr("y1", y_pos[row_index]).attr("x2", x_pos[column_index] + 10).attr("y2", y_pos[row_index]).attr("stroke", legend_colors[i]).attr("stroke-width", 5)
            } else {
                // node
                svg_graph_legend.append("circle").attr("cx", x_pos[column_index]).attr("cy", y_pos[row_index]).attr("r", 6).style("fill", legend_colors[i])
            }
            svg_graph_legend.append("text").attr("x", x_pos[column_index] + 20).attr("y", y_pos[row_index]).text(legend_names[i]).style("font-size", "15px").attr("alignment-baseline", "middle")
        }
    }


    var svg_graph = d3
        .select("#container-1 .graph")
        .html('')
        .append("svg")
        .attr("width", graph_width)
        .attr("height", graph_height)
        .on("mouseover", Tooltip.mouseover);

    var svg_graph_legend = d3
        .select("#container-1 .graph")
        .append("svg")
        .attr("width", width)
        .attr("height", legend_height)

    draw_legend(svg_graph_legend, legend_width, legend_height, legend_num_columns)


    var gs = d3
        .graphScroll()
        .container(d3.select("#container-1"))
        .graph(d3.selectAll("#container-1 .graph"))
        // .eventId('uniqueId1')  // namespace for scroll and resize events
        .sections(d3.selectAll("#container-1 .sections > div"))
        .on('active', function (i) {
            draw_graph(svg_graph, graphs[i], graph_width, graph_height)
        });


    function makeTooltip() {
        return d3
            .select("body")
            .append("div")
            .attr("class", "tooltip");
    }
}
