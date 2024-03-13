# Electric_Generation_Mexico
The objective of this project is to develop a predictive model for electrical generation and an interactive visualization platform to analyze and understand trends, geographical distribution, and the impact of various energy sources on Mexico's energy landscape from 2020 to 2023.

## Project Overview

The project involves:

1. Data Collection and Preprocessing: Gathering historical data on electrical generation, and preprocessing the data for analysis.
2. Visualization: Creating interactive dynamic graphs using Plotly to allow users to explore statistics and trends for each year or throughout the entire period.
3. Geographical Mapping: Displaying the geographical locations of power plants on a map, classified by technology type, with marker size indicating generation capacity.
4. Model Development: Designing and training a recurrent neural network (RNN) for electricity prediction, using historical data and advanced machine learning techniques.
5. Evaluation and Validation: Evaluating the performance of the predictive model and validating its accuracy using appropriate metrics.
6. Deployment: Deploying the model and visualization platform for public access.

## Data Preprocessing

The data preprocessing steps include:

* Normalization of data using MinMaxScaler to scale the input features to a range between 0 and 1, ensuring uniformity in data distribution and improving model performance.

## Neural Network Model

The neural network model consists of:

* Three-layer recurrent neural network architecture, optimized for sequence modeling and time-series forecasting (60, 40, 10 neurons).
* Utilization of Long Short-Term Memory (LSTM) layers to capture temporal dependencies and memory over time.
* Dropout regularization technique with a 10% dropout rate to prevent overfitting and enhance model generalization.
* Sequence Length: The model considers 10 time steps, representing the previous 10 hours of data, to predict the electricity generation for the subsequent hour.

## Results

Performance metrics of the predictive model include:

* Root Mean Square Error (RMSE) = 492
* Coefficient of Determination (R2) = 99.3%
* Average Relative Error = 0.946%

## Technologies Used

The project utilizes the following technologies:

* Python: Programming language for data analysis, model development, and visualization.
* Pandas: Data manipulation and preprocessing.
* Plotly: Interactive visualization library for creating dynamic graphs.
* Leaflet: Mapping library for geographical visualization.
* TensorFlow: Deep learning framework for designing and training the neural network model.
* HTML and Bootstrap: Frontend development for the visualization platform.