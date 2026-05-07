import re

with open('reviews.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove hero content properly
html = re.sub(r'<div class="hero-bg">.*?<div class="scroll-indicator">.*?</div>', '', html, flags=re.DOTALL)
html = re.sub(r'<!-- LIVE STATS -->.*?</section>', '', html, flags=re.DOTALL)
html = re.sub(r'<!-- EXPERTISE -->.*?</section>', '', html, flags=re.DOTALL)
html = re.sub(r'<!-- CAPABILITIES -->.*?</section>', '', html, flags=re.DOTALL)
html = re.sub(r'<!-- PORTFOLIO -->.*?</section>', '', html, flags=re.DOTALL)
html = re.sub(r'<!-- YOUTUBE VIDEOS -->.*?</section>', '', html, flags=re.DOTALL)
html = re.sub(r'<!-- BLOG -->.*?</section>', '', html, flags=re.DOTALL)

# Add spacing at the top
html = html.replace('<!-- CLIENT REVIEWS -->', '<div style="padding-top: 100px;"></div>\n<!-- CLIENT REVIEWS -->')
html = html.replace('<title>Automate with Shahrukh | Advanced AI & Automation</title>', '<title>Client Reviews | Automate with Shahrukh</title>')

with open('reviews.html', 'w', encoding='utf-8') as f:
    f.write(html)
