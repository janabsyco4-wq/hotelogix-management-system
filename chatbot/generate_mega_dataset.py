"""
Hotelogix AI Chatbot - MEGA Dataset Expansion Generator
This script generates 100,000+ patterns for comprehensive training
"""

import json
import random

def expand_patterns_mega(patterns):
    """
    Mega expansion with 20+ transformation techniques
    Target: 100,000+ patterns
    """
    expanded = set()
    
    # Add original patterns
    expanded.update(patterns)
    
    # 1. PUNCTUATION VARIATIONS (15 types)
    punctuations = ["?", ".", "!", "??", "!!", "...", "?!", ".!", "???", "!!!", "?!?", "!?!", ".,", ".?", "!?!?"]
    for pattern in patterns:
        for punct in punctuations:
            expanded.add(pattern + punct)
            expanded.add(pattern.strip() + " " + punct)
    
    # 2. CASE VARIATIONS (6 types)
    for pattern in list(patterns):
        expanded.add(pattern.lower())
        expanded.add(pattern.upper())
        expanded.add(pattern.capitalize())
        expanded.add(pattern.title())
        expanded.add(pattern.swapcase())
        # Random case
        expanded.add(''.join(c.upper() if random.random() > 0.5 else c.lower() for c in pattern))
    
    # 3. PREFIX VARIATIONS (50 types)
    prefixes = [
        "Please ", "Can you ", "Could you ", "Would you ", "Will you ",
        "I want to know ", "Tell me ", "Show me ", "Help me with ",
        "I need to know ", "What about ", "How about ", "I'm asking about ",
        "Question about ", "Info on ", "Information about ", "Details on ",
        "I'd like to know ", "Can you tell me ", "Could you tell me ",
        "May I ask about ", "I'm curious about ", "I wonder about ",
        "Looking for ", "Searching for ", "Need info on ", "Want details on ",
        "Interested in ", "Can I get ", "Could I get ", "Would like to know ",
        "Trying to find ", "Need help with ", "Assistance with ",
        "Query about ", "Inquiry about ", "Question regarding ",
        "Info regarding ", "Details regarding ", "Can you help me with ",
        "Could you help me with ", "I'm looking for ", "I need ", "I want ",
        "Give me ", "Provide ", "Share ", "Explain ", "Describe ",
        "What is ", "Where is ", "When is ", "How is "
    ]
    for pattern in patterns:
        for prefix in prefixes:
            expanded.add(prefix + pattern.lower())
            expanded.add(prefix + pattern)
            expanded.add(prefix.lower() + pattern.lower())
    
    # 4. SUFFIX VARIATIONS (50 types)
    suffixes = [
        " please", " now", " today", " asap", " urgently", " quickly",
        " for me", " help", " info", " information", " details",
        " thanks", " thank you", " pls", " plz", " ?", " .",
        " right now", " immediately", " soon", " later", " tomorrow",
        " this week", " this month", " available", " options",
        " choices", " recommendations", " suggestions", " advice",
        " guidance", " assistance", " support", " service",
        " booking", " reservation", " inquiry", " query",
        " needed", " required", " wanted", " desired",
        " if possible", " when possible", " at your earliest",
        " kindly", " please help", " help me", " assist me",
        " guide me", " show me", " tell me", " let me know"
    ]
    for pattern in patterns:
        for suffix in suffixes:
            expanded.add(pattern + suffix)
            expanded.add(pattern.lower() + suffix)
            expanded.add(pattern.strip() + suffix)
    
    # 5. INFORMAL/SLANG VARIATIONS (Extended)
    informal_map = {
        "you": ["u", "ya", "yah", "yu", "yew", "yoo"],
        "are": ["r", "ar", "re", "arr"],
        "want": ["wanna", "wana", "wan", "wnt"],
        "going": ["gonna", "goin", "gon", "gona"],
        "to": ["2", "too", "tew", "tu"],
        "for": ["4", "fr", "fer", "fur"],
        "your": ["ur", "yor", "yr", "ure"],
        "please": ["pls", "plz", "plss", "plzz", "plez"],
        "with": ["w/", "wit", "wif", "wth"],
        "what": ["wat", "wut", "wht", "wot"],
        "the": ["da", "de", "teh", "tha"],
        "have": ["hav", "hve", "haf"],
        "can": ["cn", "kan", "cann"],
        "do": ["du", "doo", "dew"],
        "need": ["ned", "nid", "nead"],
        "help": ["hlp", "halp", "hep"],
        "know": ["no", "noe", "kno"],
        "about": ["abt", "bout", "abut"],
        "hotel": ["hotl", "hotle", "hotal"],
        "room": ["rom", "rooom", "romm"],
        "book": ["bok", "boook", "buk"],
        "price": ["pric", "prce", "priice"]
    }
    
    for pattern in patterns:
        words = pattern.lower().split()
        for i, word in enumerate(words):
            clean_word = word.strip(".,!?")
            if clean_word in informal_map:
                for replacement in informal_map[clean_word]:
                    new_words = words.copy()
                    new_words[i] = replacement
                    expanded.add(" ".join(new_words))
                    # Multiple replacements
                    if len(words) > 2:
                        for j, word2 in enumerate(words):
                            if i != j and word2.strip(".,!?") in informal_map:
                                new_words2 = new_words.copy()
                                new_words2[j] = random.choice(informal_map[word2.strip(".,!?")])
                                expanded.add(" ".join(new_words2))
    
    # 6. TYPO VARIATIONS (Extended)
    typo_map = {
        "hotel": ["hotl", "hotle", "hotal", "hotell", "hoteel"],
        "room": ["rom", "rooom", "romm", "roum", "ruum"],
        "book": ["bok", "boook", "buk", "bouk", "boke"],
        "price": ["pric", "prce", "priice", "prise", "pryce"],
        "available": ["availble", "avaliable", "availabe", "availible"],
        "reservation": ["reservaton", "resrvation", "reservtion", "reser vation"],
        "information": ["informaton", "infomation", "informatoin", "infrmation"],
        "check": ["chek", "cheque", "chck", "chekk"],
        "payment": ["paymen", "paymnt", "payement", "paiment"],
        "location": ["locaton", "loction", "locaion", "lokation"]
    }
    
    for pattern in patterns:
        words = pattern.lower().split()
        for i, word in enumerate(words):
            clean_word = word.strip(".,!?")
            if clean_word in typo_map:
                for typo in typo_map[clean_word]:
                    new_words = words.copy()
                    new_words[i] = typo
                    expanded.add(" ".join(new_words))
    
    # 7. QUESTION FORMAT VARIATIONS (30 types)
    question_starters = [
        "Can I ask about", "I'm wondering about", "I have a question about",
        "Quick question about", "Just wondering about", "Curious about",
        "Want to know about", "Need info on", "Looking for info on",
        "May I inquire about", "Could you clarify", "What's the deal with",
        "Tell me more about", "Explain to me about", "I'd like to understand",
        "Help me understand", "Can you explain", "Could you explain",
        "What do you know about", "Do you have info on", "Any info on",
        "Got any info on", "Know anything about", "Can you share about",
        "Would you share about", "I'm interested in", "Interested to know about",
        "Want to learn about", "Need to learn about", "Trying to understand"
    ]
    for pattern in patterns:
        for starter in question_starters:
            expanded.add(f"{starter} {pattern.lower()}")
            expanded.add(f"{starter} {pattern}")
    
    # 8. POLITE VARIATIONS (20 types)
    polite_additions = [
        ("Could you please ", ""),
        ("Would you mind ", ""),
        ("I would appreciate if you could ", ""),
        ("If you could ", " that would be great"),
        ("", " if you don't mind"),
        ("", " if possible"),
        ("", " when you get a chance"),
        ("Kindly ", ""),
        ("Please ", " for me"),
        ("", " please and thank you"),
        ("I'd be grateful if you could ", ""),
        ("Would it be possible to ", ""),
        ("", " at your convenience"),
        ("", " when convenient"),
        ("May I please ", ""),
        ("Could I kindly ", ""),
        ("", " if it's not too much trouble"),
        ("", " if you have time"),
        ("Excuse me, ", ""),
        ("Pardon me, ", "")
    ]
    for pattern in patterns:
        for prefix, suffix in polite_additions:
            expanded.add(f"{prefix}{pattern.lower()}{suffix}")
            expanded.add(f"{prefix}{pattern}{suffix}")
    
    # 9. CONVERSATIONAL VARIATIONS (30 types)
    conversational = [
        "Hey, ", "Hi, ", "Hello, ", "Yo, ", "Um, ", "So, ", "Well, ",
        "Actually, ", "Basically, ", "I mean, ", "Like, ", "You know, ",
        "Listen, ", "Look, ", "See, ", "Okay, ", "Alright, ", "Right, ",
        "Anyway, ", "By the way, ", "Oh, ", "Ah, ", "Uh, ", "Er, ",
        "Hmm, ", "Yeah, ", "Yep, ", "Sure, ", "Fine, ", "Cool, "
    ]
    for pattern in patterns:
        for conv in conversational:
            expanded.add(conv + pattern.lower())
            expanded.add(conv + pattern)
    
    # 10. REPETITION FOR EMPHASIS (Multiple types)
    for pattern in patterns:
        words = pattern.split()
        if len(words) > 1:
            # First word repeated
            expanded.add(f"{words[0]} {words[0]} {' '.join(words[1:])}")
            # Last word repeated
            expanded.add(f"{' '.join(words[:-1])} {words[-1]} {words[-1]}")
            # Middle word repeated
            if len(words) > 2:
                mid = len(words) // 2
                new_words = words.copy()
                new_words.insert(mid, words[mid])
                expanded.add(" ".join(new_words))
    
    # 11. URDU/HINDI MIXING (Pakistan specific)
    urdu_additions = [
        ("", " please bhai"),
        ("", " yaar"),
        ("", " bhai"),
        ("Bhai ", ""),
        ("Yaar ", ""),
        ("", " karo"),
        ("", " batao"),
        ("", " dikhao"),
        ("Mujhe ", " chahiye"),
        ("", " hai kya"),
        ("Kya ", " hai"),
        ("", " please yaar")
    ]
    for pattern in patterns[:50]:
        for prefix, suffix in urdu_additions:
            expanded.add(f"{prefix}{pattern.lower()}{suffix}")
    
    # 12. NUMBERS AND DATES
    time_additions = [
        " for tonight", " for today", " for tomorrow", " for next week",
        " for this weekend", " for 2 nights", " for 3 days", " for a week",
        " in December", " in January", " for New Year", " for Eid",
        " for wedding", " for vacation", " for business trip"
    ]
    for pattern in patterns[:30]:
        if "book" in pattern.lower() or "room" in pattern.lower():
            for time_add in time_additions:
                expanded.add(pattern + time_add)
    
    # 13. LOCATION SPECIFIC
    location_additions = [
        " in Lahore", " in Okara", " in Multan", " in Sheikhupura",
        " near Badshahi Mosque", " near airport", " in city center",
        " near mall", " near railway station"
    ]
    for pattern in patterns[:30]:
        if "hotel" in pattern.lower() or "room" in pattern.lower():
            for loc in location_additions:
                expanded.add(pattern + loc)
    
    # 14. BUDGET SPECIFIC
    budget_additions = [
        " under 5000", " under 10000", " cheap", " affordable",
        " luxury", " premium", " budget friendly", " economical",
        " best price", " lowest price", " discounted"
    ]
    for pattern in patterns[:30]:
        if "price" in pattern.lower() or "room" in pattern.lower():
            for budget in budget_additions:
                expanded.add(pattern + budget)
    
    # 15. COMBINATION VARIATIONS (Mix multiple techniques)
    sample_patterns = list(patterns)[:20]
    for pattern in sample_patterns:
        # Prefix + Suffix
        for prefix in random.sample(prefixes, 10):
            for suffix in random.sample(suffixes, 10):
                expanded.add(f"{prefix}{pattern.lower()}{suffix}")
        
        # Conversational + Polite
        for conv in random.sample(conversational, 10):
            for prefix, suffix in random.sample(polite_additions, 10):
                expanded.add(f"{conv}{prefix}{pattern.lower()}{suffix}")
    
    return list(expanded)


