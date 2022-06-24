import {lightRed, darkRed, green, blue, orange, black, pink, cyan, gray} from "./graph_network.js";

export function wordCloud(selector, width, height) {

// set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = width,
        height = height;

    // append the svg object to the body of the page
    var svg = d3.select(selector)
        .html('')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.json("data/relationships/word_cloud.json").then( function(data) {

        var myWords = data

        var color = d3.scaleOrdinal([lightRed, green, blue, orange, darkRed, blue, pink, cyan])
        //var color = d3.scaleOrdinal(d3.schemeCategory10);

        // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
        // Wordcloud features that are different from one word to the other must be here
        var layout = d3.layout.cloud()
            .size([width, height])
            .words(myWords.map(function (d) {
                return {text: d.word, size: d.size};
            }))
            .padding(5)        //space between words
            .rotate(function () {
                var max = 40;
                var min = -40;
                //return ~~(Math.pow((x - 500), 2)) +  ~~(Math.pow((y - 500), 2)) > ~~(Math.pow(400, 2))
                return ~~(Math.random() * 2) * (max - min) + min;
            })
            .fontSize(function (d) {
                return d.size;
            })      // font size of words
            .on("end", draw);
        layout.start();

        // This function takes the output of 'layout' above and draw the words
        // Wordcloud features that are THE SAME from one word to the other can be here
        function draw(words) {
            svg
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function (d) {
                    return d.size + "px";
                })
                .style("fill", function (d) { return color(d.text); })
                //.style("fill", "#69b3a2")
                .attr("text-anchor", "middle")
                .style("font-family", "Impact")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) {
                    return d.text;
                });
        }

    })
}