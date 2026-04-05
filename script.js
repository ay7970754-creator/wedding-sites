document.addEventListener('DOMContentLoaded', () => {

    /* --- Navbar Scroll Effect --- */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Scroll Reveal Animations --- */
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    /* --- Button Ripple Effect --- */
    const buttons = document.querySelectorAll('.ripple-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;

            let ripple = document.createElement('span');
            ripple.classList.add('ripple-span');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    /* --- Hamburger Menu Logic --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    /* --- Parallax Effect --- */
    window.addEventListener('scroll', () => {
        const parallaxElements = document.querySelectorAll('.parallax');
        let scrollPosition = window.pageYOffset;
        parallaxElements.forEach(el => {
            // Adjust the background position based on scroll to create faux-parallax
            el.style.backgroundPositionY = (scrollPosition * 0.5) + 'px';
        });
    });

    /* --- Touch Fire Particle Effect --- */
    const canvas = document.getElementById('fire-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray = [];
        let interactiveParticlesArray = [];
        let activeElements = [];
        
        const colors = ['#FF4500', '#FF8C00', '#FFD700', '#D4AF37', '#FFF8DC']; // Fire / Gold variations
        const flameColors = ['#ff2a00', '#ff5a00', '#ff9a00', '#ffce00', '#ffe808']; 

        // Find elements to attach fire interaction
        const fireTargets = document.querySelectorAll('h1, h2, h3, .nav-links a, .btn, .glow-text, .emotional-subtitle');
        fireTargets.forEach(el => {
            el.addEventListener('mouseenter', () => activateFire(el));
            el.addEventListener('mouseleave', () => deactivateFire(el));
            el.addEventListener('touchstart', () => activateFire(el), {passive: true});
            el.addEventListener('touchend', () => { setTimeout(() => deactivateFire(el), 1500); }); 
        });

        function activateFire(el) {
            if (!activeElements.includes(el)) activeElements.push(el);
        }
        function deactivateFire(el) {
            activeElements = activeElements.filter(e => e !== el);
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particlesArray = []; // reset
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 100; 
                this.speedX = Math.random() * 1.5 - 0.75;
                this.speedY = Math.random() * -1.5 - 0.8; 
                this.size = Math.random() * 4 + 1; 
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.life = Math.random() * 0.5 + 0.3; 
                this.decay = Math.random() * 0.005 + 0.001; 
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                this.speedX += (Math.random() * 0.2 - 0.1);
                if (this.speedX > 1.5) this.speedX = 1.5;
                if (this.speedX < -1.5) this.speedX = -1.5;
                
                if (this.speedY > 0) this.speedY = -1;
                
                this.size -= 0.005; 
                this.life -= this.decay;
                
                if(this.y < 0) this.life = 0; 
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, Math.max(this.size, 0), 0, Math.PI * 2);
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fillStyle = `rgba(${this.hexToRgb(this.color)}, ${Math.max(this.life, 0)})`;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            
            hexToRgb(hex) {
                let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? 
                    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
                    : '255, 255, 255';
            }
        }

        class FlameParticle {
            constructor(x, y, width) {
                this.x = x + Math.random() * width;
                this.y = y + (Math.random() * 15 - 5);
                this.size = Math.random() * 15 + 10;
                this.speedX = Math.random() * 1.5 - 0.75;
                this.speedY = Math.random() * -2 - 1.5; 
                this.color = flameColors[Math.floor(Math.random() * flameColors.length)];
                this.life = 1.0;
                this.decay = Math.random() * 0.05 + 0.02; 
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                this.speedX += (Math.random() * 0.4 - 0.2);
                if (this.speedX > 2) this.speedX = 2;
                if (this.speedX < -2) this.speedX = -2;
                
                if (this.speedY > 0) this.speedY = -1.5;
                
                this.size -= 0.3;
                if (this.size < 0) this.size = 0;
                this.life -= this.decay;
                if (this.life < 0) this.life = 0;
            }
            draw() {
                ctx.globalCompositeOperation = 'lighter';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                
                let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                grad.addColorStop(0, `rgba(${this.hexToRgb(this.color)}, ${this.life})`);
                grad.addColorStop(1, "transparent");
                
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }
            hexToRgb(hex) {
                let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 100, 0';
            }
        }

        function initParticles() {
            for (let i = 0; i < 60; i++) {
                let p = new Particle();
                p.y = Math.random() * canvas.height; 
                particlesArray.push(p);
            }
        }

        function handleParticles() {
            if (particlesArray.length < 80 && Math.random() < 0.2) {
                particlesArray.push(new Particle());
            }

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
                
                if (particlesArray[i].size <= 0.1 || particlesArray[i].life <= 0) {
                    particlesArray.splice(i, 1);
                    i--;
                }
            }
        }

        function handleInteractiveFire() {
            activeElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                for (let i = 0; i < 3; i++) {
                    interactiveParticlesArray.push(new FlameParticle(rect.left, rect.bottom - (rect.height * 0.3), rect.width));
                }
            });

            for (let i = 0; i < interactiveParticlesArray.length; i++) {
                interactiveParticlesArray[i].update();
                interactiveParticlesArray[i].draw();
                
                if (interactiveParticlesArray[i].size <= 0.1 || interactiveParticlesArray[i].life <= 0) {
                    interactiveParticlesArray.splice(i, 1);
                    i--;
                }
            }
        }

        function animateParticles() {
            // Transparent clear so CSS background is fully visible behind
            ctx.clearRect(0,0, canvas.width, canvas.height); 
            handleParticles();
            handleInteractiveFire();
            requestAnimationFrame(animateParticles);
        }
        initParticles();
        animateParticles();
    }
});

/* --- Global Lightbox Functions --- */
window.openLightbox = function(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg) {
        lightboxImg.src = imageSrc;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden'; // prevent scrolling behind
    }
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // restore scrolling
    }
};

// Close on outside click
window.addEventListener('click', function(event) {
    const lightbox = document.getElementById('lightbox');
    if (event.target === lightbox) {
        closeLightbox();
    }
});
