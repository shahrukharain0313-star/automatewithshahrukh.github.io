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

    // Custom Scroll Animations Observer (Replaces AOS library for no dependencies)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // Smooth scrolling for anchor links (Ignore external/page links)
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
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle internal page links (e.g. index.html#contact from packages.html)
    if(window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if(target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
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

            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    btn.style.background = '#25D366'; // WhatsApp green
                    contactForm.reset();
                } else {
                    btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error!';
                    btn.style.background = '#f72585';
                }
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            })
            .catch(error => {
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

    // --- High-End Particle Background Animation ---
    const canvas = document.getElementById('particles');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles;
        
        let mouse = {
            x: null,
            y: null,
            radius: 150
        }

        window.addEventListener('mousemove', function(event) {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        
        // Prevent particles from getting stuck on mouseout
        window.addEventListener('mouseout', function() {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        function initParticles() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            
            particles = [];
            const particleCount = Math.min(Math.floor(window.innerWidth / 10), 120); // More particles

            for (let i = 0; i < particleCount; i++) {
                // Random color between primary (blue) and secondary (pink/purple)
                let isPink = Math.random() > 0.5;
                let color = isPink ? 'rgba(247, 37, 133, 1)' : 'rgba(67, 97, 238, 1)';
                let glowColor = isPink ? '#f72585' : '#4361ee';

                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 2 + 1.5,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    color: color,
                    glow: glowColor
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);
            
            for(let i = 0; i < particles.length; i++) {
                let p = particles[i];
                
                // Draw lines to other particles
                for(let j = i + 1; j < particles.length; j++) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if(distance < 160) {
                        ctx.beginPath();
                        // Make line color based on the first particle
                        ctx.strokeStyle = p.color.replace('1)', `${0.6 * (1 - distance/160)})`);
                        ctx.lineWidth = 1.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
                
                // Mouse interaction
                if (mouse.x != null) {
                    let dx = mouse.x - p.x;
                    let dy = mouse.y - p.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        const directionX = forceDirectionX * force * 5;
                        const directionY = forceDirectionY * force * 5;
                        
                        p.x -= directionX;
                        p.y -= directionY;
                    }
                }

                // Move particles
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges smoothly
                if(p.x < 0 || p.x > width) p.vx *= -1;
                if(p.y < 0 || p.y > height) p.vy *= -1;

                // Draw particle
                ctx.beginPath();
                ctx.fillStyle = p.color;
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Glow
                ctx.shadowBlur = 20;
                ctx.shadowColor = p.glow;
            }

            requestAnimationFrame(drawParticles);
        }

        window.addEventListener('resize', () => {
            initParticles();
            
            // Fix: Clear mobile menu inline styles if resized to desktop
            const navLinks = document.querySelector('.nav-links');
            if (window.innerWidth > 768 && navLinks) {
                navLinks.style.display = '';
                navLinks.style.flexDirection = '';
                navLinks.style.position = '';
                navLinks.style.top = '';
                navLinks.style.background = '';
                navLinks.style.padding = '';
                navLinks.style.borderBottom = '';
            }
        });

        initParticles();
        drawParticles();
    }
});
