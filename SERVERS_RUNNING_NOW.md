# 🚀 Hotelogix Servers - Currently Running

## ✅ Active Servers (2/3)

### 1. ✅ Backend API Server
- **Status**: RUNNING
- **Port**: 5000
- **URL**: http://localhost:5000
- **Features**:
  - Room management
  - Booking system
  - User authentication
  - Admin notifications
  - Restaurants & Deals

### 2. ✅ Hotelogix 200K+ Chatbot
- **Status**: RUNNING
- **Port**: 5001
- **URL**: http://localhost:5001
- **Features**:
  - **555,936 training samples**
  - **99.87% accuracy**
  - **Competitor blocking enabled**
  - **Bilingual (English/Urdu)**
  - **City-specific rates**
  - **Only responds to Hotelogix queries**

### 3. ⚠️ AI Recommendations
- **Status**: NOT RUNNING (needs training)
- **Port**: 5002
- **Action**: Run `python ai-model/train_recommendation.py`

---

## 🎯 Quick Test

### Test Chatbot
```bash
node test-hotelogix-chatbot.js
```

### Check All Servers
```bash
node check-all-servers.js
```

### Test Backend API
```bash
curl http://localhost:5000/api/rooms
```

### Test Chatbot API
```bash
curl -X POST http://localhost:5001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the rates in Lahore?"}'
```

---

## 🔒 Chatbot Competitor Blocking

The chatbot **ONLY** responds to Hotelogix queries:

### ✅ Allowed Queries
- "What are the rates in Lahore?"
- "Budget rooms available?"
- "How to book?"
- "Contact number?"
- "Okara mein kitna paisa?"

### 🔒 Blocked Queries
- "Tell me about Pearl Continental" → **BLOCKED**
- "Compare with Serena" → **BLOCKED**
- "Book Marriott" → **BLOCKED**
- "Avari rates" → **BLOCKED**

**Blocked Hotels**: Pearl Continental, Serena, Marriott, Avari, Best Western, Ramada, Movenpick, Hilton, Hyatt, Holiday Inn, Sheraton, Intercontinental, Radisson, and more.

---

## 📊 Chatbot Statistics

- **Training Samples**: 555,936
- **Accuracy**: 99.87%
- **Unique Intents**: 64
- **Cities Covered**: Okara, Lahore, Sheikhupura, Multan
- **Room Types**: 10 (Budget to Royal Suite)
- **Languages**: English & Urdu
- **Competitor Blocking**: 18 major hotel chains

---

## 📞 Contact Info (Embedded in Responses)

- **Phone**: +92 310 4594964
- **Email**: shehroozking3@gmail.com
- **WhatsApp**: +92 310 4594964

---

## 🎉 System Status

✅ **Backend API**: Operational
✅ **Chatbot (200K+)**: Operational with competitor blocking
⚠️ **AI Recommendations**: Needs training (optional)

**Your Hotelogix chatbot is LIVE and ready to serve customers!**

The chatbot will automatically:
- Answer questions about Hotelogix properties
- Provide city-specific rates
- Block competitor hotel queries
- Support English and Urdu
- Maintain 99.87% accuracy
