// Read CSV file
var rawDataURL = '../Datasets/electric_generation_cenace_2020-2023.csv'
// var rawDataURL = 'https://ivanco19.github.io/Electric_Generation_Mexico/Datasets/electric_generation_cenace_2020-2023.csv'

// Global variable to store all original data
let datos = []

// Global variable to store filtered data
let datosFiltrados = []

// Create a list to customize colors chart visualization
let colors = ['#343a40', '#198754', '#0d6efd', '#e83e8c', '#dc3545', '#6c757d', '#ffc107', '#fd7e14', 
'#20c997', '#6610f2', '#87ceeb'] 

// This function plots a time series chart with energy generation historical data
function timeSeriesChart(dates, totalEnergy){
    
    // Chart set up
    var historical_trace = {
        type: "scatter",
        mode: "lines",
        x: dates,
        y: totalEnergy,
        line: { color: '#0d6efd' }
    }
    var historical_data = [historical_trace]

    var historical_layout = {
        xaxis: {
            autorange: true,
            // Transforms date format to MM/DD/AAAA
            range: [dates[0].toISOString(), dates[dates.length - 1].toISOString()],
            rangeselector: {
                buttons: [
                    {
                        count: 1,
                        label: '1m',
                        step: 'month',
                        stepmode: 'backward'
                    },
                    {
                        count: 3,
                        label: '3m',
                        step: 'month',
                        stepmode: 'backward'
                    },
                    {
                        count: 6,
                        label: '6m',
                        step: 'month',
                        stepmode: 'backward'
                    },
                    {
                        count: 1,
                        label: '1y',
                        step: 'year',
                        stepmode: 'backward'
                    },
                    {
                        count: 2,
                        label: '2y',
                        step: 'year',
                        stepmode: 'backward'
                    },
                    { step: 'all' }
                ]
            },
            rangeslider: {
                range: [dates[0].toISOString(), dates[dates.length - 1].toISOString()]
            },
            type: 'date'
        },
        yaxis: {
            autorange: true,
            range: [0, d3.max(totalEnergy)],
            type: 'linear'
        },
        height: 500,
        width: 1100,
        plot_bgcolor: '#e9ecef',
        paper_bgcolor: '#e9ecef',
        margin: {"t": 0, "b": 50, "l": 60, "r": 60}
    }
    
    // Creates the new plot using data1 and layout1 settings
    Plotly.newPlot('timeSeriesChart', historical_data, historical_layout)
}

// This function creates a bar chart to visualize energy produced by year
function barChart(generationByYear){
    // Chart set up
    var bar_trace = {
        type: "bar",
        x: Object.keys(generationByYear),
        y: Object.values(generationByYear),
        marker: { color: '#0d6efd' }
    }

    var bar_data = [bar_trace];

    var bar_layout = { 
        yaxis: {
            title: 'Energy produced (MWh)'
        },
        plot_bgcolor: '#e9ecef',
        paper_bgcolor: '#e9ecef',
        height: 300,
        width: 460,
        margin: {"t": 10, "b": 20, "l": 50, "r": 0}
    }

    // Creates the new plot using bar_data and bar_layout settings
    Plotly.newPlot('barChart', bar_data, bar_layout)
}

// This function creates a pie chart to visualize energy produced by technology by year
function pieChart(generationByTechnology){

    // By default we'll consider sum of all energies produced from 2020-2023
    if (yearSelected === '2020-2023') {
        // Get sum of energy produced by technology from 2020-2023
        technologies = Object.keys(generationByTechnology['2020']);  // Take 2020 as a reference
        values = technologies.map(fuente => {
            return Object.keys(generationByTechnology).reduce((total, year) => total + 
            generationByTechnology[year][fuente], 0);
        });
    } else {
        // Get energy produced by technology in the year selected
        technologies = Object.keys(generationByTechnology[yearSelected]);
        values = Object.values(generationByTechnology[yearSelected]);
    }

    var pie_data = [{
        type: "pie",
        values: values,
        labels: technologies,
        marker: {
            colors: colors,  
        },
    }]
      
    var pie_layout = {
        paper_bgcolor: '#e9ecef',
        height: 350,
        width: 500,
        margin: {"t": 20, "b": 30, "l": 10, "r": 10},
    }
      
    Plotly.newPlot('pieChart', pie_data, pie_layout)

}

