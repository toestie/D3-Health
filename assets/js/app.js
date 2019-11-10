
        
// function used for updating x-scale const upon click on axis label
// function xScale(healthData, chosenXAxis) {
//     // create scales
//     const xLinearScale = d3.scaleLinear()
//         .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
//         d3.max(healthdata, d => d[chosenXAxis]) * 1.2
//         ])
//         .range([0, width]);

//     return xLinearScale;
// }

// function used for updating xAxis const upon click on axis label
// function renderAxes(newXScale, xAxis) {
//     const bottomAxis = d3.axisBottom(newXScale);

//     xAxis.transition()
//         .duration(1000)
//         .call(bottomAxis);

//     return xAxis;
// }

// function used for updating circles group with a transition to
// new circles
// function renderCircles(circlesGroup, newXScale, chosenXaxis) {
//     circlesGroup.transition()
//         .duration(1000)
//         .attr("cx", d => newXScale(d[chosenXaxis]));

//     return circlesGroup;
// }

(async function(){
    const svgWidth = 750;
    const svgHeight = 500;
    const margin = {
        top: 30,
        right: 30,
        bottom: 50,
        left: 50
    };

    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    const svg = d3.select("#scatter")
        .append("div").classed("svg-container", true)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

    // Append an SVG group
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Initial Params
    const chosenXAxis = "healthcare";

    const healthData = await d3.csv("/assets/data/data.csv").catch(error => console.warn(error));
    console.log(healthData);

    // Cast each hours value in tvData as a number using the unary + operator
    healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age;
    });

    const xScale = d3.scaleLinear()
        .domain(d3.extent(healthData, d => d.poverty))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
    // text label for the x axis
    chartGroup.append("text")             
        .attr("transform", `translate(${width/2}, ${height + margin.top + 10})` )
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .text("In Poverty (%)");

    chartGroup.append("g")
        .call(yAxis);

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .text("Lacks Healthcare (%)");    
    
    const nodeGroup = chartGroup.selectAll('.nodes')
        .data(healthData)
        .enter().append('g')
        .attr('class', 'nodes')

    const circlesGroup = nodeGroup
        // .selectAll("circle")
        // .data(healthData)
        // .enter()
        .append("circle")
        // .attr("cx", d => xScale(d.poverty))
        // .attr("cy", d => yScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "darkblue")
        .attr("opacity", ".75");

    const circlesText = nodeGroup
        // .selectAll("text")
        // .data(healthData)
        // .enter()
        .append("text")
        // .attr("transform", d => `translate(${xScale(d.poverty)}, ${yScale(d.healthcare)+margin.top/10})`)
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .attr("font-size", "11px")
        .style("font-weight","bold")
        .attr("fill", "white")
        .text(d => d.abbr);

    nodeGroup.attr("transform", d => `translate(${xScale(d.poverty)}, ${yScale(d.healthcare)})`)
})()