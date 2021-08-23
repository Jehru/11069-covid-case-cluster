//  http://bl.ocks.org/jose187/4733747

console.log("Starting");

var width = 960,
    height = 700

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(.05)
    .distance(100)
    .charge(-100)
    .size([width, height]);


  // Creates a tooltip for all the charts except for the bubble chart
var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .text("If you can see this, there may be something wrong");

d3.json("cases.json", function(json) {
  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link")
    .style("stroke-width", function(d) { 
      return Math.sqrt(d.weight); 
    });

  var node = svg.selectAll(".node")
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  node.append("circle")
      .attr("r","10")
      .data(json.nodes)
      .on("mouseover", function (d) {

        d3.select(this).attr("r", 14).style("fill", "#429EA6");

        
        //If the investigation exists state that its being investigated
        if(d.underInvestigation) {

          // if location exists
          if(d.location){
            tooltip.html("Age: "+ d.age + "<br>" +
            "Sex: " + d.sex + "<br>" + 
            "Date: " + d.date + "<br>" + 
            "Location: " + d.location + "<br>" + 
            " This case is being investigated");
          } else {
            tooltip.html("Age: "+ d.age + "<br>" +
            "Sex: " + d.sex + "<br>" + 
            "Date: " + d.date + "<br>" + 
            "Location of transmission is unknown" + "<br>" + 
            " This case is being investigated");
          }

        } // if investigation doesnt exist
        else {
          // if location exists
          if(d.location){
            tooltip.html(
            "Age: "+ d.age + "<br>" +
            "Sex: " + d.sex + "<br>" + 
            "Date: " + d.date + "<br>" + 
            "Location: " + d.location);
            } else {

              tooltip.html(
                "Age: "+ d.age + "<br>" +
                "Sex: " + d.sex + "<br>" + 
                "Date: " + d.date + "<br>" + 
                "Location of transmission is unknown ");
            }
        }
        
        return tooltip.style("visibility", "visible");
       })
       .on("mousemove", function () {
        return tooltip
        .style("top", event.pageY - 5 + "px")
        .style("left", event.pageX + 15 + "px");
       })
       .on("mouseout", function () {
        return tooltip.style("visibility", "hidden");
      });

  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.id});

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
});