/* ===================================
   Nicolas Le Roho - Main JavaScript
   Plomberie • Électricité • Chauffage
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // Header Scroll Effect
  // ===================================
  const header = document.getElementById('header');
  
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll);
  
  // ===================================
  // Mobile Menu Toggle
  // ===================================
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
  
  // ===================================
  // Smooth Scroll for Anchor Links
  // ===================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ===================================
  // Scroll Reveal Animations
  // ===================================
  const revealElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  
  const revealOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  };
  
  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
  
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
  
  // ===================================
  // Staggered Animation for Service Cards
  // ===================================
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });
  
  // ===================================
  // Contact Form Handling (via FormSubmit.co)
  // ===================================
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function() {
      // Show loading state on submit button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="btn-spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Envoi en cours...
        `;
      }
      // The form submits natively to FormSubmit.co
    });
  }
  
  // ===================================
  // Hero Stats Counter Animation
  // ===================================
  const statsSection = document.querySelector('.hero-stats');
  let statsAnimated = false;
  
  function animateValue(element, start, end, duration, suffix = '') {
    const startTimestamp = performance.now();
    
    function step(timestamp) {
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    
    requestAnimationFrame(step);
  }
  
  function checkStatsVisibility() {
    if (statsAnimated || !statsSection) return;
    
    const rect = statsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
      statsAnimated = true;
      
      const stats = statsSection.querySelectorAll('.stat-value');
      stats.forEach(stat => {
        const text = stat.textContent;
        const match = text.match(/(\d+)/);
        
        if (match) {
          const number = parseInt(match[1]);
          const suffix = text.replace(number, '');
          animateValue(stat, 0, number, 1500, suffix);
        }
      });
    }
  }
  
  window.addEventListener('scroll', checkStatsVisibility);
  checkStatsVisibility(); // Check on load
  
  // ===================================
  // Add hover effect to interactive elements
  // ===================================
  const interactiveElements = document.querySelectorAll('.btn, .service-card, .nav-link');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.style.transform = this.style.transform || '';
    });
  });
  
  // ===================================
  // Parallax effect for hero background
  // ===================================
  const heroSection = document.querySelector('.hero');
  
  if (heroSection) {
    window.addEventListener('scroll', function() {
      const scrolled = window.scrollY;
      const heroHeight = heroSection.offsetHeight;
      
      if (scrolled < heroHeight) {
        const parallaxValue = scrolled * 0.3;
        heroSection.style.setProperty('--parallax-offset', `${parallaxValue}px`);
      }
    });
  }
  
  // ===================================
  // Specialization Cards Automatic Slideshow & Lightbox Modal
  // ===================================
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxTitle = document.getElementById('lightboxTitle');

  // Automatic slideshow rotation for each card
  portfolioCards.forEach((card, cardIndex) => {
    let images = Array.from(card.querySelectorAll('.slide-img'));
    let dots = Array.from(card.querySelectorAll('.slideshow-dots .dot'));

    // Handle missing or broken images gracefully
    images.forEach(img => {
      img.onerror = function() {
        img.remove();
        // Update valid images and dots count
        const validImages = Array.from(card.querySelectorAll('.slide-img'));
        const dotsContainer = card.querySelector('.slideshow-dots');
        if (dotsContainer) {
          dotsContainer.innerHTML = validImages.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}"></span>`).join('');
        }
      };
    });

    if (images.length <= 1) return;

    let currentIndex = 0;

    // Stagger start times so cards don't all flip at the exact same instant
    setTimeout(() => {
      setInterval(() => {
        const validImages = Array.from(card.querySelectorAll('.slide-img')).filter(img => img.naturalWidth !== 0 || !img.complete);
        const validDots = Array.from(card.querySelectorAll('.slideshow-dots .dot'));

        if (validImages.length <= 1) return;

        if (validImages[currentIndex]) validImages[currentIndex].classList.remove('active');
        if (validDots[currentIndex]) validDots[currentIndex].classList.remove('active');

        currentIndex = (currentIndex + 1) % validImages.length;

        if (validImages[currentIndex]) validImages[currentIndex].classList.add('active');
        if (validDots[currentIndex]) validDots[currentIndex].classList.add('active');
      }, 3800);
    }, cardIndex * 900);
  });

  // Lightbox opens the currently visible (active) image
  portfolioCards.forEach(card => {
    card.addEventListener('click', function() {
      const activeImg = this.querySelector('.slide-img.active') || this.querySelector('img');
      const tag = this.querySelector('.portfolio-tag');
      const title = this.querySelector('h3');

      if (activeImg && lightboxModal) {
        lightboxImg.src = activeImg.src;
        lightboxImg.alt = activeImg.alt;
        lightboxTag.textContent = tag ? tag.textContent : '';
        lightboxTitle.textContent = title ? title.textContent : '';

        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  console.log('🔧 Nicolas Le Roho - Site initialisé avec succès');
});
