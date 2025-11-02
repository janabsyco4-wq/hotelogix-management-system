"""
Hotelogix AI Chatbot - Dataset Expansion Generator
This script generates a massive expanded dataset from the base dataset.
Run this script to create the training dataset with 27,000+ patterns.
"""

import json

def expand_patterns(patterns):
    """
    Expand patterns using 10 different transformation techniques
    to create comprehensive training data
    """
    expanded = set()
    
    # Add original patterns
    expanded.update(patterns)
    
    # 1. PUNCTUATION VARIATIONS (8x multiplier)
    punctuations = ["?", ".", "!", "??", "!!", "...", "?!", ".!"]
    for pattern in patterns:
        for punct in punctuations:
            expanded.add(pattern + punct)
    
    # 2. CASE VARIATIONS (4x multiplier)
    for pattern in list(expanded):
        expanded.add(pattern.lower())
        expanded.add(pattern.upper())
        expanded.add(pattern.capitalize())
        expanded.add(pattern.title())
    
    # 3. PREFIX VARIATIONS (20x multiplier)
    prefixes = [
        "Please ", "Can you ", "Could you ", "Would you ", "Will you ",
        "I want to know ", "Tell me ", "Show me ", "Help me with ",
        "I need to know ", "What about ", "How about ", "I'm asking about ",
        "Question about ", "Info on ", "Information about ", "Details on ",
        "I'd like to know ", "Can you tell me ", "Could you tell me "
    ]
    for pattern in patterns:
        for prefix in prefixes:
            expanded.add(prefix + pattern.lower())
            expanded.add(prefix + pattern)
    
    # 4. SUFFIX VARIATIONS (20x multiplier)
    suffixes = [
        " please", " now", " today", " asap", " urgently", " quickly",
        " for me", " help", " info", " information", " details",
        " thanks", " thank you", " pls", " plz", " ?", " .",
        " right now", " immediately", " soon", " later"
    ]
    for pattern in patterns:
        for suffix in suffixes:
            expanded.add(pattern + suffix)
            expanded.add(pattern.lower() + suffix)
    
    # 5. INFORMAL/SLANG VARIATIONS (5x multiplier)
    informal_map = {
        "you": ["u", "ya", "yah", "yu"],
        "are": ["r", "ar", "re"],
        "want": ["wanna", "wana", "wan"],
        "going": ["gonna", "goin", "gon"],
        "to": ["2", "too"],
        "for": ["4", "fr", "fer"],
        "your": ["ur", "yor", "yr"],
        "please": ["pls", "plz", "plss"],
        "with": ["w/", "wit", "wif"],
        "what": ["wat", "wut", "wht"],
        "the": ["da", "de", "teh"],
        "have": ["hav", "hve"],
        "can": ["cn", "kan"],
        "do": ["du", "doo"],
        "need": ["ned", "nid"],
        "help": ["hlp", "halp"]
    }
    
    for pattern in patterns[:100]:
        words = pattern.lower().split()
        for i, word in enumerate(words):
            clean_word = word.strip(".,!?")
            if clean_word in informal_map:
                for replacement in informal_map[clean_word]:
                    new_words = words.copy()
                    new_words[i] = replacement
                    expanded.add(" ".join(new_words))
    
    # 6. COMMON TYPOS (3x multiplier)
    typo_map = {
        "hotel": ["hotl", "hotle", "hotal"],
        "room": ["rom", "rooom", "romm"],
        "book": ["bok", "boook", "buk"],
        "price": ["pric", "prce", "priice"],
        "available": ["availble", "avaliable", "availabe"],
        "reservation": ["reservaton", "resrvation", "reservtion"],
        "information": ["informaton", "infomation", "informatoin"]
    }
    
    for pattern in patterns[:50]:
        words = pattern.lower().split()
        for i, word in enumerate(words):
            clean_word = word.strip(".,!?")
            if clean_word in typo_map:
                for typo in typo_map[clean_word]:
                    new_words = words.copy()
                    new_words[i] = typo
                    expanded.add(" ".join(new_words))
    
    # 7. QUESTION FORMAT VARIATIONS (9x multiplier)
    question_starters = [
        "Can I ask about", "I'm wondering about", "I have a question about",
        "Quick question about", "Just wondering about", "Curious about",
        "Want to know about", "Need info on", "Looking for info on"
    ]
    for pattern in patterns[:30]:
        for starter in question_starters:
            expanded.add(f"{starter} {pattern.lower()}")
    
    # 8. POLITE VARIATIONS (6x multiplier)
    polite_additions = [
        ("Could you please ", ""),
        ("Would you mind ", ""),
        ("I would appreciate if you could ", ""),
        ("", " if you don't mind"),
        ("", " if possible"),
        ("", " when you get a chance")
    ]
    for pattern in patterns[:30]:
        for prefix, suffix in polite_additions:
            expanded.add(f"{prefix}{pattern.lower()}{suffix}")
    
    # 9. CONVERSATIONAL VARIATIONS (10x multiplier)
    conversational = [
        "Hey, ", "Hi, ", "Hello, ", "Yo, ", "Um, ", "So, ", "Well, ",
        "Actually, ", "Basically, ", "I mean, "
    ]
    for pattern in patterns[:40]:
        for conv in conversational:
            expanded.add(conv + pattern.lower())
    
    # 10. REPETITION FOR EMPHASIS (2x multiplier)
    for pattern in patterns[:20]:
        words = pattern.split()
        if len(words) > 1:
            expanded.add(f"{words[0]} {words[0]} {' '.join(words[1:])}")
            expanded.add(f"{' '.join(words[:-1])} {words[-1]} {words[-1]}")
    
    return list(expanded)


