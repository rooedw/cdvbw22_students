import {makeTooltip,} from "./mapGer.js";

let Tooltip = makeTooltip();


export function bar(selector, w, h, url) {
    var svg = d3.select(selector),
        width = w,
        height = h;
    svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("Studienbeginn")

    svg.selectAll("*").remove();
    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    d3.csv(url).then(function (data) {
        xScale.domain(data.map(function (d) {
            return d.Studiumbeginn;
        }));
        yScale.domain([0, 12]);
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "translate(-10,10)rotate(-45)")
            .append("text")
            .attr("y", height - 350)
            .attr("x", width)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Studiumbeginn");

        g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function (d) {
                return d;
            }).ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr('dy', '-5em')
            .attr('text-anchor', 'end')
            .attr('stroke', 'black')
            .text('Anzahl')

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .on("mouseover", Tooltip.mouseover)
            .on("mousemove", (event, data) => {
                let dataString = "<br>Studienbeginn:" + data.Studiumbeginn + "<br> Anzahl Mitglieder: " + data.Count_Studiumbeginn;
                Tooltip.mousemove(event, dataString);
            })
            .on("mouseleave", Tooltip.mouseleave)
            .attr("x", function (d) {
                return xScale(d.Studiumbeginn);
            })
            .attr("y", function (d) {
                return yScale(d.Count_Studiumbeginn);
            })
            .attr("width", xScale.bandwidth())
            .transition()
            .ease(d3.easeLinear)
            .duration(500)
            .delay(function (d, i) {
                return i * 50
            })
            .attr("height", function (d) {
                return height - yScale(d.Count_Studiumbeginn);
            });


        svg.append('g')
            .attr('transform', 'translate(' + (width / 2 - 50) + ',' + 20 + ')')
            .append('text')
            .text('Studienbeginn')
            .style("font-weight","bold")
            .style('text-decoration', 'underline')
    })


}

export function draw(selector, category, w, h, url) {
    var svg = d3.select(selector),
        width = w,
        height = h,
        radius = Math.min(width, height) / 1.6;


    svg.selectAll("*").remove();

    var g = svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 1.2 + ')');
    var color = d3.scaleOrdinal(['#0c55e8', ' #a20ce8 ', '#0ce8e8', '#e80fad ', ' #16e80f ', ' #dee80f', ' #e89c0f ', ' #e8120f ', ' #aa9291 ', ' #d2d8d7 ', ' #614652 ', ' #7a5445 ', ' #215323 '])
    var pie = d3.pie().value(function (d) {
        if (category == 'Studiengang') {
            return d.Count_Fach;
        } else if (category == 'Konfession') {
            return d.Count_Konfession;
        } else if (category == 'Vater Beruf') {
            return d.Count_Vater_Beruf;
        }
    })
    var path = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(100);
    var label = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius - 150);
    d3.csv(url).then(
        function (data) {

            var arc = g.selectAll('.arc')
                .data(pie(data))
                .enter().append('g')
                .attr('class', 'arc')
            arc.append('path')
                .transition()
                .ease(d3.easeLinear)
                .duration(500)
                .delay(function (d, i) {
                    return i * 50
                })
                .attr('d', path)
                .attr('fill', function (d) {
                    if (category == 'Studiengang') {
                        return color(d.data.Fach);
                    } else if (category == 'Konfession') {
                        return color(d.data.Konfession);
                    } else if (category == 'Vater Beruf') {
                        return color(d.data.Vater_Beruf);
                    }
                })
            arc.on("mouseover", Tooltip.mouseover)
                .on("mousemove", (event, d) => {
                    if (category == 'Studiengang') {
                        let dataString = "<br>Studiengang: " + d.data.Fach + "<br> Prozent: " + Math.round(d.data.Count_Fach * 100) / 100;
                        Tooltip.mousemove(event, dataString);
                    } else if (category == 'Konfession') {
                        let dataString = "<br>Konfession: " + d.data.Konfession + "<br> Prozent: " + Math.round(d.data.Count_Konfession * 100) / 100;
                        Tooltip.mousemove(event, dataString);
                    } else if (category == 'Vater Beruf') {
                        let dataString = "<br>Vater Beruf: " + d.data.Vater_Beruf + "<br> Prozent: " + Math.round(d.data.Count_Vater_Beruf * 100) / 100;
                        Tooltip.mousemove(event, dataString);
                    }
                })
                .on("mouseleave", Tooltip.mouseleave)
            arc.append('text')
            .transition()
            .ease(d3.easeCircleOut)
            .duration(500)
            .delay(function(d,i){ return i * 50})
            	.style('fill', 'black')
            	.attr('transform', function(d){return 'translate(' + label.centroid(d)+ ')';})
            	.text(function(d){if (category=='Studiengang' && d.data.Count_Fach>=0.1){
            		return d.data.Fach;} else if (category=='Konfession'){
            			return d.data.Konfession;}else if (category=='Vater Beruf'&& d.data.Count_Vater_Beruf>=0.1){
            				return d.data.Vater_Beruf;}});


            svg.append('g')
                .attr('transform', 'translate(' + (width / 2 - 40) + ',' + (height / 1.2) + ')')
                .append('text')
                .text(category)
                .style("font-weight","bold")


        }
    );
}