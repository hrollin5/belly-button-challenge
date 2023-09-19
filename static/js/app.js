// Read in the sample data from provided URL
const sample_URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Set up the promise pending
const dataPromise = d3.json(sample_URL)

dataPromise
 .then(data => {
    const sampleData = data;
})

 .catch(error => {
    console.error("Error fetching data: " + error)
})

//okay, we have the data. Now I need to do something with it. I guess Ill just try something out. 

