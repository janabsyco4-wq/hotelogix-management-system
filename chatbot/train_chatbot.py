"""
Hotelogix AI Chatbot - Training Script
This script trains the neural network model using the expanded dataset.
"""

import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
import pickle
import nltk
from nltk.stem import WordNetLemmatizer
import random
import warnings
import os

warnings.filterwarnings('ignore')

# Download required NLTK data
print("📚 Downloading NLTK data...")
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet', quiet=True)

print("✅ NLTK data ready!")

class HotelogixChatbot:
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.words = []
        self.classes = []
        self.documents = []
        self.ignore_words = ['?', '.', ',', '!']
        
    def load_data(self, dataset_path):
        """Load and preprocess the training data"""
        print(f"\n📂 Loading dataset from: {dataset_path}")
        
        with open(dataset_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        print(f"✅ Dataset loaded successfully!")
        print(f"   Intents: {len(data['intents'])}")
        
        # Process each intent
        for intent in data['intents']:
            for pattern in intent['patterns']:
                # Tokenize each word
                word_list = nltk.word_tokenize(pattern)
                self.words.extend(word_list)
                # Add documents in the corpus
                self.documents.append((word_list, intent['tag']))
                # Add to our classes list
                if intent['tag'] not in self.classes:
                    self.classes.append(intent['tag'])
        
        # Lemmatize and lower each word and remove duplicates
        self.words = [self.lemmatizer.lemmatize(w.lower()) for w in self.words if w not in self.ignore_words]
        self.words = sorted(list(set(self.words)))
        
        # Sort classes
        self.classes = sorted(list(set(self.classes)))
        
        print(f"\n📊 Preprocessing complete:")
        print(f"   Documents: {len(self.documents):,}")
        print(f"   Classes: {len(self.classes)}")
        print(f"   Unique Words: {len(self.words):,}")
        
        return data
    
    def create_training_data(self):
        """Create training data"""
        print(f"\n🔄 Creating training data...")
        
        training = []
        output_empty = [0] * len(self.classes)
        
        # Training set, bag of words for each sentence
        for doc in self.documents:
            bag = []
            pattern_words = doc[0]
            pattern_words = [self.lemmatizer.lemmatize(word.lower()) for word in pattern_words]
            
            # Create our bag of words array with 1, if word match found in current pattern
            for w in self.words:
                bag.append(1) if w in pattern_words else bag.append(0)
            
            # Output is a '0' for each tag and '1' for current tag
            output_row = list(output_empty)
            output_row[self.classes.index(doc[1])] = 1
            
            training.append([bag, output_row])
        
        # Shuffle and convert to array
        random.shuffle(training)
        training = np.array(training, dtype=object)
        
        # Create train lists. X - patterns, Y - intents
        train_x = list(training[:, 0])
        train_y = list(training[:, 1])
        
        print(f"✅ Training data created:")
        print(f"   Training samples: {len(train_x):,}")
        print(f"   Input features: {len(train_x[0]):,}")
        print(f"   Output classes: {len(train_y[0])}")
        
        return np.array(train_x), np.array(train_y)
    
    def build_model(self, train_x, train_y):
        """Build and train the neural network model"""
        print(f"\n🧠 Building neural network...")
        
        # Create model - 3 layers
        model = Sequential()
        model.add(Dense(256, input_shape=(len(train_x[0]),), activation='relu'))
        model.add(Dropout(0.5))
        model.add(Dense(128, activation='relu'))
        model.add(Dropout(0.5))
        model.add(Dense(len(train_y[0]), activation='softmax'))
        
        # Compile model
        adam = Adam(learning_rate=0.001)
        model.compile(loss='categorical_crossentropy', optimizer=adam, metrics=['accuracy'])
        
        print(f"✅ Model architecture:")
        print(f"   Layer 1: 256 neurons (ReLU)")
        print(f"   Layer 2: 128 neurons (ReLU)")
        print(f"   Output: {len(train_y[0])} neurons (Softmax)")
        
        print(f"\n🏋️ Training model...")
        print(f"   This may take a few minutes with {len(train_x):,} samples...")
        
        # Train the model
        hist = model.fit(
            train_x, train_y,
            epochs=200,
            batch_size=32,
            verbose=1,
            validation_split=0.1
        )
        
        print(f"\n✅ Training complete!")
        print(f"   Final accuracy: {hist.history['accuracy'][-1]:.4f}")
        print(f"   Final loss: {hist.history['loss'][-1]:.4f}")
        
        return model, hist
    
    def save_model(self, model, words, classes):
        """Save the trained model and preprocessing data"""
        print(f"\n💾 Saving model and data...")
        
        # Create output directory if it doesn't exist
        os.makedirs('chatbot/model', exist_ok=True)
        
        # Save model
        model.save('chatbot/model/hotelogix_chatbot_model.h5')
        print(f"   ✅ Model saved: chatbot/model/hotelogix_chatbot_model.h5")
        
        # Save words and classes
        pickle.dump(words, open('chatbot/model/words.pkl', 'wb'))
        print(f"   ✅ Words saved: chatbot/model/words.pkl")
        
        pickle.dump(classes, open('chatbot/model/classes.pkl', 'wb'))
        print(f"   ✅ Classes saved: chatbot/model/classes.pkl")
        
        print(f"\n🎉 All files saved successfully!")
    
    def train(self, dataset_path='chatbot/dataset_expanded.json'):
        """Complete training pipeline"""
        print("=" * 70)
        print("🤖 HOTELOGIX AI CHATBOT - TRAINING")
        print("=" * 70)
        
        # Load data
        data = self.load_data(dataset_path)
        
        # Create training data
        train_x, train_y = self.create_training_data()
        
        # Build and train model
        model, hist = self.build_model(train_x, train_y)
        
        # Save model
        self.save_model(model, self.words, self.classes)
        
        print("\n" + "=" * 70)
        print("✅ TRAINING COMPLETED SUCCESSFULLY!")
        print("=" * 70)
        print(f"\n📊 Final Statistics:")
        print(f"   Intents trained: {len(data['intents'])}")
        print(f"   Patterns learned: {len(self.documents):,}")
        print(f"   Vocabulary size: {len(self.words):,}")
        print(f"   Model accuracy: {hist.history['accuracy'][-1]:.2%}")
        
        print(f"\n📁 Model files created:")
        print(f"   - chatbot/model/hotelogix_chatbot_model.h5")
        print(f"   - chatbot/model/words.pkl")
        print(f"   - chatbot/model/classes.pkl")
        
        print(f"\n🚀 Next steps:")
        print(f"   1. Create the chatbot API server")
        print(f"   2. Integrate with React frontend")
        print(f"   3. Test the chatbot!")
        
        return model, self.words, self.classes, data

if __name__ == "__main__":
    chatbot = HotelogixChatbot()
    model, words, classes, data = chatbot.train()
