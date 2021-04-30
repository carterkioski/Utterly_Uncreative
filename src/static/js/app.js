//"map" is name of div in index.html for the map
  var map = L.map("map", {
    center: [40.8324, -115.7631],
    zoom: 5,
    layers: []
  });

  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(map);

function createGraph(wineType){
    d3.select('#lineGraph').html('')
    console.log(wineType)
    traces = []
    function getVarities(item) {
        console.log(item)
        function callApi(response){
            trace = {
                x: [],
                y: [],
                type: 'line',
                mode: 'line',
                name: `${item.variety}`
            }
            for (var i = 0; i < response.Vintages.length; i++){
                trace.x.push(response.Vintages[i].Vintage)
                trace.y.push(response.Vintages[i].Average)
            }
            traces.push(trace)
        }
        d3.json(`http://127.0.0.1:5000/vintages/${item.Variety}`).then(callApi)
    }
    if (!wineType){
        d3.json(`http://127.0.0.1:5000/variety_count`).then(function(res){
        res['Variety Count'].forEach(getVarities)})
        var layout = {
            title:'Top 15 Varieties',
            xaxis: {range:[1990,2020],
                    title: 'Year'},
            yaxis: {range:[75,101],
                    title: 'Average Rating'}
            };
        Plotly.newPlot('lineGraph', traces, layout);
    }
    else{
        d3.json(`http://127.0.0.1:5000/variety/${wineType}`).then( function(res){
            res['Variety'].slice(0,1).forEach(getVarities)})
        var layout = {
            title:`${wineType}`,
            xaxis: {range:[1990,2020],
                title: 'Year'},
            yaxis: {range:[75,101],
                title: 'Average Rating'}
            };
        Plotly.newPlot('lineGraph', traces, layout);

    }
}

function updateVisualizations(wineType){
    map.panTo([40.8324, -115.7631]);
    function updateMap() {
        //On new wine selection, pan to orignal scene
        function callMap(response) {
            // Create a new marker cluster group
            var markers = L.markerClusterGroup();
            // Loop through data
            for (var i = 0; i < response.Variety.length; i++) {
                // Set the data location property to a variable
                item = response.Variety[i]
                markers.addLayer(L.marker([item.Latitude, item.Longitude]).bindPopup(`<h2>${item.Wine}</h2><hr>` +
                 `<p><b div='winery'>Winery:</b> ${item.Winery}</p>` + `<p><b>Address:</b> ${item.Address}</p>`, {className: [item.Winery, item.Rating, item.Price]}))
                // Add our marker cluster layer to the map
                map.addLayer(markers);
            }
        }
        //this url will be replaced with Heroku one
        d3.json(`http://127.0.0.1:5000/variety/${wineType}`).then(callMap)
    }
    //Call functions
    updateMap()
}

function findSimilarWines(marker){
    var winery = marker.popup.options.className[0];
    function callWines(response){
        /* Recomended wines, can remove not sure if needed/wanted
        list = '<ol>'
        if (response.count >= 4){
            topThree = response.wineries.slice(0,4)
            //then need to add this html into a certain div
            list = `<li>${topThree[0].Wine}</li> <li>${topThree[1].Wine}</li> <li>${topThree[2].Wine}</li></ol>`
        }
        else{
            response.wineries.forEach( i => list =+ `<li>${i.Wine}</li>`)
            list += '</ol>'
        }
        list = "<h1>Top 3 Wines From This Winery:</h1>" + list
        d3.select('#recommend').html(list)
        */


        //scatter of price vs rating for this winery, make the selected marker differnt color
        ////////////////////////////////////////////////////////////////////////////////////
        d3.select('#otherWines').html('')

        data = response.wineries.map( item => [item.Rating, item.Price, item.Wine])
        var max = d3.max(data, function(array) {
            return d3.max(array);
          });
        var margin = {top: 50, right: 30, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        var svg =  d3.select('#otherWines')
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // Add X axis
        var x = d3.scaleLinear()
            .domain([75, 100])
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        // Add X axis label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width/2 + margin.left)
            .attr("y", height + margin.top + 20)
            .text("Rating");
          // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, max ])
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
        // Add Y axis label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top - height/2 + 20)
            .text("Price")

        //Add title
        svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top/10))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text(`${winery}`);
        
        //setting d3 selection for div to add wine info on hover
        var tooltip = d3.select("#otherWines")
        .append("div")
        .style("opacity", 1)
        .attr("class", "tooltip")
        var mouseover = function(d) {
            tooltip 
                .html(`<p><b>Wine:</b> ${d[2]} <br>
                       <b>Price:</b>  $${d[1]}<br>
                       <b>Rating:</b>  ${d[0]}/100</p>`)
                .style("opacity", 1)
        }
    
        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        var mouseleave = function(d) {
        tooltip
            .transition()
            .duration(500)
            .style("opacity", 0)
        }
        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d[0]); } )
            .attr("cy", function (d) { return y(d[1]); } )
            .attr("r", 5)
            .style("fill", function(d){
                if (d[0] === marker.popup.options.className[1] && d[1] === marker.popup.options.className[2]){
                    return "#722F37"
                }
                else{
                    return "#000000"
                }})
            .on("mouseover", mouseover )
            .on("mouseleave", mouseleave )

    }
    //this url will be replaced with Heroku one
    d3.json(`http://127.0.0.1:5000/winery/${winery}`).then(callWines)
}
//select the carasoule, on change run updateVisualizations
createGraph('')
var button = d3.selectAll(".btn")
button.on("click", function() {
    wineType = this.getElementsByClassName("title")[0].innerText
    updateVisualizations(wineType)
    createGraph(wineType)
});

map.on('popupopen',findSimilarWines)
