// Read CSV file
var rawDataURL = '../Datasets/predictions.csv'

function timeSeriesPredictions(dates, totalReal, totalPrediction){
    
    // Chart set up for real values
    var real_trace = {
        type: "scatter",
        mode: "lines",
        x: dates,
        y: totalReal,
        name: 'Real Values',
        line: { color: '#0d6efd' }
    }

    // Chart set up for prediction values
    var prediction_trace = {
        type: "scatter",
        mode: "lines",
        x: dates,
        y: totalPrediction,
        name: 'Predictions',
        line: { color: '#dc3545' }
    }
    var data = [prediction_trace, real_trace]

    var layout = {
        xaxis: {
            autorange: true,
            // Transforms date format to MM/DD/AAAA
            range: [dates],
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
                    { step: 'all' }
                ]
            },
            rangeslider: {
                range: [dates]
            },
            type: 'date'
        },
        yaxis: {
            autorange: true,
            range: [0, d3.max(totalPrediction)],
            type: 'linear'
        },
        height: 600,
        width: 1100,
        plot_bgcolor: '#e9ecef',
        paper_bgcolor: '#e9ecef',
        margin: {"t": 0, "b": 50, "l": 60, "r": 60}
    }
    
    // Creates the new plot using data1 and layout1 settings
    Plotly.newPlot('neuralNetwork', data, layout)
}


// Read csv file using D3
d3.csv(rawDataURL).then((data) => {
    
    // Transform date column to a new date object. Parse technologies info to float type
    data.forEach((d) => {

        const [day, month, year] = d.Date.split('/')
        d.Date = new Date(year, month - 1, day, d.Time, 0, 0);
        d.Real = parseFloat(d.Real_Value)
        d.Prediction = parseFloat(d.Prediction)
    })
    
    // Transform values to arrays
    var dates = data.map(d => d.Date);
    var realValues = data.map(d => d.Real);
    var predictionValues = data.map(d => d.Prediction);

    // Build time series plot
    timeSeriesPredictions(dates, realValues, predictionValues);
});