def generate_expanded_dataset():
    """Generate the fully expanded dataset from base dataset"""
    
    print("🤖 Hotelogix AI Chatbot - Dataset Expansion")
    print("=" * 70)
    print("Loading base dataset...")
    
    # Load base dataset
    with open('chatbot/dataset.json', 'r', encoding='utf-8') as f:
        base_dataset = json.load(f)
    
    original_patterns = sum(len(i["patterns"]) for i in base_dataset["intents"])
    print(f"✅ Base dataset loaded: {len(base_dataset['intents'])} intents, {original_patterns} patterns")
    
    print("\n🔄 Expanding patterns using 10 transformation techniques...")
    print("   1. Punctuation variations")
    print("   2. Case variations")
    print("   3. Prefix variations (20 types)")
    print("   4. Suffix variations (20 types)")
    print("   5. Informal/slang variations")
    print("   6. Common typos")
    print("   7. Question format variations")
    print("   8. Polite variations")
    print("   9. Conversational starters")
    print("   10. Repetition for emphasis")
    
    # Expand dataset
    expanded_dataset = {"intents": []}
    
    for i, intent in enumerate(base_dataset["intents"], 1):
        print(f"\n   Expanding intent {i}/{len(base_dataset['intents'])}: {intent['tag']}...", end=" ")
        
        expanded_intent = {
            "tag": intent["tag"],
            "patterns": expand_patterns(intent["patterns"]),
            "responses": intent["responses"]
        }
        expanded_dataset["intents"].append(expanded_intent)
        
        print(f"{len(expanded_intent['patterns']):,} patterns")
    
    # Calculate statistics
    total_intents = len(expanded_dataset["intents"])
    total_patterns = sum(len(intent["patterns"]) for intent in expanded_dataset["intents"])
    total_responses = sum(len(intent["responses"]) for intent in expanded_dataset["intents"])
    expansion_factor = total_patterns / original_patterns
    
    print("\n" + "=" * 70)
    print("📊 EXPANSION COMPLETE!")
    print("=" * 70)
    print(f"\n📈 Statistics:")
    print(f"   Original Patterns:  {original_patterns:>8,}")
    print(f"   Expanded Patterns:  {total_patterns:>8,}")
    print(f"   Expansion Factor:   {expansion_factor:>8.1f}x")
    print(f"   Total Intents:      {total_intents:>8}")
    print(f"   Total Responses:    {total_responses:>8}")
    print(f"   Total Entries:      {total_patterns + total_responses:>8,}")
    
    # Save expanded dataset
    output_file = 'chatbot/dataset_expanded.json'
    print(f"\n💾 Saving expanded dataset to: {output_file}")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(expanded_dataset, f, indent=2, ensure_ascii=False)
    
    file_size_mb = len(json.dumps(expanded_dataset)) / 1024 / 1024
    print(f"✅ File saved successfully!")
    print(f"   File size: {file_size_mb:.2f} MB")
    
    print("\n" + "=" * 70)
    print("🎯 Dataset ready for training!")
    print("=" * 70)
    print("\n📋 Next steps:")
    print("   1. Run: python chatbot/train_chatbot.py")
    print("   2. This will train the AI model with 27,000+ patterns")
    print("   3. The chatbot will understand many variations of questions")
    print("\n✨ Your AI chatbot will be super smart!")
    
    return expanded_dataset


if __name__ == "__main__":
    generate_expanded_dataset()
