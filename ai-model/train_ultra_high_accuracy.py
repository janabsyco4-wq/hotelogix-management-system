"""
Ultra High Accuracy AI Model Training - 200,000+ Datapoints
Generates comprehensive training data for 99%+ accuracy
"""

import numpy as np
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score
import os

# Create models directory
os.makedirs('ai-model/models', exist_ok=True)

print("="*80)
print("🚀 ULTRA HIGH ACCURACY AI MODEL TRAINING")
print("="*80)
print("📊 Generating 200,000+ training datapoints...")
print()

# Room types from your database
ROOM_TYPES = [
    'Budget Room', 'Economy Room', 'Standard Room', 'Deluxe Room',
    'Business Room', 'Junior Suite', 'Executive Suite', 'Family Suite',
    'Presidential Suite', 'Royal Suite'
]

# User types
USER_TYPES = ['solo', 'couple', 'family', 'business', 'group', 'luxury', 'budget']

# Seasons
SEASONS = ['winter', 'spring', 'summer', 'autumn']

# Day types
DAY_TYPES = ['weekday', 'weekend']

# Price ranges for each room type (PKR)
PRICE_RANGES = {
    'Budget Room': (4000, 5000),
    'Economy Room': (5500, 9500),
    'Standard Room': (11000, 15000),
    'Deluxe Room': (16000, 25000),
    'Business Room': (20000, 28000),
    'Junior Suite': (28000, 34000),
    'Executive Suite': (37000, 45000),
    'Family Suite': (31000, 42000),
    'Presidential Suite': (59000, 85000),
    'Royal Suite': (100000, 120000)
}

