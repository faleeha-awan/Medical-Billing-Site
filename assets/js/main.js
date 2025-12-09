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
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

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

  // ---------- Chat UI wiring ----------
(function () {
  const WORKER_URL = "https://billsuremd-chatbot-backend.faleehaawan310.workers.dev"; // <-- your worker

  const btn = document.getElementById("chatbot-btn");
  const box = document.getElementById("chatbot-box");
  const closeBtn = document.getElementById("chatbot-close");
  const sendBtn = document.getElementById("chat-send");
  const input = document.getElementById("chat-input");
  const body = document.getElementById("chat-body");

  btn.addEventListener("click", () => box.style.display = "flex");
  closeBtn.addEventListener("click", () => box.style.display = "none");

  // FAQ buttons
  document.querySelectorAll(".faq-btn").forEach(el => {
    el.addEventListener("click", () => {
      const text = el.textContent.trim();
      addUserMessage(text);
      // call worker so hybrid logic uses prewritten reply
      sendToWorker(text);
    });
  });

  sendBtn.addEventListener("click", () => send());
  input.addEventListener("keypress", (e) => { if (e.key === "Enter") send(); });

  function addUserMessage(msg){
    const d = document.createElement("div"); d.className = "user-msg"; d.textContent = msg; body.appendChild(d); body.scrollTop = body.scrollHeight;
  }
  function addBotMessage(msg){
    const d = document.createElement("div"); d.className = "bot-msg"; d.textContent = msg; body.appendChild(d); body.scrollTop = body.scrollHeight;
  }
  function replaceLastBotMessage(msg){
    const nodes = body.querySelectorAll(".bot-msg");
    if (nodes.length) nodes[nodes.length - 1].textContent = msg;
  }

  function send(){
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = "";
    // show typing line
    addBotMessage("Typing...");
    sendToWorker(text);
  }

  async function sendToWorker(message){
    try {
      const WORKER_URL = "https://billsuremd-chatbot-backend.faleehaawan310.workers.dev";
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      if (data.error) {
        replaceLastBotMessage("Sorry, an error occurred.");
        console.error("Worker error:", data);
        return;
      }

      // If the worker returned prewritten reply
      if (data.source === "prewritten") {
        replaceLastBotMessage(data.reply);
        return;
      }

      // AI reply
      if (data.reply) {
        replaceLastBotMessage(data.reply);
        return;
      }

      replaceLastBotMessage("No response.");
    } catch (err) {
      replaceLastBotMessage("Network error.");
      console.error(err);
    }
  }
})();



  
})();