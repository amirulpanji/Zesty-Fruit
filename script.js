// ===== DATA PRODUK =====
const products = [
  // --- KATEGORI BUAH (Porsi Potongan per porsi salad) ---
  { id: 1, name: 'Potongan Pir', emoji: '🍐', unit: '50g', price: 2500, original: null, category: 'buah', badge: null, isNew: false },
  { id: 2, name: 'Potongan Nanas', emoji: '🍍', unit: '50g', price: 2000, original: null, category: 'buah', badge: null, isNew: false },
  { id: 3, name: 'Stroberi Fresh', emoji: '🍓', unit: '3 pcs', price: 4500, original: 6000, category: 'buah', badge: 'Diskon', isNew: false },
  { id: 4, name: 'Apel Fuji Slice', emoji: '🍎', unit: '50g', price: 3000, original: null, category: 'buah', badge: null, isNew: false },
  { id: 5, name: 'Mangga Manis', emoji: '🥭', unit: '50g', price: 3500, original: null, category: 'buah', badge: 'Musiman', isNew: false },
  { id: 6, name: 'Blueberry', emoji: '🫐', unit: '5 pcs', price: 5000, original: 7000, category: 'buah', badge: 'Diskon', isNew: false },
  { id: 7, name: 'Semangka Merah', emoji: '🍉', unit: '60g', price: 1500, original: null, category: 'buah', badge: null, isNew: true },
  { id: 8, name: 'Kiwi Green Slice', emoji: '🥝', unit: '30g', price: 4000, original: null, category: 'buah', badge: null, isNew: false },
  { id: 9, name: 'Jeruk Kupas', emoji: '🍊', unit: '30g', price: 2500, original: null, category: 'buah', badge: null, isNew: false },
  { id: 10, name: 'Melon Hijau', emoji: '🍈', unit: '50g', price: 2000, original: null, category: 'buah', badge: null, isNew: false },
  { id: 11, name: 'Anggur Merah', emoji: '🍇', unit: '3 pcs', price: 3000, original: null, category: 'buah', badge: null, isNew: false },

  // --- KATEGORI SAUS & TOPPING (Takaran 1 cup kecil) ---
  { id: 12, name: 'Saus Creamy Susu', emoji: '🥛', unit: '35 ml', price: 3000, original: 4500, category: 'saus', badge: 'Best Seller', isNew: false },
  { id: 13, name: 'Yogurt Dressing', emoji: '🥣', unit: '35 ml', price: 4000, original: null, category: 'saus', badge: null, isNew: true },
  { id: 14, name: 'Madu Murni', emoji: '🍯', unit: '15 ml', price: 3500, original: null, category: 'saus', badge: null, isNew: false },
  { id: 15, name: 'Keju Cheddar Parut', emoji: '🧀', unit: '20g', price: 3000, original: null, category: 'saus', badge: null, isNew: false },
  { id: 16, name: 'Granola Crunch', emoji: '🌾', unit: '15g', price: 2500, original: null, category: 'saus', badge: null, isNew: true },

  // --- KATEGORI MINUMAN (Gelas Personal 250ml) ---
  { id: 17, name: 'Infused Water', emoji: '💧', unit: '250 ml', price: 5000, original: null, category: 'minuman', badge: null, isNew: false },
  { id: 18, name: 'Jus Jeruk Peras', emoji: '🍊', unit: '250 ml', price: 12000, original: 15000, category: 'minuman', badge: 'Diskon', isNew: false },
  { id: 19, name: 'Smoothie Berry', emoji: '🧃', unit: '250 ml', price: 15000, original: null, category: 'minuman', badge: null, isNew: true },
];

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('zesty_cart') || '[]');
let currentCategory = 'semua';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);
  updateCartUI();
  observeScrollAnimations();
  handleNavbarScroll();
});

