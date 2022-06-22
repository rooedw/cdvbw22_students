import {
      bar,
      draw,
      } from "../lib/bursch.js";
      export function wrapBursch(width, height) { 
            
            function pie_svg(){
                  var svg1 = d3
                  .select("#container-4 .graph")
                  .html("")
                  .append("svg")
                  .attr("id",'svg1')
                  .attr("width", width*0.3)
                  .attr("height", height*0.83);
                  var svg2 = d3
                  .select("#container-4 .graph")
                  .append("svg")
                  .attr("id",'svg2')
                  .attr("width", width*0.3)
                  .attr("height", height*0.83);
                  var svg3 = d3
                  .select("#container-4 .graph")
                  .append("svg")
                  .attr("id",'svg3')
                  .attr("width", width*0.3)
                  .attr("height", height*0.83);}
            
            function bar_svg(){
                  var svg_bar = d3
                  .select("#container-4 .graph")
                  .html("")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);}     
         
            var gs2 = d3
            .graphScroll()
            .container(d3.select("#container-4"))
            .graph(d3.selectAll("#container-4 .graph"))
            .sections(d3.selectAll("#container-4 .sections > div"))
            .on("active", function (i) {
              switch (i) {
                case 0:
                        pie_svg()
                        draw("#container-4 .graph #svg1",'Studiengang', 300, 300,'data/bursch/Germania.csv');
                        draw("#container-4 .graph #svg2",'Konfession', 300, 300,'data/bursch/Germania.csv');
                        draw("#container-4 .graph #svg3",'Vater Beruf', 300, 300,'data/bursch/Germania.csv');
                        break;
                case 1:
                        bar_svg()
                        bar("#container-4 .graph > svg", 800, 400,'data/bursch/Germania.csv');
                        break;
                case 2:
                        pie_svg()
                        draw("#container-4 .graph #svg1",'Studiengang', 300, 300,'data/bursch/Normannia.csv');
                        draw("#container-4 .graph #svg2",'Konfession', 300, 300,'data/bursch/Normannia.csv');
                        draw("#container-4 .graph #svg3",'Vater Beruf', 300, 300,'data/bursch/Normannia.csv');
                        break;
                case 3:
                        bar_svg()
                        bar("#container-4 .graph > svg", 800, 400,'data/bursch/Normannia.csv')
                        break;
                case 4:
                        pie_svg()
                        draw("#container-4 .graph #svg1",'Studiengang',300, 300,'data/bursch/Ghibellinia.csv');
                        draw("#container-4 .graph #svg2",'Konfession', 300, 300,'data/bursch/Ghibellinia.csv');
                        draw("#container-4 .graph #svg3",'Vater Beruf', 300, 300,'data/bursch/Ghibellinia.csv');
                        break;
                  case 5:
                        bar_svg()
                        bar("#container-4 .graph > svg", 800, 400,'data/bursch/Ghibellinia.csv');
                        break;
                  case 6:
                        pie_svg()
                        draw("#container-4 .graph #svg1",'Studiengang', 300, 300,'data/bursch/Suevia.csv');
                        draw("#container-4 .graph #svg2",'Konfession', 300, 300,'data/bursch/Suevia.csv');
                        draw("#container-4 .graph #svg3",'Vater Beruf', 300, 300,'data/bursch/Suevia.csv');
                        break;
                  case 7:
                        bar_svg()
                        bar("#container-4 .graph > svg", 800, 400,'data/bursch/Suevia.csv');
                        break;
                        
              }
            });
        }