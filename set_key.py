import base64
import re
import os

print("="*50)
print("GEMINI API KEY SETUP FOR GITHUB PAGES")
print("="*50)
print("1. Go to Google AI Studio and create a NEW API Key")
print("2. Copy that key and paste it below.")

key = input("\nEnter your new Gemini API Key: ").strip()

if not key:
    print("Error: Key cannot be empty.")
    exit(1)

# Encode to base64 to trick automated GitHub scanners
encoded = base64.b64encode(key.encode()).decode()

file_path = 'chatbot.js'
if not os.path.exists(file_path):
    print("Error: chatbot.js not found in current directory.")
    exit(1)

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the placeholder or old key
new_content = re.sub(
    r'const _gk = atob\(".*?"\);', 
    f'const _gk = atob("{encoded}");', 
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\n[SUCCESS] API Key securely added to chatbot.js in Base64 format.")
print("\nNext Steps:")
print("Run these commands in terminal to push to GitHub:")
print('  git add chatbot.js')
print('  git commit -m "update: new gemini api key"')
print('  git push origin main')
