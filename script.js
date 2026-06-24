// Interactivity: menu toggle, smooth scroll, reveal on scroll, card tilt
(function(){
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  // Menu toggle for small screens
  if (menuToggle && navLinks){
    menuToggle.addEventListener('click', () => {
      const active = menuToggle.classList.toggle('active');
      // toggle nav links display for small screens
      if (window.innerWidth < 900) navLinks.style.display = active ? 'flex' : 'none';
      menuToggle.setAttribute('aria-expanded', active ? 'true' : 'false');
    });

    // close when link clicked (mobile)
    navLinks.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', () => {
        if (window.innerWidth < 900){
          navLinks.style.display = 'none';
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Initialize: Hide all sections except home on load
  function initializeSections(){
    const allSections = document.querySelectorAll('.section');
    const homeSection = document.getElementById('home');
    
    allSections.forEach(section => {
      if (section.id === 'home') {
        section.classList.add('reveal');
        section.classList.remove('hidden');
        section.style.display = 'block';
      } else {
        section.classList.remove('reveal');
        section.classList.add('hidden');
        section.style.display = 'none';
      }
    });
  }

  // Show section and hide others
  function showSection(sectionId){
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
      if (section.id === sectionId) {
        section.classList.add('reveal');
        section.classList.remove('hidden');
        section.style.display = 'block';
        section.style.pointerEvents = 'auto';
      } else {
        section.classList.remove('reveal');
        section.classList.add('hidden');
        section.style.display = 'none';
        section.style.pointerEvents = 'none';
      }
    });
  }

  // Smooth scroll for anchor links with section toggle
  document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if (href.length > 1 && document.querySelector(href)){
        e.preventDefault();
        
        // Extract section id from href
        const sectionId = href.substring(1); // remove # prefix
        showSection(sectionId);
        
        // Smooth scroll to section
        setTimeout(() => {
          document.querySelector(href).scrollIntoView({behavior:'smooth',block:'start'});
        }, 50);
      }
    });
  });

  // Reveal on scroll using IntersectionObserver
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced){
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting){
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
    document.querySelectorAll('.section, .hero, .card').forEach(el=>observer.observe(el));
  } else {
    // if reduced motion, just show them
    document.querySelectorAll('.section, .hero, .card').forEach(el=>el.classList.add('reveal'));
  }

  // Card tilt effect (mouse)
  function enableTilt(){
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card=>{
      card.addEventListener('mousemove', handleTilt);
      card.addEventListener('mouseleave', resetTilt);
      card.addEventListener('focus', ()=>card.classList.add('tilt-focus'));
      card.addEventListener('blur', ()=>card.classList.remove('tilt-focus'));
    });
    function handleTilt(e){
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = ( (y - 0.5) * 8 ).toFixed(2);
      const rotateY = ( (x - 0.5) * -12 ).toFixed(2);
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
      card.style.boxShadow = `0 30px 80px rgba(2,6,23,0.6)`;
    }
    function resetTilt(e){
      const card = e.currentTarget;
      card.style.transform = '';
      card.style.boxShadow = '';
    }
  }

  if (!prefersReduced) enableTilt();

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initializeSections();
  });
})();
