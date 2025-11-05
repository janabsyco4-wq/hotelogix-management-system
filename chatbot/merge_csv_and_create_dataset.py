import json
import csv
import re

print("🔄 Merging CSV data with Hotelogix rates and cities...\n")

# Hotelogix-specific data
HOTEL_NAME = "Hotelogix"
CITIES = {
    'Okara': {
        'code': 'OK',
        'rates': {
            'Budget': '2,800-4,500',
            'Economy': '7,700-9,900',
            'Standard': '10,200-14,200',
            'Deluxe': '18,000-24,700',
            'Business': '21,100-26,100',
            'Suites': '30,100-128,400'
        }
    },
    'Lahore': {
        'code': 'LH',
        'rates': {
            'Budget': '3,400-4,500',
            'Economy': '5,900-8,000',
            'Standard': '12,300-13,800',
            'Deluxe': '18,000-24,700',
            'Business': '21,100-26,100',
            'Suites': '30,000-150,000'
        }
    },
    'Sheikhupura': {
        'code': 'SK',
        'rates': {
            'Budget': '2,800-4,200',
            'Economy': '6,200-8,800',
            'Standard': '10,800-13,500',
            'Deluxe': '17,500-23,500',
            'Business': '20,500-25,500',
            'Suites': '29,000-140,000'
        }
    },
    'Multan': {
        'code': 'MT',
        'rates': {
            'Budget': '3,200-4,800',
            'Economy': '6,500-9,200',
            'Standard': '11,500-14,500',
            'Deluxe': '19,000-26,000',
            'Business': '22,000-28,000',
            'Suites': '32,000-145,000'
        }
    }
}

CONTACT_INFO = {
    'phone': '+92 310 4594964',
    'email': 'support@hotelogix.pk',
    'whatsapp': '+92 310 4594964',
    'website': 'www.hotelogix.pk',
    'address': 'Multiple locations across Punjab, Pakistan'
}

