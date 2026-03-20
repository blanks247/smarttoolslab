/* =============================================
   SmartToolsLab — Shared JS Utilities
   ============================================= */

// ---- Tool Search ----
const TOOLS = [
  { name: 'Image Compressor', desc: 'Compress images to reduce file size', url: 'tools/image-compressor.html', icon: '🖼️' },
  { name: 'JSON Formatter', desc: 'Format and validate JSON instantly', url: 'tools/json-formatter.html', icon: '📋' },
  { name: 'Word Counter', desc: 'Count words, characters & reading time', url: 'tools/word-counter.html', icon: '📝' },
  { name: 'QR Code Generator', desc: 'Generate QR codes for any URL or text', url: 'tools/qr-generator.html', icon: '🔲' },
  { name: 'PDF Merge', desc: 'Merge multiple PDF files into one', url: 'tools/pdf-merge.html', icon: '📄' },
];

function initSearch() {
  const searchInput = document.getElementById('toolSearch');
  const suggBox = document.getElementById('searchSuggestions');
  if (!searchInput || !suggBox) return;

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) { suggBox.innerHTML = ''; suggBox.hidden = true; return; }
    const matches = TOOLS.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));
    if (!matches.length) { suggBox.innerHTML = ''; suggBox.hidden = true; return; }
    suggBox.innerHTML = matches.map(t =>
      `<a href="${t.url}" class="search-sugg-item">
        <span class="sugg-icon">${t.icon}</span>
        <span>
          <span class="sugg-name">${t.name}</span>
          <span class="sugg-desc">${t.desc}</span>
        </span>
      </a>`
    ).join('');
    suggBox.hidden = false;
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggBox.contains(e.target)) {
      suggBox.hidden = true;
    }
  });
}

// ---- Tool Card Search Filter (homepage) ----
function initCardFilter() {
  const searchInput = document.getElementById('toolSearch');
  const cards = document.querySelectorAll('.tool-card-wrap');
  if (!searchInput || !cards.length) return;

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = !q || text.includes(q) ? '' : 'none';
    });
  });
}

// ---- Scroll Reveal ----
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.tool-card, .feature-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ---- Toast ----
function showToast(msg, type = 'info') {
  const existing = document.getElementById('stl-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'stl-toast';
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
    padding: '14px 22px', borderRadius: '12px', fontSize: '0.875rem',
    fontWeight: '600', color: '#fff', maxWidth: '340px',
    background: type === 'success' ? '#00c896' : type === 'error' ? '#ff4d6d' : '#6C63FF',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    animation: 'fadeUp 0.3s ease',
    fontFamily: `'Inter', sans-serif`
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ---- Copy to clipboard ----
async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.style.background = 'var(--success)';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
    showToast('Copied to clipboard!', 'success');
  } catch {
    showToast('Failed to copy', 'error');
  }
}

// ---- Format file size ----
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// ---- Inject search suggestion styles ----
function injectSearchStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .hero-search { position: relative; }
    #searchSuggestions {
      position: absolute; top: calc(100% + 8px); left: 0; right: 0;
      background: #121829; border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px; overflow: hidden; z-index: 100;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .search-sugg-item {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 18px; transition: background 0.2s;
    }
    .search-sugg-item:hover { background: rgba(255,255,255,0.05); }
    .sugg-icon { font-size: 1.3rem; }
    .sugg-name { display: block; font-size: 0.9rem; font-weight: 600; color: #f0f0ff; }
    .sugg-desc { display: block; font-size: 0.78rem; color: #8892b0; margin-top: 1px; }
  `;
  document.head.appendChild(style);
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  injectSearchStyles();
  initSearch();
  initCardFilter();

  // Slight scroll delay for tool cards
  setTimeout(initScrollReveal, 100);
});
