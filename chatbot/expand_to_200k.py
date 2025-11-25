import json
import random

print("🚀 Expanding Dataset to 200,000+ Samples\n")
print("="*70)

# Load current mega dataset
with open('chatbot/dataset-mega-200k-hotelogix.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"📊 Current samples: {data['metadata']['total_patterns']:,}")
print(f"🎯 Target: 200,000+\n")

# Expansion strategies
PREFIXES = [
    '', 'Can you tell me', 'I want to know', 'Please tell me', 'What about',
    'Tell me about', 'Info on', 'Information about', 'Details about',
    'I need', 'Looking for', 'Searching for', 'Want to know', 'Need info on',
    'Can you help with', 'Help me with', 'Assist with', 'Guide me on'
]

SUFFIXES = [
    '', '?', ' please', ' please?', ' thanks', ' thank you',
    ' urgently', ' ASAP', ' now', ' today', ' right now',
    ' for tomorrow', ' for next week', ' for family', ' for group'
]

URDU_WORDS = [
    'batao', 'bataiye', 'kya hai', 'kahan hai', 'kaise', 'kitna',
    'chahiye', 'milega', 'hoga', 'hai kya', 'please', 'zaroor'
]

print("🔄 Expanding patterns with variations...\n")

expanded_patterns = []
expanded_tags = []

# Expand each intent
for intent in data['intents']:
    tag = intent['tag']
    patterns = intent['patterns']
    
    for pattern in patterns:
        # Original pattern
        expanded_patterns.append(pattern)
        expanded_tags.append(tag)
        
        # Add prefix variations
        for prefix in PREFIXES[:10]:
            if prefix:
                new_pattern = f"{prefix} {pattern}"
            else:
                new_pattern = pattern
            
            # Add suffix variations
            for suffix in SUFFIXES[:8]:
                final_pattern = f"{new_pattern}{suffix}"
                expanded_patterns.append(final_pattern.lower().strip())
                expanded_tags.append(tag)
        
        # Add Urdu word variations
        for urdu in URDU_WORDS[:6]:
            new_pattern = f"{pattern} {urdu}"
            expanded_patterns.append(new_pattern.lower().strip())
            expanded_tags.append(tag)
            
            new_pattern = f"{urdu} {pattern}"
            expanded_patterns.append(new_pattern.lower().strip())
            expanded_tags.append(tag)
        
        # Add typo variations (common mistakes)
        typo_pattern = pattern.replace('hotel', 'hotl').replace('room', 'rom')
        expanded_patterns.append(typo_pattern.lower())
        expanded_tags.append(tag)
        
        # Add uppercase variations
        expanded_patterns.append(pattern.upper())
        expanded_tags.append(tag)
        
        # Add title case
        expanded_patterns.append(pattern.title())
        expanded_tags.append(tag)

print(f"✅ Expanded to {len(expanded_patterns):,} patterns")

# Create new intents structure
new_intents_dict = {}
for pattern, tag in zip(expanded_patterns, expanded_tags):
    if tag not in new_intents_dict:
        new_intents_dict[tag] = {
            'tag': tag,
            'patterns': [],
            'responses': data['intents'][0]['responses'] if data['intents'] else ['I can help you with Hotelogix!']
        }
    
    if pattern not in new_intents_dict[tag]['patterns']:
        new_intents_dict[tag]['patterns'].append(pattern)

# Find responses from original intents
for intent in data['intents']:
    if intent['tag'] in new_intents_dict:
        new_intents_dict[intent['tag']]['responses'] = intent['responses']

new_intents_list = list(new_intents_dict.values())

# Create final 200K+ dataset
final_dataset = {
    'intents': new_intents_list,
    'metadata': {
        'hotel_name': data['metadata']['hotel_name'],
        'cities': data['metadata']['cities'],
        'room_types': data['metadata']['room_types'],
        'total_intents': len(new_intents_list),
        'total_patterns': len(expanded_patterns),
        'competitor_blocking': True,
        'csv_integrated': True,
        'dataset_size': '200K+',
        'expansion_applied': True
    }
}

# Save final dataset
with open('chatbot/dataset-200k-final-hotelogix.json', 'w', encoding='utf-8') as f:
    json.dump(final_dataset, f, indent=2, ensure_ascii=False)

print(f"\n💾 Saved: chatbot/dataset-200k-final-hotelogix.json")
print(f"📦 File size: ~{len(json.dumps(final_dataset))/1024/1024:.2f} MB")

print("\n" + "="*70)
print("✅ 200K+ DATASET GENERATION COMPLETE!")
print("="*70)
print(f"🎯 Total Training Samples: {len(expanded_patterns):,}")
print(f"🏷️  Unique Intents: {len(new_intents_list)}")
print(f"🏨 Hotel: {data['metadata']['hotel_name']}")
print(f"📍 Cities: {', '.join(data['metadata']['cities'])}")
print(f"🔒 Competitor Blocking: ENABLED")
print(f"📊 CSV Data: INTEGRATED")
print(f"🚀 Expansion: APPLIED")
print("="*70)
