var story =
  {
    topic: "Linear Algebra",
    modules:
      [
        {
          name: "Introducing Tensor",
          concepts: [
            {
              name: "Scalar",
              summary:"Scalar is one dimention number",
              animation: "number",
              asset: "",
            }, {
              name: "Vector",
              animation: "vector",
              summary:"Vector is a point in multi-dimention (feature) space.", 
            }, {
              name: "Matrix",
              summary:"Matrix is a way to transform vector into different space",
              animation: "",
              asset: "Transformation.gif",
            }
            , {
              name: "Tensor",
              summary:"Tensor is a collection of n-dimention vectors",
              animation: "", 
              asset: "",
            }
          ]
        }, { 
          name: "Matrix Operation",
          concepts: [
            {
              name: "Addition",
              animation: "+",
              asset: "",
            }, {
              name: "Mutiplication",
              animation: "*",
              asset: "",
            }, {
              name: "Matrix Transpose & Inverse",
              animation: "matrix2323",
              asset: "",
            }
          ]
        }

      ]
  };

/////



/////

var Config = {
  PaddingLeft: 20,
  PaddingTop: 20,
  ModuleIndent: 50,
  ModuleHeight: 80,
  ModuleTitleHeight: 18,
  ConceptWidth: 100,
  ConceptHeight: 18,
  ConceptIndent: 10,
  CircleR: 3,
  LeadingAnimationDuration: 500,
  ConceptAnimationDuration: 1000,
  ClueAnimationDuration: 3000,
  DisplayWindowX:600,
  DisplayWindowY:20,
  DisplayWindowWidth:360,
  DisplayWindowHeight:1080 * 400/1920,
  ScaleFactor:8,
};






var svg = d3.select("#chalkboard");

function drawModule(d, i) {
  // draw circle of station
  svg.append("circle")
    .attr("class", "clue-circle")
    .attr("cx", Config.PaddingLeft + Config.ModuleIndent + Config.CircleR)
    .attr("cy", Config.PaddingTop + Config.ModuleIndent + i * Config.ModuleHeight)
    .attr("r", 0)
    .transition()
    .duration(Config.LeadingAnimationDuration)
    .attr("r", Config.CircleR);

  //draw module station name
  svg.append("text")
    .attr("class", "station")
    .attr("x", Config.PaddingLeft + Config.ModuleIndent + Config.ConceptIndent)
    .attr("y", Config.PaddingTop + Config.ModuleIndent + i * Config.ModuleHeight)
    .text(d.name)
    .attr("fill-opacity", 0)
    .transition()
    .duration(Config.ConceptAnimationDuration)
    .attr("fill-opacity", 1)
    .on("end", function () { drawConcept(d, i); });


}


/*
 d : module
 i : module index
*/
function drawConcept(d, i) {


  //draw module concept buildings
  concepts = svg.selectAll("p").
    data(d.concepts).
    enter();


  concepts.append("text")
    .attr("class", "building")
    .attr("x", function (concept, j) { return Config.PaddingLeft + Config.ModuleIndent + Config.ConceptIndent + j * Config.ConceptWidth; })
    .attr("y", Config.PaddingTop + Config.ModuleTitleHeight + Config.ModuleIndent + i * Config.ModuleHeight)
    .attr("fill-opacity", 0)
    .transition()
    .delay(function (concept, j) { 
      var result = i *Config.ConceptAnimationDuration // module animation
        + j * ( Config.ConceptAnimationDuration + Config.ClueAnimationDuration + Config.LeadingAnimationDuration) // concept animation
        ;
      return result;
     })
    .duration(Config.ConceptAnimationDuration)
    .attr("fill-opacity", 1)
    .text(function (concept, j) { return concept.name })
    .on("end", function (concept, j) {
      var id = "concept-animation-" + i + j;
      var dockX = Config.PaddingLeft + Config.ModuleIndent + Config.ConceptIndent + j * Config.ConceptWidth;
      var dockY = Config.PaddingTop + Config.ModuleIndent + i * Config.ModuleHeight + Config.ModuleTitleHeight + Config.ConceptHeight;

      var x = Config.DisplayWindowX + 50;
      var y = Config.DisplayWindowY + Config.DisplayWindowHeight/2;

      var transform = "translate("+x + ", "+y+") scale("+Config.ScaleFactor +")" ;
      var transformDock = "translate("+dockX + ", "+dockY+") scale(1)" ;


      
      //draw concept summary 

      svg.select("#conceptSummary")
          .attr("fill-opacity", 0)
          .attr("class", "building-summary") 
          .text(concept.summary)
          .attr("x", Config.DisplayWindowX)
          .attr("y", Config.DisplayWindowY + Config.DisplayWindowHeight + 10)
          .transition()
          .duration(Config.LeadingAnimationDuration)
          .attr("fill-opacity", 1);
 
      // draw concept clue animation
      if (concept.animation == "number") {  
        var g = svg.append("text") 
          .attr("id", id)
          .attr("fill-opacity", 0)
          .attr("class", "clue-shape") 
          .attr("transform", transform)
          .transition()
          .duration(100)
          .attr("fill-opacity", 1)
          .on("end",function(){ 
            g.transition()
              .delay(Config.ClueAnimationDuration)
              .duration(Config.LeadingAnimationDuration)
              .attr("transform",transformDock);
          });

        var numAnim = new CountUp(id, 24.02, 99.99, Config.ClueAnimationDuration / 1000); 
        numAnim.start();


      }
      else if (concept.animation == "vector") {
        var g = svg.append("line")
          .attr("marker-end", "url(#arrow)")
          .attr("class", "clue-line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 5)
          .attr("y2", 5)
          .attr("transform", transform)
          .transition()
          .duration(Config.ClueAnimationDuration)
          .attr("x2", 15)
          .attr("y2", 5)
          .on("end",function(){ 
            g.transition()
            .duration(Config.LeadingAnimationDuration)
              .attr("transform",transformDock);
          })


      }
      else if (concept.animation == "matrix") {
        var g = svg.append("rect")
          .attr("class", "clue-shape")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 20)
          .attr("height", 10)
          .attr("transform", transform)
          .transition()
          .duration(Config.ClueAnimationDuration)
          .attr("transform", transform + " skewX(-3)skewY(-4)")
          .on("end",function(){ 
            g.transition()
              .duration(Config.LeadingAnimationDuration)
              .attr("transform",transformDock+ " skewX(-3)skewY(-4)");
          })

      }
      else if(concept.asset != "")
      { 
        var g = d3.select("#assetImage")
          .attr("src","images/"+concept.asset)  
          .style("visibility","visible")
          .transition()
          .duration(Config.ClueAnimationDuration) 
          .on("end",function(){ 
            d3.select("#assetImage") 
            .style("visibility","hidden");
          });


      }


    });
}


 var concept_sum = 0;

function drawModules() {
  // draw path to stations
  modules.append("line")
    .attr("class", "trail-path-line")
    .attr("y1", function (d, i) { return Config.PaddingTop + Config.ModuleIndent + i * Config.ModuleHeight })
    .attr("x1", Config.PaddingLeft)
    .attr("y2", function (d, i) { return Config.PaddingTop + Config.ModuleIndent + i * Config.ModuleHeight })
    .attr("x2", Config.PaddingTop)
    .transition()
    .duration(Config.LeadingAnimationDuration)
    .delay(function (d, i) {
      var result = i *Config.ConceptAnimationDuration; // module animation
      result = result +  concept_sum* ( Config.ConceptAnimationDuration + Config.ClueAnimationDuration + Config.LeadingAnimationDuration) // previous concept animation;
      concept_sum = concept_sum + d.concepts.length;
      return result;
    })
    .attr("x2", Config.PaddingLeft + Config.ModuleIndent)
    .on("end", drawModule);
}


modules = svg.selectAll("line")
  .data(story.modules)
  .enter();

// Trail head text 
svg.append("circle")
  .attr("class", "clue-circle")
  .attr("cx", Config.PaddingLeft)
  .attr("cy", Config.PaddingTop - Config.CircleR)
  .attr("r", 0)
  .transition()
  .duration(Config.LeadingAnimationDuration)
  .attr("r", Config.CircleR);

svg.append("text")
  .attr("class", "trail-head-text")
  .attr("x", Config.PaddingLeft + Config.ConceptIndent)
  .attr("y", Config.PaddingTop - Config.CircleR)
  .text(story.topic)
  .attr("fill-opacity", 0)
  .transition()
  .duration(Config.LeadingAnimationDuration)
  .attr("fill-opacity", 1);

// line for trail vertical
svg.append("line")
  .attr("class", "trail-path-line")
  .attr("x1", Config.PaddingLeft)
  .attr("y1", function (d, i) { return Config.PaddingTop + i * Config.ModuleHeight })
  .attr("x2", Config.PaddingTop)
  .attr("y2", function (d, i) { return Config.PaddingTop + i * Config.ModuleHeight })
  .transition()
  .duration(Config.ClueAnimationDuration)
  .attr("x2", Config.PaddingLeft)
  .attr("y2", 1000)
  .on("end", drawModules);


  //draw display window border
svg.append("rect")
  .attr("class","display-window")
  .attr("x",Config.DisplayWindowX)
  .attr("y",Config.DisplayWindowY)
  .transition()
  .duration(Config.ClueAnimationDuration)
  .attr("width",Config.DisplayWindowWidth)
  .attr("height",Config.DisplayWindowHeight)
  .attr("fill-opacity",0.4);
 
  // draw asset image
 d3.select("body").append("img")
 .attr("id","assetImage")
 .attr("class","asset-image")
  .attr("style","position:absolute;left:"+Config.DisplayWindowX+"px;top:"+Config.DisplayWindowY+"px")
  .attr("width",Config.DisplayWindowWidth - 5)
  .attr("height",Config.DisplayWindowHeight - 5)
  .style("visibility","hidden")  ;


//draw concept summary text
svg.selectAll("#conceptSummary")
  .data([""])
  .enter()
  .append("text")
  .attr("id","conceptSummary");


var state = "";
  //set full screen
svg.append("text")
  .attr("id","fullscreen-button")
  .attr("class","fullscreen-button")
  .text("#")
    .attr("x",Config.DisplayWindowX + Config.DisplayWindowWidth + 20)
    .attr("y",20)
    .on("click",function(){

      if(state != "fullscreen")
      {
      var w = window.parent.innerWidth
      || window.parent.document.documentElement.clientWidth
      || window.parent.document.body.clientWidth;
  
      var h = window.parent.innerHeight
      || window.parent.document.documentElement.clientHeight
      || window.parent.document.body.clientHeight;
  
      var iframe = window.parent.document.querySelector("iframe");  
      iframe.setAttribute("width", "100%");
      iframe.setAttribute("height", "100%"); 
      iframe.setAttribute("style", "z-idex:10000; background:rgba(255,255,255,0.5);position: fixed;left:0px;top:0px;bottom:0px;right:0px;");
      state = "fullscreen";
    }
      else
      {var iframe = window.parent.document.querySelector("iframe");  
      iframe.setAttribute("width", "1000px");
      iframe.setAttribute("height", "500px"); 
      iframe.setAttribute("style", "");
      state = "";

      }
    })
    ;




