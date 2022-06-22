import {makeTooltip} from "../lib/mapGer.js";
import {lightRed, darkRed, green, blue, orange, black, pink, cyan, gray} from "./graph_network.js";

let Tooltip = makeTooltip();

export function bubbleChart(selector, width, height) {

    //const Tooltip = makeTooltip();

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = width
        height = height;

    var x = d3.scaleLinear()
        .range([0, width-120]);

    var y = d3.scaleLinear()
        .range([height, 0]);

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
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("data/relationships/bubble_chart.json").then(function(data) {

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

        // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
        var showTooltip = function (event, d) {
            tooltip
                .transition()
                .duration(200)
            tooltip
                .style("opacity", 1)
                .html("Beruf: " + d.Vater_Beruf + "<br>" + "Anzahl: " + d.Counts
                    + "<br><br>"
                    + "Top 3 Studiengänge der Kinder"
                    + "<br>" + d.subject1 + ": " + d.count1
                    + "<br>" + d.subject2 + ": " + d.count2
                    + "<br>" + d.subject3 + ": " + d.count3)
                .style("left", (event.pageX + 30) + "px")
                .style("top", (event.pageY + 30) + "px")
        }
        var moveTooltip = function (event, d) {
            tooltip
                .style("left", (event.pageX + 30) + "px")
                .style("top", (event.pageY + 30) + "px")
        }
        var hideTooltip = function (d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        }

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

})

    var gs = d3
        .graphScroll()
        .container(d3.select("#container-1"))
        .graph(d3.selectAll("#container-1 .graph"))
        // .eventId('uniqueId1')  // namespace for scroll and resize events
        .sections(d3.selectAll("#container-1 .sections > div"))
        .on('active', function(i){

        });
}

