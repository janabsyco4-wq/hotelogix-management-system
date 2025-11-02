"""
Hotelogix Chatbot API Server
Flask API for the simple chatbot
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from simple_chatbot import SimpleChatbot
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize chatbot
print("🤖 Initializing Hotelogix Chatbot...")
chatbot = SimpleChatbot()
print("✅ Chatbot ready!")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Hotelogix Chatbot API',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
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
        
        # Get response from chatbot
        bot_response = chatbot.get_response(user_message)
        
        return jsonify({
            'response': bot_response,
            'status': 'success',
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'response': "I'm experiencing some technical difficulties. Please contact our support team at +92 310 4594964.",
            'status': 'error',
            'timestamp': datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    print("\n" + "=" * 70)
    print("🚀 HOTELOGIX CHATBOT API SERVER")
    print("=" * 70)
    print("\n📡 API Endpoints:")
    print("   - POST /chat - Send messages to chatbot")
    print("   - GET /health - Health check")
    print("\n🌐 Server running on http://localhost:5001")
    print("=" * 70 + "\n")
    
    app.run(host='0.0.0.0', port=5001, debug=True)
