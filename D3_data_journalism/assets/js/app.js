//Step 1: Set up our chart
//set svg dimensions
var svgWidth = 960;
var svgHeight = 500;

//set borders in svg
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

//calculate chart height and width
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper
//append an svg element to the chart with appropriate height and width
// =================================
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Append a div to the body to create tooltips, assign it a class
d3.select(".chartGroup").append("div").attr("class", "tooltip").style("opacity", 0);

//initial Parameters
//var chosenXAxis = "poverty";
//var chosenYAxis = "healthcare";
// Step 3:
// Import data from the data.csv file
// =================================
d3.csv("assets/data/data.csv").then(function(healthData) {
   console.log(healthData)
  // Step 4: Parse Data as numbers
    //==============================
  healthData.forEach(function(data) {
     data.poverty = +data.poverty;
     data.healthcare = +data.healthcare;
  });
  // Step 5: Create Scales
 //==============================
  var xLinearScale = d3.scaleLinear().range([0, width]);
  var yLinearScale = d3.scaleLinear().range([height, 0]);

 // Step 6: Create Axes
   // =============================================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
   
 // Scale the domain
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  xMin = d3.min(healthData, function(data) {
    return +data.poverty * 0.90;
  });

  xMax = d3.max(healthData, function(data) {
    return +data.poverty * 1.04;
  });

  yMin = d3.min(healthData, function(data) {
    return +data.healthcare * 0.95;
  });

  yMax = d3.max(healthData, function(data) {
    return +data.healthcare *1.04;
  });

  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([yMin, yMax]);

  // Initialize tooltip 
  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
        var stateName = data.state;
        var pov = +data.poverty;
        var health = +data.healthcare;
        return (
            stateName + '  Poverty: ' + pov + '%  Physically Active: ' + health +'%'
        );
    });

// Create tooltip
  chartGroup.call(toolTip);

  chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", function(data, index) {
        return xLinearScale(data.poverty)
    })
    .attr("cy", function(data, index) {
        return yLinearScale(data.healthcare)
    })
    .attr("r", "15")
    .attr("fill", "lightblue")
    // display tooltip on click
    .on("mouseenter", function(data) {
        toolTip.show(data);
    })
    // hide tooltip on mouseout
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

// Appending a label to each data point
  chartGroup.append("text")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .selectAll("tspan")
    .data(healthData)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.poverty - 0);
        })
        .attr("y", function(data) {
            return yLinearScale(data.healthcare - 0.2);
        })
        .text(function(data) {
            return data.abbr
        });

// Append an SVG group for the xaxis, then display x-axis 
  chartGroup
    .append("g")
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

// Append a group for y-axis, then display it
  chartGroup.append("g").call(leftAxis);

// Append y-axis label
  chartGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0-margin.left + 40)
    .attr("x", 0 - height/2)
    .attr("dy","1em")
    .attr("class", "axis-text")
    .text("Physically Active (%)")

// Append x-axis labels
  chartGroup
    .append("text")
    .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
    )
    .attr("class", "axis-text")
    .text("In Poverty (%)");
});



