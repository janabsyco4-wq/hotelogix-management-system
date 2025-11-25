/**
 * Voice NLP Engine for Smart Room Finder
 * Handles natural language processing for voice commands
 */

class VoiceNLP {
    constructor() {
        this.numberWords = {
            'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
            'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
            'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
            'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
            'thirty': 30, 'forty': 40, 'fifty': 50
        };
    }

    /**
     * Calculate similarity between two strings (0-100)
     */
    similarity(str1, str2) {
        const s1 = str1.toLowerCase();
        const s2 = str2.toLowerCase();
        
        if (s1 === s2) return 100;
        if (s1.includes(s2) || s2.includes(s1)) return 80;
        
        let matches = 0;
        const minLen = Math.min(s1.length, s2.length);
        const maxLen = Math.max(s1.length, s2.length);
        
        // Character-by-character match
        for (let i = 0; i < minLen; i++) {
            if (s1[i] === s2[i]) matches++;
        }
        
        // Substring matches
        for (let i = 0; i < s1.length - 2; i++) {
            const substr = s1.substring(i, i + 3);
            if (s2.includes(substr)) matches += 2;
        }
        
        return Math.min(100, (matches / maxLen) * 100);
    }

    /**
     * Extract number from text
     */
    extractNumber(text, min = 1, max = 100) {
        const lower = text.toLowerCase().trim();
        
        // Direct digits
        const directMatch = lower.match(/\b(\d+)\b/);
        if (directMatch) {
            return parseInt(directMatch[1]);
        }
        
        // Written numbers (check longest first)
        const compounds = [
            'twenty nine', 'twenty-nine', 'twenty eight', 'twenty-eight',
            'twenty seven', 'twenty-seven', 'twenty six', 'twenty-six',
            'twenty five', 'twenty-five', 'twenty four', 'twenty-four',
            'twenty three', 'twenty-three', 'twenty two', 'twenty-two',
            'twenty one', 'twenty-one'
        ];
        
        for (const compound of compounds) {
            if (lower.includes(compound)) {
                const parts = compound.split(/[\s-]/);
                return this.numberWords[parts[0]] + this.numberWords[parts[1]];
            }
        }
        
        // Single words
        for (const [word, num] of Object.entries(this.numberWords)) {
            if (lower.includes(word)) {
                return num;
            }
        }
        
        // Thousand patterns
        const thousandMatch = lower.match(/(\d+)\s*(?:thousand|k)/i);
        if (thousandMatch) {
            return parseInt(thousandMatch[1]) * 1000;
        }
        
        // Written thousands
        const writtenThousand = lower.match(/(one|two|three|four|five|six|seven|eight|nine|ten|fifteen|twenty|thirty|forty)\s*(?:thousand|k)/i);
        if (writtenThousand) {
            const word = writtenThousand[1];
            return (this.numberWords[word] || 1) * 1000;
        }
        
        // Contextual phrases
        const contextMatch = lower.match(/(?:around|about|approximately|roughly|maybe|like)\s+(\d+)/i);
        if (contextMatch) {
            return parseInt(contextMatch[1]);
        }
        
        // Range expressions (take max)
        const rangeMatch = lower.match(/(?:between\s+)?(\d+)\s*(?:to|and|-)\s*(\d+)/i);
        if (rangeMatch) {
            return Math.max(parseInt(rangeMatch[1]), parseInt(rangeMatch[2]));
        }
        
        return null;
    }

    /**
     * Extract group size with natural language
     */
    extractGroupSize(text) {
        const lower = text.toLowerCase().trim();
        
        // Enhanced patterns for better recognition
        const patterns = {
            // Single person
            'just me': 1, 'only me': 1, 'myself': 1, 'alone': 1, 'solo': 1, 'single': 1,
            'one person': 1, 'one guest': 1, 'one': 1,
            
            // Two people
            'me and my wife': 2, 'me and my husband': 2, 'me and my partner': 2,
            'couple': 2, 'two of us': 2, 'both of us': 2, 'us two': 2, 'two people': 2,
            'me and my spouse': 2, 'my partner and i': 2, 'my wife and i': 2,
            'two guests': 2, 'two persons': 2, 'to': 2, 'too': 2, 'tu': 2,
            
            // Three people
            'three of us': 3, 'three people': 3, 'three guests': 3, 'three persons': 3,
            'family of three': 3, 'me and two others': 3, 'tree': 3, 'free': 3,
            
            // Four people
            'four of us': 4, 'four people': 4, 'four guests': 4, 'four persons': 4,
            'family of four': 4, 'me and three others': 4, 'for': 4, 'fore': 4,
            
            // Five people
            'five of us': 5, 'five people': 5, 'five guests': 5, 'five persons': 5,
            'family of five': 5, 'me and four others': 5, 'fife': 5,
            
            // Six people
            'six of us': 6, 'six people': 6, 'six guests': 6, 'six persons': 6,
            'family of six': 6, 'sicks': 6, 'sex': 6,
            
            // Seven people
            'seven of us': 7, 'seven people': 7, 'seven guests': 7, 'seven persons': 7,
            'large group': 7, 'sven': 7,
            
            // Eight people
            'eight of us': 8, 'eight people': 8, 'eight guests': 8, 'eight persons': 8,
            'ate': 8, 'ait': 8,
            
            // Groups
            'small group': 3, 'medium group': 5, 'big group': 7
        };
        
        // Check patterns first
        for (const [phrase, num] of Object.entries(patterns)) {
            if (lower.includes(phrase)) {
                return num;
            }
        }
        
        // Try to extract number
        return this.extractNumber(text, 1, 8);
    }

