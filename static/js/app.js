// Use the D3 library to load and read the data from json file.

d3.json("samples.json").then(function(data) {
    //print/to see the data in console
    console.log(data);

  // Add all test subject's ID to create dropdown menu from html file 
   var idList = data.names;
  //use for loop 
  for (var i = 0; i < idList.length; i++) {
    selectBox = d3.select("#selDataset");
    selectBox.append("option").text(idList[i]);
  }

  // create/setup a  default plot
  updatePlots(0)

  // declare a function to create and updating plots   
  function updatePlots(index) {
    // to setup an arrays for horizontal bar chart 
    var sampleSubjectOTUs = data.samples[index].otu_ids;
    // print/to see the sampleOTUs 
    console.log(sampleSubjectOTUs);
    //declare varibale for sample frequency and OTUs Label
    var sampleSubjectFreq = data.samples[index].sample_values;
    var otuLabels = data.samples[index].otu_labels;
    //declare varibale for washing frequency
    var washFrequency = data.metadata[+index].wfreq;
    // print/to see the washFrequency 
    console.log(washFrequency);


    // generate demographic data for card
    //declare varibale for demograohic data
    var demoKeys = Object.keys(data.metadata[index]);
    var demoValues = Object.values(data.metadata[index])
    //select id sample-metadata from html file 
    var demographicData = d3.select("#sample-metadata");

    // clear demographic data
    demographicData.html("");
    //use for loop and append demographicData
    for (var i = 0; i < demoKeys.length; i++) {

      demographicData.append("p").text(`${demoKeys[i]}: ${demoValues[i]}`);
    };


    // reverse data for horizontal bar chart with top tens data
    var topTenOTUS = sampleSubjectOTUs.slice(0, 10).reverse();
    var topTenFreq = sampleSubjectFreq.slice(0, 10).reverse();
    var topTenToolTips = data.samples[0].otu_labels.slice(0, 10).reverse();
    var topTenLabels = topTenOTUS.map((otu => "OTU " + otu));
    var reversedLabels = topTenLabels.reverse();

    // to create a  trace for bar chart
    var trace1 = {
      x: topTenFreq,
      y: reversedLabels,
      text: topTenToolTips,
      name: "",
      type: "bar",
      orientation: "h"
    };

    // declear a variable for data for bar plots
    var barData = [trace1];

    // Apply  layout
    var layout = {
      title: "Top 10 OTUs",
      margin: {
        l: 75,
        r: 75,
        t: 75,
        b: 50
      }
    };

    // Render the plot to the div tag with id "plot" 
    Plotly.newPlot("bar", barData, layout);

    // Set up another trace
    trace2 = {
      x: sampleSubjectOTUs,
      y: sampleSubjectFreq,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: sampleSubjectOTUs,
        opacity: [1, 0.8, 0.6, 0.4],
        size: sampleSubjectFreq
      }
    }

    //declare another variable for data
    var bubbleData = [trace2];

    // Apply layout for plots
    var layout = {
      title: 'OTU Frequency',
      showlegend: false,
      height: 600,
      width: 930
    }

    // render the plot to use id from html page id="bubble-plot" for bubble plot
    Plotly.newPlot("bubble", bubbleData, layout)

    // to create gauge chart to display on main windows
    //help from "https://plotly.com/javascript/gauge-charts/""

    var trace3 = [{
      domain: {x: [0, 1], y: [0,1]},
      type: "indicator",
      mode: "gauge+number",
      value: washFrequency,
      title: { text: "Belly Button Washing Frequency <br> Scrub per Week" },
      gauge: {
        //value range from 0 to 9
        axis: { range: [0, 9], tickwidth: 0.5, tickcolor: "black" },
        bar: { color: "#669999" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "transparent",
        steps: [
          { range: [0, 1], color: "#fff" },
          { range: [1, 2], color: "#e6fff5" },
          { range: [2, 3], color: "ccffeb" },
          { range: [3, 4], color: "b3ffe0" },
          { range: [4, 5], color: "#99ffd6" },
          { range: [5, 6], color: "#80ffcc" },
          { range: [6, 7], color: "#66ffc2" },
          { range: [7, 8], color: "#4dffb8" },
          { range: [8, 9], color: "#33ffad" }

        ],
      }
    }];

    gaugeData = trace3;

    var layout = {
      width: 600,
      height: 500,
      margin: { t: 0, b: 0 }
    };

    Plotly.newPlot("gauge", gaugeData, layout);

  }

  // On button click and  call refreshData()
  d3.selectAll("#selDataset").on("change", refreshData);
  // function for refreshData
  function refreshData() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var personsID = dropdownMenu.property("value");
    //print the data for personID
    console.log(personsID);
    // Initialize an empty array for the person's data
    console.log(data)
    //use for loop
    for (var i = 0; i < data.names.length; i++) {
      if (personsID === data.names[i]) {
        updatePlots(i);
        return
      }
    }
  }

});