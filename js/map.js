// The svgMap
const w = 900;
const h = 900;
const svgMap = d3
  .select("#kenya_map")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// Map and projection
const path = d3.geoPath();
const projection = d3
  .geoMercator()
  .scale(4600)
  .center([36, 0])
  .translate([w / 2, h / 2]);

// Data and color scale
let data = new Map();
const colorScale = d3
  .scaleThreshold()
  .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .range(d3.schemeBlues[7]);

// Load external data and boot
Promise.all([
  d3.json("./data/kenya.json"),
  d3.csv("./data/unemployment-x.csv", function (d) {
    data.set(+d.id, +d.rate);
  }),
]).then(function (loadData) {
  let topo = loadData[0];

  // create a tooltip
  var Tooltip = d3
    .select("#kenya_map")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("width", "auto");

  let mouseOver = function (event, d) {
    d3.selectAll(".Country").transition().duration(200).style("opacity", 0.5);
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black");

    Tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "black").style("opacity", 1);
  };

  let mouseLeave = function (d) {
    Tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 0.8);

    d3.selectAll(".Country").transition().duration(200).style("opacity", 0.8);
    d3.select(this).transition().duration(200).style("stroke", "transparent");
  };

  var mouseMove = function (event, d) {
    if (d.properties?.COUNTY_NAM) {
      Tooltip.html(`${d.properties?.COUNTY_NAM}: ${d.total} %`)
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px");
    }
  };

  let mapTitle = svgMap
    .append("text")
    .attr("class", "title")
    .attr("y", 24)
    .html("Kenya counties unemployment rates");

  // Draw the map
  svgMap
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
    // draw each country
    .attr("d", d3.geoPath().projection(projection))
    // set the color of each country
    .attr("fill", function (d) {
      d.total = data.get(d.properties?.COUNTY_COD);
      return colorScale(d.total);
    })
    .style("stroke", "transparent")
    .attr("class", function (d) {
      return "Country";
    })
    .style("opacity", 0.8)
    .on("mouseover", mouseOver)
    .on("mousemove", mouseMove)
    .on("mouseleave", mouseLeave);
});
