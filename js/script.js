const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Set ranges
const x = d3.scaleBand().range([0, width]).padding(0.1);
const y = d3.scaleLinear().range([height, 0]);

const svg = d3
  .select(".container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let mapTitle = svg
  .append("text")
  .attr("class", "title")
  .attr("y", 24)
  .html("Simple  bar graph");

// Get data
d3.csv("./data/amounts.csv").then(function (data) {
  // Format
  data.forEach(function (d) {
    d.amounts = +d.amounts;
  });

  // Scale the range of the data in the domains
  x.domain(
    data.map(function (d) {
      return d.name;
    })
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.amounts;
    }),
  ]);

  // Append rectangles for bar chart
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.name);
    })
    .attr("width", x.bandwidth())
    .attr("y", function (d) {
      return y(d.amounts);
    })
    .attr("height", function (d) {
      return height - y(d.amounts);
    });

  // Add x axis
  const gx = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  //   gx.transition().duration(750).call(d3.axisBottom(x));

  // Add y axis
  svg.append("g").call(d3.axisLeft(y));
});
