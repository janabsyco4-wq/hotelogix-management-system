"""
Flask API for AI Room Recommendations
Serves compatibility scores and booking likelihood predictions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Stats file path
STATS_FILE = 'ai-model/stats_data.json'

# Global model variables
compatibility_model = None
booking_model = None
scaler = None
label_encoders = None

def load_stats():
    """Load stats from file if exists"""
    if os.path.exists(STATS_FILE):
        try:
            with open(STATS_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"⚠️ Could not load stats: {e}")
    
    # Return default stats
    return {
        "total_predictions": 0,
        "room_type_counts": {},
        "user_type_counts": {},
        "season_counts": {},
        "day_type_counts": {},
        "avg_compatibility": [],
        "avg_booking_likelihood": [],
        "start_time": datetime.now().isoformat(),
        "clicks": 0,
        "views": 0,
        "bookings": 0,
        "device_breakdown": {"desktop": 0, "mobile": 0, "tablet": 0},
        "time_of_day": {},
        "session_times": [],
        "bounce_count": 0,
        "total_sessions": 0,
        "total_revenue": 0,
        "ai_driven_revenue": 0,
        "booking_revenues": [],
        "room_bookings": {}
    }

def save_stats():
    """Save stats to file"""
    try:
        with open(STATS_FILE, 'w') as f:
            json.dump(stats, f, indent=2)
    except Exception as e:
        print(f"⚠️ Could not save stats: {e}")

# Global stats tracking - load from file
stats = load_stats()
print(f"📊 Loaded stats: {stats['total_predictions']} predictions, {stats['bookings']} bookings")

def load_models():
    """Load trained ML models"""
    global compatibility_model, booking_model, scaler, label_encoders
    
    model_dir = 'ai-model/models'
    
    print("📂 Loading AI models...")
    
    try:
        with open(f'{model_dir}/compatibility_model.pkl', 'rb') as f:
            compatibility_model = pickle.load(f)
        
        with open(f'{model_dir}/booking_model.pkl', 'rb') as f:
            booking_model = pickle.load(f)
        
        with open(f'{model_dir}/scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)
        
        with open(f'{model_dir}/label_encoders.pkl', 'rb') as f:
            label_encoders = pickle.load(f)
        
        print("✅ Models loaded successfully!")
        return True
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return False

def prepare_features(user_data):
    """Prepare features for prediction"""
    
    # Encode categorical features
    user_type_enc = label_encoders['user_type'].transform([user_data.get('user_type', 'solo')])[0]
    room_type_enc = label_encoders['room_type'].transform([user_data.get('room_type', 'Standard')])[0]
    season_enc = label_encoders['season'].transform([user_data.get('season', 'summer')])[0]
    day_type_enc = label_encoders['day_type'].transform([user_data.get('day_type', 'weekday')])[0]
    
    # Numerical features
    booking_advance = user_data.get('booking_advance', 7)
    stay_duration = user_data.get('stay_duration', 2)
    group_size = user_data.get('group_size', 2)
    view_time = user_data.get('view_time', 120)
    previous_bookings = user_data.get('previous_bookings', 0)
    budget = user_data.get('budget', 150)
    
    # Feature engineering
    urgency = booking_advance * view_time
    value_ratio = budget / (stay_duration + 1)
    loyalty = previous_bookings * stay_duration
    
    # Create feature vector
    features = np.array([[
        user_type_enc, room_type_enc, season_enc, day_type_enc,
        booking_advance, stay_duration, group_size, view_time,
        previous_bookings, budget, urgency, value_ratio, loyalty
    ]])
    
    # Scale features
    features_scaled = scaler.transform(features)
    
    return features_scaled

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Recommendation API',
        'models_loaded': compatibility_model is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/stats', methods=['GET'])
def get_stats():
    """Get model statistics and analytics"""
    try:
        avg_compat = np.mean(stats["avg_compatibility"]) if stats["avg_compatibility"] else 0
        avg_booking = np.mean(stats["avg_booking_likelihood"]) if stats["avg_booking_likelihood"] else 0
        avg_session_time = np.mean(stats["session_times"]) if stats["session_times"] else 0
        
        # Calculate click-through rate
        ctr = (stats["clicks"] / stats["views"] * 100) if stats["views"] > 0 else 0
        
        # Calculate conversion rate
        conversion_rate = (stats["bookings"] / stats["views"] * 100) if stats["views"] > 0 else 0
        
        # Calculate bounce rate
        bounce_rate = (stats["bounce_count"] / stats["total_sessions"] * 100) if stats["total_sessions"] > 0 else 0
        
        # Calculate revenue metrics
        avg_order_value = (stats["total_revenue"] / stats["bookings"]) if stats["bookings"] > 0 else 0
        ai_contribution = (stats["ai_driven_revenue"] / stats["total_revenue"] * 100) if stats["total_revenue"] > 0 else 0
        
        # Calculate device percentages
        total_devices = sum(stats["device_breakdown"].values())
        device_percentages = {
            device: round((count / total_devices * 100), 1) if total_devices > 0 else 0
            for device, count in stats["device_breakdown"].items()
        }
        
        # Format time of day data
        time_of_day_data = [
            {"hour": int(hour), "interactions": count}
            for hour, count in sorted(stats["time_of_day"].items(), key=lambda x: int(x[0]))
        ]
        
        return jsonify({
            'success': True,
            'model_info': {
                'version': '1.0.0',
                'last_trained': stats["start_time"],
                'total_predictions': stats["total_predictions"],
                'features_used': 13,
                'algorithms': ['Logistic Regression', 'Linear Regression']
            },
            'performance': {
                'avg_compatibility_score': round(avg_compat, 2),
                'avg_booking_likelihood': round(avg_booking, 2),
                'total_recommendations': len(stats["avg_compatibility"])
            },
            'usage_stats': {
                'total_requests': stats["total_predictions"],
                'room_type_distribution': stats["room_type_counts"],
                'user_type_distribution': stats["user_type_counts"],
                'season_distribution': stats["season_counts"],
                'day_type_distribution': stats["day_type_counts"]
            },
            'user_behavior': {
                'total_interactions': stats["views"],
                'clicks': stats["clicks"],
                'bookings': stats["bookings"],
                'click_through_rate': round(ctr, 2),
                'conversion_rate': round(conversion_rate, 2),
                'average_session_time': round(avg_session_time, 0),
                'bounce_rate': round(bounce_rate, 2),
                'device_breakdown': device_percentages,
                'time_of_day': time_of_day_data
            },
            'revenue': {
                'total_revenue': round(stats["total_revenue"], 2),
                'ai_driven_revenue': round(stats["ai_driven_revenue"], 2),
                'ai_contribution': round(ai_contribution, 2),
                'average_order_value': round(avg_order_value, 2),
                'total_bookings': stats["bookings"],
                'room_bookings': stats["room_bookings"]
            },
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    """Get room recommendations based on user preferences"""
    
    if not compatibility_model or not booking_model:
        return jsonify({'error': 'Models not loaded'}), 500
    
    try:
        data = request.json
        
        # Map frontend user types to model user types
        user_type_map = {
            'business_traveler': 'business',
            'family_vacation': 'family',
            'couple_romantic': 'couple',
            'solo_traveler': 'solo',
            'group_friends': 'group',
            'luxury_seeker': 'luxury',
            'budget_conscious': 'budget'
        }
        
        # Get user preferences and map them
        user_type_raw = data.get('userType', 'solo_traveler')
        user_type = user_type_map.get(user_type_raw, 'solo')
        season = data.get('season', 'summer')
        day_type = data.get('dayType', 'weekday')
        
        # Convert all numeric values to proper types
        booking_advance = int(data.get('bookingAdvance', 7))
        stay_duration = int(data.get('stayDuration', 2))
        group_size = int(data.get('groupSize', 2))
        budget = float(data.get('budget', 150))
        view_time = int(data.get('viewTime', 120))
        previous_bookings = int(data.get('previousBookings', 0))
        
        # Room types to evaluate
        room_types = ['Standard', 'Deluxe', 'Business', 'Junior Suite', 
                     'Executive Suite', 'Family Suite', 'Presidential Suite']
        
        recommendations = []
        
        for room_type in room_types:
            # Prepare features
            user_data = {
                'user_type': user_type,
                'room_type': room_type,
                'season': season,
                'day_type': day_type,
                'booking_advance': booking_advance,
                'stay_duration': stay_duration,
                'group_size': group_size,
                'view_time': view_time,
                'previous_bookings': previous_bookings,
                'budget': budget
            }
            
            features = prepare_features(user_data)
            
            # Get predictions
            compatibility_class = compatibility_model.predict(features)[0]
            compatibility_proba = compatibility_model.predict_proba(features)[0]
            compatibility_score = float(compatibility_proba[1])  # Probability of high compatibility
            
            booking_probability = float(booking_model.predict(features)[0])
            booking_probability = max(0, min(1, booking_probability))  # Clip to 0-1
            
            # Calculate overall score
            overall_score = (compatibility_score * 0.6) + (booking_probability * 0.4)
            
            recommendations.append({
                'roomType': room_type,
                'compatibilityScore': round(compatibility_score * 100, 2),
                'bookingLikelihood': round(booking_probability * 100, 2),
                'overallScore': round(overall_score * 100, 2),
                'isHighMatch': bool(compatibility_class == 1),
                'recommendation': get_recommendation_text(compatibility_score, booking_probability)
            })
        
        # Sort by overall score
        recommendations.sort(key=lambda x: x['overallScore'], reverse=True)
        
        # Track stats
        stats["total_predictions"] += 1
        stats["views"] += 1  # Auto-track view
        stats["total_sessions"] += 1
        stats["user_type_counts"][user_type_raw] = stats["user_type_counts"].get(user_type_raw, 0) + 1
        stats["season_counts"][season] = stats["season_counts"].get(season, 0) + 1
        stats["day_type_counts"][day_type] = stats["day_type_counts"].get(day_type, 0) + 1
        
        # Track device (from request headers)
        user_agent = request.headers.get('User-Agent', '').lower()
        if 'mobile' in user_agent:
            stats["device_breakdown"]["mobile"] += 1
        elif 'tablet' in user_agent or 'ipad' in user_agent:
            stats["device_breakdown"]["tablet"] += 1
        else:
            stats["device_breakdown"]["desktop"] += 1
        
        # Track time of day
        current_hour = datetime.now().hour
        stats["time_of_day"][current_hour] = stats["time_of_day"].get(current_hour, 0) + 1
        
        for rec in recommendations:
            room_type = rec["roomType"]
            stats["room_type_counts"][room_type] = stats["room_type_counts"].get(room_type, 0) + 1
            stats["avg_compatibility"].append(rec["compatibilityScore"])
            stats["avg_booking_likelihood"].append(rec["bookingLikelihood"])
        
        # Keep only last 10000 scores to prevent memory issues
        if len(stats["avg_compatibility"]) > 10000:
            stats["avg_compatibility"] = stats["avg_compatibility"][-10000:]
            stats["avg_booking_likelihood"] = stats["avg_booking_likelihood"][-10000:]
        
        # Save stats to file
        save_stats()
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'topRecommendation': recommendations[0] if recommendations else None,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Error in recommendation: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict-single', methods=['POST'])
def predict_single():
    """Predict compatibility and booking likelihood for a single room"""
    
    if not compatibility_model or not booking_model:
        return jsonify({'error': 'Models not loaded'}), 500
    
    try:
        data = request.json
        features = prepare_features(data)
        
        # Get predictions
        compatibility_class = compatibility_model.predict(features)[0]
        compatibility_proba = compatibility_model.predict_proba(features)[0]
        compatibility_score = float(compatibility_proba[1])
        
        booking_probability = float(booking_model.predict(features)[0])
        booking_probability = max(0, min(1, booking_probability))
        
        return jsonify({
            'success': True,
            'compatibilityScore': round(compatibility_score * 100, 2),
            'bookingLikelihood': round(booking_probability * 100, 2),
            'isHighMatch': bool(compatibility_class == 1),
            'recommendation': get_recommendation_text(compatibility_score, booking_probability)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_recommendation_text(compatibility, booking_prob):
    """Generate recommendation text based on scores"""
    if compatibility > 0.8 and booking_prob > 0.7:
        return "Perfect match! Highly recommended for you."
    elif compatibility > 0.7:
        return "Great match! This room suits your preferences well."
    elif compatibility > 0.5:
        return "Good option that meets your needs."
    elif booking_prob > 0.6:
        return "Popular choice among similar users."
    else:
        return "Consider other options for better match."

@app.route('/track', methods=['POST'])
def track_interaction():
    """Track user interactions for analytics"""
    try:
        data = request.json
        interaction_type = data.get('type', 'view')  # view, click, booking, session
        device = data.get('device', 'desktop')  # desktop, mobile, tablet
        
        current_hour = datetime.now().hour
        
        if interaction_type == 'view':
            stats["views"] += 1
            stats["total_sessions"] += 1
            
        elif interaction_type == 'click':
            stats["clicks"] += 1
            
        elif interaction_type == 'booking':
            stats["bookings"] += 1
            
            # Track revenue
            revenue = data.get('revenue', 0)
            room_type = data.get('room_type', 'Unknown')
            
            stats["total_revenue"] += revenue
            stats["ai_driven_revenue"] += revenue  # Assume all bookings are AI-driven
            stats["booking_revenues"].append(revenue)
            
            # Track bookings by room type
            stats["room_bookings"][room_type] = stats["room_bookings"].get(room_type, 0) + 1
            
            # Keep only last 1000 revenues
            if len(stats["booking_revenues"]) > 1000:
                stats["booking_revenues"] = stats["booking_revenues"][-1000:]
            
        elif interaction_type == 'bounce':
            stats["bounce_count"] += 1
            
        elif interaction_type == 'session':
            session_time = data.get('duration', 0)
            stats["session_times"].append(session_time)
            # Keep only last 1000 session times
            if len(stats["session_times"]) > 1000:
                stats["session_times"] = stats["session_times"][-1000:]
        
        # Track device
        if device in stats["device_breakdown"]:
            stats["device_breakdown"][device] += 1
        
        # Track time of day
        stats["time_of_day"][current_hour] = stats["time_of_day"].get(current_hour, 0) + 1
        
        # Save stats to file
        save_stats()
        
        return jsonify({
            'success': True,
            'message': 'Interaction tracked',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("="*70)
    print("🏨 AI Room Recommendation API")
    print("="*70)
    
    # Load models
    if load_models():
        print("\n🚀 Starting API server...")
        print("📡 Endpoints:")
        print("   - POST /recommend - Get room recommendations")
        print("   - POST /predict-single - Predict for single room")
        print("   - GET /stats - Get model statistics")
        print("   - GET /health - Health check")
        print("\n🌐 Server running on http://localhost:5002")
        print("="*70)
        
        app.run(host='0.0.0.0', port=5002, debug=True)
    else:
        print("\n❌ Failed to load models. Please train the model first:")
        print("   python ai-model/train_recommendation.py")
