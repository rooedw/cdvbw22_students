import {makeTooltip} from "../lib/mapGer.js";
import {lightRed, darkRed, green, blue, orange, black, pink, cyan, gray} from "./graph_network.js";

let Tooltip = makeTooltip();

export function bubbleChart(selector, width, height) {

    var margin = {top: 20, right: 20, bottom: 30, left: 40}

    var graph_height = 4 * height / 5
    var legend_width = width
    var legend_height = height - graph_height
    const legend_colors = [blue,lightRed, orange, green, darkRed, blue]
    const legend_num_columns = 3
    var legend_names = []

    //const Tooltip = makeTooltip();

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([graph_height, 0]);

    var z = d3.scaleLinear()
        .range([1, 40]);

    //var color = d3.scaleOrdinal(d3.schemeCategory10);
    var color = d3.scaleOrdinal([lightRed, green, blue, orange, darkRed, blue, pink, cyan])

    var xAxis = d3.axisBottom(x)

    var yAxis = d3.axisLeft(y)

    // **** var svg = d3.select("body").append("svg") ****
    var svg = d3.select(selector)
        .html('')
        .append("svg")
        .attr("width", width)
        .attr("height", graph_height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("data/relationships/bubble_chart.json").then(function(data) {

        legend_names = ["", data[2].Vater_Beruf, data[0].Vater_Beruf, data[3].Vater_Beruf, data[1].Vater_Beruf, data[4].Vater_Beruf]

        data.forEach(function (d) {
            d.x = +d.x;
            d.y = +d.y;
        });

        x.domain(d3.extent(data, function (d) { return d.x; })).nice();
        y.domain(d3.extent(data, function (d) { return d.y; })).nice();
        z.domain(d3.extent(data, function (d) { return d.Counts; })).nice();

        var tooltip = d3.select(selector)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            //.append("text")
            .attr("class", "label")
            .attr("x", width - 120)
            .attr("y", -6)
            .style("text-anchor", "end")
            //.style("opacity", 1)
            .text("x");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            //.append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("y")

        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "bubbles")
            .attr("r", function (d) { return z(d.Counts); })
            .attr("cx", function (d) { return x(d.x); })
            .attr("cy", function (d) { return y(d.y); })
            .style("fill", function (d) { return color(d.Vater_Beruf); })
            .on("mouseover", Tooltip.mouseover)
            .on("mousemove", (event, d) => {
                let dataString = ("Beruf: " + d.Vater_Beruf + "<br>" + "Anzahl: " + d.Counts
                    + "<br><br>"
                    + "Top 3 Studiengänge der Kinder"
                    + "<br>" + d.subject1 + ": " + d.count1
                    + "<br>" + d.subject2 + ": " + d.count2
                    + "<br>" + d.subject3 + ": " + d.count3);
                Tooltip.mousemove(event, dataString);
            })
            .on("mouseleave", Tooltip.mouseleave)

        var svg_graph_legend = d3
            .select(selector)
            .append("svg")
            .attr("width", width)
            .attr("height", legend_height)

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

                if (i == 0){
                    svg_graph_legend.append("text").attr("x", x_pos[column_index]).attr("y", y_pos[row_index]).text("Top 5 Berufe").style("font-size", "15px").attr("alignment-baseline", "middle")

                }
                else{
                    svg_graph_legend.append("circle").attr("cx", x_pos[column_index]).attr("cy", y_pos[row_index]).attr("r", 6).style("fill", legend_colors[i-1])

                    svg_graph_legend.append("text").attr("x", x_pos[column_index] + 20).attr("y", y_pos[row_index]).text(legend_names[i]).style("font-size", "15px").attr("alignment-baseline", "middle")

                }
            }
        }

        draw_legend(svg_graph_legend, legend_width, legend_height, legend_num_columns)



    })
}

