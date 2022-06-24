import {makeTooltip,} from "./mapGer.js";
import {lightRed, darkRed, green, blue, orange,pink} from "../script/graph_network.js";

let Tooltip = makeTooltip();
export const yellow ="#ece561";
export const purple ="#c296b7";
export const turquoise="#39e3c2";
export const lightgrey="#d2d8d7";

//creates the bar charts for the "Studentenverbindungen"
export function bar(selector, w, h, file) {
    
    var svg = d3.select(selector),
        width = w,
        height = h;
    
        svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 200)
        .attr("y", 50)
        .attr("font-size", "20px")
        .text("Studienbeginn")
        .style("font-weight","bold")
        .style('text-decoration', 'underline')

    
    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    //Uses the data out of the file, to create the graph
    d3.csv(file).then(function (data) {
        
        xScale.domain(data.map(function (d) {
            return d.Studiumbeginn;
        }));
        
        yScale.domain([0, 12]);
        
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "translate(-10,10)rotate(-45)")
            .style("font-weight","bold")
              
        g.append("text")
            .attr("x", 600)
            .attr('dy', '25em')
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Jahr");


        g.append("g")
            .call(d3.axisLeft(yScale))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr('dy', '-5em')
            .attr('text-anchor', 'end')
            .attr('stroke', 'black')
            .text('Anzahl')
        
        // creates the bars and mouseover
        g.selectAll()
            .data(data)
            .enter().append("rect")
            .attr("fill", darkRed)
            .on("mouseover", Tooltip.mouseover)
            .on("mousemove", (event, data) => {
                let dataString = "Studienbeginn: " + data.Studiumbeginn + "<br> Anzahl Mitglieder: " + data.Count_Studiumbeginn;
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
    })


}

//creates the pie charts for the "Studentenverbindungen"
export function draw(selector, category, w, h, file) {
    
    var svg = d3.select(selector),
        width = w,
        height = h,
        radius = Math.min(width, height) / 1.6;


    var g = svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 1.2 + ')');
    
    var color = d3.scaleOrdinal([pink,yellow,darkRed,green,blue,orange,purple,turquoise,lightgrey,lightRed])
    
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
        .outerRadius(radius - 50)
        .innerRadius(100);
    
    var label = d3.arc()
        .outerRadius(radius +20)
        .innerRadius(radius - 80);
    

    //uses the data to create the pie chart and mousover
    d3.csv(file).then(
        function (data) {

        var arc = g.selectAll()
                .data(pie(data))
                .enter().append('g')
            
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
                        let dataString = "Studiengang: " + d.data.Fach + "<br> Prozent: " + Math.round(d.data.Count_Fach * 100) / 100;
                        Tooltip.mousemove(event, dataString);
                    } else if (category == 'Konfession') {
                        let dataString = "Konfession: " + d.data.Konfession + "<br> Prozent: " + Math.round(d.data.Count_Konfession * 100) / 100;
                        Tooltip.mousemove(event, dataString);
                    } else if (category == 'Vater Beruf') {
                        let dataString = "Vater Beruf: " + d.data.Vater_Beruf + "<br> Prozent: " + Math.round(d.data.Count_Vater_Beruf * 100) / 100;
                        Tooltip.mousemove(event, dataString);
                    }
                })
                .on("mouseleave", Tooltip.mouseleave)
            
            //arc.append('text')
            //    .transition()
            //    .ease(d3.easeCircleOut)
            //    .duration(500)
            //    .delay(function(d,i){ return i * 50})
            //	.style('fill', 'black')
            //	.attr('transform', function(d){return 'translate(' + label.centroid(d)+ ')';})
            //	.text(function(d){
            //        if (category=='Studiengang' && d.data.Count_Fach>=0.1){
            //		    return d.data.Fach;} 
            //        else if (category=='Konfession' && d.data.Count_Konfession>0.08){
            //			return d.data.Konfession;}
            //        else if (category=='Vater Beruf'&& d.data.Count_Vater_Beruf>=0.1 && d.data.Vater_Beruf!='Andere'){
            //            return d.data.Vater_Beruf;}});


            svg.append('g')
                .attr('transform', 'translate(' + (width / 2 - 40) + ',' + (height / 1.2) + ')')
                .append('text')
                .text(category)
                .style("font-weight","bold")


        }
    );
}


export function draw_legend(svg_graph_legend, legend_width, legend_height, num_columns,legend_names,legend_colors) {
    var svg = d3.select(svg_graph_legend)
    var entries_per_column = Math.ceil(legend_colors.length / num_columns)
    var height_per_entry = Math.floor(legend_height / entries_per_column)
    var width_per_column = Math.floor(legend_width / num_columns)
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


            svg.append("circle").attr("cx", x_pos[column_index]).attr("cy", y_pos[row_index]).attr("r", 6).style("fill", legend_colors[i])

            svg.append("text").attr("x", x_pos[column_index] + 20).attr("y", y_pos[row_index]).text(legend_names[i]).style("font-size", "15px").attr("alignment-baseline", "middle")

        
    }
}

