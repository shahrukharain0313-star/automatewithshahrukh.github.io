import base64
import re
import os

print("="*50)
print("DATABASE SETUP FOR GITHUB PAGES (Admin Panel)")
print("="*50)
print("Go to your Vercel Dashboard -> Storage -> upstash-kv-coffee-village")
print("Scroll down to 'REST API' section to find these two values.")

db_url = input("\nEnter UPSTASH_REDIS_REST_URL (starts with https://): ").strip()
db_token = input("Enter UPSTASH_REDIS_REST_TOKEN: ").strip()

if not db_url or not db_token:
    print("Error: URL and Token cannot be empty.")
    exit(1)

enc_url = base64.b64encode(db_url.encode()).decode()
enc_token = base64.b64encode(db_token.encode()).decode()

def update_file(filename):
    if not os.path.exists(filename):
        print(f"Warning: {filename} not found.")
        return False
        
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    content = re.sub(r'const _dbUrl = atob\(".*?"\);', f'const _dbUrl = atob("{enc_url}");', content)
    content = re.sub(r'const _dbToken = atob\(".*?"\);', f'const _dbToken = atob("{enc_token}");', content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

if update_file('chatbot.js') and update_file('admin.html'):
    print("\n[SUCCESS] Database credentials securely added to frontend files in Base64 format.")
    print("\nNext Steps:")
    print("Run these commands in terminal to push to GitHub:")
    print('  git add chatbot.js admin.html')
    print('  git commit -m "update: database credentials"')
    print('  git push origin main')
else:
    print("\nFailed to update some files.")
