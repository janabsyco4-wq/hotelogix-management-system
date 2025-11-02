"""
Hotelogix AI Chatbot - Training with scikit-learn
Alternative to TensorFlow - no DLL issues!
"""

import json
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import nltk
from nltk.stem import WordNetLemmatizer
import warnings
warnings.filterwarnings('ignore')

# Download NLTK data
print("📚 Downloading NLTK data...")
try:
    nltk.data.find('tokenizers/punkt')
except:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/wordnet')
except:
    nltk.download('wordnet', quiet=True)

print("✅ NLTK ready!")

class SklearnChatbot:
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.pipeline = None
        self.intents_map = {}
        
    def preprocess_text(self, text):
        """Preprocess text"""
        words = nltk.word_tokenize(text.lower())
        words = [self.lemmatizer.lemmatize(w) for w in words]
        return ' '.join(words)
    
    def load_data(self, dataset_path):
        """Load dataset"""
        print(f"\n📂 Loading dataset: {dataset_path}")
        
        with open(dataset_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        X = []  # patterns
        y = []  # intent tags
        
        for intent in data['intents']:
            tag = intent['tag']
            self.intents_map[tag] = intent['responses']
            
            for pattern in intent['patterns']:
                X.append(self.preprocess_text(pattern))
                y.append(tag)
        
        print(f"✅ Loaded {len(X):,} patterns across {len(self.intents_map)} intents")
        return X, y, data
    
    def train(self, X, y):
        """Train the model"""
        print(f"\n🏋️ Training model on {len(X):,} samples...")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.1, random_state=42
        )
        
        print(f"   Training samples: {len(X_train):,}")
        print(f"   Test samples: {len(X_test):,}")
        
        # Create pipeline with TF-IDF and Naive Bayes
        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1, 2))),
            ('clf', MultinomialNB(alpha=0.1))
        ])
        
        # Train
        self.pipeline.fit(X_train, y_train)
        
        # Evaluate
        accuracy = self.pipeline.score(X_test, y_test)
        
        print(f"\n✅ Training complete!")
        print(f"   Accuracy: {accuracy:.2%}")
        
        return accuracy
    
    def save_model(self):
        """Save the trained model"""
        print(f"\n💾 Saving model...")
        
        import os
        os.makedirs('chatbot/model', exist_ok=True)
        
        # Save pipeline
        with open('chatbot/model/sklearn_model.pkl', 'wb') as f:
            pickle.dump(self.pipeline, f)
        print(f"   ✅ Model saved: chatbot/model/sklearn_model.pkl")
        
        # Save intents map
        with open('chatbot/model/intents_map.pkl', 'wb') as f:
            pickle.dump(self.intents_map, f)
        print(f"   ✅ Intents saved: chatbot/model/intents_map.pkl")
        
        print(f"\n🎉 All files saved successfully!")
    
    def run(self, dataset_path='chatbot/dataset_expanded.json'):
        """Complete training pipeline"""
        print("=" * 70)
        print("🤖 HOTELOGIX AI CHATBOT - SKLEARN TRAINING")
        print("=" * 70)
        
        # Load data
        X, y, data = self.load_data(dataset_path)
        
        # Train model
        accuracy = self.train(X, y)
        
        # Save model
        self.save_model()
        
        print("\n" + "=" * 70)
        print("✅ TRAINING COMPLETED SUCCESSFULLY!")
        print("=" * 70)
        print(f"\n📊 Final Statistics:")
        print(f"   Patterns trained: {len(X):,}")
        print(f"   Intents: {len(self.intents_map)}")
        print(f"   Model accuracy: {accuracy:.2%}")
        
        print(f"\n📁 Model files created:")
        print(f"   - chatbot/model/sklearn_model.pkl")
        print(f"   - chatbot/model/intents_map.pkl")
        
        print(f"\n🚀 Next steps:")
        print(f"   1. Run: python chatbot/chatbot_sklearn_api.py")
        print(f"   2. Test the API at http://localhost:5001")
        print(f"   3. Integrate with React frontend")
        
        return self.pipeline, self.intents_map

if __name__ == "__main__":
    trainer = SklearnChatbot()
    trainer.run()
