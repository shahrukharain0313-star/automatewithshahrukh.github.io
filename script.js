document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(5, 5, 8, 0.98)';
                navLinks.style.padding = '2rem 0';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            }
        });
    }

    // Scroll Animations Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                if (window.innerWidth <= 768 && navLinks) {
                    navLinks.style.display = 'none';
                }
                window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // Handle internal hash links from other pages
    if(window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if(target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }, 100);
    }

    // Form submission via AJAX to Formsubmit
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                btn.innerHTML = response.ok
                    ? '<i class="fas fa-check"></i> Message Sent!'
                    : '<i class="fas fa-exclamation-triangle"></i> Error!';
                btn.style.background = response.ok ? '#25D366' : '#f72585';
                if(response.ok) contactForm.reset();
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            })
            .catch(() => {
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error!';
                btn.style.background = '#f72585';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            });
        });
    }

    // --- Optimized Particle Animation ---
    const canvas = document.getElementById('particles');
    if(!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, particles, animationId;
    let mouse = { x: null, y: null };

    // Throttled mouse tracking (~60fps)
    let mouseTimer;
    window.addEventListener('mousemove', (e) => {
        clearTimeout(mouseTimer);
        mouseTimer = setTimeout(() => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, 16);
    });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

    function init() {
        if(animationId) cancelAnimationFrame(animationId);
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];

        // Premium particle count
        const count = Math.min(Math.floor(window.innerWidth / 10), 110);
        for(let i = 0; i < count; i++) {
            const isPink = Math.random() > 0.5;
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.5 + 1,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                color: isPink ? 'rgba(247,37,133,' : 'rgba(67,97,238,'
            });
        }
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        for(let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Mouse repulsion
            if(mouse.x !== null) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if(dist < 120) {
                    const force = (120 - dist) / 120;
                    p.x -= (dx / dist) * force * 2.5;
                    p.y -= (dy / dist) * force * 2.5;
                }
            }

            // Move & bounce
            p.x += p.vx;
            p.y += p.vy;
            if(p.x < 0 || p.x > width)  p.vx *= -1;
            if(p.y < 0 || p.y > height) p.vy *= -1;

            // Draw dot
            ctx.beginPath();
            ctx.fillStyle = p.color + '0.9)';
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            // Draw connecting lines (squared distance — no sqrt needed)
            for(let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const ddx = p.x - q.x;
                const ddy = p.y - q.y;
                const d2 = ddx * ddx + ddy * ddy;
                if(d2 < 12100) { // 110px
                    const alpha = 0.45 * (1 - d2 / 12100);
                    ctx.beginPath();
                    ctx.strokeStyle = p.color + alpha + ')';
                    ctx.lineWidth = 0.7;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }
        }
        animationId = requestAnimationFrame(draw);
    }

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            init();
            if(window.innerWidth > 768 && navLinks) navLinks.style.cssText = '';
        }, 250);
    });

    init();
});
