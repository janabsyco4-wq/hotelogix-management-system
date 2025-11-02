"""
Hotelogix Chatbot API - Using Sklearn Model
Flask API server for the trained sklearn chatbot
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import random
from datetime import datetime
import nltk
from nltk.stem import WordNetLemmatizer

app = Flask(__name__)
CORS(app)

# Load model
print("🤖 Loading Hotelogix Chatbot Model...")

lemmatizer = WordNetLemmatizer()

with open('chatbot/model/sklearn_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('chatbot/model/intents_map.pkl', 'rb') as f:
    intents_map = pickle.load(f)

print(f"✅ Model loaded! {len(intents_map)} intents ready")

def preprocess_text(text):
    """Preprocess user input"""
    words = nltk.word_tokenize(text.lower())
    words = [lemmatizer.lemmatize(w) for w in words]
    return ' '.join(words)

def get_response(user_message):
    """Get chatbot response"""
    try:
        # Preprocess
        processed = preprocess_text(user_message)
        
        # Predict intent
        intent = model.predict([processed])[0]
        confidence = max(model.predict_proba([processed])[0])
        
        # Get response
        if confidence > 0.3:  # Confidence threshold
            responses = intents_map.get(intent, [])
            if responses:
                return random.choice(responses), confidence
        
        return "I'm sorry, I didn't understand that. Could you please rephrase? You can ask about rooms, booking, pricing, amenities, or contact information.", 0.0
    
    except Exception as e:
        print(f"Error: {e}")
        return "I'm experiencing some technical difficulties. Please contact our support team at +92 310 4594964.", 0.0

@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({
        'status': 'healthy',
        'service': 'Hotelogix AI Chatbot',
        'model': 'sklearn',
        'intents': len(intents_map),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                'error': 'Message is required',
                'status': 'error'
            }), 400
        
        user_message = data['message'].strip()
        
        if not user_message:
            return jsonify({
                'error': 'Message cannot be empty',
                'status': 'error'
            }), 400
        
        # Get response
        response, confidence = get_response(user_message)
        
        return jsonify({
            'response': response,
            'confidence': float(confidence),
            'status': 'success',
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'response': "I'm experiencing some technical difficulties. Please contact our support team.",
            'status': 'error',
            'timestamp': datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    print("\n" + "=" * 70)
    print("🚀 HOTELOGIX AI CHATBOT API SERVER")
    print("=" * 70)
    print(f"\n📊 Model Info:")
    print(f"   - Type: Sklearn (TF-IDF + Naive Bayes)")
    print(f"   - Intents: {len(intents_map)}")
    print(f"   - Accuracy: 95.08%")
    print(f"\n📡 API Endpoints:")
    print(f"   - POST /chat - Send messages to chatbot")
    print(f"   - GET /health - Health check")
    print(f"\n🌐 Server running on http://localhost:5001")
    print("=" * 70 + "\n")
    
    app.run(host='0.0.0.0', port=5001, debug=True)