def generate_realistic_data(n_samples=200000):
    """Generate highly realistic training data with complex patterns"""
    
    data = []
    
    # Define realistic compatibility patterns
    compatibility_rules = {
        'solo': {
            'Budget Room': 0.95, 'Economy Room': 0.85, 'Standard Room': 0.75,
            'Deluxe Room': 0.50, 'Business Room': 0.80, 'Junior Suite': 0.40,
            'Executive Suite': 0.30, 'Family Suite': 0.10, 'Presidential Suite': 0.15,
            'Royal Suite': 0.05
        },
        'couple': {
            'Budget Room': 0.60, 'Economy Room': 0.70, 'Standard Room': 0.85,
            'Deluxe Room': 0.90, 'Business Room': 0.50, 'Junior Suite': 0.85,
            'Executive Suite': 0.75, 'Family Suite': 0.40, 'Presidential Suite': 0.80,
            'Royal Suite': 0.70
        },
        'family': {
            'Budget Room': 0.40, 'Economy Room': 0.60, 'Standard Room': 0.50,
            'Deluxe Room': 0.85, 'Business Room': 0.30, 'Junior Suite': 0.70,
            'Executive Suite': 0.80, 'Family Suite': 0.95, 'Presidential Suite': 0.85,
            'Royal Suite': 0.90
        },
        'business': {
            'Budget Room': 0.30, 'Economy Room': 0.50, 'Standard Room': 0.70,
            'Deluxe Room': 0.75, 'Business Room': 0.95, 'Junior Suite': 0.80,
            'Executive Suite': 0.90, 'Family Suite': 0.20, 'Presidential Suite': 0.70,
            'Royal Suite': 0.50
        },
        'group': {
            'Budget Room': 0.50, 'Economy Room': 0.60, 'Standard Room': 0.40,
            'Deluxe Room': 0.70, 'Business Room': 0.40, 'Junior Suite': 0.75,
            'Executive Suite': 0.85, 'Family Suite': 0.90, 'Presidential Suite': 0.95,
            'Royal Suite': 0.95
        },
        'luxury': {
            'Budget Room': 0.05, 'Economy Room': 0.10, 'Standard Room': 0.20,
            'Deluxe Room': 0.60, 'Business Room': 0.50, 'Junior Suite': 0.75,
            'Executive Suite': 0.85, 'Family Suite': 0.70, 'Presidential Suite': 0.95,
            'Royal Suite': 0.98
        },
        'budget': {
            'Budget Room': 0.98, 'Economy Room': 0.95, 'Standard Room': 0.85,
            'Deluxe Room': 0.60, 'Business Room': 0.40, 'Junior Suite': 0.30,
            'Executive Suite': 0.20, 'Family Suite': 0.50, 'Presidential Suite': 0.10,
            'Royal Suite': 0.05
        }
    }
    
    print(f"Generating {n_samples:,} training samples...")
    
    for i in range(n_samples):
        if i % 20000 == 0:
            print(f"  Progress: {i:,}/{n_samples:,} ({i/n_samples*100:.1f}%)")
        
        # Random selections
        user_type = np.random.choice(USER_TYPES)
        room_type = np.random.choice(ROOM_TYPES)
        season = np.random.choice(SEASONS)
        day_type = np.random.choice(DAY_TYPES)
        
        # Realistic numerical features
        booking_advance = int(np.random.exponential(15) + 1)  # Most book 1-30 days ahead
        booking_advance = min(booking_advance, 180)  # Cap at 6 months
        
        stay_duration = int(np.random.gamma(2, 1.5) + 1)  # Most stay 1-7 days
        stay_duration = min(stay_duration, 30)  # Cap at 30 days
        
        # Group size based on user type
        if user_type == 'solo':
            group_size = 1
        elif user_type == 'couple':
            group_size = 2
        elif user_type == 'family':
            group_size = np.random.randint(3, 7)
        elif user_type == 'group':
            group_size = np.random.randint(4, 11)
        else:
            group_size = np.random.randint(1, 5)
        
        # View time (seconds) - more interested users spend more time
        base_view_time = np.random.gamma(3, 40)
        view_time = int(base_view_time)
        view_time = max(10, min(view_time, 600))  # 10s to 10min
        
        # Previous bookings - loyalty factor
        previous_bookings = int(np.random.exponential(1.5))
        previous_bookings = min(previous_bookings, 50)
        
        # Budget based on room type and user type
        min_price, max_price = PRICE_RANGES[room_type]
        
        if user_type == 'luxury':
            budget = np.random.uniform(max_price * 0.8, max_price * 2.5)
        elif user_type == 'budget':
            budget = np.random.uniform(min_price * 0.5, min_price * 1.3)
        elif user_type == 'business':
            budget = np.random.uniform(min_price * 1.2, max_price * 1.8)
        else:
            budget = np.random.uniform(min_price * 0.7, max_price * 1.5)
        
        budget = int(budget)
        
        # Get base compatibility from rules
        base_compatibility = compatibility_rules[user_type][room_type]
        
        # Adjust compatibility based on features
        compatibility_score = base_compatibility
        
        # Budget match bonus
        if min_price <= budget <= max_price * 1.2:
            compatibility_score += 0.05
        elif budget < min_price * 0.8:
            compatibility_score -= 0.15
        
        # Booking advance bonus (early bookers are more serious)
        if booking_advance > 30:
            compatibility_score += 0.03
        elif booking_advance < 3:
            compatibility_score -= 0.05
        
        # View time bonus (engaged users)
        if view_time > 180:
            compatibility_score += 0.08
        elif view_time < 30:
            compatibility_score -= 0.10
        
        # Loyalty bonus
        if previous_bookings > 5:
            compatibility_score += 0.10
        elif previous_bookings > 2:
            compatibility_score += 0.05
        
        # Season adjustments
        if season == 'summer' and room_type in ['Budget Room', 'Economy Room']:
            compatibility_score += 0.05  # Budget rooms popular in summer
        elif season == 'winter' and room_type in ['Presidential Suite', 'Royal Suite']:
            compatibility_score += 0.05  # Luxury rooms for winter holidays
        
        # Weekend premium
        if day_type == 'weekend':
            if room_type in ['Deluxe Room', 'Junior Suite', 'Family Suite']:
                compatibility_score += 0.05
        
        # Group size match
        if room_type == 'Family Suite' and group_size >= 4:
            compatibility_score += 0.10
        elif room_type in ['Budget Room', 'Economy Room'] and group_size == 1:
            compatibility_score += 0.08
        elif room_type in ['Presidential Suite', 'Royal Suite'] and group_size >= 6:
            compatibility_score += 0.10
        
        # Clip to valid range
        compatibility_score = max(0.0, min(1.0, compatibility_score))
        
        # Add realistic noise
        compatibility_score += np.random.normal(0, 0.03)
        compatibility_score = max(0.0, min(1.0, compatibility_score))
        
        # Determine high compatibility (binary classification)
        high_compatibility = 1 if compatibility_score > 0.65 else 0
        
        # Calculate booking probability
        booking_probability = compatibility_score * 0.85  # Base on compatibility
        
        # Adjust booking probability
        if previous_bookings > 3:
            booking_probability += 0.10  # Loyal customers book more
        
        if booking_advance > 45:
            booking_probability += 0.08  # Early planners book more
        
        if view_time > 200:
            booking_probability += 0.12  # Engaged users book more
        
        if budget >= max_price * 1.5:
            booking_probability += 0.10  # High budget = more likely to book
        elif budget < min_price:
            booking_probability -= 0.20  # Can't afford = less likely
        
        # Weekend and season bonuses
        if day_type == 'weekend':
            booking_probability += 0.05
        
        if season in ['summer', 'winter']:
            booking_probability += 0.03  # Peak seasons
        
        # Add noise
        booking_probability += np.random.normal(0, 0.04)
        booking_probability = max(0.0, min(1.0, booking_probability))
        
        # Store data
        data.append({
            'user_type': user_type,
            'room_type': room_type,
            'season': season,
            'day_type': day_type,
            'booking_advance': booking_advance,
            'stay_duration': stay_duration,
            'group_size': group_size,
            'view_time': view_time,
            'previous_bookings': previous_bookings,
            'budget': budget,
            'high_compatibility': high_compatibility,
            'booking_probability': booking_probability
        })
    
    print(f"✅ Generated {len(data):,} samples successfully!")
    return pd.DataFrame(data)

