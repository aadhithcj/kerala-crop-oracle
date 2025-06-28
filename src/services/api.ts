
interface PredictionRequest {
  lat: number;
  lng: number;
  district: string;
  rainfall?: number;
  temperature?: number;
  year?: number;
}

interface PredictionResponse {
  bestCrop: string;
  confidence: number;
  yieldPotential: number;
  soilType: string;
  temperature: number;
  rainfall: number;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const predictCrop = async (data: PredictionRequest): Promise<PredictionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error calling prediction API:', error);
    // Fallback to basic prediction logic
    return {
      bestCrop: getDistrictDefaultCrop(data.district),
      confidence: 75,
      yieldPotential: 70,
      soilType: getDistrictSoilType(data.district),
      temperature: 28,
      rainfall: data.rainfall || 2500,
    };
  }
};

const getDistrictDefaultCrop = (district: string): string => {
  const cropMapping: Record<string, string> = {
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
  };
  return cropMapping[district] || 'Rice';
};

const getDistrictSoilType = (district: string): string => {
  const soilMapping: Record<string, string> = {
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
  };
  return soilMapping[district] || 'Laterite';
};

export const getDistrictFromCoordinates = (lat: number, lng: number): string => {
  // Basic district mapping based on coordinates
  // This is a simplified version - in production, you'd use a proper geocoding service
  if (lat >= 11.5 && lng >= 75.5) return 'Kannur';
  if (lat >= 11.0 && lat < 11.5) return 'Kozhikode';
  if (lat >= 10.5 && lat < 11.0) return 'Thrissur';
  if (lat >= 10.0 && lat < 10.5) return 'Ernakulam';
  if (lat >= 9.5 && lat < 10.0) return 'Kottayam';
  if (lat >= 9.0 && lat < 9.5) return 'Pathanamthitta';
  if (lat >= 8.5 && lat < 9.0) return 'Kollam';
  if (lat < 8.5) return 'Thiruvananthapuram';
  if (lng >= 77.0) return 'Idukki';
  if (lat >= 11.5 && lng < 76.0) return 'Wayanad';
  if (lat >= 10.5 && lng < 76.0) return 'Palakkad';
  return 'Malappuram';
};

export async function getCropComparison(district: string) {
  const res = await fetch(`/api/compare?district=${district}`);
  return res.json();
}

export async function getSeasonalGuide(district: string) {
  const res = await fetch(`/api/seasonal-guide?district=${district}`);
  return res.json();
}

export async function getMarketPrices(crop: string) {
  const res = await fetch(`/api/market-price?crop=${crop}`);
  return res.json();
}