    /**
     * Extract stay duration with natural language
     */
    extractStayDuration(text) {
        const lower = text.toLowerCase().trim();
        
        const patterns = {
            'one night': 1, 'a night': 1, 'just one night': 1,
            'weekend': 2, 'a weekend': 2, 'couple of nights': 2, 'few nights': 3,
            'a week': 7, 'one week': 7, 'two weeks': 14, 'month': 30
        };
        
        for (const [phrase, num] of Object.entries(patterns)) {
            if (lower.includes(phrase)) {
                return num;
            }
        }
        
        return this.extractNumber(text, 1, 30);
    }

    /**
     * Extract budget with natural language
     */
    extractBudget(text) {
        const lower = text.toLowerCase().trim();
        
        const patterns = {
            'low budget': 3000, 'budget': 5000, 'affordable': 5000, 'cheap': 3000,
            'mid range': 10000, 'moderate': 10000, 'average': 10000,
            'high end': 20000, 'luxury': 30000, 'premium': 35000, 'expensive': 40000,
            'no limit': 40000, 'unlimited': 40000, 'any price': 40000
        };
        
        for (const [phrase, num] of Object.entries(patterns)) {
            if (lower.includes(phrase)) {
                return num;
            }
        }
        
        return this.extractNumber(text, 2000, 40000);
    }

    /**
     * Match option with fuzzy matching
     */
    matchOption(text, options) {
        const lower = text.toLowerCase().trim();
        const words = lower.split(/\s+/);
        
        let bestMatch = null;
        let maxScore = 0;
        
        for (const option of options) {
            let score = 0;
            
            // Exact keyword match
            for (const keyword of option.keywords) {
                if (lower.includes(keyword)) {
                    score += 100;
                }
            }
            
            // Fuzzy keyword match
            for (const word of words) {
                if (word.length >= 3) {
                    for (const keyword of option.keywords) {
                        const sim = this.similarity(word, keyword);
                        if (sim > 60) {
                            score += sim * 0.8;
                        }
                    }
                }
            }
            
            // Partial match
            for (const word of words) {
                for (const keyword of option.keywords) {
                    if (word.includes(keyword) || keyword.includes(word)) {
                        score += 50;
                    }
                }
            }
            
            // Label match
            const labelWords = option.label.toLowerCase().split(/\s+/);
            for (const labelWord of labelWords) {
                for (const word of words) {
                    const sim = this.similarity(word, labelWord);
                    if (sim > 60) {
                        score += sim * 0.7;
                    }
                }
            }
            
            if (score > maxScore) {
                maxScore = score;
                bestMatch = option;
            }
        }
        
        return maxScore > 30 ? bestMatch : null;
    }

    /**
     * Process voice input based on question type
     */
    processInput(text, question) {
        if (question.type === 'number') {
            let value = null;
            
            // Use specialized extractors
            if (question.key === 'groupSize') {
                value = this.extractGroupSize(text);
            } else if (question.key === 'stayDuration') {
                value = this.extractStayDuration(text);
            } else if (question.key === 'maxPrice') {
                value = this.extractBudget(text);
            } else {
                value = this.extractNumber(text, question.min, question.max);
            }
            
            // Check if in range
            if (value !== null && value >= question.min && value <= question.max) {
                return { success: true, value };
            } else if (value !== null) {
                return { success: false, error: 'out_of_range', value };
            } else {
                return { success: false, error: 'not_found' };
            }
        } else if (question.options) {
            const matched = this.matchOption(text, question.options);
            if (matched) {
                return { success: true, value: matched.value, label: matched.label };
            } else {
                return { success: false, error: 'no_match' };
            }
        }
        
        return { success: false, error: 'unknown' };
    }
}

export default new VoiceNLP();
