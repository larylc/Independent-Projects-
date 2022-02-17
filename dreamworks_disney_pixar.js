/*==================================================
// Scrolling 
==================================================*/



function splitScroll(){
    const controller = new ScrollMagic.Controller();

    new ScrollMagic.Scene({
        duration: "110%",
        triggerElement: ".modeling",
        triggerHook: 0
    })
    .setPin(".modeling")
    //.addIndicators()
    .addTo(controller);
}
splitScroll();








/*==================================================
// Finance and Reception
==================================================*/
 
function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function drawBar(width_size, axis_variable, metric, target_chart, tooltip_target, tooltip_metric1, tooltip_metric2,tooltip_metric3, trigger_point) {
    // 2. Create Chart Dimensions
    const width = width_size
    let dimensions = {
        width,
        height: width*0.6,
        margin: {
            top: 30,
            right: 10,
            bottom: 50,
            left: 50
        }
    }
   
    dimensions.boundedWidth = dimensions.width
        -dimensions.margin.right -dimensions.margin.left
    dimensions.boundedHeight = dimensions.height
        -dimensions.margin.top -dimensions.margin.left
 
 
// 4. Load Data  
const data = await d3.csv("https://raw.githubusercontent.com/larylc/DreamWorks-Disney-or-Pixar/main/all_movie_data.csv")
   
const xAccessor = d => d["name"]
const yAccessor = d => parseFloat(d[metric])
const colorAccessor = d => d.company
 
// 4. Draw Canvas
const wrapper = d3.select(target_chart)
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
 
let bounds = wrapper
    .append("g")
    .attr("class", "bounds")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`
    );
 
// 5. Create scales
const xScale = d3.scaleBand()
    .domain(data.map(xAccessor))
    .range([0,dimensions.boundedWidth])
    .padding(0.4);
   
const yScale = d3.scaleLinear()
    .domain(d3.extent(data,yAccessor))
    .range([dimensions.boundedHeight, 0])
 
 
const colorScale = d3.scaleOrdinal()
    .domain(["Pixar", "Disney", "DreamWorks"])
    .range(["#9EAFE6",  "#5F5BF3", "#fff"])  
 
// 6. Draw Data

 
const bars = bounds.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class","bar")
    .attr("x", (d) =>  xScale(xAccessor(d)))
    .attr("y", (d) => dimensions.boundedHeight)
    .attr("width",  xScale.bandwidth())
    .attr("height", (d) => yScale(yAccessor(0)))
    .attr("fill", d=> colorScale(colorAccessor(d)))


var controller = new ScrollMagic.Controller();
var sectionTwoScene = new ScrollMagic.Scene({
    triggerElement: trigger_point, 
    reverse: false})
    .setClassToggle(trigger_point)
    .on('enter', (e) => {
        bars.transition()
        .duration(2000)
        .attr("y", (d) => yScale(yAccessor(d)))
        .attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
    })
    .triggerHook(1)
    .addTo(controller);

bars.on("mouseenter", onMouseEnter )
        .on("mouseleave", onMouseLeave)
 
    const tooltip = d3.select(tooltip_target)
 
    function onMouseEnter(event, d) {
            tooltip.select(tooltip_metric1)
                .text(d.company)
            tooltip.select(tooltip_metric2)
                .text(xAccessor(d))
            tooltip.select(tooltip_metric3)
                .text(addCommas(yAccessor(d)))
            tooltip.style("opacity", 1)
           
 
 
        const x = xScale(xAccessor(d)) + dimensions.margin.left
        const y = yScale(yAccessor(d)) + dimensions.margin.top
           
            //tooltip.style("left", x + "px").style("top", y + "px")
 
            tooltip.style("transform", `translate(`
                +`calc(-50% + ${x}px),`
                +`calc(-100% + ${y}px)`
                +`)`)
        }
    function onMouseLeave(event, d){
        tooltip.style("opacity", 0)
    }

//Peripheral
const xAxisGenerator  = d3.axisBottom()
    .scale(xScale)

const xAxis = bounds.append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    .attr("class", "x-axis")

const xAxisLabel = xAxis.append("text")
    .attr("x", dimensions.boundedWidth/2 )
    .attr("y", dimensions.margin.bottom -10)
    .attr("fill", "white")
    .style("font-size", "1.4em")
    .text(axis_variable)
    .style("font-family", "Century")

 
}


drawBar(parseInt(d3.select(".col1").style("width"), 10), "Budget","budget", ".chart1", "#tooltip1", "#company1", "#name1","#budget1", ".chart1" );
drawBar(parseInt(d3.select(".col1").style("width"), 10), "World Box Office Gross","box_office_gross_world", ".chart2", "#tooltip2","#company2", "#name2","#budget2", ".chart2");
drawBar(parseInt(d3.select(".col1").style("width"), 10),"US Box Office Gross","box_office_gross_us", ".chart3", "#tooltip3","#company3", "#name3","#budget3", ".chart3");
drawBar(280,"IMDB Score","imdb_score", ".chart4", "#tooltip4", "#company4", "#name4","#score4", ".chart4");
drawBar(280, "Rotten Tomatoes Score","rotten_tomatoes_score", ".chart5", "#tooltip5","#company5", "#name5","#score5", ".chart5" );
drawBar(280, "Metacritic Score","metacritic_score", ".chart6", "#tooltip6","#company6", "#name6","#score6", ".chart6" ); 
 


 


/*==================================================
Impact
=============*/

async function drawCirc(width_size, metric, target_chart, tooltip_target, tooltip_metric1, tooltip_metric2, legend_metric, trigger_point) {

// Dimensions 
    const width = width_size;
    const height = width_size;
    

// Canvas 
    const svg = d3.select(target_chart)
    .append("svg")
        .attr("width", width_size)
        .attr("height", width_size)
    
// Load Data 
    const data = await d3.csv("https://raw.githubusercontent.com/larylc/DreamWorks-Disney-or-Pixar/main/all_movie_data.csv")
    const sizeAccessor = d => parseFloat(d[metric])
    const colorAccessor = d => d.company

// Scales     
    const sizeScale = d3.scaleLinear()
        .domain(d3.extent(data,sizeAccessor))
        .range([0,width])
        .nice()
    
    const colorScale = d3.scaleOrdinal()
        .domain(["Pixar", "Disney", "DreamWorks"])
        .range(["#9EAFE6",  "#5F5BF3", "#fff"])   
    

//Draw Data 
    const node = svg.append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("class", "node")
        .attr("r", d=> sizeScale(0))
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", d=> colorScale(colorAccessor(d)))
        .style("fill-opacity", 0.85)
        .attr("stroke", d=> colorScale(colorAccessor(d)))
    
//Force Simulation
    const simulation = d3.forceSimulation()
        .force("forceX", d3.forceX().strength(.2).x(width * .5))
        .force("forceY", d3.forceY().strength(.2).y(height * .5))
        .force("center", d3.forceCenter().x(width / 2).y(height / 2))
        .force("charge", d3.forceManyBody().strength(-20)) 
        .force("collide", d3.forceCollide().radius(d=> sizeScale(sizeAccessor(d))/9)) 

    simulation
        .nodes(data)
        .on("tick", function(d){
          node
              .attr("cx", d => d.x)
              .attr("cy", d => d.y)
        });


//Interactions 

var controller = new ScrollMagic.Controller();
var sectionTwoScene = new ScrollMagic.Scene({
    triggerElement: trigger_point, 
    reverse: false})
    .setClassToggle(trigger_point)
    .on('enter', (e) => {
        node.transition()
        .duration(2000)
        .attr("r", d=> sizeScale(sizeAccessor(d))/10)

    })
    .triggerHook(1)
    .addTo(controller);


node.on("mouseenter", onMouseEnter )
        .on("mouseleave", onMouseLeave)

    const tooltip = d3.select(tooltip_target) 

    function onMouseEnter(event, d) {
            tooltip.select(tooltip_metric1)
                .text(d.name)
            tooltip.select(tooltip_metric2)
                .text(addCommas(sizeAccessor(d)))
            tooltip.style("opacity", 1)
            

            //tooltip.style("left", x + "px").style("top", y + "px")

            tooltip.style("transform", `translate(`
                +`calc(-50% + ${d.x}px),`
                +`calc(-100% + ${d.y}px)`
                +`)`)
        }
    function onMouseLeave(event, d){
        tooltip.style("opacity", 0)
    }

//Legend 
svg.append("circle").attr("cx",width/2 - 15).attr("cy",18).attr("r", 2).style("fill", "white")
svg.append("circle").attr("cx",width/2).attr("cy",18).attr("r", 4).style("fill", "white")
svg.append("circle").attr("cx",width/2 + 20).attr("cy",18).attr("r", 6).style("fill", "white")

svg.append("text").attr("x", width/2 - 75).attr("y", 6.9).text("Circle Size: # of " + legend_metric).style("font-size", "13px").style("fill","white").attr("alignment-baseline","middle")
svg.append("text").attr("x", width/2 - 60).attr("y", 18).text("Less").style("font-size", "13px").style("fill","white").attr("alignment-baseline","middle")
svg.append("text").attr("x", width/2 + 40).attr("y", 18).text("More").style("font-size", "13px").style("fill", "white").attr("alignment-baseline","middle")
 

    }

drawCirc(parseInt(d3.select(".col5").style("width"), 10), "wiki_page_views", ".chart7", "#tooltip7", "#name7","#wiki-metric7", "Page Views", ".chart7" );
drawCirc(parseInt(d3.select(".col5").style("width"), 10), "wiki_link_count", ".chart8", "#tooltip8", "#name8","#wiki-metric8", "Link Counts", ".chart8" );



/*==================================================
Features
=============*/

async function drawHBar(width_size, target_data, metric, target_chart, tooltip_target, tooltip_metric, trigger_point){
     // 2. Create Chart Dimensions
     const width = width_size;
     let dimensions = {
         width,
         height: width*0.6,
         margin: {
             top: 10,
             right: 20,
             bottom: 10,
             left: 50
         }
     }
    
     dimensions.boundedWidth = dimensions.width
         -dimensions.margin.right -dimensions.margin.left
     dimensions.boundedHeight = dimensions.height
         -dimensions.margin.top -dimensions.margin.left
  
  
 // 4. Load Data  
 const data = await d3.csv(target_data)
 const drawHBarChart = function() {
    
 const xAccessor = d => parseFloat(d[metric])
 const yAccessor = d => d["company"]
  
 // 4. Draw Canvas
 const wrapper = d3.select(target_chart)
     .append("svg")
     .attr("width", dimensions.width)
     .attr("height", dimensions.height)
  
 let bounds = wrapper
     .append("g")
     .attr("class", "bounds")
     .style(
       "transform",
       `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`
     );
  
 // 5. Create scales
 const xScale = d3.scaleLinear()
     .domain([ d3.min(data, xAccessor), 0])
     .range([0, dimensions.boundedWidth ])

    
 const yScale = d3.scaleBand()
     .domain(data.map(yAccessor))
     .range([0, dimensions.boundedHeight])
     .padding(0.05);
  

 // 6. Draw Data
 const bars = bounds.selectAll("rect")
     .data(data)
     .join("rect")
     .attr("class","bar")
     .attr("x", (d) => xScale(Math.min(0, xAccessor(d))))
     .attr("y", (d) => yScale(yAccessor(d)))
     .attr("width", (d) => Math.abs(xScale(xAccessor(d) -xScale(0))))
     .attr("height", yScale.bandwidth() )
     .attr("fill","#4e49e6")
     .style("opacity", 0)



//7. Peripherals
const yAxisGenerator = d3.axisLeft("text")
    .scale(yScale)

  
const yAxis = bounds
  .append("g")
  .call(yAxisGenerator)
  .style("transform", `translateX(${dimensions.boundedWidth + dimensions.margin.right}px)`)
  .attr("class", "y-axis")


  //interactions 
 
  var controller = new ScrollMagic.Controller();
  var sectionTwoScene = new ScrollMagic.Scene({
      triggerElement: trigger_point, 
      reverse: false})
      .setClassToggle(trigger_point)
      .on('enter', (e) => {
          bars.transition()
          .duration(2000)
          .style("opacity", 1)

      })
      .triggerHook(1)
      .addTo(controller);



bars.on("mouseenter", onMouseEnter )
    .on("mouseleave", onMouseLeave)

const tooltip = d3.select(tooltip_target)

function onMouseEnter(event, d) {
    tooltip.select(tooltip_metric)
        .text(xAccessor(d))
    tooltip.style("opacity", 1)
   

const x = xScale(xAccessor(d)) + dimensions.margin.left
const y = yScale(yAccessor(d)) + dimensions.margin.top
   
    //tooltip.style("left", x + "px").style("top", y + "px")

    tooltip.style("transform", `translate(`
        +`calc(-50% + ${x}px),`
        +`calc(-100% + ${y}px)`
        +`)`)
}
function onMouseLeave(event, d){
tooltip.style("opacity", 0)
}



     }
drawHBarChart()



}

drawHBar(parseInt(d3.select(".col7").style("width"), 10),"https://raw.githubusercontent.com/larylc/DreamWorks-Disney-or-Pixar/main/all_movie_sentiment_afinn.csv","avg_overall_sentiment", ".chart9", "#tooltip9" , "#features9", ".chart9");
drawHBar(parseInt(d3.select(".col7").style("width"), 10),"https://raw.githubusercontent.com/larylc/DreamWorks-Disney-or-Pixar/main/all_movie_sentiment_bing.csv","avg_overall_sentiment", ".chart10", "#tooltip10" , "#features10", ".chart10" );


///

async function drawHBarInt(width_size, tooltip_target, tooltip_metric) {
        //  Create Chart Dimensions 
        const width = width_size
        let dimensions = {
            width,
            height: width*0.6, 
            margin: {
                top: 10,
                right: 20,
                bottom: 10,
                left: 50
            }
        }
        
        dimensions.boundedWidth = dimensions.width
            -dimensions.margin.right -dimensions.margin.left 
        dimensions.boundedHeight = dimensions.height 
            -dimensions.margin.top -dimensions.margin.left 
    
    //  Draw Canvas 
    const wrapper = d3.select(".chart11")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
    
  
    let bounds = wrapper
        .append("g")
        .attr("class", "bounds")
        .style(
          "transform",
          `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`
        );
     
    bounds.append("g")
    .attr("class", "h-y-axis")
    
    
    // Load Data  

    const raw_data = await d3.csv("https://raw.githubusercontent.com/larylc/DreamWorks-Disney-or-Pixar/main/all_movie_topics.csv")

    //  Function that draws data 
    const drawHBarIntChart = function(company_name) {
        const dataset = raw_data.filter(function(d){ return  d["company"] == company_name }).filter(function(d){ return d["topic"] == "1" })
        const xAccessor = d => parseFloat(d.beta)
        const yAccessor = d =>  d["term"]
        
    //  Create scales 
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, xAccessor)])
        .range([0, dimensions.boundedWidth ])

    const yScale = d3.scaleBand()
        .domain(dataset.map(yAccessor))
        .range([0, dimensions.boundedHeight])
        .padding(0.05);

       
    //  Draw Data
    const bars = bounds.selectAll("rect")
        .data(dataset)

    
    bars.join("rect").merge(bars)
        .attr("class","bar")
        .attr("x", 0)
        .attr("y", (d) => yScale(yAccessor(d)))
        .attr("width",(d) => xScale(xAccessor(d)))
        .attr("height", yScale.bandwidth() )
        .attr("fill", d => (d.company == "Disney" ? '#5F5BF3' : d.company == "DreamWorks" ? '#fff': "#9EAFE6"))
        .style("fill-opacity", 0.85)
        .attr("rx", 10) 
        .attr("ry",10) 


        
    bars.exit().remove();

    //7. Peripherals
    const yAxisGenerator = d3.axisLeft("text")
        .scale(yScale)

  
const yAxis = bounds.select(".h-y-axis").call(yAxisGenerator)

//Interactions

bars.on("mouseenter", onMouseEnter )
    .on("mouseleave", onMouseLeave)

const tooltip = d3.select(tooltip_target)

function onMouseEnter(event, d) {
    tooltip.select(tooltip_metric)
        .text(xAccessor(d).toFixed(4))
    tooltip.style("opacity", 1)
   

const x = xScale(xAccessor(d)) + dimensions.margin.left
const y = yScale(yAccessor(d)) + dimensions.margin.top
   
    //tooltip.style("left", x + "px").style("top", y + "px")

    tooltip.style("transform", `translate(`
        +`calc(-50% + ${x}px),`
        +`calc(-100% + ${y}px)`
        +`)`)
}
function onMouseLeave(event, d){
    tooltip.style("opacity", 0)
}


    
    }
    
// Interactions 
    drawHBarIntChart("Pixar");
    
    // All Buttons and functions that triggers data change 
    const button1 = d3.select(".button-dreamworks")
        .node()
        .addEventListener("click", onClick1) 
    
    function onClick1() {
        const company = document.querySelector(".button-dreamworks").innerHTML;
        drawHBarIntChart(company);
    }
    
    const button2 = d3.select(".button-disney")
        .node()
        .addEventListener("click", onClick2) 
    
    function onClick2() {
        const company2 = document.querySelector(".button-disney").innerHTML;
        drawHBarIntChart(company2);
        }
    
    const button3 = d3.select(".button-pixar")
        .node()
        .addEventListener("click", onClick3) 
    
    function onClick3() {
        const company3 = document.querySelector(".button-pixar").innerHTML;
        drawHBarIntChart(company3);
        }
    
    
    }    
drawHBarInt(parseInt(d3.select(".col7").style("width"), 10), "#tooltip11", "#features11"); 
    
