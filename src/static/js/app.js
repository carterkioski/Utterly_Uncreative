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

function updateVisualizations(){
    function updateMap() {
        //On new wine selection, pan to orignal scene
        map.panTo(new L.LatLng(40.8324, -115.7631));
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
        var wineType = "Cabernet Sauvignon"
        //this url will be replaced with Heroku one
        d3.json(`http://127.0.0.1:5000/variety/${wineType}`).then(callMap)
    }
    function updateVis3(){}
    //Set this whole block to be onchange of html carasoulr selector div
    // Store API query variables
    //TODO: GET THIS FROM HTML input
    // #carasouelSelct
    //Call functions
    updateMap()
    //updateVis3()
}

function findSimilarWines(marker){
    function callWines(response){
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
        //d3.select('#recommend').html(list)



        //scatter of price vs rating for this winery, make the selected marker differnt color
        d3.select('#otherWines').html('')
        /*d3.select('#otherWines').html(`
        <div class="h-100 p-5 bg-light border rounded-3">
        <h2>Visulization 2</h2>
        <p>Or, keep it light and add a border for some added definition to the boundaries of your content. Be sure to look under the hood at the source HTML here as we've adjusted the alignment and sizing of both column's content for equal-height.</p>
        <button class="btn btn-outline-secondary" type="button">Example button</button>
        <br>
        </div>
        `)*/
        data = response.wineries.map( item => [item.Rating, item.Price])
        var max = d3.max(data, function(array) {
            return d3.max(array);
          });
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
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
                    return "#000000"
                }
                else{
                    return "#69b3a2"
                }})
        /*svg.append('g')
            .selectAll("dot")
            .data([80,80])
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d[0]); } )
            .attr("cy", function (d) { return y(d[1]); } )
            .attr("r", 5)
            .style("fill", "#000000")
            console.log(marker.popup.options.className.slice(1,3)[0])
            console.log(marker.popup.options.className.slice(1,3)[1])
            */
    }
    var winery = marker.popup.options.className[0];
    //this url will be replaced with Heroku one
    d3.json(`http://127.0.0.1:5000/winery/${winery}`).then(callWines)
}
//select the carasoule, on change run updateMap
//d3.select("#carasouelSelct").on("change", updateVisualizations);
updateVisualizations()
map.on('popupopen',findSimilarWines)