// ===== RENDER PRODUCTS =====
function renderProducts(list) {
  const grid = document.getElementById('product-grid');
  if (!list.length) {
    grid.innerHTML = '<div style="text-align:center;color:var(--gray);padding:48px;grid-column:1/-1">Produk tidak ditemukan 🔍</div>';
    return;
  }
  grid.innerHTML = list.map((p, i) => `
    <div class="product-card" style="animation-delay:${i * 0.07}s" onclick="addToCart(${p.id})">
      <div class="product-img">
        <span>${p.emoji}</span>
        ${p.badge ? `<div class="product-badge${p.isNew ? ' new' : ''}">${p.badge}</div>` : ''}
        ${p.isNew && !p.badge ? '<div class="product-badge new">Baru</div>' : ''}
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="product-unit">${p.unit}</p>
        <div class="product-footer">
          <div class="product-price">
            ${p.original ? `<span class="original">Rp ${p.original.toLocaleString('id-ID')}</span>` : ''}
            Rp ${p.price.toLocaleString('id-ID')}
          </div>
          <button class="btn-add" onclick="event.stopPropagation();addToCart(${p.id})">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== FILTER =====
function filterCategory(cat, btn) {
  currentCategory = cat;
  // Update filter buttons
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const filtered = cat === 'semua' ? products : products.filter(p => p.category === cat);
  renderProducts(filtered);

  if (cat !== 'semua') {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ===== CART =====
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartUI();
  showToast(`🛒 ${product.name} ditambahkan ke keranjang!`);
  animateCartBadge();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('zesty_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const total = cart.reduce((s, c) => s + c.qty, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';

  const cartItems = document.getElementById('cart-items');
  const cartFooter = document.getElementById('cart-footer');
  const cartTotal = document.getElementById('cart-total');

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty">Keranjang Anda masih kosong 🛒</div>';
    cartFooter.style.display = 'none';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <span class="cart-item-emoji">${item.emoji}</span>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>Rp ${(item.price * item.qty).toLocaleString('id-ID')}</p>
        </div>
        <div class="cart-item-controls">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `).join('');
    const totalPrice = cart.reduce((s, c) => s + c.price * c.qty, 0);
    cartTotal.textContent = 'Rp ' + totalPrice.toLocaleString('id-ID');
    cartFooter.style.display = 'block';
  }
}

function animateCartBadge() {
  const badge = document.getElementById('cart-badge');
  badge.style.transform = 'scale(1.6)';
  setTimeout(() => badge.style.transform = 'scale(1)', 300);
}

// ===== CART SIDEBAR =====
function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

// ===== SEARCH =====
function toggleSearch() {
  const overlay = document.getElementById('search-overlay');
  overlay.classList.toggle('active');
  if (overlay.classList.contains('active')) {
    setTimeout(() => document.getElementById('search-input').focus(), 200);
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

function searchProducts(query) {
  const resultsEl = document.getElementById('search-results');
  if (!query.trim()) { resultsEl.innerHTML = ''; return; }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  if (!filtered.length) {
    resultsEl.innerHTML = '<div style="color:rgba(255,255,255,0.5);text-align:center;padding:16px">Tidak ada hasil untuk "' + query + '"</div>';
    return;
  }

  resultsEl.innerHTML = filtered.slice(0, 5).map(p => `
    <div class="search-result-item" onclick="quickAdd(${p.id})">
      <span>${p.emoji}</span>
      <div>
        <div>${p.name}</div>
        <div style="font-size:0.8rem;opacity:0.6">Rp ${p.price.toLocaleString('id-ID')} · ${p.unit}</div>
      </div>
      <div style="margin-left:auto;opacity:0.6;font-size:0.8rem">+ Keranjang</div>
    </div>
  `).join('');
}

function quickAdd(id) {
  addToCart(id);
  toggleSearch();
}

// ===== CHECKOUT =====
// Ganti fungsi checkout yang lama dengan ini:
function checkout() {
  if (cart.length === 0) {
    showToast("⚠️ Keranjang kamu masih kosong!");
    return;
  }
  
  // Menampilkan efek loading sebentar sebelum pindah halaman
  showToast("🔄 Mengalihkan ke halaman pembayaran...");
  
  setTimeout(() => {
    window.location.href = 'payment.html';
  }, 800);
}
// ===== PROMO =====
function copyPromo() {
  navigator.clipboard.writeText('ZESTYFRESH').then(() => {
    showToast('🎉 Kode promo ZESTYFRESH disalin!');
  }).catch(() => {
    showToast('Kode: ZESTYFRESH — salin manual ya!');
  });
}

// ===== FORM =====
function submitForm(e) {
  e.preventDefault();
  showToast('✉️ Pesan terkirim! Kami akan membalas dalam 1x24 jam.');
  e.target.reset();
}

// ===== NEWSLETTER =====
function subscribeNewsletter() {
  const input = document.querySelector('.newsletter-form input');
  if (!input.value) return;
  showToast('💌 Berhasil berlangganan newsletter!');
  input.value = '';
}

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== NAVBAR SCROLL =====
function handleNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const scrollTop = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      scrollTop.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      scrollTop.classList.remove('visible');
    }
  });
}

// ===== SCROLL TO TOP =====
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== MOBILE MENU =====
function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('open');
}

// ===== SCROLL ANIMATIONS =====
function observeScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        el.target.classList.add('fade-in');
        observer.unobserve(el.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.about-card, .testi-card, .category-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ===== KEYBOARD EVENTS =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const searchEl = document.getElementById('search-overlay');
    if (searchEl.classList.contains('active')) toggleSearch();
    const cartEl = document.getElementById('cart-sidebar');
    if (cartEl.classList.contains('active')) toggleCart();
  }
});