# Read CSV and adapt questions
csv_intents = []
try:
    with open('BP_MHS_V1.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        questions_seen = set()
        
        for row in reader:
            question = row.get('question', '').strip()
            if question and question not in questions_seen:
                questions_seen.add(question)
                
                # Adapt question to Hotelogix context
                adapted_question = question.replace('Montréal Hotel & Suites', HOTEL_NAME)
                adapted_question = adapted_question.replace('Montreal Hotel', HOTEL_NAME)
                adapted_question = adapted_question.replace('this hotel', HOTEL_NAME)
                adapted_question = adapted_question.replace('the hotel', HOTEL_NAME)
                
                csv_intents.append(adapted_question)
    
    print(f"✅ Loaded {len(csv_intents)} questions from CSV")
except Exception as e:
    print(f"⚠️  Could not load CSV: {e}")
    csv_intents = []

# Load base dataset
with open('chatbot/dataset-merged-hotelogix.json', 'r', encoding='utf-8') as f:
    base_data = json.load(f)

# Add CSV-derived patterns to existing intents
for intent in base_data['intents']:
    if intent['tag'] in ['hotel_identity', 'contact', 'cities', 'lahore_info']:
        # Add some CSV patterns to relevant intents
        for csv_q in csv_intents[:5]:  # Add first 5 CSV questions
            if csv_q not in intent['patterns']:
                intent['patterns'].append(csv_q)

# Create comprehensive merged dataset with city-specific information
merged_intents = base_data['intents'].copy()

# Add detailed city-rate intents
for city, data in CITIES.items():
    city_rate_intent = {
        "tag": f"{city.lower()}_rates_detailed",
        "patterns": [
            f"What are the rates in {city}",
            f"{city} room prices",
            f"How much in {city}",
            f"{city} mein kitna",
            f"Prices for {city}",
            f"{city} hotel rates",
            f"Cost in {city}",
            f"{city} ke rates"
        ],
        "responses": [
            f"Hotelogix {city} rates: Budget PKR {data['rates']['Budget']} | Economy PKR {data['rates']['Economy']} | Standard PKR {data['rates']['Standard']} | Deluxe PKR {data['rates']['Deluxe']} | Business PKR {data['rates']['Business']} | Suites PKR {data['rates']['Suites']}. Book now!"
        ]
    }
    merged_intents.append(city_rate_intent)

# Add CSV-specific intents
csv_specific_intents = [
    {
        "tag": "hotel_size",
        "patterns": [
            "How big is the hotel",
            "Hotel size",
            "Number of rooms",
            "How many floors",
            "Kitne kamre hain",
            "Hotel kitna bara hai"
        ],
        "responses": [
            "Hotelogix has multiple properties across 4 cities with a total of 116 rooms. Each location offers 10 different room categories from Budget to Royal Suites!"
        ]
    },
    {
        "tag": "hotel_history",
        "patterns": [
            "When was hotel built",
            "Hotel history",
            "Who founded",
            "When founded",
            "Kab bana",
            "History of hotel"
        ],
        "responses": [
            "Hotelogix was established to provide quality accommodations across Punjab, Pakistan. We operate in Okara, Lahore, Sheikhupura, and Multan with consistent service standards!"
        ]
    },
    {
        "tag": "hotel_rating",
        "patterns": [
            "What is the rating",
            "Star rating",
            "How many stars",
            "Hotel rating",
            "Kitne star",
            "Rating kya hai"
        ],
        "responses": [
            "Hotelogix maintains 4.5+ star ratings across all properties! Our guests consistently rate us highly for cleanliness, service, and value for money!"
        ]
    },
    {
        "tag": "postal_code",
        "patterns": [
            "What is postal code",
            "Zip code",
            "Address",
            "Location address",
            "Postal code kya hai"
        ],
        "responses": [
            "Hotelogix has locations in 4 cities. For specific addresses: Okara (Punjab), Lahore (near Badshahi Mosque), Sheikhupura (near Hiran Minar), Multan (City of Saints). Contact +92-300-1234567 for exact addresses!"
        ]
    }
]

merged_intents.extend(csv_specific_intents)

# Competitor blocking - CRITICAL
competitor_blocking = {
    "tag": "competitor_strict_block",
    "patterns": [
        "Pearl Continental", "PC Hotel", "Serena", "Marriott", "Avari",
        "Best Western", "Ramada", "Movenpick", "Hilton", "Hyatt",
        "Holiday Inn", "Sheraton", "Intercontinental", "Radisson",
        "Other hotels", "Different hotel", "Compare hotels",
        "Better hotel", "Cheaper hotel elsewhere", "Dusra hotel",
        "Tell me about Pearl", "What about Serena", "Marriott rates",
        "Is Avari better", "Compare with PC", "Book Serena"
    ],
    "responses": [
        "I can ONLY provide information about Hotelogix properties. For other hotels, please contact them directly. Would you like to know about our Hotelogix rooms in Okara, Lahore, Sheikhupura, or Multan?",
        "I exclusively represent Hotelogix Pakistan. I cannot provide information about other hotels. How can I help you with Hotelogix bookings?",
        "Sorry, I only handle Hotelogix inquiries. For other hotels, please visit their websites. Can I help you with our properties across 4 cities?"
    ]
}
merged_intents.append(competitor_blocking)

# Final dataset
final_dataset = {
    "intents": merged_intents,
    "metadata": {
        "hotel_name": HOTEL_NAME,
        "cities": list(CITIES.keys()),
        "total_intents": len(merged_intents),
        "competitor_blocking": True,
        "exclusive_to": "Hotelogix Pakistan",
        "contact": CONTACT_INFO,
        "csv_integrated": True
    }
}

# Save final dataset
with open('chatbot/dataset-final-hotelogix.json', 'w', encoding='utf-8') as f:
    json.dump(final_dataset, f, indent=2, ensure_ascii=False)

print(f"\n✅ FINAL DATASET CREATED!")
print(f"📊 Total Intents: {len(merged_intents)}")
print(f"🏨 Hotel: {HOTEL_NAME}")
print(f"📍 Cities: {', '.join(CITIES.keys())}")
print(f"🔒 Competitor Blocking: ENABLED")
print(f"📁 CSV Data: INTEGRATED")
print(f"💾 File: dataset-final-hotelogix.json")

# Calculate total patterns
total_patterns = sum(len(intent['patterns']) for intent in merged_intents)
print(f"🎯 Total Training Patterns: {total_patterns}")
