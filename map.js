           

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
 
            var greenIcon = new L.Icon({
              iconUrl: 'icons/green.png',
              shadowUrl: 'icons/shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

            var redIcon = new L.Icon({
              iconUrl: 'icons/red.png',
              shadowUrl: 'icons/shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

           var blueIcon = new L.Icon({
              iconUrl: 'icons/blue.png',
              shadowUrl: 'icons/shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

           var purpleIcon = new L.Icon({
              iconUrl: 'icons/purple.png',
              shadowUrl: 'icons/shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

          
             var orangeIcon = new L.Icon({
              iconUrl: 'icons/orange.png',
              shadowUrl: 'icons/shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

            var yellowIcon = new L.Icon({
              iconUrl: 'icons/yellow.png',
              shadowUrl: 'icons/shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

            var greyIcon = new L.Icon({
              iconUrl: 'icons/grey.png',
              shadowUrl: 'icons/shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

            var azureIcon = new L.Icon({
              iconUrl: 'icons/azure.png',
              shadowUrl: 'icons/shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

             var ochreIcon = new L.Icon({
              iconUrl: 'icons/ochre.png',
              shadowUrl: 'icons/shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

             var pinkIcon = new L.Icon({
              iconUrl: 'icons/pink.png',
              shadowUrl: 'icons/shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

             var blackIcon = new L.Icon({
              iconUrl: 'icons/black.png',
              shadowUrl: 'icons/shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });
