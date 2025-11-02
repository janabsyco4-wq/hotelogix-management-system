"""
Simple Rule-Based Chatbot for Hotelogix
Works without TensorFlow - uses pattern matching
"""

import json
import re
from difflib import get_close_matches

class SimpleChatbot:
    def __init__(self, dataset_path='chatbot/dataset.json'):
        with open(dataset_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        self.intents = data['intents']
        print(f"✅ Chatbot loaded with {len(self.intents)} intents")
    
    def get_response(self, user_input):
        """Get response using pattern matching"""
        user_input = user_input.lower().strip()
        
        # Find best matching intent
        best_match = None
        best_score = 0
        
        for intent in self.intents:
            for pattern in intent['patterns']:
                # Simple similarity check
                pattern_lower = pattern.lower()
                
                # Exact match
                if user_input == pattern_lower:
                    return intent['responses'][0]
                
                # Contains match
                if user_input in pattern_lower or pattern_lower in user_input:
                    score = len(set(user_input.split()) & set(pattern_lower.split()))
                    if score > best_score:
                        best_score = score
                        best_match = intent
        
        if best_match and best_score > 0:
            import random
            return random.choice(best_match['responses'])
        
        return "I'm sorry, I didn't understand that. Could you please rephrase? You can ask about rooms, booking, pricing, amenities, or contact information."

# Test the chatbot
if __name__ == "__main__":
    print("🤖 Simple Hotelogix Chatbot")
    print("=" * 50)
    
    bot = SimpleChatbot()
    
    print("\n💬 Chat with me! (type 'quit' to exit)\n")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() in ['quit', 'exit', 'bye']:
            print("Bot: Goodbye! Thank you for using Hotelogix!")
            break
        
        response = bot.get_response(user_input)
        print(f"Bot: {response}\n")
