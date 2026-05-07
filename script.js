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

    // ===== STATS COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const target = +entry.target.getAttribute('data-target');
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        entry.target.textContent = Math.floor(current) + (target >= 1000 ? '+' : '+');
                    }, 16);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(el => counterObserver.observe(el));
    }

    // ===== PORTFOLIO FILTER =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            portfolioCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ===== 3D AI BRAIN ANIMATION =====
    const hero3DContainer = document.getElementById('hero-3d-container');
    if(hero3DContainer && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, hero3DContainer.clientWidth / hero3DContainer.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
        
        renderer.setSize(hero3DContainer.clientWidth, hero3DContainer.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        hero3DContainer.appendChild(renderer.domElement);

        const brainGroup = new THREE.Group();
        scene.add(brainGroup);

        // Procedural Brain Geometry
        const geometry = new THREE.IcosahedronGeometry(1.6, 5); // Detail level 5 gives lots of vertices
        const positions = geometry.attributes.position;
        
        // Arrays for custom colors
        const colors = new Float32Array(positions.count * 3);
        const colorBlue = new THREE.Color(0x4cc9f0);
        const colorPink = new THREE.Color(0xf72585);

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // Shape into brain
            if (y < -0.3) y *= 0.6; // flatten bottom
            z *= 1.15; // elongate front-to-back
            x *= 0.85; // narrow sides

            // Longitudinal fissure (indent middle)
            let distFromCenter = Math.abs(x);
            if (distFromCenter < 0.4 && y > 0) {
                let indent = (0.4 - distFromCenter) * 1.2;
                y -= indent;
                z += (Math.random() - 0.5) * 0.1; // slight organic variation in the fissure
            }

            // Brain folds (gyri and sulci) using noise
            let noise = Math.sin(x * 6) * Math.cos(y * 6) * Math.sin(z * 6) * 0.12;
            x += noise * x;
            y += noise * y;
            z += noise * z;

            positions.setXYZ(i, x, y, z);

            // Color mix based on height and depth
            const mixRatio = (y + 1.5) / 3.0 + (Math.random() * 0.2);
            const mixedColor = colorBlue.clone().lerp(colorPink, mixRatio);
            colors[i*3] = mixedColor.r;
            colors[i*3+1] = mixedColor.g;
            colors[i*3+2] = mixedColor.b;
        }
        
        geometry.computeVertexNormals();
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Material for Points (The glowing nodes)
        const particleTexture = new THREE.CanvasTexture((() => {
            const c = document.createElement('canvas');
            c.width = 32; c.height = 32;
            const ctx = c.getContext('2d');
            const grad = ctx.createRadialGradient(16,16,0,16,16,16);
            grad.addColorStop(0, 'rgba(255,255,255,1)');
            grad.addColorStop(0.3, 'rgba(255,255,255,0.7)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0,0,32,32);
            return c;
        })());

        const pointsMat = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            map: particleTexture,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particlesMesh = new THREE.Points(geometry, pointsMat);
        brainGroup.add(particlesMesh);

        // Material for Wireframe (The neural connections)
        const wireframeGeo = new THREE.WireframeGeometry(geometry);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x4cc9f0,
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const linesMesh = new THREE.LineSegments(wireframeGeo, lineMat);
        brainGroup.add(linesMesh);

        // Floating glowing data bits inside
        const coreGeo = new THREE.BufferGeometry();
        const corePos = new Float32Array(300);
        for(let i=0; i<300; i++) {
            corePos[i] = (Math.random() - 0.5) * 2;
        }
        coreGeo.setAttribute('position', new THREE.BufferAttribute(corePos, 3));
        const coreMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.04,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        const coreMesh = new THREE.Points(coreGeo, coreMat);
        brainGroup.add(coreMesh);

        // Initial rotation to show the best angle
        brainGroup.rotation.y = -Math.PI / 6;
        brainGroup.rotation.x = Math.PI / 12;

        camera.position.set(0, 0, 5.5);
        
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
            mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
        });

        const clock = new THREE.Clock();
        
        const animate3D = () => {
            requestAnimationFrame(animate3D);
            const elapsedTime = clock.getElapsedTime();

            // Slow rotation
            brainGroup.rotation.y += 0.0015;
            
            // Gentle floating
            brainGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.05;
            
            // Mouse interactivity (tilt)
            brainGroup.rotation.x += (mouseY - brainGroup.rotation.x) * 0.05;
            
            // Core points moving randomly
            const positions = coreMesh.geometry.attributes.position.array;
            for(let i=0; i<300; i+=3) {
                positions[i+1] += Math.sin(elapsedTime + i) * 0.002;
            }
            coreMesh.geometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        };
        animate3D();

        window.addEventListener('resize', () => {
            if(!hero3DContainer) return;
            camera.aspect = hero3DContainer.clientWidth / hero3DContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(hero3DContainer.clientWidth, hero3DContainer.clientHeight);
        });
    }
});
