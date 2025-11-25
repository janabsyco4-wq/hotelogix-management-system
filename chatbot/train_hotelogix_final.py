import json
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import re

print("🚀 Training Hotelogix Chatbot (CSV + Rates + Cities Merged)\n")
print("="*70)

# Load final dataset
with open('chatbot/dataset-final-hotelogix.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"📊 Dataset Info:")
print(f"   Hotel: {data['metadata']['hotel_name']}")
print(f"   Cities: {', '.join(data['metadata']['cities'])}")
print(f"   Total Intents: {data['metadata']['total_intents']}")
print(f"   Competitor Blocking: {data['metadata']['competitor_blocking']}")
print(f"   CSV Integrated: {data['metadata']['csv_integrated']}")
print("="*70 + "\n")

# Prepare training data
X = []  # patterns
y = []  # tags

for intent in data['intents']:
    for pattern in intent['patterns']:
        X.append(pattern.lower())
        y.append(intent['tag'])

print(f"📝 Training samples: {len(X)}")
print(f"🏷️  Unique intents: {len(set(y))}\n")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"✂️  Train set: {len(X_train)} samples")
print(f"✂️  Test set: {len(X_test)} samples\n")

# Create pipeline with TF-IDF and Naive Bayes
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        ngram_range=(1, 3),
        max_features=5000,
        min_df=1,
        max_df=0.8,
        sublinear_tf=True
    )),
    ('clf', MultinomialNB(alpha=0.1))
])

# Train model
print("🎓 Training model...")
pipeline.fit(X_train, y_train)
print("✅ Training complete!\n")

# Evaluate
y_pred = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("="*70)
print(f"🎯 MODEL PERFORMANCE")
print("="*70)
print(f"Accuracy: {accuracy*100:.2f}%\n")

# Save model
with open('chatbot/hotelogix_chatbot_model.pkl', 'wb') as f:
    pickle.dump(pipeline, f)

# Save intents for response generation
with open('chatbot/hotelogix_intents.pkl', 'wb') as f:
    pickle.dump(data['intents'], f)

print("💾 Model saved: chatbot/hotelogix_chatbot_model.pkl")
print("💾 Intents saved: chatbot/hotelogix_intents.pkl\n")

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
    "Compare with Serena hotel"
]

for query in test_queries:
    predicted_tag = pipeline.predict([query.lower()])[0]
    
    # Find response
    response = "I can help you with Hotelogix bookings!"
    for intent in data['intents']:
        if intent['tag'] == predicted_tag:
            response = intent['responses'][0]
            break
    
    print(f"\n❓ Query: {query}")
    print(f"🏷️  Intent: {predicted_tag}")
    print(f"💬 Response: {response[:100]}...")

print("\n" + "="*70)
print("✅ HOTELOGIX CHATBOT TRAINING COMPLETE!")
print("="*70)
print(f"🎯 Accuracy: {accuracy*100:.2f}%")
print(f"🏨 Exclusive to: Hotelogix Pakistan")
print(f"📍 Cities: Okara, Lahore, Sheikhupura, Multan")
print(f"🔒 Competitor queries: BLOCKED")
print(f"📊 CSV data: INTEGRATED")
print("="*70)
