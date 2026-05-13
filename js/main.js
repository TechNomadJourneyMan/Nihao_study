/* ============================================================
   NIHAO STUDY — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll ---------- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ---------- Mobile burger ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq__answer');
      const isOpen = btn.classList.contains('active');

      document.querySelectorAll('.faq__question').forEach(q => {
        q.classList.remove('active');
        q.parentElement.querySelector('.faq__answer').classList.remove('open');
      });

      if (!isOpen) {
        btn.classList.add('active');
        answer.classList.add('open');
      }
    });
  });

  /* ---------- Quiz ---------- */
  let quizAnswers = [];

  document.querySelectorAll('.quiz__option').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.closest('.quiz__step');
      const nextStep = btn.dataset.next;
      quizAnswers.push(btn.textContent.trim());

      if (btn.classList.contains('quiz__option--final')) {
        step.classList.remove('active');
        const result = document.getElementById('quiz-result');
        result.classList.add('visible');
        document.querySelectorAll('.quiz__step').forEach(s => s.classList.remove('active'));
        return;
      }

      if (nextStep) {
        step.classList.remove('active');
        const next = document.querySelector(`[data-step="${nextStep}"]`);
        if (next) next.classList.add('active');
      }
    });
  });

  const quizForm = document.getElementById('quiz-form');
  if (quizForm) {
    quizForm.addEventListener('submit', e => {
      e.preventDefault();
      showSuccessModal();
      quizForm.reset();
    });
  }

  /* ---------- Contact form → Google Sheets ---------- */
  const SHEETS_WEBHOOK = 'https://script.google.com/macros/s/AKfycbxws_uMQCLJNb_KLyYhxGM-joJ-AVLuEYUi0_kBz1rQiYhisxsqjBSrjtmUorTXLIbfDw/exec';

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type=submit]');
      btn.disabled = true;

      const payload = {
        name:      (document.getElementById('form-name')    || {}).value || '',
        phone:     (document.getElementById('form-phone')   || {}).value || '',
        status:    (document.getElementById('form-status')  || {}).value || '',
        package:   (document.getElementById('contact-package') || {}).value || '',
        source:    'nihao-study-website',
        timestamp: new Date().toISOString(),
      };

      if (SHEETS_WEBHOOK && SHEETS_WEBHOOK !== 'REPLACE_WITH_YOUR_APPS_SCRIPT_URL') {
        try {
          const url = new URL(SHEETS_WEBHOOK);
          Object.entries(payload).forEach(([k, v]) => url.searchParams.append(k, v));
          await fetch(url.toString(), { method: 'GET', mode: 'no-cors' });
        } catch (err) {
          console.warn('Sheets webhook error:', err);
        }
      }

      showSuccessModal();
      contactForm.reset();
      btn.disabled = false;
    });
  }

  /* ---------- Success modal ---------- */
  const modal = document.getElementById('success-modal');
  const modalClose = document.getElementById('modal-close');

  function showSuccessModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.querySelector('.modal__backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(
    '.why-card, .problem__card, .service-card, .uni-card, .case-card, .testimonial, .visual__card, .process__step'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Particles in hero ---------- */
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 8 + 4;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 12 + 10}s;
        animation-delay: ${Math.random() * 10}s;
        opacity: ${Math.random() * 0.4 + 0.1};
      `;
      particlesContainer.appendChild(p);
    }
  }

  /* ---------- Animate hero stats ---------- */
  function animateCount(el, target, suffix) {
    let start = 0;
    const duration = 1800;
    const step = timestamp => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat__num');
        nums.forEach(n => {
          const text = n.textContent.trim();
          const match = text.match(/^(\d+)(.*)$/);
          if (match) animateCount(n, parseInt(match[1]), match[2]);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) statsObserver.observe(heroStats);

});
