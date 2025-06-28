
# Flask Backend for Kerala Crop Prediction

## Setup Instructions

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Replace the model loading section in `app.py` with your actual trained model:
```python
# Replace this line with your actual model loading:
model = pickle.load(open('your_model.pkl', 'rb'))
```

3. Update the `district_avg_scores` and `feature_columns` with your actual training data.

4. Run the Flask server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

- `POST /api/predict` - Get crop prediction
- `GET /api/health` - Health check

## Integration with Your Model

1. Save your trained model as a pickle file
2. Update the model loading section in `load_model_and_data()`
3. Replace the simulated prediction logic with your actual model prediction
4. Update district_avg_scores with your actual training data