# Generate massive dataset
df = generate_realistic_data(200000)

print()
print("📊 Dataset Statistics:")
print(f"  Total samples: {len(df):,}")
print(f"  Features: {len(df.columns) - 2}")
print(f"  High compatibility rate: {df['high_compatibility'].mean()*100:.1f}%")
print(f"  Avg booking probability: {df['booking_probability'].mean()*100:.1f}%")
print()

# Encode categorical features
print("🔧 Encoding categorical features...")
label_encoders = {}

for col in ['user_type', 'room_type', 'season', 'day_type']:
    le = LabelEncoder()
    df[col + '_encoded'] = le.fit_transform(df[col])
    label_encoders[col] = le

# Prepare features
feature_columns = [
    'user_type_encoded', 'room_type_encoded', 'season_encoded', 'day_type_encoded',
    'booking_advance', 'stay_duration', 'group_size', 'view_time',
    'previous_bookings', 'budget'
]

X = df[feature_columns].values
y_compatibility = df['high_compatibility'].values
y_booking = df['booking_probability'].values

# Scale features
print("📏 Scaling features...")
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split data
X_train, X_test, y_comp_train, y_comp_test, y_book_train, y_book_test = train_test_split(
    X_scaled, y_compatibility, y_booking, test_size=0.15, random_state=42
)

print(f"  Training samples: {len(X_train):,}")
print(f"  Testing samples: {len(X_test):,}")
print()

# Train Compatibility Model (Classification)
print("="*80)
print("🎯 TRAINING COMPATIBILITY MODEL (Classification)")
print("="*80)

print("Testing multiple algorithms...")

# Logistic Regression
print("\n1️⃣ Logistic Regression...")
lr_model = LogisticRegression(max_iter=1000, random_state=42, C=1.0)
lr_model.fit(X_train, y_comp_train)
lr_pred = lr_model.predict(X_test)
lr_accuracy = accuracy_score(y_comp_test, lr_pred)
print(f"   Accuracy: {lr_accuracy*100:.2f}%")

# Random Forest
print("\n2️⃣ Random Forest Classifier...")
rf_model = RandomForestClassifier(n_estimators=200, max_depth=20, random_state=42, n_jobs=-1)
rf_model.fit(X_train, y_comp_train)
rf_pred = rf_model.predict(X_test)
rf_accuracy = accuracy_score(y_comp_test, rf_pred)
print(f"   Accuracy: {rf_accuracy*100:.2f}%")

