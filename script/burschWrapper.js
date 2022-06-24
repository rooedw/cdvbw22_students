import {bar, draw, draw_legend, yellow,purple,turquoise,lightgrey} from "../lib/bursch.js";
import {darkRed, green, blue, orange, pink} from "./graph_network.js";

//creates svg´s for every chart and inserts the charts into container 4 of the scrollable page for the "Studentenverbindungen"
export function wrapBursch(width, height) { 

      function pie_svg(){
            var svg1 = d3
            .select("#container-4 .graph")
            .html("")
            .append("svg")
            .attr("id",'svg1')
            .attr("width", width*0.26)
            .attr("height", height*0.5);
            var svg2 = d3
            .select("#container-4 .graph")
            .append("svg")
            .attr("id",'svg2')
            .attr("width", width*0.26)
            .attr("height", height*0.5);
            var svg3 = d3
            .select("#container-4 .graph")
            .append("svg")
            .attr("id",'svg3')
            .attr("width", width*0.26)
            .attr("height", height*0.5);
            var svg4 = d3
            .select("#container-4 .graph")
            .append("svg")
            .attr("id",'svg4')
            .attr("width", width*0.26)
            .attr("height", height*0.3);
            var svg5 = d3
            .select("#container-4 .graph")
            .append("svg")
            .attr("id",'svg5')
            .attr("width", width*0.26)
            .attr("height", height*0.3);
            var svg6 = d3
            .select("#container-4 .graph")
            .append("svg")
            .attr("id",'svg6')
            .attr("width", width*0.26)
            .attr("height", height*0.3);}
      
      function bar_svg(){
            var svg_bar = d3
            .select("#container-4 .graph")
            .html("")
            .append("svg")
            .attr("width", width*0.75)
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
                  draw("#container-4 .graph #svg1",'Studiengang', 200, 200,'data/bursch/Germania.csv');
                  draw("#container-4 .graph #svg2",'Konfession', 200, 200,'data/bursch/Germania.csv');
                  draw("#container-4 .graph #svg3",'Vater Beruf', 200, 200,'data/bursch/Germania.csv');
                  draw_legend("#container-4 .graph #svg4",  width*0.26, height*0.3, 1,["Jura","Medizin", "Forstwissenschaft", "ev. Theologie"],[green,orange,darkRed,lightgrey]);
                  draw_legend("#container-4 .graph #svg5",  width*0.26, height*0.3, 1,["evangelisch","katholisch"],[pink,yellow]);
                  draw_legend("#container-4 .graph #svg6",  width*0.26, height*0.3, 1,["Arzt","Kaufmann", "Apotheker", "Pfarrer"],[green,blue,darkRed,purple]);
                  break;
            case 1:
                  bar_svg()
                  bar("#container-4 .graph > svg", 600, 350,'data/bursch/Germania.csv');
                  break;
            case 2:
                  pie_svg()
                  draw("#container-4 .graph #svg1",'Studiengang', 200, 200,'data/bursch/Normannia.csv');
                  draw("#container-4 .graph #svg2",'Konfession', 200, 200,'data/bursch/Normannia.csv');
                  draw("#container-4 .graph #svg3",'Vater Beruf', 200, 200,'data/bursch/Normannia.csv');
                  draw_legend("#container-4 .graph #svg4",  width*0.26, height*0.3, 1,["Seminarist","Jura", "ev. Theologie", "Medizin"],[turquoise,darkRed,lightgrey,blue]);
                  draw_legend("#container-4 .graph #svg5",  width*0.26, height*0.3, 1,["evangelisch"],[pink]);
                  draw_legend("#container-4 .graph #svg6",  width*0.26, height*0.3, 1,["Pfarrer","Kaufmann","Dekan","Professor"],[blue,green,darkRed,orange]);
                  break;
            case 3:
                  bar_svg()
                  bar("#container-4 .graph > svg", 600, 350,'data/bursch/Normannia.csv')
                  break;
            case 4:
                  pie_svg()
                  draw("#container-4 .graph #svg1",'Studiengang',200, 200,'data/bursch/Ghibellinia.csv');
                  draw("#container-4 .graph #svg2",'Konfession', 200, 200,'data/bursch/Ghibellinia.csv');
                  draw("#container-4 .graph #svg3",'Vater Beruf', 200, 200,'data/bursch/Ghibellinia.csv');
                  draw_legend("#container-4 .graph #svg4",  width*0.26, height*0.3, 1,["Medizin","Jura", "ev. Theologie", "Pharmazie Hospitierender"],[orange,green,pink,purple]);
                  draw_legend("#container-4 .graph #svg5",  width*0.26, height*0.3, 1,["evangelisch", "katholisch","muslimisch"],[pink,yellow,darkRed]);
                  draw_legend("#container-4 .graph #svg6",  width*0.26, height*0.3, 1,["Pfarrer","Arzt","Gerichtsnotar","Kameralverwalter"],[pink,green,purple,turquoise]);
                  break;
            case 5:
                  bar_svg()
                  bar("#container-4 .graph > svg", 600, 350,'data/bursch/Ghibellinia.csv');
                  break;
            case 6:
                  pie_svg()
                  draw("#container-4 .graph #svg1",'Studiengang', 200, 200,'data/bursch/Suevia.csv');
                  draw("#container-4 .graph #svg2",'Konfession', 200, 200,'data/bursch/Suevia.csv');
                  draw("#container-4 .graph #svg3",'Vater Beruf', 200, 200,'data/bursch/Suevia.csv');
                  draw_legend("#container-4 .graph #svg4",  width*0.26, height*0.3, 1,["Jura","Medizin","Fortswissenschaft", "ev. Theologie"],[green,blue,darkRed,orange]);
                  draw_legend("#container-4 .graph #svg5",  width*0.26, height*0.3, 1,["evangelisch", "katholisch"],[pink,yellow]);
                  draw_legend("#container-4 .graph #svg6",  width*0.26, height*0.3, 1,["Kaufmann","Arzt","Rittergutsbesitzer","Regierungsrat"],[blue,darkRed,turquoise,purple]);
                  break;
            case 7:
                  bar_svg()
                  bar("#container-4 .graph > svg", 600, 350,'data/bursch/Suevia.csv');
                  break;
                  
        }
      });
  }