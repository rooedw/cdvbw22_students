const HEXBIN_RADIUS = 0.05;
const CIRCLE_SCALE_FACTOR = 0.01;
const MIN_CIRCLE_SIZE = 0.015;
const [bottomLeft, topRight] = [
  [5.87161922454851, 47.26985931396479],
  [15.03811264038086, 55.05652618408226],
];
let width;
let height;
let centered;
let projection = d3.geoMercator();
let svg;

let maxPathLength;

let geomap, mData, data;

let Tooltip = makeTooltip();

export async function preLoadData() {
  geomap = await makeGeomap();
  mData = await loadMovement();
  data = loadBirthDeathData();
}

async function createCircles() {
  binData((await data)[0]);
  renderDataWithHexBin(
    binData((await data)[0]),
    "birthCircle",
    bottomLeft,
    "rgb(255, 54, 54)"
  );

  renderDataWithHexBin(
    binData((await data)[1]),
    "deathCircle",
    topRight,
    "rgb(12, 0, 250)"
  );
}

async function loadMovement() {
  const mData = await d3.json("data/germany/student_movement.json");
  const lineArr = [];
  for (const startKey of Object.keys(mData)) {
    const startMapped = geomap[startKey];
    // mData[startKey] = {
    //   targets: mData[startKey],
    //   mapped: geomap[startKey],
    // };
    // skip places without mappings
    if (!startMapped) {
      continue;
    }

    for (const endKey of Object.keys(mData[startKey])) {
      const endMapped = geomap[endKey];
      // mData[startKey].targets = {
      //   count: mData[startKey].targets[endKey],
      //   mapped: geomap[endKey],
      // };
      // skip places without mappings
      if (!endMapped) {
        continue;
      }

      lineArr.push({
        start: startMapped,
        end: endMapped,
        count: mData[startKey][endKey],
      });
    }
  }
  return lineArr
    .filter((x) => inbox(bottomLeft, topRight, x.start.lon, x.start.lat))
    .filter((x) => inbox(bottomLeft, topRight, x.end.lon, x.end.lat));
}

export async function hideMovement() {
  svg
    .selectAll("path.arrow")
    .transition()
    .duration(500)
    .attr("stroke-dashoffset", "1000")
    .transition()
    .delay(600)
    .attr("display", "none");
}

export async function showMovement() {
  svg
    .selectAll("path.arrow")
    .transition()
    .duration(2500)
    .attr("stroke-dashoffset", "0")
    .attr("display", null);
  // .style("display", "none")
  // .style("display", null)
  // svg.on("click", (evt) => {
  //   let coords = [projection.invert([evt.offsetX, evt.offsetY])];
  //   g.selectAll("path.highlightCircle")
  //     .data(coords)
  //     .enter()
  //     .append("path")
  //     .datum((d) => {
  //       return d3.geoCircle().center(d).precision(50).radius(0.23)();
  //     })
  //     .attr("class", "highlightCircle")
  //     .attr("d", geoPath)
  // });
}

async function makeArrows() {
  const g = d3.select("#arrows");
  const geoPath = d3.geoPath().projection(projection);
  g.selectAll("path.arrow")
    // .data(mData.slice(0, 1))
    .data(mData)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("class", "arrow")
    .datum((d) => {
      return {
        type: "LineString",
        coordinates: [
          [d.start.lon, d.start.lat],
          [d.end.lon, d.end.lat],
        ],
        data: d,
      };
    })
    .attr("d", geoPath)
    .on("mouseover", Tooltip.mouseover)
    .on("mousemove", (event, rawData) => {
      const dataString = `Von: ${rawData.data.start.formatted}<br>Nach: ${rawData.data.end.formatted}`;
      Tooltip.mousemove(event, dataString);
    })
    .on("mouseleave", Tooltip.mouseleave)
    .attr("stroke-dasharray", "1000 1000")
    .attr("display", "none")
}

