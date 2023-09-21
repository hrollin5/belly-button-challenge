// Read in the sample data from provided URL
const sample_URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Set up the promise pending
const dataPromise = d3.json(sample_URL)

// Create the variable to hold the data
let sampleData =

// Get the data and initialize the charts
dataPromise
 .then(data => {
    sampleData = data;
    // Get the unique ID for each sample
    let uniqueIDs = sampleData.samples.map(sample => sample.id);
    // Populate the dropdown menu
    let dropdown = d3.select("#selDataset")
    dropdown
     .selectAll("option")
     .data(uniqueIDs)
     .enter()
     .append("option")
     .text(d => d)
     .attr("value", d => d);

    // Initial bar chart creation
    createBarChart(uniqueIDs[0]);

    // Initial bubble chart creation
    createBubbleChart(uniqueIDs[0]);

    // Initial display of metadata
    displayMetadata(uniqueIDs[0]);

    // Initial creation of the gauge chart
    createGaugeChart(uniqueIDs[0]);
})

 .catch(error => {
    console.error("Error fetching data: " + error)
})


// Function to create the bar chart
function createBarChart(selectedID) {
    // Filter the data for the selected ID
    const selectedSample = sampleData.samples.find(sample => sample.id === selectedID);
    const top10SampleValues = selectedSample.sample_values.slice(0, 10).reverse();
    const top10OTUIds = selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const top10OTULabels = selectedSample.otu_labels.slice(0, 10).reverse();
    
    // Create the trace for the horizontal bar chart
    const barTrace = {
     type: "bar",
     x: top10SampleValues,
     y: top10OTUIds,
     text: top10OTULabels,
     orientation: "h"
    };

    const barData = [barTrace];
    
    // Define the layout
    const barLayout = {
     title: `Top 10 OTUs for Sample ID ${selectedID}`,
     xaxis: { title: "Sample Values" }
    };

    // Plot the chart
    Plotly.newPlot("bar", barData, barLayout);
}

// Function to create the bubble chart
function createBubbleChart(selectedID) {
    // Filter the data for the selected ID
    const selectedSample = sampleData.samples.find(sample => sample.id === selectedID);

    // Define the trace for the bubble chart
    const bubbleTrace = {
     x: selectedSample.otu_ids,
     y: selectedSample.sample_values,
     mode: 'markers',
     marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: 'Earth', // You can choose a different colorscale
        opacity: 0.7
     },
     text: selectedSample.otu_labels,
    };

    const bubbleData = [bubbleTrace];

    // Define the layout for the bubble chart
    const bubbleLayout = {
        title: `Bubble Chart for Sample ID ${selectedID}`,
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' },
    };

    // Plot the bubble chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
}

// Function to display sample metadata
function displayMetadata(selectedID) {
    // Filter the data for the selected ID
    const selectedMetadata = sampleData.metadata.find(metadata => metadata.id === parseInt(selectedID));
  
    // Select the div where you want to display the metadata
    const metadataDiv = d3.select("#sample-metadata");
  
    // Clear existing content
    metadataDiv.html("");
  
    // Iterate through the key-value pairs in the metadata object and display them
    Object.entries(selectedMetadata).forEach(([key, value]) => {
        metadataDiv
        .append("p")
        .text(`${key}: ${value}`);
    });
}

// Function to create the gauge chart
function createGaugeChart(selectedID) {
    // Filter the data for the selected ID
    const selectedMetadata = sampleData.metadata.find(metadata => metadata.id === parseInt(selectedID));
  
    // Get the washing frequency value
    const washingFrequency = selectedMetadata.wfreq;
  
    // Create the trace for the gauge chart
    const gaugeTrace = {
        type: "indicator",
        mode: "gauge+number",
        value: washingFrequency,
        title: {
            text: "<span style ='font-size:1.3em;color:dimgrey;font-family:verdana'><b>Belly Button Washing Frequency</b></span><br><span style='font-size:1.3em;color:dimgray;font-family:verdana'>Scrubs Per Week</span>",
        },
        gauge: {
            axis: { range: [0, 9], tickwidth: 1, tickcolor: "#648e6c"},
            bar: { color: "#6f9e78" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
                { range: [0, 1], color: "#f7f2ec"},
                { range: [1, 2], color: "#f3f0e5"},
                { range: [2, 3], color: "#e9e7c9"},
                { range: [3, 4], color: "#e5e9b1"},
                { range: [4, 5], color: "#d5e595"},
                { range: [5, 6], color: "#b7cd8b"},
                { range: [6, 7], color: "#87c080"},
                { range: [7, 8], color: "#85bc8b"},
                { range: [8, 9], color: "#80b586"}
            ],
            threshold: {
                line: { color: "#648e6c", width: 4 },
                thickness: 0.75,
                value: washingFrequency
              }
        },
        number: {
            font: {color: "#648e6c",
                size: 60}
        },     
    };
    const gaugeData = [gaugeTrace];

    // Define the layout for the gauge chart
    const gaugeLayout = {
        width: 500,
        height: 500,
        margin: { t: 0, b: 0 },
        paper_bgcolor: "white",
        font: { color: "648e6c", family: "verdana" }
    };
      
    // Plot the gauge chart
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
}

// Define the optionChanged function
function optionChanged(selectedID) {
    // Get the selected ID from the dropdown
    selectedID = d3.select("#selDataset").property("value");
  
    // Replot all charts with the selected ID
    createBarChart(selectedID);
    createBubbleChart(selectedID);
    displayMetadata(selectedID);
    createGaugeChart(selectedID);
}