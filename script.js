//Logica de programacion en JS vanilla (no usar librerias externas), no agregar estilos en JS usar clases dinamicos.

// Theme toggle and simple reveal animations
document.addEventListener('DOMContentLoaded', function() {
  const body = document.body;
  const toggle = document.getElementById('toggleTheme');
  // Initialize theme based on localStorage if available
  const saved = localStorage.getItem('theme');
  if (saved) {
    body.setAttribute('data-theme', saved);
  }
  toggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // Frame viewer elements
  const frameModal = document.getElementById('frameModal');
  const frameInner = document.getElementById('frameInner');
  const milestones = Array.from(document.querySelectorAll('.milestone'));

  // Track currently opened frame index
  let currentOpenIdx = -1;
  // Frame open/close handlers (event delegation for future milestones)
  document.addEventListener('click', function(event) {
    const btn = event.target.closest('.open-frame');
    if (btn) {
      const idx = parseInt(btn.dataset.idx, 10);
      if (frameModal.classList.contains('active') && currentOpenIdx === idx) {
        closeFrame();
      } else {
        openFrame(idx);
        currentOpenIdx = idx;
      }
      return;
    }
    if (event.target.closest('.frame-close') || event.target === frameModal) {
      closeFrame();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeFrame();
  });

  // Simple reveal on scroll
  const items = document.querySelectorAll('.milestone');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => observer.observe(el));

  function openFrame(idx) {
    if (!milestones[idx]) return;
    const milestone = milestones[idx];
    // Clone the inner structure but strip any interactive buttons inside
    const fig = milestone.querySelector('.milestone-figure');
    const inner = fig.cloneNode(true);
    const innerBtn = inner.querySelector('.open-frame');
    if (innerBtn) innerBtn.remove();
    frameInner.innerHTML = '<div class="frame-card">' + inner.outerHTML + '</div>';
    frameModal.classList.add('active');
    // Update trigger button text to indicate close action
    const triggerBtn = document.querySelector(`.open-frame[data-idx="${idx}"]`);
    if (triggerBtn) triggerBtn.textContent = 'Cerrar';
  }
  function closeFrame() {
    frameModal.classList.remove('active');
    frameInner.innerHTML = '';
    currentOpenIdx = -1;
    // Reset all trigger buttons text
    document.querySelectorAll('.open-frame').forEach((b) => {
      b.textContent = 'Ver en marco';
    });
  }
});
