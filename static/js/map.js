// Define the map
let map = L.map("map", {
  center: [22.2071553, -100.3379744], // Center the map in Mexico
  zoom: 5
});

// Add the map layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  attribution: '© CartoDB'
}).addTo(map);

// Create the cluster group
let markers = L.layerGroup();

// Define a function for marker size
function markerSize(capacity) {
  const smallSize = 2;  
  const mediumSize = 5; 
  const largeSize = 7;  

  // Categorize capacity into three ranges and set the corresponding marker size
  if (capacity < 100) {
      return smallSize;
  } else if (capacity < 500) {
      return mediumSize;
  } else {
      return largeSize;
  }
}

// Function to get color based on technology
function getColor(tecnologia) {
  return tecnologia == 'Combined Cycle' ? '#FF4500' :
    tecnologia == 'Hydro' ? '#1E90FF' :
    tecnologia == 'Internal Combustion' ? '#FF69B4' :
    tecnologia == 'Wind' ? '#C0C0C0' :
    tecnologia == 'Photovoltaics' ? '#fd7e14' :
    tecnologia == 'Geothermal' ? '#9E9D24' :
    tecnologia == 'Nuclear' ? '#8B0000' :
    tecnologia == 'Thermal' ? '#32CD32' :
    tecnologia == 'Gas' ? '#ffc107' :
    tecnologia == 'Coal' ? '#5E35B1' :
    '#ffffff'; 
}

// Variable to track the state of filters
let filterActive = {
  'Combined Cycle': true,
  'Hydro': true,
  'Internal Combustion': true,
  'Wind': true,
  'Photovoltaics': true,
  'Geothermal': true,
  'Nuclear': true,
  'Thermal': true,
  'Gas': true,
  'Coal': true
};

// Function to update the legend style based on filter state
function updateLegendStyle() {
  const legendItems = document.querySelectorAll('.legend-item');

  legendItems.forEach((legendItem) => {
    const tecnologia = legendItem.getAttribute('data-tecnologia');

    // Change the style based on whether the filter is active or not
    if (filterActive[tecnologia]) {
      legendItem.classList.remove('active');
    } else {
      legendItem.classList.add('active');
    }
  });
}

// Function to toggle marker visibility based on selected technology
window.toggleMarkers = function(tecnologia) {
  markers.eachLayer(function (layer) {
    if (layer.options.tecnologia === tecnologia) {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
        filterActive[tecnologia] = false;
      } else {
        map.addLayer(layer);
        filterActive[tecnologia] = true;
      }
    }
  });

  // Update the legend style
  updateLegendStyle();
};

// Read CSV data and add markers to the cluster group
d3.csv('../Datasets/centrales_generacion_mexico.csv').then((plants) => {
  plants.forEach((plant) => {
    let coordenates = L.latLng(plant.Latitud, plant.Longitud);
    let capacidad = parseFloat(plant.Capacidad);
    let tecnologia = plant.Tecnologia;

    // Draw a marker on the map layer based on capacity and technology
    let circle = L.circleMarker(coordenates, {
      radius: markerSize(capacidad), 
      color: getColor(tecnologia),
      weight: 1,
      fillColor: getColor(tecnologia),
      fillOpacity: 0.8,
      tecnologia: tecnologia  // Store technology directly in the marker
    });

    // Popup to show power plant information
    circle.bindPopup(`<strong>Name:</strong> ${plant.Nombre}<br>
                      <strong>Power:</strong> ${capacidad} MW<br>
                      <strong>Technology:</strong> ${tecnologia}<br>
                      <strong>State:</strong> ${plant.Entidad}`);

    // Add the marker to the cluster group
    markers.addLayer(circle);
  });

  // Add the cluster group to the map
  markers.addTo(map);

  // Create legend control to show color meanings
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        tecnologias = ['Combined Cycle', 'Hydro', 'Thermal', 'Gas', 'Coal', 
        'Internal Combustion', 'Wind', 'Photovoltaics', 'Geothermal', 'Nuclear'];

    // Loop to generate labels with color squares for each technology
    tecnologias.forEach(tecnologia => {
      div.innerHTML += `
        <div class="legend-item" data-tecnologia="${tecnologia}" onclick="toggleMarkers('${tecnologia}')">
          <div style="width: 25px; height: 20px; background: ${getColor(tecnologia)};"></div>
          <span>${tecnologia}</span>
        </div>
      `;
    });

    // Update legend style
    updateLegendStyle();

    return div;
  };
  legend.addTo(map);
});