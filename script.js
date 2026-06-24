// Interactivity: menu toggle, SPA routing, card tilt
(function(){
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = navLinks ? navLinks.querySelectorAll('a') : [];

  // Menu toggle for small screens
  if (menuToggle && navLinks){
    menuToggle.addEventListener('click', () => {
      const active = menuToggle.classList.toggle('active');
      if (window.innerWidth < 900) navLinks.style.display = active ? 'flex' : 'none';
      menuToggle.setAttribute('aria-expanded', active ? 'true' : 'false');
    });

    // Close menu when a link is clicked (mobile)
    links.forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth < 900){
          navLinks.style.display = 'none';
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // --- SPA ROUTER LOGIC ---

  // Update style navigasi yang sedang aktif
  function updateActiveNav(sectionId) {
    links.forEach(link => {
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Menampilkan section yang dipilih dengan animasi transisi
  function showSection(sectionId){
    const allSections = document.querySelectorAll('.section');
    let sectionFound = false;

    allSections.forEach(section => {
      if (section.id === sectionId) {
        // Hero section butuh display 'flex', section biasa butuh 'block'
        section.style.display = 'block';
        
        // Jeda sebentar agar transisi CSS terbaca oleh browser
        setTimeout(() => {
          section.classList.add('reveal');
          section.classList.remove('hidden');
        }, 10);
        
        section.style.pointerEvents = 'auto';
        sectionFound = true;
      } else {
        section.classList.remove('reveal');
        section.classList.add('hidden');
        section.style.pointerEvents = 'none';
        
        // Sembunyikan sepenuhnya setelah animasi selesai
        setTimeout(() => {
          if (section.classList.contains('hidden')) {
            section.style.display = 'none';
          }
        }, 250); // Sesuaikan dengan waktu transisi di CSS (250ms)
      }
    });

    // Fallback ke home jika URL hash tidak valid
    if (!sectionFound && sectionId !== 'home') {
      window.location.hash = 'home';
    }
  }

  // Handle pergantian hash URL (Tombol navigasi & back/forward browser)
  window.addEventListener('hashchange', () => {
    const sectionId = window.location.hash.substring(1) || 'home';
    showSection(sectionId);
    updateActiveNav(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Reset scroll ke atas tiap pindah halaman
  });

  // --- END SPA ROUTER ---

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

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) enableTilt();

  // Run on DOM ready (Inisialisasi halaman pertama saat web dibuka)
  document.addEventListener('DOMContentLoaded', () => {
    const initialSection = window.location.hash.substring(1) || 'home';
    showSection(initialSection);
    updateActiveNav(initialSection);
  });
})();