def generate_mega_dataset():
    """Generate 100,000+ patterns dataset"""
    
    print("🚀 Hotelogix AI Chatbot - MEGA Dataset Expansion")
    print("=" * 70)
    print("🎯 Target: 100,000+ patterns for comprehensive training")
    print("=" * 70)
    print("\nLoading base dataset...")
    
    # Load base dataset
    with open('chatbot/dataset-pakistan.json', 'r', encoding='utf-8') as f:
        base_dataset = json.load(f)
    
    original_patterns = sum(len(i["patterns"]) for i in base_dataset["intents"])
    print(f"✅ Base dataset loaded: {len(base_dataset['intents'])} intents, {original_patterns} patterns")
    
    print("\n🔄 Applying 15+ mega expansion techniques...")
    print("   This will take a moment...")
    
    # Expand dataset
    expanded_dataset = {"intents": []}
    total_patterns = 0
    
    for i, intent in enumerate(base_dataset["intents"], 1):
        print(f"\n   [{i}/{len(base_dataset['intents'])}] Expanding: {intent['tag']:<25}", end=" ")
        
        expanded_patterns = expand_patterns_mega(intent["patterns"])
        total_patterns += len(expanded_patterns)
        
        expanded_intent = {
            "tag": intent["tag"],
            "patterns": expanded_patterns,
            "responses": intent["responses"]
        }
        expanded_dataset["intents"].append(expanded_intent)
        
        print(f"✅ {len(expanded_patterns):>6,} patterns")
    
    # Calculate statistics
    total_intents = len(expanded_dataset["intents"])
    total_responses = sum(len(intent["responses"]) for intent in expanded_dataset["intents"])
    expansion_factor = total_patterns / original_patterns
    
    print("\n" + "=" * 70)
    print("🎉 MEGA EXPANSION COMPLETE!")
    print("=" * 70)
    print(f"\n📊 Final Statistics:")
    print(f"   Original Patterns:  {original_patterns:>10,}")
    print(f"   Expanded Patterns:  {total_patterns:>10,}")
    print(f"   Expansion Factor:   {expansion_factor:>10.1f}x")
    print(f"   Total Intents:      {total_intents:>10}")
    print(f"   Total Responses:    {total_responses:>10}")
    print(f"   Dataset Entries:    {total_patterns + total_responses:>10,}")
    
    # Save expanded dataset
    output_file = 'chatbot/dataset_expanded.json'
    print(f"\n💾 Saving mega dataset to: {output_file}")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(expanded_dataset, f, indent=2, ensure_ascii=False)
    
    file_size_mb = len(json.dumps(expanded_dataset)) / 1024 / 1024
    print(f"✅ File saved successfully!")
    print(f"   File size: {file_size_mb:.2f} MB")
    
    print("\n" + "=" * 70)
    print("✅ MEGA DATASET READY FOR TRAINING!")
    print("=" * 70)
    print("\n📋 Next steps:")
    print("   1. Run: python chatbot/train_sklearn.py")
    print("   2. Wait for training to complete (may take a few minutes)")
    print("   3. Run: python chatbot/chatbot_sklearn_api.py")
    print("   4. Your chatbot will understand 100,000+ question variations!")
    print("\n🎯 Your AI chatbot will be EXTREMELY intelligent!")
    
    return expanded_dataset


if __name__ == "__main__":
    generate_mega_dataset()
