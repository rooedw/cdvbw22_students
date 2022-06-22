export function graph_example(width, height) {
    var colors = ['orange', 'purple', 'steelblue', 'pink', 'black']
    var svg2 = d3.select('#container-2 .graph').html('')
        .append('svg')
        .attr("width", width)
        .attr("height", height)

    var path = svg2.append('path')

    var gs2 = d3.graphScroll()
        .container(d3.select('#container-2'))
        .graph(d3.selectAll('#container-2 .graph'))
        //.eventId('uniqueId2')  // namespace for scroll and resize events
        .sections(d3.selectAll('#container-2 .sections > div'))
        .on('active', function(i){
            var h = height
            var w = width
            var dArray = [
                [[w/4, h/4], [w*3/4, h/4],  [w*3/4, h*3/4], [w/4, h*3/4]],
                [[0, 0],     [w*3/4, h/4],  [w*3/4, h*3/4], [w/4, h*3/4]],
                [[w/2, h/2], [w, h/4],      [w, h],         [w/4, h]],
                [[w/2, h/2], [w, h/4],      [w, h],         [w/4, h]],
                [[w/2, h/2], [w, h/2],      [0, 0],         [w/4, h/2]],
                [[w/2, h/2], [0, h/4],      [0, h/2],         [w/4, 0]],
            ].map(function(d){ return 'M' + d.join(' L ') })


            path.transition().duration(1000)
                .attr('d', dArray[i])
                .style('fill', colors[i])
        })
}

