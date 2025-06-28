
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os

app = Flask(__name__)
CORS(app)

# Global variables for model and data
model = None
district_avg_scores = {}
feature_columns = []

def load_model_and_data():
    """Load the trained model and preprocessing data"""
    global model, district_avg_scores, feature_columns
    
    try:
        # Load your trained model (update path as needed)
        # model = pickle.load(open('your_model.pkl', 'rb'))
        
        # For now, we'll simulate the model loading
        # Replace this with your actual model loading code
        print("Model loaded successfully")
        
        # Simulate district average scores (replace with your actual data)
        district_avg_scores = {
            'district_ernakulam': 85,
            'district_kozhikode': 82,
            'district_thiruvananthapuram': 80,
            'district_thrissur': 78,
            'district_kannur': 88,
            'district_idukki': 75,
            'district_kollam': 79,
            'district_kottayam': 81,
            'district_malappuram': 76,
            'district_palakkad': 83,
            'district_pathanamthitta': 77,
            'district_wayanad': 74,
        }
        
        # Define feature columns (replace with your actual feature columns)
        feature_columns = [
            'year', 'rainfall', 'monsoon', 'score',
            'district_ernakulam', 'district_idukki', 'district_kannur',
            'district_kollam', 'district_kottayam', 'district_kozhikode',
            'district_malappuram', 'district_palakkad', 'district_pathanamthitta',
            'district_thiruvananthapuram', 'district_thrissur', 'district_wayanad'
        ]
        
    except Exception as e:
        print(f"Error loading model: {e}")

def get_district_key(district_name):
    """Convert district name to district key format"""
    district_mapping = {
        'Ernakulam': 'district_ernakulam',
        'Kozhikode': 'district_kozhikode',
        'Thiruvananthapuram': 'district_thiruvananthapuram',
        'Thrissur': 'district_thrissur',
        'Kannur': 'district_kannur',
        'Idukki': 'district_idukki',
        'Kollam': 'district_kollam',
        'Kottayam': 'district_kottayam',
        'Malappuram': 'district_malappuram',
        'Palakkad': 'district_palakkad',
        'Pathanamthitta': 'district_pathanamthitta',
        'Wayanad': 'district_wayanad',
    }
    return district_mapping.get(district_name, 'district_ernakulam')

@app.route('/api/predict', methods=['POST'])
def predict_crop():
    try:
        data = request.json
        
        # Extract input data
        lat = data.get('lat', 10.0)
        lng = data.get('lng', 76.0)
        district = data.get('district', 'Ernakulam')
        rainfall = data.get('rainfall', 2500)
        temperature = data.get('temperature', 28)
        year = data.get('year', 2024)
        
        # Create input data structure similar to your Python code
        inputdata = {
            'year': year,
            'rainfall': rainfall,
            'monsoon': rainfall * 0.6,  # Approximate monsoon as 60% of total rainfall
        }
        
        # Initialize all district columns to 0
        for col in feature_columns:
            if col.startswith('district_'):
                inputdata[col] = 0
        
        # Set the specific district to 1
        district_key = get_district_key(district)
        if district_key in inputdata:
            inputdata[district_key] = 1
            inputdata['score'] = district_avg_scores.get(district_key, 75)
        else:
            inputdata['score'] = 75  # Default score
        
        # Fill missing columns with 0
        for col in feature_columns:
            if col not in inputdata:
                inputdata[col] = 0
        
        # Create DataFrame for prediction
        input_df = pd.DataFrame([inputdata])
        input_df = input_df[feature_columns]
        
        # Make prediction (replace with your actual model prediction)
        # prediction = model.predict(input_df)[0]
        
        # For now, simulate prediction based on district and conditions
        crop_predictions = {
            'Ernakulam': 'Rice',
            'Kozhikode': 'Coconut',
            'Thiruvananthapuram': 'Banana',
            'Thrissur': 'Pepper',
            'Kannur': 'Cashew',
            'Idukki': 'Cardamom',
            'Kollam': 'Coconut',
            'Kottayam': 'Rice',
            'Malappuram': 'Coconut',
            'Palakkad': 'Rice',
            'Pathanamthitta': 'Pepper',
            'Wayanad': 'Coffee',
        }
        
        prediction = crop_predictions.get(district, 'Rice')
        
        # Calculate confidence and yield potential based on conditions
        base_confidence = district_avg_scores.get(district_key, 75)
        confidence = min(95, max(60, base_confidence + np.random.normal(0, 5)))
        
        yield_potential = base_confidence + (5 if rainfall > 2000 else -5)
        yield_potential = min(95, max(50, yield_potential))
        
        # Determine soil type based on district
        soil_types = {
            'Ernakulam': 'Alluvial',
            'Kozhikode': 'Laterite',
            'Thiruvananthapuram': 'Red Soil',
            'Thrissur': 'Laterite',
            'Kannur': 'Coastal Alluvium',
            'Idukki': 'Forest Soil',
            'Kollam': 'Laterite',
            'Kottayam': 'Alluvial',
            'Malappuram': 'Laterite',
            'Palakkad': 'Red Soil',
            'Pathanamthitta': 'Forest Soil',
            'Wayanad': 'Red Soil',
        }
        
        response = {
            'bestCrop': prediction,
            'confidence': round(confidence, 1),
            'yieldPotential': round(yield_potential, 1),
            'soilType': soil_types.get(district, 'Laterite'),
            'temperature': temperature,
            'rainfall': rainfall
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({
            'bestCrop': 'Rice',
            'confidence': 70,
            'yieldPotential': 70,
            'soilType': 'Laterite',
            'temperature': 28,
            'rainfall': 2500,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Flask API is running'})

if __name__ == '__main__':
    load_model_and_data()
    app.run(debug=True, host='0.0.0.0', port=5000)
