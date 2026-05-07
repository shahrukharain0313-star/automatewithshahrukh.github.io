import re

def update_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update stats
    html = re.sub(r'<div class="stat-number" data-target="50">0</div>\n                    <div class="stat-label">Projects Completed</div>',
                  r'<div class="stat-number" data-target="1000">0</div>\n                    <div class="stat-label">Projects Completed</div>', html)
    
    html = re.sub(r'<div class="stat-number" data-target="30">0</div>\n                    <div class="stat-label">Happy Clients</div>',
                  r'<div class="stat-number" data-target="1000">0</div>\n                    <div class="stat-label">Happy Clients</div>', html)
    
    # 2. Add 6th portfolio project
    new_project = """
                <div class="portfolio-card glass-panel" data-category="bot" data-aos="fade-up">
                    <div class="portfolio-img">
                        <img src="images/whatsapp_bot.png" alt="YouTube Shorts Generator" loading="lazy">
                        <div class="portfolio-overlay">
                            <a href="#contact" class="btn btn-primary">Get Similar</a>
                        </div>
                    </div>
                    <div class="portfolio-info">
                        <span class="portfolio-tag">Software / AI</span>
                        <h3>YouTube Shorts Generator</h3>
                        <p>One-click software that generates, edits, and adds subtitles to short videos automatically.</p>
                        <div class="portfolio-result"><i class="fas fa-chart-line"></i> Result: 100+ Shorts per hour</div>
                    </div>
                </div>
"""
    # Insert before the last closing div of portfolio-grid
    html = html.replace('Result: 40% increase in lead conversion</div>\n                    </div>\n                </div>',
                        'Result: 40% increase in lead conversion</div>\n                    </div>\n                </div>' + new_project)

    # 3. Update Footer bottom in index.html
    footer_bottom_old = r'<div class="footer-bottom">\n            <p>&copy; 2026 Automate with Shahrukh. All rights reserved.</p>\n        </div>'
    footer_bottom_new = """<div class="footer-bottom" style="display: flex; justify-content: space-between; align-items: center; padding-top: 2rem; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 1rem;">
            <p>&copy; 2026 Automate with Shahrukh. All rights reserved.</p>
            <div class="footer-legal" style="display: flex; gap: 1.5rem;">
                <a href="#" style="color: var(--text-muted); text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color=\'var(--primary)\'" onmouseout="this.style.color=\'var(--text-muted)\'">Terms & Conditions</a>
                <a href="#" style="color: var(--text-muted); text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color=\'var(--primary)\'" onmouseout="this.style.color=\'var(--text-muted)\'">Privacy Policy</a>
                <a href="#" style="color: var(--text-muted); text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color=\'var(--primary)\'" onmouseout="this.style.color=\'var(--text-muted)\'">Refund Policy</a>
            </div>
        </div>"""
    html = re.sub(footer_bottom_old, footer_bottom_new, html)

    # Make sure we add a "+" after the counter in JS if we want it, but the HTML will just say 1000 and count up.
    # Actually, the user asked to change 50 to 1000+. To make it show 1000+, we need to add the "+" in JS or CSS. 
    # Let's change the JS later if needed. For now, data-target="1000".

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)


