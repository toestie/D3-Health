const svgWidth = 750;
const svgHeight = 500;
const margin = {
    top: 30,
    right: 30,
    bottom: 110,
    left: 90
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
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

function setXScale(healthData, chosenXAxis) {
    const xScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.9, d3.max(healthData, d => d[chosenXAxis]) * 1.1])
        .range([0, width]);
    
    return xScale;
}

function setYScale(healthData, chosenYAxis) {
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d[chosenYAxis])])
        .range([height, 0]);
    
    return xScale;
}

// function used for updating xAxis const upon click on axis label
function renderXAxis(newXScale, xAxis) {
    const bottomAxis = d3.axisBottom(newXScale);
    
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
}

function renderYAxis(newYScale, yAxis) {
    const leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderNodes(nodeGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    nodeGroup.transition()
        .duration(1000)
        .attr("transform", d => `translate(${newXScale(d[chosenXAxis])}, ${newYScale(d[chosenYAxis])})`)
    
    return nodeGroup;
}

function updateToolTip(chosenXAxis, chosenYAxis, nodeGroup) {
    let xlabel  = "";
    let ylabel  = "";

    if (chosenXAxis === "poverty") {
        xlabel = "In Poverty (%):";
    }
    else if (chosenXAxis === "age"){
        xlabel = "Median Age (years):";
    }
    else {
        xlabel = "Median Household Income ($):";
    }

    if (chosenYAxis === "healthcare") {
        ylabel = "Lacks Healthcare (%):";
    }
    else if (chosenYAxis === "smokes"){
        ylabel = "Smokes (%):";
    }
    else {
        ylabel = "Obese (%):";
    }

    const toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${ylabel} ${d[chosenYAxis]}<br>${xlabel} ${d[chosenXAxis]}`);
        });

    nodeGroup.call(toolTip);

    nodeGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data, this);
    });

    return nodeGroup;
}

(async function(){
    const healthData = await d3.csv("./assets/data/data.csv").catch(error => console.warn(error));
    // console.log(healthData);

    healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.obesity = +data.obesity;
        data.income = +data.income;
    });

    const xScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.9, d3.max(healthData, d => d[chosenXAxis]) * 1.1])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d[chosenYAxis])])
        .range([height, 0]);

    const bottomAxis = d3.axisBottom(xScale);
    const leftAxis = d3.axisLeft(yScale);

    xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    xLabels = chartGroup.append("g")
        .attr("transform", `translate(${width/2}, ${height + margin.top + 10})` )
    
    xPoverty = xLabels.append("text")       
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .attr("value", "poverty")
        .text("In Poverty (%)")
        .classed("active", true)
        .attr("axis", "x");
            
    xAge = xLabels.append("text")
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .attr("value", "age")
        .text("Median Age (Years)")
        .classed("inactive", true)
        .attr("axis", "x");
    
    xIncome = xLabels.append("text")
        .attr("dy", "2.4em")
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .attr("value", "income")
        .text("Median Household Income ($)")
        .classed("inactive", true)
        .attr("axis", "x");

    yAxis = chartGroup.append("g")
        .call(leftAxis);

    yLabels = chartGroup.append("g")

    ySmokes = yLabels.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "2.2em")
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .attr("value", "smokes")
        .attr("axis", "y")
        .text("Smokes (%)")
        .classed("inactive", true)
    
    yObese = yLabels.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "3.4em")
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .attr("value", "obesity")
        .attr("axis", "y")
        .text("Obese (%)")
        .classed("inactive", true)

    yHealth = yLabels.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .attr("value", "healthcare")
        .attr("axis", "y")
        .text("Lacks Healthcare (%)")
        .classed("active", true)
    
    const nodeGroup = chartGroup.selectAll('.nodes')
        .data(healthData)
        .enter().append('g')
        .attr('class', 'nodes')

    const circlesGroup = nodeGroup
        .append("circle")
        .attr("r", "10")
        .attr("fill", "darkblue")
        .attr("opacity", ".75");

    const circlesText = nodeGroup
        .append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .attr("font-size", "11px")
        .style("font-weight","bold")
        .attr("fill", "white")
        .text(d => d.abbr);

    nodeGroup.attr("transform", d => `translate(${xScale(d[chosenXAxis])}, ${yScale(d[chosenYAxis])})`)

    nodeGroup = updateToolTip(chosenXAxis, chosenYAxis, nodeGroup);

    xLabels.selectAll("text")
    .on("click", function() {
    // get value of selection
        const value = d3.select(this).attr("value");
        const XorY = d3.select(this).attr("axis")
        if (value !== chosenXAxis && XorY == "x") {

            chosenXAxis = value;
            // console.log(chosenXAxis)
            xNewScale = setXScale(healthData, chosenXAxis);
            yNewScale = setYScale(healthData, chosenYAxis);

            xAxis = renderXAxis(xNewScale, xAxis);

            nodesGroup = renderNodes(nodeGroup, xNewScale, chosenXAxis, yNewScale, chosenYAxis);
            nodesGroup = updateToolTip(chosenXAxis, chosenYAxis, nodesGroup);

            if (value === "age") {
                xAge
                    .classed("active", true)
                    .classed("inactive", false);
                xPoverty
                    .classed("active", false)
                    .classed("inactive", true);
                xIncome
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (value === "income") {
                xIncome
                    .classed("active", true)
                    .classed("inactive", false);
                xPoverty
                    .classed("active", false)
                    .classed("inactive", true);
                xAge
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                xPoverty
                    .classed("active", true)
                    .classed("inactive", false);
                xIncome
                    .classed("active", false)
                    .classed("inactive", true);
                xAge
                    .classed("active", false)
                    .classed("inactive", true);
            }
        }
    });
    yLabels.selectAll("text")
    .on("click", function() {
    // get value of selection
        const value = d3.select(this).attr("value");
        const XorY = d3.select(this).attr("axis")
        if (value !== chosenYAxis && XorY == "y") {

            chosenYAxis = value;
            // console.log(chosenYAxis)
            xNewScale = setXScale(healthData, chosenXAxis);
            yNewScale = setYScale(healthData, chosenYAxis);

            yAxis = renderYAxis(yNewScale, yAxis);
    
            nodesGroup = renderNodes(nodeGroup, xNewScale, chosenXAxis, yNewScale, chosenYAxis);
            nodesGroup = updateToolTip(chosenXAxis, chosenYAxis, nodesGroup);
    
            if (value === "smokes") {
                ySmokes
                    .classed("active", true)
                    .classed("inactive", false);
                yObese
                    .classed("active", false)
                    .classed("inactive", true);
                yHealth
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (value === "obesity") {
                yObese
                    .classed("active", true)
                    .classed("inactive", false);
                ySmokes
                    .classed("active", false)
                    .classed("inactive", true);
                yHealth
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                yHealth
                    .classed("active", true)
                    .classed("inactive", false);
                yObese
                    .classed("active", false)
                    .classed("inactive", true);
                ySmokes
                    .classed("active", false)
                    .classed("inactive", true);
            }
        }
    });
})()