export async function makeMap(selector, w, h) {
  width = w;
  height = h;
  svg = d3.select(selector);
  const germany = await d3.json("data/germany/3_mittel.geo.json");
  projection.fitSize([width, height], germany);
  const geoPath = d3.geoPath().projection(projection);
  // svg.attr("width", width).attr("height", height);

  // states
  var g = svg.append("g").attr("id", "states");
  // movement arrows
  svg.append("g").attr("id", "arrows");
  makeArrows();

  g.selectAll("path.feature")
    .data(germany.features)
    .enter()
    .append("path")
    .attr("class", "feature")
    .attr("d", geoPath)
    .on("click", centerMap);

  svg.append("g").attr("class", "circles");
  createCircles();

  function centerMap(event, d) {
    // set centered to d if it was false or false if it was anything
    centered = centered !== d && d;
    // set class of all path elements to active if they are the element stored in centered
    var paths = svg.selectAll("path").classed("active", (d) => d === centered);
    // this selection also contains all circles (since they are paths as well!)

    // Starting translate/scale
    var t0 = projection.translate(),
      s0 = projection.scale();
    projection.fitSize([width, height], centered || germany);

    // Create interpolators
    var interpolateTranslate = d3.interpolate(t0, projection.translate()),
      interpolateScale = d3.interpolate(s0, projection.scale());

    const path = d3.geoPath().projection(projection);

    var circles = svg.select(".circles").selectAll("path");
    var interpolator = (t) => {
      projection.scale(interpolateScale(t)).translate(interpolateTranslate(t));
      paths.attr("d", path);
    };

    d3.transition()
      .duration(750)
      .tween("projection", () => interpolator);
  }
}
export function makeTooltip() {
  var t = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 1);

  t.mouseover = function (event, d) {
    d3.select(this).classed("tooltipHover", true);

    Tooltip.style("left", event.pageX + 5 + "px")
      .style("top", event.pageY + "px")
      .style("opacity", 0.9);
  };

  t.mousemove = function (event, d) {
    Tooltip.html(d)
      .style("left", event.pageX + 5 + "px")
      .style("top", event.pageY + "px");
  };
  t.mouseleave = function (event, d) {
    d3.select(this).classed("tooltipHover", false);

    Tooltip.style("opacity", 0);
  };
  return t;
}

async function loadBirthDeathData() {
  function filterFrequencyData(array, geomap) {
    return (
      array
        .filter((data) => data.count > 0)
        // keep if geomapping exists
        .filter((data) => geomap[data.city])
        // add lon, lat
        .map((data) => {
          let lon = geomap[data.city].lon;
          let lat = geomap[data.city].lat;

          return {
            ...data,
            lon,
            lat,
            x: projection([lon, lat])[0],
            y: projection([lon, lat])[1],
            formattedName: geomap[data.city].formatted,
          };
        })
        // remove if outside of bounding box
        .filter((data) => inbox(bottomLeft, topRight, data.lon, data.lat))
    );
  }

  let birthplaces = await d3.csv("data/germany/Geburtsort_Frequenz.csv");
  let deathplaces = await d3.csv("data/germany/Sterbeort_Frequenz.csv");
  birthplaces = filterFrequencyData(birthplaces, geomap);
  deathplaces = filterFrequencyData(deathplaces, geomap);
  // this should probably be equal
  // numB = birthplaces.reduce((sum, a) => sum + parseInt(a.count),0)
  // numD = deathplaces.reduce((sum, a) => sum + parseInt(a.count),0)
  return [birthplaces, deathplaces];
}
function inbox(bottomLeft, topRight, lon, lat) {
  // bottomLeft[0] = lon, 1=>lat
  // topRight[0] = lon, 1=> lat
  return (
    lon >= bottomLeft[0] &&
    lon <= topRight[0] &&
    lat >= bottomLeft[1] &&
    lat <= topRight[1]
  );
}
export async function renderCalls(fnNum, dNum) {
  const dataSync = await data;

  switch (fnNum) {
    // case 0:
    //   if (dNum == 0) renderData(dataSync[0], "birthCircle");
    //   else renderData(dataSync[1], "deathCircle");
    //   break;
    // case 1:
    //   if (dNum == 0)
    //     renderData(
    //       dataSync[0].filter((d) => d.count > 2),
    //       "birthCircle",
    //       bottomLeft,
    //       "rgb(255, 54, 54)"
    //     );
    //   else
    //     renderData(
    //       dataSync[1].filter((d) => d.count > 2),
    //       "deathCircle",
    //       topRight,
    //       "rgb(0, 0, 250)"
    //     );
    //   break;
    case 2:
      if (dNum == 0) {
        svg
          .selectAll("path.birthCircle")
          .transition()
          .style("display", null)
          .style("opacity", 1)
          .delay(function (data, i) {
            const d = data.properties;
            origin = bottomLeft;
            let dist = Math.hypot(d.x - origin[0], d.y - origin[1]);
            return dist * 100;
          });
      } else
        svg
          .selectAll("path.deathCircle")
          .transition()
          .style("display", null)
          .style("opacity", 1)
          .delay(function (data, i) {
            const d = data.properties;
            origin = bottomLeft;
            let dist = Math.hypot(d.x - origin[0], d.y - origin[1]);
            return dist * 100;
          });
      break;
  }
}

