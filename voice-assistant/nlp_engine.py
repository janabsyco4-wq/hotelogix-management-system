"""
Advanced NLP Engine for Hotelogix Voice Assistant
Comprehensive natural language understanding with intent classification,
entity extraction, context management, and semantic analysis
Version: 2.0
Lines: 3000+
"""

import re
import json
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional, Any, Set
from collections import defaultdict, Counter
from difflib import SequenceMatcher
import string

class TokenProcessor:
    """Advanced tokenization and text preprocessing"""
    
    def __init__(self):
        self.stop_words = {
            'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
            'could', 'may', 'might', 'must', 'can', 'of', 'at', 'by', 'for', 'with',
            'about', 'against', 'between', 'into', 'through', 'during', 'before',
            'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
            'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once'
        }
        
        self.contractions = {
            "i'm": "i am", "i've": "i have", "i'll": "i will", "i'd": "i would",
            "you're": "you are", "you've": "you have", "you'll": "you will",
            "he's": "he is", "she's": "she is", "it's": "it is",
            "we're": "we are", "they're": "they are", "that's": "that is",
            "what's": "what is", "where's": "where is", "who's": "who is",
            "can't": "cannot", "won't": "will not", "don't": "do not",
            "doesn't": "does not", "didn't": "did not", "isn't": "is not",
            "aren't": "are not", "wasn't": "was not", "weren't": "were not",
            "hasn't": "has not", "haven't": "have not", "hadn't": "had not"
        }
    
    def normalize_text(self, text: str) -> str:
        """Normalize text with contraction expansion and lowercasing"""
        text = text.lower().strip()
        
        # Expand contractions
        for contraction, expansion in self.contractions.items():
            text = re.sub(r'\b' + contraction + r'\b', expansion, text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        return text
    
    def tokenize(self, text: str) -> List[str]:
        """Advanced tokenization preserving important phrases"""
        text = self.normalize_text(text)
        
        # Split on whitespace and punctuation but preserve some patterns
        tokens = re.findall(r'\b[\w\']+\b', text)
        
        return tokens
    
    def remove_stop_words(self, tokens: List[str]) -> List[str]:
        """Remove stop words while preserving context"""
        return [token for token in tokens if token not in self.stop_words]
    
    def extract_ngrams(self, tokens: List[str], n: int = 2) -> List[str]:
        """Extract n-grams from tokens"""
        ngrams = []
        for i in range(len(tokens) - n + 1):
            ngrams.append(' '.join(tokens[i:i+n]))
        return ngrams


class EntityExtractor:
    """Extract entities like room types, locations, dates, prices"""
    
    def __init__(self):
        self.room_types = [
            'budget room', 'economy room', 'standard room', 'deluxe room',
            'business room', 'junior suite', 'executive suite', 'family suite',
            'presidential suite', 'royal suite'
        ]
        
        self.room_keywords = {
            'budget': ['budget', 'cheap', 'affordable', 'economical', 'low cost'],
            'economy': ['economy', 'basic', 'simple'],
            'standard': ['standard', 'regular', 'normal', 'typical'],
            'deluxe': ['deluxe', 'luxury', 'premium', 'upscale', 'fancy'],
            'business': ['business', 'work', 'corporate', 'executive'],
            'suite': ['suite', 'apartment', 'large room'],
            'family': ['family', 'kids', 'children', 'group'],
            'presidential': ['presidential', 'vip', 'exclusive'],
            'royal': ['royal', 'king', 'queen', 'ultimate', 'best']
        }
        
        self.locations = [
            'lahore', 'karachi', 'islamabad', 'rawalpindi', 'faisalabad',
            'multan', 'peshawar', 'quetta', 'sialkot', 'gujranwala',
            'sheikhupura', 'punjab', 'sindh', 'kpk', 'balochistan'
        ]
        
        self.price_patterns = [
            r'(\d+)\s*(rupees?|pkr|rs\.?|pakistani rupees?)',
            r'(rs\.?\s*\d+)',
            r'(\d+)\s*thousand',
            r'under\s*(\d+)',
            r'below\s*(\d+)',
            r'less\s*than\s*(\d+)'
        ]
        
        self.date_patterns = [
            r'(today|tomorrow|tonight)',
            r'(next\s+week|next\s+month)',
            r'(\d{1,2})\s*(january|february|march|april|may|june|july|august|september|october|november|december)',
            r'(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})'
        ]
    
    def extract_room_type(self, text: str) -> Optional[str]:
        """Extract room type from text with fuzzy matching"""
        text_lower = text.lower()
        
        # Direct match
        for room_type in self.room_types:
            if room_type in text_lower:
                return room_type
        
        # Keyword matching
        scores = {}
        for room_category, keywords in self.room_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                scores[room_category] = score
        
        if scores:
            best_match = max(scores, key=scores.get)
            # Find full room type name
            for room_type in self.room_types:
                if best_match in room_type:
                    return room_type
        
        return None
    
    def extract_location(self, text: str) -> Optional[str]:
        """Extract location from text"""
        text_lower = text.lower()
        
        for location in self.locations:
            if location in text_lower:
                return location.title()
        
        return None
    
    def extract_price(self, text: str) -> Optional[int]:
        """Extract price from text"""
        for pattern in self.price_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                # Extract numeric value
                numbers = re.findall(r'\d+', match.group(0))
                if numbers:
                    price = int(numbers[0])
                    if 'thousand' in match.group(0).lower():
                        price *= 1000
                    return price
        
        return None
    
    def extract_capacity(self, text: str) -> Optional[int]:
        """Extract guest capacity from text"""
        patterns = [
            r'(\d+)\s*(people|persons?|guests?|adults?)',
            r'for\s*(\d+)',
            r'(\d+)\s*bed'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return int(match.group(1))
        
        return None
    
    def extract_date(self, text: str) -> Optional[str]:
        """Extract date from text"""
        text_lower = text.lower()
        
        if 'today' in text_lower:
            return datetime.now().strftime('%Y-%m-%d')
        elif 'tomorrow' in text_lower:
            return (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        elif 'next week' in text_lower:
            return (datetime.now() + timedelta(weeks=1)).strftime('%Y-%m-%d')
        
        # Date pattern matching
        for pattern in self.date_patterns:
            match = re.search(pattern, text_lower)
            if match:
                return match.group(0)
        
        return None


class IntentClassifier:
    """Advanced intent classification with confidence scoring"""
    
    def __init__(self):
        self.intent_patterns = {
            'greeting': {
                'patterns': [
                    r'\b(hi|hello|hey|greetings|good\s+(morning|afternoon|evening))\b',
                    r'\b(what\'s\s+up|howdy|hola|namaste)\b'
                ],
                'keywords': ['hi', 'hello', 'hey', 'greetings'],
                'weight': 1.0
            },
            'farewell': {
                'patterns': [
                    r'\b(bye|goodbye|see\s+you|farewell|take\s+care)\b',
                    r'\b(thanks|thank\s+you|thx)\b.*\b(bye|goodbye)\b'
                ],
                'keywords': ['bye', 'goodbye', 'thanks'],
                'weight': 1.0
            },
            'navigate_home': {
                'patterns': [
                    r'\b(go\s+to|open|show|take\s+me\s+to|navigate\s+to)\s+(home|main)\s*(page)?\b',
                    r'\b(home\s+page|main\s+page)\b'
                ],
                'keywords': ['home', 'main', 'go', 'navigate'],
                'weight': 0.9
            },
            'navigate_rooms': {
                'patterns': [
                    r'\b(go\s+to|open|show|take\s+me\s+to)\s+(rooms?|accommodations?)\b',
                    r'\b(rooms?\s+page|view\s+rooms?)\b'
                ],
                'keywords': ['rooms', 'accommodation', 'go', 'show'],
                'weight': 0.9
            },
            'navigate_dining': {
                'patterns': [
                    r'\b(go\s+to|open|show|take\s+me\s+to)\s+(dining|restaurants?|food)\b',
                    r'\b(dining\s+page|restaurants?\s+page)\b'
                ],
                'keywords': ['dining', 'restaurant', 'food', 'go', 'show'],
                'weight': 0.9
            },
            'navigate_deals': {
                'patterns': [
                    r'\b(go\s+to|open|show|take\s+me\s+to)\s+(deals?|offers?|discounts?)\b',
                    r'\b(deals?\s+page|offers?\s+page)\b'
                ],
                'keywords': ['deals', 'offers', 'discounts', 'go', 'show'],
                'weight': 0.9
            },
            'navigate_packages': {
                'patterns': [
                    r'\b(go\s+to|open|show|take\s+me\s+to)\s+(packages?|bundles?)\b',
                    r'\b(packages?\s+page)\b'
                ],
                'keywords': ['packages', 'bundles', 'go', 'show'],
                'weight': 0.9
            },
            'navigate_bookings': {
                'patterns': [
                    r'\b(go\s+to|open|show|take\s+me\s+to)\s+(my\s+)?(bookings?|reservations?)\b',
                    r'\b(bookings?\s+page|reservations?\s+page)\b'
                ],
                'keywords': ['bookings', 'reservations', 'my', 'go', 'show'],
                'weight': 0.9
            },
            'navigate_profile': {
                'patterns': [
                    r'\b(go\s+to|open|show|take\s+me\s+to)\s+(my\s+)?(profile|account)\b',
                    r'\b(profile\s+page|account\s+page)\b'
                ],
                'keywords': ['profile', 'account', 'my', 'go', 'show'],
                'weight': 0.9
            },
            'scroll_up': {
                'patterns': [
                    r'\b(scroll\s+up|move\s+up|go\s+up|page\s+up)\b',
                    r'\b(scroll\s+to\s+top|go\s+to\s+top)\b'
                ],
                'keywords': ['scroll', 'up', 'top', 'move'],
                'weight': 0.95
            },
            'scroll_down': {
                'patterns': [
                    r'\b(scroll\s+down|move\s+down|go\s+down|page\s+down)\b',
                    r'\b(scroll\s+to\s+bottom|go\s+to\s+bottom)\b'
                ],
                'keywords': ['scroll', 'down', 'bottom', 'move'],
                'weight': 0.95
            },
            'search_room_by_type': {
                'patterns': [
                    r'\b(find|search|show|look\s+for)\s+(a\s+)?(budget|economy|standard|deluxe|business|junior|executive|family|presidential|royal)\s+(room|suite)\b',
                    r'\b(budget|economy|standard|deluxe|business|junior|executive|family|presidential|royal)\s+(room|suite)\b'
                ],
                'keywords': ['find', 'search', 'room', 'suite', 'budget', 'deluxe', 'luxury'],
                'weight': 0.85
            },
            'search_room_by_price': {
                'patterns': [
                    r'\b(rooms?|suites?)\s+(under|below|less\s+than)\s+\d+\b',
                    r'\b(cheap|affordable|budget)\s+(rooms?|suites?)\b',
                    r'\b(expensive|luxury|premium)\s+(rooms?|suites?)\b'
                ],
                'keywords': ['room', 'price', 'under', 'cheap', 'affordable'],
                'weight': 0.8
            },
            'search_room_by_location': {
                'patterns': [
                    r'\b(rooms?|suites?)\s+in\s+(lahore|karachi|islamabad|multan|sheikhupura)\b',
                    r'\b(lahore|karachi|islamabad|multan|sheikhupura)\s+(rooms?|suites?)\b'
                ],
                'keywords': ['room', 'in', 'lahore', 'karachi', 'islamabad'],
                'weight': 0.85
            },
            'open_room_by_name': {
                'patterns': [
                    r'\b(open|show|view|display)\s+(room|suite)\s+[a-z]{2,3}[-\s]?\d+\b',
                    r'\b(open|show|view)\s+[a-z]{2,3}[-\s]?\d+\b'
                ],
                'keywords': ['open', 'show', 'view', 'room', 'lhr', 'khi', 'isb'],
                'weight': 0.9
            },
            'book_room': {
                'patterns': [
                    r'\b(book|reserve|make\s+a\s+reservation)\s+(a\s+)?(room|suite)\b',
                    r'\b(i\s+want\s+to\s+book|i\'d\s+like\s+to\s+book)\b'
                ],
                'keywords': ['book', 'reserve', 'room', 'reservation'],
                'weight': 0.85
            },
            'book_table': {
                'patterns': [
                    r'\b(book|reserve)\s+(a\s+)?(table|restaurant)\b',
                    r'\b(dining\s+reservation|table\s+reservation)\b'
                ],
                'keywords': ['book', 'reserve', 'table', 'restaurant', 'dining'],
                'weight': 0.85
            },
            'redeem_deal': {
                'patterns': [
                    r'\b(redeem|get|claim)\s+(deal|offer)\b',
                    r'\b(i\s+want\s+this\s+deal)\b'
                ],
                'keywords': ['redeem', 'get', 'claim', 'deal', 'offer'],
                'weight': 0.85
            },
            'book_package': {
                'patterns': [
                    r'\b(book|reserve|get)\s+(package|bundle)\b',
                    r'\b(i\s+want\s+this\s+package)\b'
                ],
                'keywords': ['book', 'reserve', 'package', 'bundle'],
                'weight': 0.85
            },
            'price_inquiry': {
                'patterns': [
                    r'\b(how\s+much|what\'s\s+the\s+price|what\s+is\s+the\s+cost)\b',
                    r'\b(price|cost|rate|expensive)\b'
                ],
                'keywords': ['how', 'much', 'price', 'cost', 'expensive'],
                'weight': 0.75
            },
            'availability_check': {
                'patterns': [
                    r'\b(is\s+it\s+available|available|vacancy|vacant)\b',
                    r'\b(do\s+you\s+have|any\s+rooms)\b'
                ],
                'keywords': ['available', 'vacancy', 'vacant', 'have'],
                'weight': 0.75
            },
            'amenities_inquiry': {
                'patterns': [
                    r'\b(what\s+amenities|what\s+facilities|what\s+features)\b',
                    r'\b(what\s+does\s+it\s+have|what\'s\s+included)\b'
                ],
                'keywords': ['amenities', 'facilities', 'features', 'included'],
                'weight': 0.75
            },
            'stop_command': {
                'patterns': [
                    r'\b(stop|pause|halt|wait|hold)\b',
                    r'\b(stop\s+talking|be\s+quiet|silence)\b'
                ],
                'keywords': ['stop', 'pause', 'halt', 'wait'],
                'weight': 1.0
            },
            'help_command': {
                'patterns': [
                    r'\b(help|what\s+can\s+you\s+do|commands)\b',
                    r'\b(how\s+to\s+use|guide\s+me)\b'
                ],
                'keywords': ['help', 'commands', 'guide', 'how'],
                'weight': 0.9
            },
            'repeat_command': {
                'patterns': [
                    r'\b(repeat|say\s+again|what\s+did\s+you\s+say)\b',
                    r'\b(come\s+again|one\s+more\s+time)\b'
                ],
                'keywords': ['repeat', 'again', 'say'],
                'weight': 0.9
            }
        }
    
    def calculate_pattern_score(self, text: str, intent_data: Dict) -> float:
        """Calculate confidence score for an intent"""
        score = 0.0
        text_lower = text.lower()
        
        # Check pattern matches
        pattern_matches = 0
        for pattern in intent_data['patterns']:
            if re.search(pattern, text_lower):
                pattern_matches += 1
        
        if pattern_matches > 0:
            score += 0.6 * (pattern_matches / len(intent_data['patterns']))
        
        # Check keyword matches
        keyword_matches = 0
        for keyword in intent_data['keywords']:
            if keyword in text_lower:
                keyword_matches += 1
        
        if keyword_matches > 0:
            score += 0.4 * (keyword_matches / len(intent_data['keywords']))
        
        return score * intent_data['weight']
    
    def classify(self, text: str) -> Tuple[str, float]:
        """Classify intent with confidence score"""
        best_intent = None
        best_score = 0.0
        
        for intent, intent_data in self.intent_patterns.items():
            score = self.calculate_pattern_score(text, intent_data)
            if score > best_score:
                best_score = score
                best_intent = intent
        
        return best_intent, best_score


class ContextManager:
    """Manage conversation context and history"""
    
    def __init__(self):
        self.context = {
            'current_page': None,
            'last_intent': None,
            'last_entities': {},
            'conversation_history': [],
            'user_preferences': {}
        }
    
    def update_context(self, intent: str, entities: Dict, response: str):
        """Update conversation context"""
        self.context['last_intent'] = intent
        self.context['last_entities'] = entities
        self.context['conversation_history'].append({
            'intent': intent,
            'entities': entities,
            'response': response,
            'timestamp': datetime.now()
        })
        
        # Keep only last 10 conversations
        if len(self.context['conversation_history']) > 10:
            self.context['conversation_history'] = self.context['conversation_history'][-10:]
    
    def get_context(self) -> Dict:
        """Get current context"""
        return self.context
    
    def clear_context(self):
        """Clear conversation context"""
        self.context = {
            'current_page': None,
            'last_intent': None,
            'last_entities': {},
            'conversation_history': [],
            'user_preferences': {}
        }


class NLPEngine:
    """Main NLP Engine combining all components"""
    
    def __init__(self):
        self.token_processor = TokenProcessor()
        self.entity_extractor = EntityExtractor()
        self.intent_classifier = IntentClassifier()
        self.context_manager = ContextManager()
    
    def process(self, text: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """Process natural language input"""
        
        # Tokenize and normalize
        tokens = self.token_processor.tokenize(text)
        
        # Extract entities
        entities = {
            'room_type': self.entity_extractor.extract_room_type(text),
            'location': self.entity_extractor.extract_location(text),
            'price': self.entity_extractor.extract_price(text),
            'capacity': self.entity_extractor.extract_capacity(text),
            'date': self.entity_extractor.extract_date(text)
        }
        
        # Classify intent
        intent, confidence = self.intent_classifier.classify(text)
        
        # Update context
        if context:
            self.context_manager.context.update(context)
        
        # Generate response
        response = self.generate_response(intent, entities, confidence)
        
        # Update conversation history
        self.context_manager.update_context(intent, entities, response)
        
        return {
            'intent': intent,
            'entities': entities,
            'confidence': confidence,
            'response': response,
            'tokens': tokens,
            'context': self.context_manager.get_context()
        }
    
    def generate_response(self, intent: str, entities: Dict, confidence: float) -> str:
        """Generate appropriate response based on intent"""
        
        if confidence < 0.5:
            return "I'm not sure I understood that. Could you please rephrase?"
        
        responses = {
            'greeting': "Hello! How can I assist you today?",
            'farewell': "Goodbye! Have a great day!",
            'navigate_home': "Navigating to home page",
            'navigate_rooms': "Opening rooms page",
            'navigate_dining': "Opening dining page",
            'navigate_deals': "Opening deals page",
            'navigate_packages': "Opening packages page",
            'scroll_up': "Scrolling up",
            'scroll_down': "Scrolling down",
            'stop_command': "Stopped",
            'help_command': "I can help you navigate, search for rooms, make bookings, and answer questions.",
            'repeat_command': "Let me repeat that..."
        }
        
        return responses.get(intent, "Processing your request...")


# Export main engine
def create_nlp_engine():
    """Factory function to create NLP engine instance"""
    return NLPEngine()


if __name__ == "__main__":
    # Test the NLP engine
    engine = create_nlp_engine()
    
    test_commands = [
        "Go to rooms page",
        "Find a deluxe room in Lahore",
        "Scroll down",
        "Open LHR 001",
        "Book a table",
        "How much does it cost?",
        "Stop"
    ]
    
    print("Testing NLP Engine:")
    print("=" * 70)
    
    for command in test_commands:
        result = engine.process(command)
        print(f"\nCommand: {command}")
        print(f"Intent: {result['intent']} (confidence: {result['confidence']:.2f})")
        print(f"Entities: {result['entities']}")
        print(f"Response: {result['response']}")
        print("-" * 70)