// This function creates a pie chart to visualize energy produced by technology throughout the years
function scatterChart(generationByTechnology){
    
    // List all energy sources
    const fuentes = Object.keys(generationByTechnology['2020']);  // Take 2020 as a reference

    // Array to store traces
    const traces = [];

    // Iterate through each type of source and build the trace
    fuentes.forEach((fuente, index) => {
        const trace = {
            type: 'scatter',
            x: Object.keys(generationByTechnology),
            y: Object.keys(generationByTechnology).map(anio => generationByTechnology[anio][fuente]),
            name: fuente,
            line: {
                color: colors[index % colors.length], 
            },
        };

    // Agregar el trace al array
    traces.push(trace);
    });

    // Crear el objeto de datos
    const scatter_data = traces;

    var scatter_layout = {
        plot_bgcolor: '#e9ecef',
        paper_bgcolor: '#e9ecef',
        height: 400,
        width: 1100,
        margin: {"t": 20, "b": 30, "l": 60, "r": 40},
        showlegend: true
    }
    
    // Creates the new plot using data and layout settings
    Plotly.newPlot('scatterChart', scatter_data, scatter_layout)
}

// This function prepares data for visualization
function loadData(){

    // 1. DATA PREPARATION FOR BAR VISUALIZATION
    // Groups energy produced by year
    const totalGenerationByYear = d3.rollup(
        datosFiltrados,
        values => d3.sum(values, d => (
        d.Biomass + d.Coal + d.CombinedCycle + d.InternalCombustion +
        d.Wind + d.Photovoltaics + d.Geothermal + d.Hydro + d.Gas + 
        d.Nuclear + d.Thermal
        )),
        d => d.Date.getFullYear()
    );

    // Transform to an object type
    const generationByYear = Object.fromEntries(totalGenerationByYear);

    // 2. DATA PREPARATION FOR SCATTER AND PIE CHARTS VISUALIZATION
    // Groups energy produced by year
    const totalGenerationByTechnology = d3.rollup(
        datosFiltrados,
        (values) => ({
            Biomass: d3.sum(values, d => d.Biomass),
            Coal: d3.sum(values, d => d.Coal),
            CombinedCycle: d3.sum(values, d => d.CombinedCycle),
            InternalCombustion: d3.sum(values, d => d.InternalCombustion),
            Wind: d3.sum(values, d => d.Wind),
            Photovoltaics: d3.sum(values, d => d.Photovoltaics),
            Geothermal: d3.sum(values, d => d.Geothermal),
            Hydro: d3.sum(values, d => d.Hydro),
            Gas: d3.sum(values, d => d.Gas),
            Nuclear: d3.sum(values, d => d.Nuclear),
            Thermal: d3.sum(values, d => d.Thermal)
        }),
        d => d.Date.getFullYear()
    );

    // Transform to an object type
    const generationByTechnology = Object.fromEntries(totalGenerationByTechnology);

    // 3. DATA PREPARATION FOR TIME SERIES VISUALIZATION
    // Groups energy produced per hour
    const generationPerHour = d3.rollup(
        datosFiltrados,
        values => d3.sum(values, d => (
            d.Biomass + d.Coal + d.CombinedCycle + d.InternalCombustion +
            d.Wind + d.Photovoltaics + d.Geothermal + d.Hydro + d.Gas + 
            d.Nuclear + d.Thermal
            )),
        d => d.Date_time
    );

    // Arrays to store dates and total energy values
    const dates = [];
    const totalEnergy = [];

    // Iterate over the entries of generacionPorHora
    for (const [date, value] of generationPerHour) {
    // Add the date and total energy to the arrays
    dates.push(date);
    totalEnergy.push(value); 
    }

    // CREATES VISUALIZATIONS
    barChart(generationByYear)
    pieChart(generationByTechnology)
    scatterChart(generationByTechnology)
    timeSeriesChart(dates, totalEnergy)
}

// This function filters data according to user selection
function updateData(){
    
    yearSelected = document.getElementById('userSelection').value
    
    if (yearSelected === '2020-2023') {
        datosFiltrados = datos;
    } else {
        datosFiltrados = datos.filter((d) => d.Date.getFullYear() == yearSelected);
    }

    loadData()
}

// Read csv file using D3
d3.csv(rawDataURL).then((data) => {
    
    // assign data from csv file to a variable so we can make it global
    datos = data
    
    // Transform date column to a new date object. Parse technologies info to float type
    datos.forEach((d) => {

        const [day, month, year] = d.Date.split('/')
        const fechaFormatoCorrecto = `${month}/${day}/${year}`
        d.Date_time = new Date(year, month - 1, day, d.Time, 0, 0);

        d.Date = new Date(fechaFormatoCorrecto)
        d.Time = parseFloat(d.Time)
        d.Biomass = parseFloat(d.Biomass)
        d.Coal = parseFloat(d.Coal)
        d.CombinedCycle = parseFloat(d.CombinedCycle)
        d.InternalCombustion = parseFloat(d.InternalCombustion)
        d.Wind = parseFloat(d.Wind)
        d.Photovoltaics = parseFloat(d.Photovoltaics)
        d.Geothermal = parseFloat(d.Geothermal)
        d.Hydro = parseFloat(d.Hydro)
        d.Gas = parseFloat(d.Gas)
        d.Nuclear = parseFloat(d.Nuclear)
        d.Thermal = parseFloat(d.Thermal)

    })
    
    //Initialize plots visualizations
    updateData()
});