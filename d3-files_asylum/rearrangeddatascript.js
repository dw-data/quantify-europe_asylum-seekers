(function() {
    var margin = { top: 140, left: 100, right: 150, bottom: 30},
    height = 2500 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var countries = ['Estonia','Latvia','Slovakia','Lithuania','Slovenia','Portugal','Czech Republic','Romania','Luxembourg','Ireland','Malta','Cyprus','Spain','Finland','Poland','Denmark','Bulgaria','Norway','Greece','Belgium','Netherlands','United Kingdom','Austria','Hungary','Italy','France','Sweden','Germany']

  var columns = ["aggregated_refused_entry_12_16","aggregated_applications_12_16","aggregated_alldecisions_12_16","aggregated_positive_decisions_12_16","aggregated_negative_decisions_12_16","aggregated_persons_found_illegal_12_16","aggregated_ordered_to_leave_12_16","aggregated_returned_to_3rdcountry_12_16"]

  var colourScale = d3.scaleOrdinal().domain(["Northern Europe", "Western Europe", "Southern Europe", "Eastern Europe"]).range(['#009BFF','#82B905','#DC0F6E','#EB6E14'])

  var xPositionScale = d3.scalePoint().domain(columns).range([60,width])
  
  var yPositionScale = d3.scalePoint().domain(countries).range([height,20])

  var circleRadiusScale = d3.scaleSqrt().domain([25,1511455]).range([2,50]);

  d3.queue()
    .defer(d3.csv, "allaggregatesSORTED.csv", function(d){
      // console.log(d)
      // all numbers are aggregates from 2012 to 2016
      d.country = d.GEO
      d.region = d.region
      d.indicator = d.indicator
      d.value = +d.value
      return d

    })
    .await(ready)

  function ready(error, datapoints) {

    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("r", function(d){
        return circleRadiusScale(d.value)
      })
      .attr("class", function(d){
        return d.country+d.indicator+"V"+d.value
      })
      .attr("cx", function(d){
        return xPositionScale(d.indicator)
      })
      .attr("cy", function(d){
        return yPositionScale(d.country)
        // sort
      })
      .attr("fill", function(d){
        return colourScale(d.region)
      })

    // Adding Values as labels
    svg.selectAll("text")
      .data(datapoints)
      .enter().append("text")
      .attr("text-anchor", "end")
      .text(function(d){
        return d.value
      })
      .attr("x", function(d){
         return xPositionScale(d.indicator)
      })
      .attr("y", function(d){
         return yPositionScale(d.country)
      })
      .attr("dy", ".35em")
      .attr("dx", ".70em")
      .style("fill", "#778D9E")
      .style("font-size", "11px");

    // Adding  axes
    var xAxis = d3.axisTop(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0,0)")
      .call(xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 90)
      .attr("dy", ".35em")
      .attr("transform", "rotate(-45)");

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .attr("transform", "translate(0,0)")
      // .attr("fill", none)
      .call(yAxis);

  
  }

})();
