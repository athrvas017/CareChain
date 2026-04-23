from app.ml.hotspot_engine import train_hotspot_model
import os

print("Starting ML Model Training...")
result = train_hotspot_model()
print(f"Result: {result}")

if os.path.exists("app/ml/hotspot_model.pkl"):
    print("SUCCESS: hotspot_model.pkl created!")
else:
    print("FAILED: Model file not found.")
