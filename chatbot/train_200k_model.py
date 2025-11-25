import json
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import time

print("🚀 Training Hotelogix Chatbot with 200K+ Dataset\n")
print("="*70)

# Load massive dataset
print("📂 Loading dataset...")
start_time = time.time()

with open('chatbot/dataset-200k-final-hotelogix.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

load_time = time.time() - start_time
print(f"✅ Dataset loaded in {load_time:.2f} seconds\n")

print(f"📊 Dataset Info:")
print(f"   Hotel: {data['metadata']['hotel_name']}")
print(f"   Cities: {', '.join(data['metadata']['cities'])}")
print(f"   Total Intents: {data['metadata']['total_intents']}")
print(f"   Total Patterns: {data['metadata']['total_patterns']:,}")
print(f"   Competitor Blocking: {data['metadata']['competitor_blocking']}")
print(f"   CSV Integrated: {data['metadata']['csv_integrated']}")
print("="*70 + "\n")

# Prepare training data
print("🔄 Preparing training data...")
X = []
y = []

for intent in data['intents']:
    for pattern in intent['patterns']:
        X.append(pattern.lower())
        y.append(intent['tag'])

print(f"✅ Prepared {len(X):,} training samples")
print(f"✅ Unique intents: {len(set(y))}\n")

# Split data
print("✂️  Splitting dataset (80% train, 20% test)...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"   Train set: {len(X_train):,} samples")
print(f"   Test set: {len(X_test):,} samples\n")

# Create pipeline with optimized parameters for large dataset
print("🏗️  Building ML pipeline...")
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        ngram_range=(1, 3),
        max_features=10000,
        min_df=2,
        max_df=0.7,
        sublinear_tf=True,
        strip_accents='unicode'
    )),
    ('clf', LogisticRegression(
        max_iter=1000,
        C=1.0,
        random_state=42,
        n_jobs=-1
    ))
])

print("✅ Pipeline created\n")

# Train model
print("🎓 Training model (this may take a few minutes)...")
train_start = time.time()

pipeline.fit(X_train, y_train)

train_time = time.time() - train_start
print(f"✅ Training complete in {train_time:.2f} seconds!\n")

# Evaluate
print("📊 Evaluating model...")
eval_start = time.time()

y_pred = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

eval_time = time.time() - eval_start
print(f"✅ Evaluation complete in {eval_time:.2f} seconds\n")

print("="*70)
print(f"🎯 MODEL PERFORMANCE")
print("="*70)
print(f"Accuracy: {accuracy*100:.2f}%")
print(f"Training Time: {train_time:.2f}s")
print(f"Evaluation Time: {eval_time:.2f}s")
print("="*70 + "\n")

# Save model
print("💾 Saving model...")
with open('chatbot/hotelogix_200k_model.pkl', 'wb') as f:
    pickle.dump(pipeline, f)

# Save intents for response generation
with open('chatbot/hotelogix_200k_intents.pkl', 'wb') as f:
    pickle.dump(data['intents'], f)

print("✅ Model saved: chatbot/hotelogix_200k_model.pkl")
print("✅ Intents saved: chatbot/hotelogix_200k_intents.pkl\n")

# Test with sample queries
print("="*70)
print("🧪 TESTING WITH SAMPLE QUERIES")
print("="*70)

test_queries = [
    "What are the rates in Lahore?",
    "Tell me about Pearl Continental",
    "How to book a room?",
    "Budget rooms available?",
    "Contact number?",
    "Which cities do you have hotels?",
    "Royal suite price?",
    "Compare with Serena hotel",
    "Okara mein kitna paisa?",
    "Book deluxe room Multan",
    "Wifi hai kya?",
    "Breakfast included?",
    "Cancel booking kaise karun?",
    "Airport pickup available?",
    "Family suite for 6 people"
]

for query in test_queries:
    predicted_tag = pipeline.predict([query.lower()])[0]
    
    # Find response
    response = "I can help you with Hotelogix bookings!"
    for intent in data['intents']:
        if intent['tag'] == predicted_tag:
            response = intent['responses'][0] if intent['responses'] else response
            break
    
    print(f"\n❓ Query: {query}")
    print(f"🏷️  Intent: {predicted_tag}")
    print(f"💬 Response: {response[:80]}...")

print("\n" + "="*70)
print("✅ HOTELOGIX 200K+ CHATBOT TRAINING COMPLETE!")
print("="*70)
print(f"🎯 Accuracy: {accuracy*100:.2f}%")
print(f"📊 Training Samples: {len(X):,}")
print(f"🏨 Exclusive to: Hotelogix Pakistan")
print(f"📍 Cities: {', '.join(data['metadata']['cities'])}")
print(f"🔒 Competitor queries: BLOCKED")
print(f"📊 CSV data: INTEGRATED")
print(f"⏱️  Total Time: {load_time + train_time + eval_time:.2f}s")
print("="*70)