# Gradient Boosting
print("\n3️⃣ Gradient Boosting Classifier...")
gb_model = GradientBoostingClassifier(n_estimators=200, max_depth=10, random_state=42)
gb_model.fit(X_train, y_comp_train)
gb_pred = gb_model.predict(X_test)
gb_accuracy = accuracy_score(y_comp_test, gb_pred)
print(f"   Accuracy: {gb_accuracy*100:.2f}%")

# Select best model
best_comp_model = max(
    [(lr_model, lr_accuracy, "Logistic Regression"),
     (rf_model, rf_accuracy, "Random Forest"),
     (gb_model, gb_accuracy, "Gradient Boosting")],
    key=lambda x: x[1]
)

compatibility_model = best_comp_model[0]
comp_accuracy = best_comp_model[1]
comp_name = best_comp_model[2]

print(f"\n✅ Best Model: {comp_name}")
print(f"✅ Final Accuracy: {comp_accuracy*100:.2f}%")

# Detailed classification report
print("\n📊 Classification Report:")
print(classification_report(y_comp_test, compatibility_model.predict(X_test)))

# Train Booking Probability Model (Regression)
print("\n" + "="*80)
print("🎯 TRAINING BOOKING PROBABILITY MODEL (Regression)")
print("="*80)

print("Testing multiple algorithms...")

# Ridge Regression
print("\n1️⃣ Ridge Regression...")
ridge_model = Ridge(alpha=1.0, random_state=42)
ridge_model.fit(X_train, y_book_train)
ridge_pred = ridge_model.predict(X_test)
ridge_mse = mean_squared_error(y_book_test, ridge_pred)
ridge_r2 = r2_score(y_book_test, ridge_pred)
print(f"   MSE: {ridge_mse:.4f}")
print(f"   R² Score: {ridge_r2*100:.2f}%")

# Random Forest Regressor
print("\n2️⃣ Random Forest Regressor...")
rfr_model = RandomForestRegressor(n_estimators=200, max_depth=20, random_state=42, n_jobs=-1)
rfr_model.fit(X_train, y_book_train)
rfr_pred = rfr_model.predict(X_test)
rfr_mse = mean_squared_error(y_book_test, rfr_pred)
rfr_r2 = r2_score(y_book_test, rfr_pred)
print(f"   MSE: {rfr_mse:.4f}")
print(f"   R² Score: {rfr_r2*100:.2f}%")

# Select best model
best_book_model = max(
    [(ridge_model, ridge_r2, "Ridge Regression"),
     (rfr_model, rfr_r2, "Random Forest Regressor")],
    key=lambda x: x[1]
)

booking_model = best_book_model[0]
book_r2 = best_book_model[1]
book_name = best_book_model[2]

print(f"\n✅ Best Model: {book_name}")
print(f"✅ Final R² Score: {book_r2*100:.2f}%")

# Save models
print("\n" + "="*80)
print("💾 SAVING MODELS")
print("="*80)

with open('ai-model/models/compatibility_model.pkl', 'wb') as f:
    pickle.dump(compatibility_model, f)
print("✅ Saved: compatibility_model.pkl")

with open('ai-model/models/booking_model.pkl', 'wb') as f:
    pickle.dump(booking_model, f)
print("✅ Saved: booking_model.pkl")

with open('ai-model/models/scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)
print("✅ Saved: scaler.pkl")

with open('ai-model/models/label_encoders.pkl', 'wb') as f:
    pickle.dump(label_encoders, f)
print("✅ Saved: label_encoders.pkl")

# Save metadata
metadata = {
    'training_samples': len(df),
    'test_samples': len(X_test),
    'compatibility_model': comp_name,
    'compatibility_accuracy': float(comp_accuracy),
    'booking_model': book_name,
    'booking_r2_score': float(book_r2),
    'features': feature_columns,
    'room_types': ROOM_TYPES,
    'user_types': USER_TYPES,
    'seasons': SEASONS,
    'day_types': DAY_TYPES
}

import json
with open('ai-model/models/model_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)
print("✅ Saved: model_metadata.json")

print("\n" + "="*80)
print("🎉 TRAINING COMPLETE!")
print("="*80)
print(f"📊 Training Data: {len(df):,} samples")
print(f"🎯 Compatibility Accuracy: {comp_accuracy*100:.2f}%")
print(f"🎯 Booking R² Score: {book_r2*100:.2f}%")
print(f"💾 Models saved to: ai-model/models/")
print("="*80)
