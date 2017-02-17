           

            var Hydda = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
                            attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }); 
            
            var OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>'
            });
            
            var OpenCycleMap = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
              	attribution: '&copy; <a href="http://www.opencyclemap.org" target="_blank">OpenCycleMap</a>, &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>'
            });   
            
            var mypoints = new L.LayerGroup();
            
            var baseMaps = {
                  "Hydda": Hydda,
                  "OpenStreetMap": OpenStreetMap,
                  "OpenCycloMap": OpenCycleMap
            };
                      
            var overlayMaps = {
               //   "My Points": mypoints,
            };
            
            var mymap = new L.Map('mapid', {
                layers: [Hydda],
                center: [49.75, 13.35],
                zoom: 13
              });
            
            var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(mymap);
 