export function removeData(cssClass) {
  svg
    .selectAll("path." + cssClass)
    .transition()
    .style("opacity", 0)
    .style("display", "none")
    .delay(function (data, i) {
      const d = data.properties;
      origin = bottomLeft;
      let dist = Math.hypot(d.x - origin[0], d.y - origin[1]);
      return dist * 100;
    });
}

function renderData(data, cssClass, origin) {
  svg
    .selectAll("circle." + cssClass)
    .data(data)
    .enter()
    .append("circle")
    .on("mouseover", Tooltip.mouseover)
    .on("mousemove", (event, data) => {
      let dataString = data.formattedName + "<br> Anzahl: " + data.count;
      Tooltip.mousemove(event, dataString);
    })
    .on("mouseleave", Tooltip.mouseleave)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("class", cssClass)
    .transition()
    .duration(800)
    .ease(d3.easeBackOut)
    .attr("r", function (d, i) {
      return Math.sqrt(d.count);
    })
    .delay(function (d, i) {
      if (!origin) return 0;
      let dist = Math.hypot(d.lon - origin[0], d.lat - origin[1]);
      return dist * 250;
    });
}

function binData(data) {
  const blProj = bottomLeft;
  const trProj = topRight;
  let hexbin = d3
    .hexbin()
    // binning in lon/lat space! -> sets x y as lon lat unfortunately,
    // but projection won't work otherwise
    .x((d) => d.lon)
    .y((d) => d.lat)
    .extent(blProj, [trProj[0] - blProj[0], trProj[1] - blProj[1]])
    .radius(HEXBIN_RADIUS);
  let binned = hexbin(data);
  binned.forEach((x) => {
    x.largestCity = x.sort((a, b) => b.count - a.count)[0];
    x.totalPop = x.reduce((sum, a) => sum + parseInt(a.count), 0);
  });
  const circle = d3.geoCircle();

  //renders circles large to small
  binned.sort((x, y) => y.totalPop - x.totalPop);

  // transform object to make it svg-renderable
  binned = binned.map((data) => {
    let size = 0;
    for (const x of data) {
      size += parseInt(x.count);
    }
    const radius = Math.max(
      Math.sqrt(size) * CIRCLE_SCALE_FACTOR,
      MIN_CIRCLE_SIZE
    );

    const c = circle.center([data.x, data.y]).precision(50).radius(radius)();
    c.properties = data;
    return c;
  });

  return binned;
}

function renderDataWithHexBin(data, cssClass, origin) {
  const path = d3.geoPath().projection(projection);
  svg
    .select(".circles")
    .selectAll("circle." + cssClass)
    .data(data)
    .enter()
    .append("path")
    .attr("d", path)
    .on("mouseover", Tooltip.mouseover)
    .on("mousemove", (event, rawData) => {
      const data = rawData.properties;
      let dataString =
        data.largestCity.formattedName +
        "<br> Anzahl: " +
        data.largestCity.count;
      if (data.length > 1) {
        const total = data.totalPop;
        dataString += `<br>und ${
          data.length - 1
        } weitere Orte. <br>Insgesamt: ${total}`;
      }
      Tooltip.mousemove(event, dataString);
    })
    .on("mouseleave", Tooltip.mouseleave)
    .attr("class", cssClass)
    .style("opacity", 0)
    .style("display", "none");
}

async function makeGeomap() {
  // dsv -> custom delimiter
  const places = await d3.dsv(";", "data/germany/goodPlaces.csv");

  let geomap = {};

  for (const place of places) {
    geomap[place.query] = {
      lon: place.lon,
      lat: place.lat,
      formatted: place.formatted,
    };
  }
  return geomap;
}
