import json
import random

# Load base dataset
with open('dataset-merged-hotelogix.json', 'r', encoding='utf-8') as f:
    base_data = json.load(f)

# Expansion patterns for more training data
expansion_templates = {
    'question': [
        '{pattern}?',
        'Can you tell me {pattern}?',
        'I want to know {pattern}',
        'Please tell me {pattern}',
        'What about {pattern}?',
        'Tell me about {pattern}',
        '{pattern} please',
        'Info about {pattern}',
        '{pattern} ki information',
        'Mujhe {pattern} chahiye'
    ],
    'variations': {
        'hotel': ['hotel', 'Hotelogix', 'your hotel', 'this hotel', 'aapka hotel'],
        'room': ['room', 'kamra', 'accommodation', 'stay'],
        'price': ['price', 'rate', 'cost', 'charges', 'qeemat', 'kitna paisa'],
        'book': ['book', 'reserve', 'booking', 'reservation', 'book karna'],
        'city': ['city', 'location', 'place', 'sheher', 'jagah']
    }
}

# Competitor names to filter out
competitors = [
    'pearl continental', 'pc hotel', 'serena', 'marriott', 'avari', 
    'best western', 'ramada', 'movenpick', 'hilton', 'hyatt',
    'holiday inn', 'sheraton', 'intercontinental', 'radisson'
]

# Add competitor blocking intent
competitor_intent = {
    "tag": "competitor_block",
    "patterns": [],
    "responses": [
        "I can only provide information about Hotelogix properties. For other hotels, please contact them directly. Would you like to know about our Hotelogix rooms?",
        "I represent Hotelogix exclusively. I cannot provide information about other hotels. How can I help you with Hotelogix bookings?",
        "Sorry, I only handle Hotelogix inquiries. For other hotels, please visit their websites. Can I help you with our Hotelogix properties in Okara, Lahore, Sheikhupura, or Multan?"
    ]
}

# Generate competitor blocking patterns
for comp in competitors:
    competitor_intent['patterns'].extend([
        f"Tell me about {comp}",
        f"What about {comp}",
        f"{comp} rates",
        f"{comp} booking",
        f"Compare with {comp}",
        f"Is {comp} better",
        f"{comp} vs hotelogix",
        f"Book {comp}",
        f"{comp} rooms"
    ])

# Expand dataset
expanded_intents = []

for intent in base_data['intents']:
    expanded_intent = {
        'tag': intent['tag'],
        'patterns': list(intent['patterns']),  # Start with original patterns
        'responses': intent['responses']
    }
    
    # Add variations for each pattern
    original_patterns = list(intent['patterns'])
    for pattern in original_patterns:
        # Add question variations
        for template in expansion_templates['question'][:5]:  # Use first 5 templates
            if '{pattern}' in template:
                new_pattern = template.replace('{pattern}', pattern.lower())
                if new_pattern not in expanded_intent['patterns']:
                    expanded_intent['patterns'].append(new_pattern)
        
        # Add case variations
        expanded_intent['patterns'].append(pattern.lower())
        expanded_intent['patterns'].append(pattern.upper())
        expanded_intent['patterns'].append(pattern.title())
    
    # Remove duplicates
    expanded_intent['patterns'] = list(set(expanded_intent['patterns']))
    expanded_intents.append(expanded_intent)

# Add competitor blocking intent
expanded_intents.append(competitor_intent)

# Add Hotelogix-specific clarification intent
hotelogix_only_intent = {
    "tag": "hotelogix_only",
    "patterns": [
        "Do you work for other hotels",
        "Can you book other hotels",
        "Other hotel options",
        "Different hotel",
        "Not Hotelogix",
        "I want different hotel",
        "Other properties",
        "Koi aur hotel",
        "Dusra hotel"
    ],
    "responses": [
        "I exclusively represent Hotelogix properties in Pakistan. I can only help with Hotelogix bookings in Okara, Lahore, Sheikhupura, and Multan. Would you like to explore our options?",
        "I'm the Hotelogix assistant and can only provide information about our hotels. For other properties, please contact them directly. How can I help you with Hotelogix?",
        "I specialize in Hotelogix bookings only. We have excellent options across 4 cities with rates from PKR 2,800 to PKR 150,000. Interested?"
    ]
}
expanded_intents.append(hotelogix_only_intent)

# Create final dataset
final_dataset = {
    'intents': expanded_intents,
    'metadata': {
        'hotel_name': 'Hotelogix',
        'cities': ['Okara', 'Lahore', 'Sheikhupura', 'Multan'],
        'total_intents': len(expanded_intents),
        'competitor_blocking': True,
        'exclusive_to': 'Hotelogix Pakistan'
    }
}

# Save expanded dataset
with open('dataset-hotelogix-mega.json', 'w', encoding='utf-8') as f:
    json.dump(final_dataset, f, indent=2, ensure_ascii=False)

print(f"✅ Hotelogix Mega Dataset Created!")
print(f"📊 Total Intents: {len(expanded_intents)}")
print(f"🔒 Competitor Blocking: Enabled")
print(f"🏨 Exclusive to: Hotelogix Pakistan")
print(f"📍 Cities: Okara, Lahore, Sheikhupura, Multan")

# Calculate total patterns
total_patterns = sum(len(intent['patterns']) for intent in expanded_intents)
print(f"🎯 Total Training Patterns: {total_patterns}")
print(f"\n✅ File saved: dataset-hotelogix-mega.json")
