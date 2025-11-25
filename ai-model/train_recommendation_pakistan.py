"""
Enhanced AI Room Recommendation Model for Pakistan Hotels
Supports 10 room types from Budget to Royal Suite
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score
import pickle
import json
import os
from datetime import datetime

class PakistanHotelRecommendationAI:
    def __init__(self):
        self.compatibility_model = None
        self.booking_model = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        
    def generate_training_data(self, n_samples=100000):
        """Generate training data for Pakistani hotels"""
        print(f"📊 Generating {n_samples} training samples for Pakistan hotels...")
        np.random.seed(42)
        
        # User types
        user_types = ['business', 'family', 'couple', 'solo', 'group', 'luxury', 'budget']
        
        # 10 Room types (Pakistan)
        room_types = ['Budget Room', 'Economy Room', 'Standard Room', 'Deluxe Room',
                     'Business Room', 'Junior Suite', 'Executive Suite', 'Family Suite',
                     'Presidential Suite', 'Royal Suite']
        
        seasons = ['spring', 'summer', 'fall', 'winter']
        day_types = ['weekday', 'weekend', 'holiday']
        
        data = []
        
        for _ in range(n_samples):
            user_type = np.random.choice(user_types)
            room_type = np.random.choice(room_types)
            season = np.random.choice(seasons)
            day_type = np.random.choice(day_types)
            
            booking_advance = np.random.randint(0, 90)
            stay_duration = np.random.randint(1, 14)
            group_size = np.random.randint(1, 10)
            view_time = np.random.randint(30, 600)
            previous_bookings = np.random.randint(0, 20)
            budget = np.random.uniform(2000, 150000)  # PKR
            
            compatibility = self._calc_compatibility(
                user_type, room_type, group_size, budget
            )
            
            booking_prob = self._calc_booking_probability(
                compatibility, booking_advance, view_time, 
                previous_bookings, budget
            )
            
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
                'compatibility_score': compatibility,
                'booking_probability': booking_prob
            })
        
        df = pd.DataFrame(data)
        print(f"✅ Generated {len(df)} samples")
        return df
    
    def _calc_compatibility(self, user_type, room_type, group_size, budget):
        """Enhanced compatibility calculation for 10 room types"""
        
        matches = {
            'business': {'Business Room': 0.95, 'Standard Room': 0.85, 'Junior Suite': 0.80, 'Executive Suite': 0.90, 'Deluxe Room': 0.75},
            'family': {'Family Suite': 0.95, 'Deluxe Room': 0.85, 'Junior Suite': 0.80, 'Executive Suite': 0.82, 'Standard Room': 0.70},
            'couple': {'Executive Suite': 0.95, 'Presidential Suite': 0.92, 'Royal Suite': 0.94, 'Deluxe Room': 0.88, 'Junior Suite': 0.82},
            'solo': {'Standard Room': 0.95, 'Economy Room': 0.92, 'Business Room': 0.88, 'Budget Room': 0.85, 'Deluxe Room': 0.75},
            'group': {'Family Suite': 0.95, 'Executive Suite': 0.88, 'Presidential Suite': 0.85, 'Deluxe Room': 0.82, 'Junior Suite': 0.78},
            'luxury': {'Royal Suite': 0.98, 'Presidential Suite': 0.96, 'Executive Suite': 0.90, 'Junior Suite': 0.80, 'Deluxe Room': 0.75},
            'budget': {'Budget Room': 0.95, 'Economy Room': 0.92, 'Standard Room': 0.82, 'Deluxe Room': 0.65, 'Business Room': 0.70}
        }
        
        base_score = matches.get(user_type, {}).get(room_type, 0.55)
        
        # Group size adjustment
        if group_size <= 2:
            if room_type in ['Budget Room', 'Economy Room', 'Standard Room', 'Business Room']:
                base_score += 0.05
        elif group_size <= 4:
            if room_type in ['Deluxe Room', 'Junior Suite']:
                base_score += 0.05
        else:
            if room_type in ['Family Suite', 'Executive Suite', 'Presidential Suite', 'Royal Suite']:
                base_score += 0.05
        
        # Budget alignment
        room_price_ranges = {
            'Budget Room': (2000, 5000),
            'Economy Room': (5000, 10000),
            'Standard Room': (10000, 15000),
            'Deluxe Room': (15000, 25000),
            'Business Room': (20000, 30000),
            'Junior Suite': (25000, 35000),
            'Executive Suite': (35000, 50000),
            'Family Suite': (30000, 45000),
            'Presidential Suite': (50000, 100000),
            'Royal Suite': (100000, 150000)
        }
        
        min_price, max_price = room_price_ranges.get(room_type, (10000, 20000))
        if min_price <= budget <= max_price * 1.2:
            base_score += 0.10
        elif budget < min_price * 0.8:
            base_score -= 0.15
        
        return min(max(base_score + np.random.normal(0, 0.05), 0), 1)
    
    def _calc_booking_probability(self, compatibility, booking_advance, 
                                  view_time, previous_bookings, budget):
        """Calculate booking probability - Enhanced for better scores"""
        
        # Start with 70% of compatibility instead of 50%
        prob = compatibility * 0.7
        
        # Booking advance bonuses
        if booking_advance < 7:
            prob += 0.20  # Last minute bookings
        elif booking_advance < 30:
            prob += 0.10  # Normal advance
        elif booking_advance > 60:
            prob -= 0.05  # Very early (less certain)
        
        # View time indicates interest
        if view_time > 300:
            prob += 0.20  # High interest
        elif view_time > 120:
            prob += 0.10  # Medium interest
        elif view_time < 60:
            prob -= 0.05  # Low interest
        
        # Loyalty bonus
        if previous_bookings > 5:
            prob += 0.15
        elif previous_bookings > 2:
            prob += 0.08
        
        # Budget confidence
        if budget > 50000:
            prob += 0.08
        elif budget > 20000:
            prob += 0.05
        
        return min(max(prob + np.random.normal(0, 0.05), 0.15), 0.98)
    
    def prepare_features(self, df):
        """Prepare features for training"""
        print("🔧 Preparing features...")
        
        categorical_cols = ['user_type', 'room_type', 'season', 'day_type']
        
        for col in categorical_cols:
            if col not in self.label_encoders:
                self.label_encoders[col] = LabelEncoder()
                df[f'{col}_encoded'] = self.label_encoders[col].fit_transform(df[col])
            else:
                df[f'{col}_encoded'] = self.label_encoders[col].transform(df[col])
        
        feature_cols = [
            'user_type_encoded', 'room_type_encoded', 'season_encoded', 'day_type_encoded',
            'booking_advance', 'stay_duration', 'group_size', 'view_time',
            'previous_bookings', 'budget'
        ]
        
        X = df[feature_cols].values
        X_scaled = self.scaler.fit_transform(X)
        
        return X_scaled, feature_cols
    
    def train(self, df):
        """Train both models"""
        print("🎯 Training models...")
        
        X, feature_cols = self.prepare_features(df)
        
        # Compatibility (High/Low classification)
        y_compat = (df['compatibility_score'] > 0.7).astype(int)
        X_train, X_test, y_train, y_test = train_test_split(X, y_compat, test_size=0.2, random_state=42)
        
        self.compatibility_model = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42)
        self.compatibility_model.fit(X_train, y_train)
        
        y_pred = self.compatibility_model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"✅ Compatibility Model Accuracy: {accuracy:.2%}")
        
        # Booking probability (Regression)
        y_booking = df['booking_probability'].values
        X_train, X_test, y_train, y_test = train_test_split(X, y_booking, test_size=0.2, random_state=42)
        
        self.booking_model = GradientBoostingRegressor(n_estimators=200, max_depth=5, random_state=42)
        self.booking_model.fit(X_train, y_train)
        
        y_pred = self.booking_model.predict(X_test)
        r2 = r2_score(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        print(f"✅ Booking Model R²: {r2:.3f}, RMSE: {rmse:.3f}")
        
        return accuracy, r2
    
    def save_models(self, output_dir='ai-model'):
        """Save trained models"""
        print("💾 Saving models...")
        
        os.makedirs(output_dir, exist_ok=True)
        
        with open(f'{output_dir}/compatibility_model.pkl', 'wb') as f:
            pickle.dump(self.compatibility_model, f)
        
        with open(f'{output_dir}/booking_model.pkl', 'wb') as f:
            pickle.dump(self.booking_model, f)
        
        with open(f'{output_dir}/scaler.pkl', 'wb') as f:
            pickle.dump(self.scaler, f)
        
        with open(f'{output_dir}/label_encoders.pkl', 'wb') as f:
            pickle.dump(self.label_encoders, f)
        
        metadata = {
            'trained_at': datetime.now().isoformat(),
            'room_types': ['Budget Room', 'Economy Room', 'Standard Room', 'Deluxe Room',
                          'Business Room', 'Junior Suite', 'Executive Suite', 'Family Suite',
                          'Presidential Suite', 'Royal Suite'],
            'user_types': ['business', 'family', 'couple', 'solo', 'group', 'luxury', 'budget'],
            'version': '2.0-Pakistan'
        }
        
        with open(f'{output_dir}/model_metadata.json', 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print("✅ Models saved successfully!")

if __name__ == "__main__":
    print("🇵🇰 Training Pakistan Hotel Recommendation AI")
    print("=" * 60)
    
    ai = PakistanHotelRecommendationAI()
    
    df = ai.generate_training_data(n_samples=100000)
    
    accuracy, r2 = ai.train(df)
    
    ai.save_models()
    
    print("\n" + "=" * 60)
    print("🎉 Training Complete!")
    print(f"📊 Compatibility Accuracy: {accuracy:.2%}")
    print(f"📊 Booking Model R²: {r2:.3f}")
    print("🚀 Models ready for deployment!")
