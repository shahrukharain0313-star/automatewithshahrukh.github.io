import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add 5th portfolio project
new_portfolio_project = """
                <div class="portfolio-card glass-panel" data-category="web" data-aos="fade-up">
                    <div class="portfolio-img">
                        <img src="images/dashboard.png" alt="Real Estate Website" loading="lazy">
                        <div class="portfolio-overlay">
                            <a href="#contact" class="btn btn-primary">Get Similar</a>
                        </div>
                    </div>
                    <div class="portfolio-info">
                        <span class="portfolio-tag">Web Dev + AI</span>
                        <h3>Real Estate CRM Platform</h3>
                        <p>A full real estate agency portal with automated AI-based property matching and daily email alerts for clients.</p>
                        <div class="portfolio-result"><i class="fas fa-chart-line"></i> Result: 40% increase in lead conversion</div>
                    </div>
                </div>
"""
# Find the end of portfolio grid and insert the 5th project
html = html.replace('</div>\n        </div>\n    </section>\n\n    <!-- YOUTUBE VIDEOS -->', new_portfolio_project + '            </div>\n        </div>\n    </section>\n\n    <!-- YOUTUBE VIDEOS -->')

# Truncate reviews
reviews_match = re.search(r'(<!-- CLIENT REVIEWS -->.*?<div class="reviews-grid">)(.*?)(</div>\n        </div>\n    </section>)', html, flags=re.DOTALL)
if reviews_match:
    reviews_content = reviews_match.group(2)
    # Get the first 3 reviews (each starts with <div class="review-card)
    review_cards = re.findall(r'<div class="review-card.*?</p>\n                    <div class="reviewer">.*?</div>\n                </div>', reviews_content, flags=re.DOTALL)
    
    first_3_reviews = "\n".join(review_cards[:3])
    
    new_reviews_section = f"""{reviews_match.group(1)}
{first_3_reviews}
            </div>
            <div class="text-center" style="margin-top: 3rem;">
                <a href="reviews.html" class="btn btn-outline glow-btn" style="font-size: 1.1rem; padding: 1rem 2.5rem;">Read All 20+ Reviews <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    </section>"""
    html = html[:reviews_match.start()] + new_reviews_section + html[reviews_match.end():]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