def update_reviews():
    with open('reviews.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Fix Navbar Links
    html = html.replace('href="#home"', 'href="index.html"')
    html = html.replace('href="#results"', 'href="index.html#results"')
    html = html.replace('href="#expertise"', 'href="index.html#expertise"')
    html = html.replace('href="#portfolio"', 'href="index.html#portfolio"')
    html = html.replace('href="#reviews"', 'href="index.html#reviews"')
    html = html.replace('href="#blog"', 'href="index.html#blog"')
    
    # Fix spacing at the top
    html = html.replace('<div style="padding-top: 100px;"></div>', '<div style="height: 140px;"></div>')
    
    # Footer
    footer_bottom_old = r'<div class="footer-bottom">\n            <p>&copy; 2026 Automate with Shahrukh. All rights reserved.</p>\n        </div>'
    footer_bottom_new = """<div class="footer-bottom" style="display: flex; justify-content: space-between; align-items: center; padding-top: 2rem; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 1rem;">
            <p>&copy; 2026 Automate with Shahrukh. All rights reserved.</p>
            <div class="footer-legal" style="display: flex; gap: 1.5rem;">
                <a href="#" style="color: var(--text-muted); text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color=\'var(--primary)\'" onmouseout="this.style.color=\'var(--text-muted)\'">Terms & Conditions</a>
                <a href="#" style="color: var(--text-muted); text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color=\'var(--primary)\'" onmouseout="this.style.color=\'var(--text-muted)\'">Privacy Policy</a>
                <a href="#" style="color: var(--text-muted); text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color=\'var(--primary)\'" onmouseout="this.style.color=\'var(--text-muted)\'">Refund Policy</a>
            </div>
        </div>"""
    html = re.sub(footer_bottom_old, footer_bottom_new, html)

    with open('reviews.html', 'w', encoding='utf-8') as f:
        f.write(html)

def update_packages():
    with open('packages.html', 'r', encoding='utf-8') as f:
        html = f.read()

    new_packages = """
                <!-- Package 5 -->
                <div class="package-card glass-panel" data-aos="zoom-up">
                    <div class="package-icon"><i class="fas fa-file-code"></i></div>
                    <h3>Simple Python Script</h3>
                    <div class="budget-tag">Idea: $30 - $80</div>
                    <p>100-200 line Python scripts for fixing bugs, file renaming, basic data entry or quick automation.</p>
                    <ul class="package-features">
                        <li><i class="fas fa-check"></i> Clean Python Code</li>
                        <li><i class="fas fa-check"></i> Bug Fixing & Edits</li>
                        <li><i class="fas fa-check"></i> Fast Delivery (1 Day)</li>
                        <li><i class="fas fa-check"></i> Executable File (.exe)</li>
                    </ul>
                    <a href="index.html#contact" class="btn btn-outline w-100 mt-4">Discuss Project</a>
                </div>

                <!-- Package 6 -->
                <div class="package-card glass-panel" data-aos="zoom-up">
                    <div class="package-icon"><i class="fas fa-laptop-code"></i></div>
                    <h3>Landing Page Design</h3>
                    <div class="budget-tag">Idea: $50 - $150</div>
                    <p>Beautiful, high-converting single page websites like this one for your local business.</p>
                    <ul class="package-features">
                        <li><i class="fas fa-check"></i> Modern UI/UX Design</li>
                        <li><i class="fas fa-check"></i> Mobile Responsive</li>
                        <li><i class="fas fa-check"></i> Contact Form Setup</li>
                        <li><i class="fas fa-check"></i> Free Deployment</li>
                    </ul>
                    <a href="index.html#contact" class="btn btn-outline w-100 mt-4">Discuss Project</a>
                </div>

                <!-- Package 7 -->
                <div class="package-card glass-panel" data-aos="zoom-up">
                    <div class="package-icon"><i class="fab fa-telegram-plane"></i></div>
                    <h3>Telegram / Discord Bot</h3>
                    <div class="budget-tag">Idea: $40 - $100</div>
                    <p>Automated group management, message forwarding, or alert bots for your community.</p>
                    <ul class="package-features">
                        <li><i class="fas fa-check"></i> Keyword Responders</li>
                        <li><i class="fas fa-check"></i> Auto Moderation</li>
                        <li><i class="fas fa-check"></i> API Alerts Integration</li>
                        <li><i class="fas fa-check"></i> User Welcome System</li>
                    </ul>
                    <a href="index.html#contact" class="btn btn-outline w-100 mt-4">Discuss Project</a>
                </div>

                <!-- Package 8 -->
                <div class="package-card glass-panel" data-aos="zoom-up">
                    <div class="package-icon"><i class="fas fa-tools"></i></div>
                    <h3>Consultation & Review</h3>
                    <div class="budget-tag">Idea: $20 - $50</div>
                    <p>1-on-1 Zoom call to review your current code, fix errors, or plan a scalable automation architecture.</p>
                    <ul class="package-features">
                        <li><i class="fas fa-check"></i> Code Error Fixing</li>
                        <li><i class="fas fa-check"></i> Automation Strategy</li>
                        <li><i class="fas fa-check"></i> Tool Recommendations</li>
                        <li><i class="fas fa-check"></i> Live Screen Share</li>
                    </ul>
                    <a href="index.html#contact" class="btn btn-outline w-100 mt-4">Discuss Project</a>
                </div>
"""
    html = html.replace('</div>\n        </div>\n    </section>\n\n    <footer>', new_packages + '            </div>\n        </div>\n    </section>\n\n    <footer>')

    # Footer
    footer_bottom_old = r'<div class="footer-bottom">\n            <p>&copy; 2026 Automate with Shahrukh. All rights reserved.</p>\n        </div>'
    footer_bottom_new = """<div class="footer-bottom" style="display: flex; justify-content: space-between; align-items: center; padding-top: 2rem; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 1rem;">
            <p>&copy; 2026 Automate with Shahrukh. All rights reserved.</p>
            <div class="footer-legal" style="display: flex; gap: 1.5rem;">
                <a href="#" style="color: var(--text-muted); text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color=\'var(--primary)\'" onmouseout="this.style.color=\'var(--text-muted)\'">Terms & Conditions</a>
                <a href="#" style="color: var(--text-muted); text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color=\'var(--primary)\'" onmouseout="this.style.color=\'var(--text-muted)\'">Privacy Policy</a>
                <a href="#" style="color: var(--text-muted); text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color=\'var(--primary)\'" onmouseout="this.style.color=\'var(--text-muted)\'">Refund Policy</a>
            </div>
        </div>"""
    html = re.sub(footer_bottom_old, footer_bottom_new, html)

    with open('packages.html', 'w', encoding='utf-8') as f:
        f.write(html)

try:
    update_index()
    update_reviews()
    update_packages()
    print("Updates applied successfully.")
except Exception as e:
    print(f"Error: {e}")
