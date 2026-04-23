import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os
from sqlalchemy.orm import Session
from app.models.campaign import Campaign
from app.models.donation import Donation

CSV_PATH = "app/ml/maharashtra_hotspot_dataset.csv"
MODEL_PATH = "app/ml/hotspot_model.pkl"
CAT_ENCODER_PATH = "app/ml/category_encoder.pkl"
CITY_ENCODER_PATH = "app/ml/city_encoder.pkl"

def train_hotspot_model():
    """
    Trains a model using the provided Maharashtra hotspot dataset.
    """
    if not os.path.exists(CSV_PATH):
        return {"error": "Dataset CSV not found at " + CSV_PATH}

    # 1. Load Data
    df = pd.read_csv(CSV_PATH)
    
    # 2. Preprocessing
    le_cat = LabelEncoder()
    le_city = LabelEncoder()
    
    df['category_enc'] = le_cat.fit_transform(df['category'])
    df['city_enc'] = le_city.fit_transform(df['city'])
    
    # Features from CSV: goal_amount, raised_amount, fulfillment_ratio, donation_count, poverty_index, etc.
    # We'll use a subset that we can also extract from our live database
    feature_cols = ['city_enc', 'category_enc', 'goal_amount', 'raised_amount', 'fulfillment_ratio', 'donation_count']
    
    X = df[feature_cols]
    y = df['is_hotspot']
    
    # 3. Training
    model = GradientBoostingClassifier(n_estimators=150, learning_rate=0.05, max_depth=5)
    model.fit(X, y)
    
    # 4. Save
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(le_cat, CAT_ENCODER_PATH)
    joblib.dump(le_city, CITY_ENCODER_PATH)
    
    return {"message": "Model trained on Maharashtra dataset successfully", "samples": len(df)}

def predict_hotspots(db: Session):
    """
    Predicts probability of being a hotspot for current active campaigns
    """
    if not os.path.exists(MODEL_PATH):
        train_hotspot_model()
        
    model = joblib.load(MODEL_PATH)
    le_cat = joblib.load(CAT_ENCODER_PATH)
    le_city = joblib.load(CITY_ENCODER_PATH)
    
    # Fetch active campaigns
    campaigns = db.query(Campaign).filter(Campaign.status == "active").all()
    if not campaigns:
        return []
    
    results = []
    for c in campaigns:
        # Prepare features
        try:
            # We need to map the campaign city to the encoder. 
            # If city is missing in campaign, we'll try to use a default or mock if it's the demo.
            campaign_city = c.city if hasattr(c, 'city') and c.city else "Mumbai"
            city_enc = le_city.transform([campaign_city])[0]
        except:
            city_enc = 0
            
        try:
            cat_enc = le_cat.transform([c.category])[0]
        except:
            cat_enc = 0
            
        ratio = c.raised_amount / c.goal_amount if c.goal_amount > 0 else 0
        donations_count = db.query(Donation).filter(Donation.campaign_id == c.id).count()
        
        # Must match feature_cols order: ['city_enc', 'category_enc', 'goal_amount', 'raised_amount', 'fulfillment_ratio', 'donation_count']
        features = [[city_enc, cat_enc, c.goal_amount, c.raised_amount, ratio, donations_count]]
        
        # Predict probability
        prob = model.predict_proba(features)[0][1]
        
        # Use coordinates from campaign or assigned locations
        locations = {
            "Mumbai": {"lat": 19.0760, "lng": 72.8777},
            "Pune": {"lat": 18.5204, "lng": 73.8567},
            "Nagpur": {"lat": 21.1458, "lng": 79.0882},
            "Nashik": {"lat": 19.9975, "lng": 73.7898},
            "Thane": {"lat": 19.2183, "lng": 72.9781},
            "Aurangabad": {"lat": 19.8762, "lng": 75.3433},
            "Solapur": {"lat": 17.6599, "lng": 75.9064}
        }
        
        city_name = getattr(c, 'city', "Mumbai") or "Mumbai"
        coords = locations.get(city_name, locations["Mumbai"])

        results.append({
            "campaign_id": c.id,
            "title": c.title,
            "category": c.category,
            "hotspot_score": float(prob),
            "need_gap": c.goal_amount - c.raised_amount,
            "lat": coords["lat"],
            "lng": coords["lng"],
            "city": city_name
        })
    
    return sorted(results, key=lambda x: x['hotspot_score'], reverse=True)
