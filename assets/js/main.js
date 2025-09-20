/**
* Template Name: Clinic
* Template URL: https://bootstrapmade.com/clinic-bootstrap-template/
* Updated: Jul 23 2025 with Bootstrap v5.3.7
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   * Enhanced for responsive topbar behavior
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  /**
   * Enhanced responsive topbar scroll behavior for mobile
   * Requirements: 1.4, 2.1, 3.1
   */
  function handleResponsiveTopbar() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    const topbar = document.querySelector('.header .topbar');
    
    if (!selectHeader || !topbar) return;
    
    // Check if we're on mobile viewport
    const isMobile = window.innerWidth <= 767;
    
    if (isMobile) {
      // On mobile, hide topbar when scrolling down, show when scrolling up
      let lastScrollTop = 0;
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
        // Scrolling down - hide topbar
        selectBody.classList.add('scrolled');
      } else if (currentScrollTop < lastScrollTop) {
        // Scrolling up - show topbar if near top
        if (currentScrollTop <= 100) {
          selectBody.classList.remove('scrolled');
        }
      }
      
      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    } else {
      // On tablet/desktop, use standard scroll behavior
      window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
    }
  }

  /**
   * Throttled scroll handler for better performance
   */
  let scrollTimeout;
  function throttledScrollHandler() {
    if (scrollTimeout) {
      return;
    }
    
    scrollTimeout = setTimeout(() => {
      toggleScrolled();
      handleResponsiveTopbar();
      scrollTimeout = null;
    }, 16); // ~60fps
  }

  document.addEventListener('scroll', throttledScrollHandler);
  window.addEventListener('load', () => {
    toggleScrolled();
    handleResponsiveTopbar();
  });

  /**
   * Handle viewport resize for responsive topbar
   */
  window.addEventListener('resize', () => {
    handleResponsiveTopbar();
  });

  /**
   * Enhanced Mobile Navigation with Accessibility Support
   * Requirements: 1.4, 3.2, 8.2
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('#navmenu');
  let focusableElements = [];
  let firstFocusableElement = null;
  let lastFocusableElement = null;

  function updateFocusableElements() {
    if (navMenu) {
      focusableElements = navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      firstFocusableElement = focusableElements[0];
      lastFocusableElement = focusableElements[focusableElements.length - 1];
    }
  }

  function mobileNavToggle() {
    const body = document.querySelector('body');
    const isActive = body.classList.contains('mobile-nav-active');
    
    if (isActive) {
      // Closing navigation
      body.classList.remove('mobile-nav-active');
      mobileNavToggleBtn.classList.remove('bi-x');
      mobileNavToggleBtn.classList.add('bi-list');
      mobileNavToggleBtn.setAttribute('aria-expanded', 'false');
      mobileNavToggleBtn.setAttribute('aria-label', 'Open navigation menu');
      
      // Remove focus trap
      document.removeEventListener('keydown', trapFocus);
      
      // Return focus to toggle button
      mobileNavToggleBtn.focus();
    } else {
      // Opening navigation
      body.classList.add('mobile-nav-active');
      mobileNavToggleBtn.classList.remove('bi-list');
      mobileNavToggleBtn.classList.add('bi-x');
      mobileNavToggleBtn.setAttribute('aria-expanded', 'true');
      mobileNavToggleBtn.setAttribute('aria-label', 'Close navigation menu');
      
      // Update focusable elements and set up focus trap
      updateFocusableElements();
      document.addEventListener('keydown', trapFocus);
      
      // Focus first navigation item
      setTimeout(() => {
        if (firstFocusableElement) {
          firstFocusableElement.focus();
        }
      }, 100);
    }
  }

  /**
   * Trap focus within mobile navigation for accessibility
   */
  function trapFocus(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement || document.activeElement === mobileNavToggleBtn) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableElement) {
          mobileNavToggleBtn.focus();
          e.preventDefault();
        }
      }
    }
    
    // Close navigation with Escape key
    if (e.key === 'Escape') {
      mobileNavToggle();
    }
  }

  /**
   * Initialize mobile navigation
   */
  if (mobileNavToggleBtn) {
    // Set initial ARIA attributes
    mobileNavToggleBtn.setAttribute('aria-expanded', 'false');
    mobileNavToggleBtn.setAttribute('aria-label', 'Open navigation menu');
    mobileNavToggleBtn.setAttribute('aria-controls', 'navmenu');
    
    // Add click event listener
    mobileNavToggleBtn.addEventListener('click', mobileNavToggle);
    
    // Add keyboard support for toggle button
    mobileNavToggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mobileNavToggle();
      }
    });
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navLink => {
    navLink.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToggle();
      }
    });
  });

  /**
   * Close mobile navigation when clicking overlay
   */
  document.addEventListener('click', (e) => {
    const isNavActive = document.querySelector('.mobile-nav-active');
    const navMenu = document.querySelector('.navmenu');
    const isClickInsideNav = navMenu && navMenu.contains(e.target);
    const isToggleButton = e.target.closest('.mobile-nav-toggle');
    
    if (isNavActive && !isClickInsideNav && !isToggleButton) {
      mobileNavToggle();
    }
  });

  /**
   * Handle viewport resize for mobile navigation
   */
  window.addEventListener('resize', () => {
    // Close mobile navigation if viewport becomes desktop size
    if (window.innerWidth >= 1200 && document.querySelector('.mobile-nav-active')) {
      mobileNavToggle();
    }
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  
})();  /**
  
 * Responsive Hero Image Loading and Optimization
   * Handles lazy loading, loading states, and performance optimization
   * Requirements: 1.3, 2.2, 7.4
   */
  function initResponsiveHeroImages() {
    // Handle lazy loading for hero images
    const heroImages = document.querySelectorAll('.hero-visual img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Add loading class for smooth transition
            img.classList.add('loading');
            
            // Handle image load event
            img.addEventListener('load', () => {
              img.classList.remove('loading');
              img.classList.add('loaded');
            });
            
            // Handle image error event
            img.addEventListener('error', () => {
              img.classList.remove('loading');
              img.classList.add('error');
              console.warn('Hero image failed to load:', img.src);
            });
            
            // Stop observing this image
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });
      
      heroImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      heroImages.forEach(img => {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
      });
    }
  }

  /**
   * Optimize hero visual elements for performance
   * Handles animation performance and responsive behavior
   */
  function optimizeHeroVisualElements() {
    const backgroundElements = document.querySelectorAll('.background-elements .element');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      backgroundElements.forEach(element => {
        element.style.animation = 'none';
      });
    }
    
    // Optimize floating card visibility based on viewport
    function updateFloatingCardVisibility() {
      const isMobile = window.innerWidth < 576;
      
      floatingCards.forEach(card => {
        if (isMobile) {
          // Hide complex floating cards on very small screens
          card.style.display = 'none';
        } else {
          card.style.display = 'block';
        }
      });
    }
    
    // Initial check
    updateFloatingCardVisibility();
    
    // Update on resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateFloatingCardVisibility, 150);
    });
  }

  /**
   * Handle responsive image srcset updates
   * Ensures optimal image loading based on device capabilities
   */
  function handleResponsiveImageSrcset() {
    const pictureElements = document.querySelectorAll('.hero-visual picture');
    
    pictureElements.forEach(picture => {
      const img = picture.querySelector('img');
      const sources = picture.querySelectorAll('source');
      
      if (!img || !sources.length) return;
      
      // Add responsive image loading attributes
      img.setAttribute('decoding', 'async');
      
      // Handle high DPI displays
      if (window.devicePixelRatio > 1) {
        sources.forEach(source => {
          const srcset = source.getAttribute('srcset');
          if (srcset && !srcset.includes('2x')) {
            // Could add 2x versions here if available
            // source.setAttribute('srcset', srcset + ', ' + srcset.replace('.jpg', '@2x.jpg') + ' 2x');
          }
        });
      }
    });
  }

  /**
   * Initialize all hero image optimizations
   */
  function initHeroImageOptimizations() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initResponsiveHeroImages();
        optimizeHeroVisualElements();
        handleResponsiveImageSrcset();
      });
    } else {
      initResponsiveHeroImages();
      optimizeHeroVisualElements();
      handleResponsiveImageSrcset();
    }
  }

  // Initialize hero image optimizations
  initHeroImageOptimizations();  /**
   
* Enhanced Hero Call-to-Action Functionality
   * Handles touch-friendly interactions, loading states, and accessibility
   * Requirements: 3.2, 3.3, 6.1
   */
  function initHeroCTAElements() {
    const ctaButtons = document.querySelectorAll('.hero-actions .btn');
    
    ctaButtons.forEach(button => {
      // Add ripple effect for better touch feedback
      button.addEventListener('click', function(e) {
        // Create ripple element
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        `;
        
        // Add ripple animation CSS if not already present
        if (!document.querySelector('#ripple-animation')) {
          const style = document.createElement('style');
          style.id = 'ripple-animation';
          style.textContent = `
            @keyframes ripple {
              to {
                transform: scale(4);
                opacity: 0;
              }
            }
          `;
          document.head.appendChild(style);
        }
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 600);
      });
      
      // Handle form submission with loading state
      if (button.closest('form')) {
        button.closest('form').addEventListener('submit', function(e) {
          button.classList.add('loading');
          button.disabled = true;
          
          // Re-enable after 3 seconds (adjust based on actual form processing time)
          setTimeout(() => {
            button.classList.remove('loading');
            button.disabled = false;
          }, 3000);
        });
      }
      
      // Enhanced keyboard navigation
      button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
      
      // Touch feedback for mobile devices
      if ('ontouchstart' in window) {
        button.addEventListener('touchstart', function() {
          this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('touchend', function() {
          this.style.transform = '';
        });
        
        button.addEventListener('touchcancel', function() {
          this.style.transform = '';
        });
      }
    });
  }

  /**
   * Handle responsive CTA layout adjustments
   * Optimizes button layout based on viewport size and content
   */
  function handleResponsiveCTALayout() {
    const heroActions = document.querySelector('.hero-actions');
    const ctaButtons = document.querySelectorAll('.hero-actions .btn');
    
    if (!heroActions || !ctaButtons.length) return;
    
    function adjustCTALayout() {
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth < 576;
      const isTablet = viewportWidth >= 576 && viewportWidth < 992;
      
      // Adjust button text for smaller screens
      ctaButtons.forEach(button => {
        const originalText = button.getAttribute('data-original-text') || button.textContent;
        button.setAttribute('data-original-text', originalText);
        
        if (isMobile && originalText.length > 20) {
          // Shorten text on mobile if too long
          const shortText = originalText.replace('Get Free ', '').replace('Consultation', 'Consult');
          button.textContent = shortText;
        } else {
          button.textContent = originalText;
        }
      });
      
      // Adjust spacing and layout
      if (isMobile) {
        heroActions.style.gap = 'var(--spacing-sm)';
        heroActions.style.flexDirection = 'column';
      } else if (isTablet) {
        heroActions.style.gap = 'var(--spacing-md)';
        heroActions.style.flexDirection = 'row';
        heroActions.style.flexWrap = 'wrap';
      } else {
        heroActions.style.gap = 'var(--spacing-lg)';
        heroActions.style.flexDirection = 'row';
        heroActions.style.flexWrap = 'nowrap';
      }
    }
    
    // Initial adjustment
    adjustCTALayout();
    
    // Adjust on resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(adjustCTALayout, 150);
    });
  }

  /**
   * Add analytics tracking for CTA interactions
   * Tracks button clicks and user engagement
   */
  function initCTAAnalytics() {
    const ctaButtons = document.querySelectorAll('.hero-actions .btn');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        const buttonText = this.textContent.trim();
        const buttonType = this.classList.contains('btn-primary') ? 'primary' : 'secondary';
        
        // Track with Google Analytics if available
        if (typeof gtag !== 'undefined') {
          gtag('event', 'cta_click', {
            'event_category': 'Hero Section',
            'event_label': buttonText,
            'button_type': buttonType,
            'viewport_width': window.innerWidth
          });
        }
        
        // Track with other analytics platforms as needed
        if (typeof fbq !== 'undefined') {
          fbq('track', 'Lead', {
            content_name: buttonText,
            content_category: 'Hero CTA'
          });
        }
        
        // Console log for debugging (remove in production)
        console.log('CTA clicked:', {
          text: buttonText,
          type: buttonType,
          viewport: window.innerWidth
        });
      });
    });
  }

  /**
   * Initialize all hero CTA enhancements
   */
  function initAllHeroCTAEnhancements() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initHeroCTAElements();
        handleResponsiveCTALayout();
        initCTAAnalytics();
      });
    } else {
      initHeroCTAElements();
      handleResponsiveCTALayout();
      initCTAAnalytics();
    }
  }

  // Initialize hero CTA enhancements
  initAllHeroCTAEnhancements();  /**

   * RESPONSIVE SPECIALTIES CAROUSEL CONFIGURATION
   * 
   * Task 4.3: Implements responsive Swiper carousel for medical specialties
   * Configures different slides per view based on screen size
   * Ensures touch-friendly navigation and proper spacing
   * 
   * Requirements addressed: 4.4, 6.2, 6.3
   */
  function initSpecialtiesCarousel() {
    const specialtiesSwiper = document.querySelector('.mySwiper');
    
    if (!specialtiesSwiper) return;
    
    // Initialize Swiper with responsive configuration
    const swiper = new Swiper('.mySwiper', {
      // Basic configuration
      loop: true,
      centeredSlides: false,
      spaceBetween: 20,
      grabCursor: true,
      
      // Responsive breakpoints - mobile first approach
      slidesPerView: 1, // Default for mobile (320px+)
      breakpoints: {
        // Small devices (576px and up) - 2 slides
        576: {
          slidesPerView: 2,
          spaceBetween: 25,
        },
        // Medium devices (768px and up) - 3 slides  
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        // Large devices (992px and up) - 4 slides
        992: {
          slidesPerView: 4,
          spaceBetween: 35,
        },
        // Extra large devices (1200px and up) - 5 slides
        1200: {
          slidesPerView: 5,
          spaceBetween: 40,
        },
        // Ultra-wide devices (1400px and up) - 6 slides
        1400: {
          slidesPerView: 6,
          spaceBetween: 45,
        }
      },
      
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      
      // Pagination dots
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 5,
      },
      
      // Autoplay configuration
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      
      // Touch and interaction settings
      touchRatio: 1,
      touchAngle: 45,
      simulateTouch: true,
      allowTouchMove: true,
      
      // Performance optimizations
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      
      // Accessibility
      a11y: {
        enabled: true,
        prevSlideMessage: 'Previous specialty',
        nextSlideMessage: 'Next specialty',
        firstSlideMessage: 'This is the first specialty',
        lastSlideMessage: 'This is the last specialty',
      },
      
      // Keyboard navigation
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      
      // Mouse wheel control (for desktop)
      mousewheel: {
        enabled: false, // Disabled by default to prevent accidental scrolling
      },
      
      // Speed and easing
      speed: 600,
      
      // Events for enhanced functionality
      on: {
        init: function() {
          // Add loaded class for CSS animations
          specialtiesSwiper.classList.add('swiper-loaded');
          
          // Pause autoplay if user prefers reduced motion
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.autoplay.stop();
          }
        },
        
        slideChange: function() {
          // Track slide changes for analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', 'specialty_carousel_slide', {
              'event_category': 'Specialties Section',
              'slide_index': this.activeIndex
            });
          }
        },
        
        touchStart: function() {
          // Pause autoplay on touch interaction
          this.autoplay.stop();
        },
        
        touchEnd: function() {
          // Resume autoplay after touch interaction
          setTimeout(() => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              this.autoplay.start();
            }
          }, 2000);
        },
        
        resize: function() {
          // Recalculate slides on window resize
          this.update();
        }
      }
    });
    
    // Handle reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addListener((e) => {
      if (e.matches) {
        swiper.autoplay.stop();
        swiper.allowTouchMove = true; // Still allow manual navigation
      } else {
        swiper.autoplay.start();
      }
    });
    
    // Pause autoplay when page is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        swiper.autoplay.stop();
      } else if (!mediaQuery.matches) {
        swiper.autoplay.start();
      }
    });
    
    // Enhanced touch feedback for mobile devices
    if ('ontouchstart' in window) {
      const slides = specialtiesSwiper.querySelectorAll('.swiper-slide');
      slides.forEach(slide => {
        slide.addEventListener('touchstart', function() {
          this.style.transform = 'scale(0.98)';
        });
        
        slide.addEventListener('touchend', function() {
          this.style.transform = '';
        });
      });
    }
    
    return swiper;
  }
  
  /**
   * Initialize specialties carousel when DOM is ready
   */
  function initSpecialtiesSection() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSpecialtiesCarousel);
    } else {
      initSpecialtiesCarousel();
    }
  }
  
  // Initialize the specialties carousel
  initSpecialtiesSection();

  /**
   * RESPONSIVE FORM ENHANCEMENTS AND MOBILE OPTIMIZATION
   * 
   * Task 6.1 & 6.2: Enhanced form validation, mobile keyboard support, and accessibility
   * Implements proper touch targets, input validation, and error handling
   * 
   * Requirements addressed: 2.3, 3.3, 8.1, 8.3, 8.4
   */
  function initResponsiveFormEnhancements() {
    const forms = document.querySelectorAll('#consultationForm, #contactForm');
    
    forms.forEach(form => {
      enhanceFormInputs(form);
      addFormValidation(form);
      addMobileKeyboardSupport(form);
      addAccessibilityFeatures(form);
      addFormSubmissionHandling(form);
    });
  }

  /**
   * Enhance form inputs with responsive features
   */
  function enhanceFormInputs(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Add mobile-optimized input types and attributes
      if (input.type === 'email') {
        input.setAttribute('autocomplete', 'email');
        input.setAttribute('autocapitalize', 'none');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('spellcheck', 'false');
      }
      
      if (input.type === 'tel') {
        input.setAttribute('autocomplete', 'tel');
        input.setAttribute('pattern', '[0-9+\\-\\s\\(\\)]*');
        input.setAttribute('inputmode', 'tel');
      }
      
      if (input.name === 'name') {
        input.setAttribute('autocomplete', 'name');
        input.setAttribute('autocapitalize', 'words');
      }
      
      // Add responsive placeholder behavior
      const originalPlaceholder = input.placeholder;
      
      function updatePlaceholder() {
        const isMobile = window.innerWidth < 768;
        if (isMobile && originalPlaceholder.length > 15) {
          // Shorten placeholders on mobile
          input.placeholder = originalPlaceholder.replace('Address', 'Email').replace('Number', '');
        } else {
          input.placeholder = originalPlaceholder;
        }
      }
      
      updatePlaceholder();
      window.addEventListener('resize', updatePlaceholder);
      
      // Add focus/blur animations
      input.addEventListener('focus', function() {
        this.parentElement.classList.add('input-focused');
        
        // Scroll input into view on mobile
        if (window.innerWidth < 768) {
          setTimeout(() => {
            this.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }, 300);
        }
      });
      
      input.addEventListener('blur', function() {
        this.parentElement.classList.remove('input-focused');
        
        // Validate on blur
        validateInput(this);
      });
      
      // Real-time validation for better UX
      input.addEventListener('input', function() {
        // Clear previous validation state
        clearValidationState(this);
        
        // Debounced validation
        clearTimeout(this.validationTimeout);
        this.validationTimeout = setTimeout(() => {
          validateInput(this);
        }, 500);
      });
    });
  }

  /**
   * Add comprehensive form validation
   */
  function addFormValidation(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      
      // Validate all required inputs
      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });
      
      if (isValid) {
        // Show loading state
        showFormLoading(submitButton);
        
        // Submit form (existing functionality)
        submitForm(form);
      } else {
        // Focus first invalid input
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
          
          // Scroll to first error on mobile
          if (window.innerWidth < 768) {
            firstInvalid.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }
        
        // Show error feedback
        showFormError('Please correct the highlighted fields and try again.');
      }
    });
  }

  /**
   * Validate individual input
   */
  function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = `${getFieldLabel(input)} is required.`;
    }
    
    // Email validation
    else if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
    }
    
    // Phone validation
    else if (input.type === 'tel' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
      if (cleanPhone.length < 10 || !phoneRegex.test(cleanPhone)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number.';
      }
    }
    
    // Text length validation
    else if (input.type === 'text' && value && value.length < 2) {
      isValid = false;
      errorMessage = `${getFieldLabel(input)} must be at least 2 characters.`;
    }
    
    // Update input state
    updateInputValidationState(input, isValid, errorMessage);
    
    return isValid;
  }

  /**
   * Update input validation visual state
   */
  function updateInputValidationState(input, isValid, errorMessage) {
    const container = input.parentElement;
    
    // Remove existing validation classes
    input.classList.remove('is-valid', 'is-invalid');
    
    // Remove existing feedback
    const existingFeedback = container.querySelector('.invalid-feedback, .valid-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }
    
    if (isValid && input.value.trim()) {
      input.classList.add('is-valid');
      
      const feedback = document.createElement('div');
      feedback.className = 'valid-feedback';
      feedback.textContent = '✓ Looks good!';
      container.appendChild(feedback);
    } else if (!isValid) {
      input.classList.add('is-invalid');
      
      const feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      feedback.textContent = errorMessage;
      container.appendChild(feedback);
    }
  }

  /**
   * Clear validation state
   */
  function clearValidationState(input) {
    input.classList.remove('is-valid', 'is-invalid');
    const feedback = input.parentElement.querySelector('.invalid-feedback, .valid-feedback');
    if (feedback) {
      feedback.remove();
    }
  }

  /**
   * Get user-friendly field label
   */
  function getFieldLabel(input) {
    return input.placeholder || input.name.charAt(0).toUpperCase() + input.name.slice(1);
  }

  /**
   * Add mobile keyboard support
   */
  function addMobileKeyboardSupport(form) {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach((input, index) => {
      // Add proper keyboard navigation
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && input.type !== 'textarea') {
          e.preventDefault();
          
          // Move to next input or submit
          const nextInput = inputs[index + 1];
          if (nextInput) {
            nextInput.focus();
          } else {
            form.querySelector('button[type="submit"]').click();
          }
        }
      });
      
      // Handle virtual keyboard on mobile
      if ('visualViewport' in window) {
        input.addEventListener('focus', function() {
          // Adjust layout when virtual keyboard appears
          setTimeout(() => {
            if (window.visualViewport.height < window.innerHeight * 0.75) {
              document.body.classList.add('keyboard-open');
            }
          }, 300);
        });
        
        input.addEventListener('blur', function() {
          // Reset layout when keyboard closes
          setTimeout(() => {
            document.body.classList.remove('keyboard-open');
          }, 300);
        });
      }
    });
  }

  /**
   * Add accessibility features
   */
  function addAccessibilityFeatures(form) {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      // Add ARIA labels if missing
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        input.setAttribute('aria-label', input.placeholder || input.name);
      }
      
      // Add ARIA describedby for validation messages
      input.addEventListener('invalid', function() {
        const feedback = this.parentElement.querySelector('.invalid-feedback');
        if (feedback) {
          const feedbackId = 'feedback-' + this.name;
          feedback.id = feedbackId;
          this.setAttribute('aria-describedby', feedbackId);
        }
      });
    });
    
    // Add form role and labels
    form.setAttribute('role', 'form');
    form.setAttribute('novalidate', 'true'); // Use custom validation
    
    // Announce form submission status to screen readers
    const statusRegion = document.createElement('div');
    statusRegion.setAttribute('aria-live', 'polite');
    statusRegion.setAttribute('aria-atomic', 'true');
    statusRegion.className = 'sr-only';
    statusRegion.id = 'form-status-' + form.id;
    form.appendChild(statusRegion);
  }

  /**
   * Enhanced form submission handling
   */
  function addFormSubmissionHandling(form) {
    const originalSubmitHandler = form.onsubmit;
    
    form.addEventListener('submit', function(e) {
      // Prevent double submission
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton.disabled) {
        e.preventDefault();
        return;
      }
      
      // Add loading state
      showFormLoading(submitButton);
      
      // Announce to screen readers
      const statusRegion = document.getElementById('form-status-' + form.id);
      if (statusRegion) {
        statusRegion.textContent = 'Submitting form, please wait...';
      }
    });
  }

  /**
   * Show form loading state
   */
  function showFormLoading(button) {
    const originalText = button.textContent;
    button.setAttribute('data-original-text', originalText);
    button.textContent = 'Submitting...';
    button.disabled = true;
    button.classList.add('loading');
    
    // Add loading spinner
    const spinner = document.createElement('span');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = '⟳';
    button.prepend(spinner);
  }

  /**
   * Hide form loading state
   */
  function hideFormLoading(button) {
    const originalText = button.getAttribute('data-original-text');
    if (originalText) {
      button.textContent = originalText;
    }
    button.disabled = false;
    button.classList.remove('loading');
    
    const spinner = button.querySelector('.loading-spinner');
    if (spinner) {
      spinner.remove();
    }
  }

  /**
   * Show form error message
   */
  function showFormError(message) {
    // Create or update error alert
    let errorAlert = document.querySelector('.form-error-alert');
    if (!errorAlert) {
      errorAlert = document.createElement('div');
      errorAlert.className = 'alert alert-danger form-error-alert';
      errorAlert.setAttribute('role', 'alert');
      
      // Insert at top of form
      const form = document.querySelector('form');
      form.insertBefore(errorAlert, form.firstChild);
    }
    
    errorAlert.textContent = message;
    errorAlert.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorAlert.style.display = 'none';
    }, 5000);
  }

  /**
   * Submit form with enhanced error handling
   */
  function submitForm(form) {
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => formObject[key] = value);
    
    fetch("https://script.google.com/macros/s/AKfycbxZ33rUqEUfdAsBaBX6Y29HzGV59QnPtkLh7g96zHoKnnOhsS48dEypB9RupijYb0eBXw/exec", {
      method: "POST",
      body: new URLSearchParams(formObject),
    })
    .then(response => {
      const submitButton = form.querySelector('button[type="submit"]');
      hideFormLoading(submitButton);
      
      if (response.ok) {
        // Show success modal
        const modal = document.getElementById('successModal');
        if (modal) {
          modal.style.display = 'flex';
          
          // Focus modal for accessibility
          const closeButton = modal.querySelector('#closeModal');
          if (closeButton) {
            closeButton.focus();
          }
        }
        
        // Announce success to screen readers
        const statusRegion = document.getElementById('form-status-' + form.id);
        if (statusRegion) {
          statusRegion.textContent = 'Form submitted successfully!';
        }
        
        // Reset form
        form.reset();
        
        // Clear validation states
        form.querySelectorAll('.is-valid, .is-invalid').forEach(input => {
          clearValidationState(input);
        });
        
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      console.error('Form submission error:', error);
      
      const submitButton = form.querySelector('button[type="submit"]');
      hideFormLoading(submitButton);
      
      showFormError('There was an error submitting your form. Please try again.');
      
      // Announce error to screen readers
      const statusRegion = document.getElementById('form-status-' + form.id);
      if (statusRegion) {
        statusRegion.textContent = 'Form submission failed. Please try again.';
      }
    });
  }

  /**
   * Initialize responsive form enhancements when DOM is ready
   */
  function initFormEnhancements() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initResponsiveFormEnhancements);
    } else {
      initResponsiveFormEnhancements();
    }
  }

  // Initialize form enhancements
  initFormEnhancements();

  /**
   * Enhanced Modal Accessibility and Keyboard Support
   * 
   * Adds proper focus management, keyboard navigation, and ARIA support
   * Requirements addressed: 8.1, 8.2, 8.4
   */
  function initModalAccessibility() {
    const modals = document.querySelectorAll('.modal-overlay');
    
    modals.forEach(modal => {
      // Add keyboard event listeners
      modal.addEventListener('keydown', handleModalKeydown);
      
      // Close modal when clicking overlay (not content)
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
      
      // Prevent content clicks from closing modal
      const modalBox = modal.querySelector('.modal-box');
      if (modalBox) {
        modalBox.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      }
    });
  }

  /**
   * Handle keyboard navigation in modals
   */
  function handleModalKeydown(e) {
    const modal = e.currentTarget;
    const isModalOpen = modal.getAttribute('aria-hidden') === 'false';
    
    if (!isModalOpen) return;
    
    // Close modal with Escape key
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal(modal);
      return;
    }
    
    // Trap focus within modal
    if (e.key === 'Tab') {
      trapModalFocus(e, modal);
    }
  }

  /**
   * Trap focus within modal for accessibility
   */
  function trapModalFocus(e, modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  /**
   * Close modal with proper cleanup
   */
  function closeModal(modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    
    // Return focus to the element that opened the modal
    const formId = modal.id.includes('consultation') ? 'consultationForm' : 'contactForm';
    const submitButton = document.querySelector(`#${formId} button[type="submit"]`);
    if (submitButton) {
      submitButton.focus();
    }
    
    // Reset associated form
    const form = document.getElementById(formId);
    if (form) {
      form.reset();
      
      // Clear validation states
      form.querySelectorAll('.is-valid, .is-invalid').forEach(input => {
        clearValidationState(input);
      });
    }
  }

  /**
   * Enhanced form submission with better error handling
   */
  function enhanceFormSubmissionHandling() {
    // Override existing form submission handlers with enhanced versions
    const consultationForm = document.getElementById('consultationForm');
    const contactForm = document.getElementById('contactForm');
    
    if (consultationForm) {
      enhanceFormSubmission(consultationForm);
    }
    
    if (contactForm) {
      enhanceFormSubmission(contactForm);
    }
  }

  /**
   * Enhance individual form submission
   */
  function enhanceFormSubmission(form) {
    // Remove existing event listeners by cloning the form
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Add enhanced submission handler
    newForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      if (!validateFormCompletely(newForm)) {
        return;
      }
      
      // Show loading state
      const submitButton = newForm.querySelector('button[type="submit"]');
      showFormLoading(submitButton);
      
      // Submit form
      submitFormWithEnhancedHandling(newForm);
    });
    
    // Re-add close modal handler
    const modalId = newForm.id === 'consultationForm' ? 'successModal' : 'successModal';
    const closeButton = document.getElementById('closeModal');
    if (closeButton) {
      closeButton.addEventListener('click', function() {
        const modal = document.getElementById(modalId);
        closeModal(modal);
      });
    }
  }

  /**
   * Validate entire form
   */
  function validateFormCompletely(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      // Focus first invalid input
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        
        // Scroll to error on mobile
        if (window.innerWidth < 768) {
          firstInvalid.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }
      
      // Show error message
      showFormError('Please correct the highlighted fields and try again.');
      
      // Announce error to screen readers
      announceToScreenReader('Form contains errors. Please review and correct the highlighted fields.');
    }
    
    return isValid;
  }

  /**
   * Submit form with enhanced error handling
   */
  function submitFormWithEnhancedHandling(form) {
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => formObject[key] = value);
    
    // Add timeout for better UX
    const timeoutId = setTimeout(() => {
      const submitButton = form.querySelector('button[type="submit"]');
      hideFormLoading(submitButton);
      showFormError('Request is taking longer than expected. Please try again.');
    }, 30000); // 30 second timeout
    
    fetch("https://script.google.com/macros/s/AKfycbxZ33rUqEUfdAsBaBX6Y29HzGV59QnPtkLh7g96zHoKnnOhsS48dEypB9RupijYb0eBXw/exec", {
      method: "POST",
      body: new URLSearchParams(formObject),
    })
    .then(response => {
      clearTimeout(timeoutId);
      const submitButton = form.querySelector('button[type="submit"]');
      hideFormLoading(submitButton);
      
      if (response.ok) {
        // Show success modal
        const modal = document.getElementById('successModal');
        if (modal) {
          modal.style.display = 'flex';
          modal.setAttribute('aria-hidden', 'false');
          
          // Focus close button for accessibility
          const closeButton = modal.querySelector('#closeModal');
          if (closeButton) {
            closeButton.focus();
          }
        }
        
        // Announce success
        announceToScreenReader('Form submitted successfully! We will contact you soon.');
        
        // Clear form
        form.reset();
        clearAllValidationStates(form);
        
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    })
    .catch(error => {
      clearTimeout(timeoutId);
      console.error('Form submission error:', error);
      
      const submitButton = form.querySelector('button[type="submit"]');
      hideFormLoading(submitButton);
      
      let errorMessage = 'There was an error submitting your form. Please try again.';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('HTTP 5')) {
        errorMessage = 'Server error. Please try again in a few minutes.';
      }
      
      showFormError(errorMessage);
      announceToScreenReader(`Form submission failed: ${errorMessage}`);
    });
  }

  /**
   * Clear all validation states from form
   */
  function clearAllValidationStates(form) {
    form.querySelectorAll('.is-valid, .is-invalid').forEach(input => {
      clearValidationState(input);
    });
  }

  /**
   * Announce message to screen readers
   */
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Initialize all modal and form enhancements
   */
  function initAllModalEnhancements() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initModalAccessibility();
        enhanceFormSubmissionHandling();
      });
    } else {
      initModalAccessibility();
      enhanceFormSubmissionHandling();
    }
  }

  // Initialize modal enhancements
  initAllModalEnhancements();

  /**
   * Responsive Image System with Lazy Loading
   * Requirements: 1.3, 7.4, 5.1
   */
  function initResponsiveImages() {
    // Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Handle picture elements
            if (img.tagName === 'IMG' && img.closest('picture')) {
              const picture = img.closest('picture');
              const sources = picture.querySelectorAll('source');
              
              sources.forEach(source => {
                if (source.dataset.srcset) {
                  source.srcset = source.dataset.srcset;
                  source.removeAttribute('data-srcset');
                }
              });
            }
            
            // Handle regular images
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            
            // Add loaded class for fade-in effect
            img.classList.add('loaded');
            
            // Stop observing this image
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe all images with loading="lazy"
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
      });
    }
    
    // Fallback for browsers without Intersection Observer
    else {
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }
        img.classList.add('loaded');
      });
    }
  }

  /**
   * Handle responsive image error states
   * Requirements: 5.2, 7.4, 1.3
   */
  function handleImageErrors() {
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function() {
        // Add error class for styling
        this.classList.add('img-error');
        
        // Try to load a fallback image if available
        if (this.dataset.fallback && this.src !== this.dataset.fallback) {
          this.src = this.dataset.fallback;
        }
        // If no fallback, ensure alt text is visible
        else if (this.alt) {
          this.style.position = 'relative';
          this.style.minHeight = '100px';
          this.style.backgroundColor = '#f8f9fa';
          this.style.border = '2px dashed #dee2e6';
        }
      });
      
      img.addEventListener('load', function() {
        this.classList.remove('img-error');
        this.classList.add('loaded');
      });
    });
  }

  /**
   * Optimize images for different viewport sizes
   * Requirements: 1.3, 2.2, 7.4
   */
  function optimizeImagesForViewport() {
    const updateImageSources = () => {
      const viewportWidth = window.innerWidth;
      
      // Update hero images based on viewport
      const heroImages = document.querySelectorAll('.hero .main-image picture');
      heroImages.forEach(picture => {
        const img = picture.querySelector('img');
        const sources = picture.querySelectorAll('source');
        
        // Ensure proper source selection based on viewport
        sources.forEach(source => {
          const media = source.getAttribute('media');
          if (media) {
            const mediaQuery = window.matchMedia(media);
            if (mediaQuery.matches && source.srcset) {
              // Force browser to re-evaluate source selection
              source.srcset = source.srcset;
            }
          }
        });
      });
      
      // Update service card images
      const serviceImages = document.querySelectorAll('.specialty-card img, .department-highlight img');
      serviceImages.forEach(img => {
        if (viewportWidth <= 576) {
          img.style.maxHeight = '60px';
        } else if (viewportWidth <= 768) {
          img.style.maxHeight = '80px';
        } else {
          img.style.maxHeight = '100px';
        }
      });
    };
    
    // Update on load and resize
    updateImageSources();
    window.addEventListener('resize', debounce(updateImageSources, 250));
  }

  /**
   * Debounce function for performance
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  } 
 /**
   * Initialize all responsive image enhancements
   */
  function initAllResponsiveImageEnhancements() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initResponsiveImages();
        handleImageErrors();
        optimizeImagesForViewport();
      });
    } else {
      initResponsiveImages();
      handleImageErrors();
      optimizeImagesForViewport();
    }
  }

  /**
   * Responsive Background Image System
   * Requirements: 5.2, 7.4, 1.3
   */
  function initResponsiveBackgrounds() {
    const responsiveBgs = document.querySelectorAll('.responsive-bg, .hero');
    
    responsiveBgs.forEach(element => {
      // Handle background image loading
      const bgImage = window.getComputedStyle(element).backgroundImage;
      
      if (bgImage && bgImage !== 'none') {
        // Create a new image to preload the background
        const img = new Image();
        
        img.onload = function() {
          element.classList.add('bg-loaded');
        };
        
        img.onerror = function() {
          element.classList.add('bg-error');
          // Apply fallback background
          element.style.backgroundColor = '#f8f9fa';
          element.style.backgroundImage = 'linear-gradient(135deg, rgba(23, 92, 221, 0.05) 0%, rgba(23, 92, 221, 0.02) 100%)';
        };
        
        // Extract URL from CSS background-image property
        const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (urlMatch) {
          img.src = urlMatch[1];
        }
      }
    });
  }

  /**
   * Optimize decorative visual elements for mobile usability
   * Requirements: 5.2, 1.3
   */
  function optimizeVisualElements() {
    const decorativeElements = document.querySelectorAll('.hero .background-elements .element');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    const handleViewportChange = () => {
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth <= 767;
      const isTablet = viewportWidth >= 768 && viewportWidth <= 991;
      
      // Optimize decorative elements
      decorativeElements.forEach(element => {
        if (isMobile) {
          element.style.display = 'none';
        } else if (isTablet) {
          element.style.display = 'block';
          element.style.opacity = '0.3';
          element.style.transform = 'scale(0.7)';
        } else {
          element.style.display = 'block';
          element.style.opacity = '0.7';
          element.style.transform = 'scale(1)';
        }
      });
      
      // Optimize floating cards for mobile
      floatingCards.forEach(card => {
        if (isMobile) {
          card.style.padding = '0.75rem';
          card.style.fontSize = '0.875rem';
        } else if (isTablet) {
          card.style.padding = '1rem';
          card.style.fontSize = '0.9rem';
        } else {
          card.style.padding = '1.5rem';
          card.style.fontSize = '1rem';
        }
      });
    };
    
    // Initial optimization
    handleViewportChange();
    
    // Update on resize
    window.addEventListener('resize', debounce(handleViewportChange, 250));
  }

  /**
   * Handle background image performance optimization
   * Requirements: 7.4, 5.1, 5.2
   */
  function optimizeBackgroundPerformance() {
    // Disable background-attachment: fixed on mobile for better performance
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      const style = document.createElement('style');
      style.textContent = `
        .responsive-bg {
          background-attachment: scroll !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Optimize background images based on connection speed
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        // Disable background images on very slow connections
        const style = document.createElement('style');
        style.textContent = `
          .responsive-bg {
            background-image: none !important;
            background-color: #f8f9fa !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }

  /**
   * Add intersection observer for background elements
   * Requirements: 5.1, 7.4
   */
  function initBackgroundIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const bgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('bg-visible');
            
            // Start animations for decorative elements
            const decorativeElements = entry.target.querySelectorAll('.background-elements .element');
            decorativeElements.forEach((element, index) => {
              setTimeout(() => {
                element.style.opacity = getComputedStyle(element).opacity;
                element.style.animation = element.style.animation || `float ${6 + index}s ease-in-out infinite`;
              }, index * 200);
            });
          } else {
            entry.target.classList.remove('bg-visible');
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });

      // Observe hero sections and other background elements
      document.querySelectorAll('.hero, .responsive-bg').forEach(element => {
        bgObserver.observe(element);
      });
    }
  }  /*
*
   * Initialize all responsive image and background enhancements
   */
  function initAllResponsiveImageAndBackgroundEnhancements() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initResponsiveImages();
        handleImageErrors();
        optimizeImagesForViewport();
        initResponsiveBackgrounds();
        optimizeVisualElements();
        optimizeBackgroundPerformance();
        initBackgroundIntersectionObserver();
      });
    } else {
      initResponsiveImages();
      handleImageErrors();
      optimizeImagesForViewport();
      initResponsiveBackgrounds();
      optimizeVisualElements();
      optimizeBackgroundPerformance();
      initBackgroundIntersectionObserver();
    }
  }

  // Initialize all responsive enhancements
  initAllResponsiveImageAndBackgroundEnhancements();

  /**
   * Enhanced Screen Reader Announcements for Responsive Design
   * Requirements: 8.1, 8.2, 8.4
   */
  
  // Create a live region for screen reader announcements
  function createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    return liveRegion;
  }

  // Announce viewport changes to screen readers
  function announceViewportChange() {
    const liveRegion = document.getElementById('live-region') || createLiveRegion();
    const width = window.innerWidth;
    let announcement = '';
    
    if (width <= 576) {
      announcement = 'Mobile view active. Navigation menu available via menu button.';
    } else if (width <= 768) {
      announcement = 'Tablet view active. Enhanced touch navigation available.';
    } else if (width <= 1200) {
      announcement = 'Desktop view active. Full navigation menu visible.';
    } else {
      announcement = 'Large screen view active. Optimized layout displayed.';
    }
    
    liveRegion.textContent = announcement;
  }

  // Announce navigation state changes
  function announceNavigationState(isOpen) {
    const liveRegion = document.getElementById('live-region') || createLiveRegion();
    const announcement = isOpen ? 
      'Navigation menu opened. Use Tab to navigate, Escape to close.' : 
      'Navigation menu closed.';
    liveRegion.textContent = announcement;
  }

  // Enhanced mobile navigation with screen reader support
  function enhancedMobileNavToggle() {
    const body = document.querySelector('body');
    const isActive = body.classList.contains('mobile-nav-active');
    
    // Call original toggle function
    mobileNavToggle();
    
    // Announce state change to screen readers
    announceNavigationState(!isActive);
  }

  // Update mobile navigation toggle to use enhanced version
  if (mobileNavToggleBtn) {
    // Remove existing event listener and add enhanced one
    mobileNavToggleBtn.removeEventListener('click', mobileNavToggle);
    mobileNavToggleBtn.addEventListener('click', enhancedMobileNavToggle);
  }

  // Announce viewport changes on resize with debouncing
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      announceViewportChange();
    }, 500); // Debounce to avoid too many announcements
  });

  // Initialize live region on page load
  document.addEventListener('DOMContentLoaded', () => {
    createLiveRegion();
    
    // Announce initial viewport state
    setTimeout(() => {
      announceViewportChange();
    }, 1000); // Delay to avoid conflicting with page load announcements
  });

  /**
   * Keyboard Navigation Enhancements
   * Requirements: 8.2, 8.3
   */
  
  // Track if user is navigating with keyboard
  let isKeyboardUser = false;
  
  // Detect keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isKeyboardUser = true;
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  // Detect mouse navigation
  document.addEventListener('mousedown', () => {
    isKeyboardUser = false;
    document.body.classList.remove('keyboard-navigation');
  });

  /**
   * Enhanced Focus Management for Responsive Components
   */
  
  // Manage focus for responsive image carousels
  function manageFocusForCarousel() {
    const carousels = document.querySelectorAll('.swiper');
    
    carousels.forEach(carousel => {
      const slides = carousel.querySelectorAll('.swiper-slide');
      const prevButton = carousel.querySelector('.swiper-button-prev');
      const nextButton = carousel.querySelector('.swiper-button-next');
      
      // Add ARIA labels for carousel navigation
      if (prevButton) {
        prevButton.setAttribute('aria-label', 'Previous slide');
        prevButton.setAttribute('role', 'button');
      }
      
      if (nextButton) {
        nextButton.setAttribute('aria-label', 'Next slide');
        nextButton.setAttribute('role', 'button');
      }
      
      // Add slide information for screen readers
      slides.forEach((slide, index) => {
        slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
        slide.setAttribute('role', 'group');
      });
    });
  }

  // Enhanced form accessibility
  function enhanceFormAccessibility() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        // Ensure proper labeling
        const label = form.querySelector(`label[for="${input.id}"]`);
        if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
          // Add aria-label based on placeholder or name
          const placeholder = input.getAttribute('placeholder');
          const name = input.getAttribute('name');
          if (placeholder) {
            input.setAttribute('aria-label', placeholder);
          } else if (name) {
            input.setAttribute('aria-label', name.replace(/([A-Z])/g, ' $1').toLowerCase());
          }
        }
        
        // Add required field announcements
        if (input.hasAttribute('required')) {
          const currentLabel = input.getAttribute('aria-label') || '';
          input.setAttribute('aria-label', `${currentLabel} (required)`.trim());
        }
      });
    });
  }

  // Initialize accessibility enhancements
  document.addEventListener('DOMContentLoaded', () => {
    manageFocusForCarousel();
    enhanceFormAccessibility();
  });

  /**
   * Responsive Image Loading with Accessibility
   */
  function enhanceImageAccessibility() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Add loading error handling
      img.addEventListener('error', function() {
        const fallback = this.getAttribute('data-fallback');
        if (fallback && this.src !== fallback) {
          this.src = fallback;
        } else {
          // Add descriptive alt text for broken images
          this.alt = this.alt || 'Image could not be loaded';
          this.style.display = 'none';
          
          // Create text replacement
          const textReplacement = document.createElement('span');
          textReplacement.textContent = this.alt;
          textReplacement.className = 'image-fallback';
          textReplacement.style.cssText = 'display: inline-block; padding: 1rem; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; color: #6c757d;';
          this.parentNode.insertBefore(textReplacement, this.nextSibling);
        }
      });
      
      // Enhance lazy loading accessibility
      if (img.hasAttribute('loading') && img.getAttribute('loading') === 'lazy') {
        img.setAttribute('aria-label', (img.alt || 'Image') + ' (loading)');
        
        // Update aria-label when image loads
        img.addEventListener('load', function() {
          this.setAttribute('aria-label', this.alt || 'Image');
        });
      }
    });
  }

  // Initialize image accessibility enhancements
  document.addEventListener('DOMContentLoaded', enhanceImageAccessibility);