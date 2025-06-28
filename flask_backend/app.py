from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os

app = Flask(__name__)
CORS(app)

# Global variables
model = None
district_avg_scores = {}
feature_columns = []

def load_model_and_data():
    """Load the trained model and extract feature info from dftrain.csv"""
    global model, district_avg_scores, feature_columns

    try:
        # Load model
        model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
        model = pickle.load(open(model_path, 'rb'))
        print("✅ Model loaded successfully from model.pkl")

        # Load training data
        df_path = os.path.join(os.path.dirname(__file__), 'dftrain.csv')
        df = pd.read_csv(df_path)

        # Extract district columns and calculate average scores
        district_columns = [col for col in df.columns if col.startswith('district_')]
        for col in district_columns:
            avg = df[df[col] == 1]['score'].mean()
            district_avg_scores[col] = round(avg if not np.isnan(avg) else 0.75, 4)

        # Define feature columns
        feature_columns[:] = ['year', 'rainfall', 'monsoon', 'score'] + district_columns

        print("✅ District average scores loaded:", district_avg_scores)
        print("✅ Feature columns defined:", feature_columns)

    except Exception as e:
        print(f"❌ Error loading model or training data: {e}")
        print("Make sure 'model.pkl' and 'dftrain.csv' exist in the flask_backend directory.")

def get_district_key(district_name):
    """Convert human-readable district name to encoded column name"""
    mapping = {
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
    return mapping.get(district_name, 'district_ernakulam')

@app.route('/api/predict', methods=['POST'])
def predict_crop():
    try:
        data = request.json
        print(f"📥 Received request: {data}")

        # Extract inputs
        lat = data.get('lat', 10.0)
        lng = data.get('lng', 76.0)
        district = data.get('district', 'Ernakulam')
        rainfall = data.get('rainfall', 2500)
        temperature = data.get('temperature', 28)
        year = data.get('year', 2024)

        # Build input dictionary
        inputdata = {
            'year': year,
            'rainfall': rainfall,
            'monsoon': rainfall * 0.6
        }

        # Add district one-hot columns
        for col in feature_columns:
            if col.startswith('district_'):
                inputdata[col] = 0

        district_key = get_district_key(district)
        if district_key in inputdata:
            inputdata[district_key] = 1
            inputdata['score'] = district_avg_scores.get(district_key, 0.75)
        else:
            inputdata['score'] = 0.75

        # Fill missing columns
        for col in feature_columns:
            if col not in inputdata:
                inputdata[col] = 0

        # Prepare DataFrame
        input_df = pd.DataFrame([inputdata])
        input_df = input_df[feature_columns]

        print(f"🔍 Prediction input: {input_df.to_dict(orient='records')[0]}")

        # Make prediction
        if model:
            prediction = model.predict(input_df)[0]
            print(f"✅ Prediction: {prediction}")
        else:
            prediction = 'rice'
            print("⚠️ Model not loaded. Returning fallback prediction.")

        # Confidence & yield potential
        base_score = district_avg_scores.get(district_key, 0.75) * 100
        confidence = min(95, max(60, base_score + np.random.normal(0, 5)))
        yield_potential = min(95, max(50, base_score + (5 if rainfall > 2000 else -5)))

        # Soil type lookup
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

        # Response
        response = {
            'bestCrop': prediction.capitalize(),
            'confidence': round(confidence, 1),
            'yieldPotential': round(yield_potential, 1),
            'soilType': soil_types.get(district, 'Laterite'),
            'temperature': temperature,
            'rainfall': rainfall
        }

        print(f"📤 Sending response: {response}")
        return jsonify(response)

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"❌ Prediction error: {e}")
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
    return jsonify({
        'status': 'healthy',
        'message': 'Flask API is running',
        'model_loaded': model is not None,
        'feature_columns': feature_columns,
        'district_scores_loaded': len(district_avg_scores) > 0
    })

if __name__ == '__main__':
    load_model_and_data()
    print("🚀 Starting Flask server...")
    print("📍 Available endpoints:")
    print(" - GET  /api/health")
    print(" - POST /api/predict")
    app.run(debug=True, host='0.0.0.0', port=5000)
