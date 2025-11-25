import json

print("🔄 Updating Contact Information in All Datasets\n")
print("="*70)

# Your actual contact information
CONTACT_INFO = {
    'phone': '+92 310 4594964',
    'email': 'shehroozking3@gmail.com',
    'whatsapp': '+92 310 4594964'
}

print(f"📞 Phone: {CONTACT_INFO['phone']}")
print(f"📧 Email: {CONTACT_INFO['email']}")
print(f"💬 WhatsApp: {CONTACT_INFO['whatsapp']}")
print("="*70 + "\n")

# Update merged dataset
print("1️⃣  Updating dataset-merged-hotelogix.json...")
with open('chatbot/dataset-merged-hotelogix.json', 'r', encoding='utf-8') as f:
    merged_data = json.load(f)

for intent in merged_data['intents']:
    if intent['tag'] == 'contact':
        intent['responses'] = [
            f"Contact Hotelogix: Phone: {CONTACT_INFO['phone']} | Email: {CONTACT_INFO['email']} | WhatsApp: {CONTACT_INFO['whatsapp']} | Available 24/7 for your convenience!"
        ]
    elif intent['tag'] == 'competitor_redirect':
        intent['responses'] = [
            f"I can only provide information about Hotelogix properties. For other hotels, please visit their websites directly. Would you like to know about our Hotelogix rooms and rates? Contact us: {CONTACT_INFO['phone']}"
        ]
    elif intent['tag'] == 'competitor_strict_block':
        intent['responses'] = [
            f"I can ONLY provide information about Hotelogix properties. For other hotels, please contact them directly. Would you like to know about our Hotelogix rooms? Call: {CONTACT_INFO['phone']}",
            f"I exclusively represent Hotelogix Pakistan. I cannot help with other hotels. How can I help you with Hotelogix bookings? Contact: {CONTACT_INFO['email']}",
            f"Sorry, I only handle Hotelogix inquiries. For other hotels, visit their websites. Can I help you with our properties? WhatsApp: {CONTACT_INFO['whatsapp']}"
        ]

with open('chatbot/dataset-merged-hotelogix.json', 'w', encoding='utf-8') as f:
    json.dump(merged_data, f, indent=2, ensure_ascii=False)

print("✅ Updated dataset-merged-hotelogix.json")

# Update 200K dataset
print("\n2️⃣  Updating dataset-200k-final-hotelogix.json...")
with open('chatbot/dataset-200k-final-hotelogix.json', 'r', encoding='utf-8') as f:
    mega_data = json.load(f)

for intent in mega_data['intents']:
    if intent['tag'] == 'contact':
        intent['responses'] = [
            f"Contact Hotelogix: Phone: {CONTACT_INFO['phone']} | Email: {CONTACT_INFO['email']} | WhatsApp: {CONTACT_INFO['whatsapp']} | Available 24/7!"
        ]
    elif intent['tag'] == 'competitor_strict_block':
        intent['responses'] = [
            f"I can ONLY provide information about Hotelogix properties. For other hotels, please contact them directly. Hotelogix: {CONTACT_INFO['phone']}",
            f"I exclusively represent Hotelogix Pakistan. I cannot help with other hotels. Contact: {CONTACT_INFO['email']}",
            f"Sorry, I only handle Hotelogix inquiries. For other hotels, visit their websites. WhatsApp: {CONTACT_INFO['whatsapp']}"
        ]

# Update metadata
if 'metadata' in mega_data:
    mega_data['metadata']['contact'] = CONTACT_INFO

with open('chatbot/dataset-200k-final-hotelogix.json', 'w', encoding='utf-8') as f:
    json.dump(mega_data, f, indent=2, ensure_ascii=False)

print("✅ Updated dataset-200k-final-hotelogix.json")

print("\n" + "="*70)
print("✅ CONTACT INFORMATION UPDATED!")
print("="*70)
print(f"📞 Phone: {CONTACT_INFO['phone']}")
print(f"📧 Email: {CONTACT_INFO['email']}")
print(f"💬 WhatsApp: {CONTACT_INFO['whatsapp']}")
print("="*70)
print("\n⚠️  IMPORTANT: Restart the chatbot API to apply changes!")
print("   Run: python chatbot/hotelogix_chatbot_api.py")
print("="*70)
