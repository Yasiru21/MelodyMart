// script.js - MelodyMart core (shared across all pages)
// All prices updated to Sri Lankan Rupees (LKR) - 1 USD ≈ 300 LKR

// ---------- PRODUCT DATA (prices in LKR) ----------
const products = [
  { id: 1, name: "Acoustic Guitar", category: "Guitar", price: 89700, rating: 4.8, desc: "Rich warm tone, ideal for folk.", img: "https://images.pexels.com/photos/165971/pexels-photo-165971.jpeg?auto=compress&cs=tinysrgb&w=400", views: 0 },
  { id: 2, name: "Electric Guitar", category: "Guitar", price: 149700, rating: 4.9, desc: "Classic rock sound.", img: "https://images.pexels.com/photos/4246089/pexels-photo-4246089.jpeg?auto=compress&cs=tinysrgb&w=400", views: 0 },
  { id: 3, name: "Digital Keyboard", category: "Keyboard", price: 119700, rating: 4.7, desc: "88 weighted keys.", img: "https://images.pexels.com/photos/4207963/pexels-photo-4207963.jpeg?auto=compress&cs=tinysrgb&w=400", views: 0 },
  { id: 4, name: "Drum Set", category: "Drums", price: 209700, rating: 4.9, desc: "5-piece birch shell.", img: "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=400", views: 0 },
  { id: 5, name: "Violin", category: "Strings", price: 74700, rating: 4.6, desc: "Handcrafted full size.", img: "https://images.pexels.com/photos/301689/pexels-photo-301689.jpeg?auto=compress&cs=tinysrgb&w=400", views: 0 },
  { id: 6, name: "Microphone", category: "Microphone", price: 38700, rating: 4.8, desc: "Condenser mic.", img: "https://images.pexels.com/photos/3394659/pexels-photo-3394659.jpeg?auto=compress&cs=tinysrgb&w=400", views: 0 },
  { id: 7, name: "Saxophone", category: "Strings", price: 269700, rating: 4.9, desc: "Alto sax, rich jazz sound.", img: "https://images.pexels.com/photos/1049946/pexels-photo-1049946.jpeg?auto=compress&cs=tinysrgb&w=400", views: 0 },
  { id: 8, name: "Audio Mixer", category: "Accessories", price: 59700, rating: 4.5, desc: "6-channel mixer.", img: "https://images.pexels.com/photos/2107890/pexels-photo-2107890.jpeg?auto=compress&cs=tinysrgb&w=400", views: 0 },
  { id: 9, name: "Bass Guitar", category: "Guitar", price: 113700, rating: 4.7, desc: "4-string electric bass.", img: "https://images.pexels.com/photos/164920/pexels-photo-164920.jpeg?auto=compress&cs=tinysrgb&w=400", views: 0 },
  { id: 10, name: "Studio Headphones", category: "Accessories", price: 26700, rating: 4.6, desc: "Closed-back monitoring.", img: "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=400", views: 0 }
];

// Global tracking
let totalViews = 0;
let totalCartClicks = 0;
let leadsArray = JSON.parse(localStorage.getItem("melodyLeads")) || [];
let categoryViews = { Guitar:0, Keyboard:0, Drums:0, Strings:0, Microphone:0, Accessories:0 };
let visitorCount = parseInt(localStorage.getItem("visitorCount")) || 0;

// UTM & visitor tracking
const urlParams = new URLSearchParams(window.location.search);
const utmSource = urlParams.get('utm_source') || 'direct';
if (!sessionStorage.getItem("visitorTracked")) {
  visitorCount++;
  localStorage.setItem("visitorCount", visitorCount);
  sessionStorage.setItem("visitorTracked", "true");
}

// Helper: update dashboard (only on products page)
function updateAnalyticsDashboard() {
  if (!document.getElementById("totalViews")) return;
  document.getElementById("totalViews").innerText = totalViews;
  document.getElementById("totalCartClicks").innerText = totalCartClicks;
  document.getElementById("totalLeads").innerText = leadsArray.length;
  let mostViewed = Object.keys(categoryViews).reduce((a,b) => categoryViews[a] > categoryViews[b] ? a : b, "Guitar");
  document.getElementById("mostViewedCat").innerText = mostViewed;
  let convRate = visitorCount ? ((leadsArray.length / visitorCount)*100).toFixed(1) : 0;
  document.getElementById("conversionRate").innerText = convRate + "%";
  let srcCount = { Facebook:0, Email:0, WhatsApp:0, Direct:0 };
  leadsArray.forEach(lead => { if(srcCount[lead.source] !== undefined) srcCount[lead.source]++; });
  document.getElementById("sourceStats").innerHTML = `Facebook:${srcCount.Facebook} | Email:${srcCount.Email} | WhatsApp:${srcCount.WhatsApp} | Direct:${srcCount.Direct}`;
  document.getElementById("campaignSource").innerText = utmSource;
}

// GA4 simulation
// GA4 & Meta Pixel event simulation (now with real fbq calls)
function trackEvent(eventName, params) {
  console.log(`[Analytics] ${eventName}`, params);
  
  // Map our internal event names to Meta Pixel standard events
  let fbEventName = null;
  let fbParams = {};
  
  switch(eventName) {
    case 'page_view':
      fbEventName = 'PageView';
      fbParams = { /* optional: page title, etc. */ };
      break;
    case 'view_content':
      fbEventName = 'ViewContent';
      fbParams = {
        content_name: params.product_name,
        content_category: params.category,
        content_ids: [params.product_id],
        content_type: 'product'
      };
      break;
    case 'add_to_cart':
      fbEventName = 'AddToCart';
      fbParams = {
        content_name: params.product_name,
        content_ids: [params.product_id],
        content_type: 'product',
        currency: 'LKR'
        // value: product.price  // optional if you have price
      };
      break;
    case 'generate_lead':
      fbEventName = 'Lead';
      fbParams = {
        lead_source: params.source
      };
      break;
    case 'contact_click':
      fbEventName = 'Contact';
      fbParams = {
        contact_method: params.method
      };
      break;
    default:
      // Custom events could be sent as 'CustomEvent'
      return;
  }
  
  // Fire Meta Pixel event if fbq is available
  if (fbEventName && typeof fbq === 'function') {
    fbq('track', fbEventName, fbParams);
    console.log(`[Meta Pixel] ${fbEventName} sent`, fbParams);
  } else if (fbEventName) {
    console.warn('Meta Pixel not loaded – fbq is undefined');
  }
}

// Create product card HTML (price formatted in LKR)
function createProductCard(p) {
  let stars = "★".repeat(Math.floor(p.rating)) + "☆".repeat(5 - Math.floor(p.rating));
  // Format price in Sri Lankan Rupees with commas
  let formattedPrice = `Rs. ${p.price.toLocaleString('en-IN')}`;
  return `<div class="product-card" data-id="${p.id}">
    <div class="product-img"><img src="${p.img}" alt="${p.name}"></div>
    <div class="product-info">
      <div class="product-name">${p.name}</div>
      <div class="category-badge">${p.category}</div>
      <div class="price">${formattedPrice}</div>
      <div class="stars">${stars}</div>
      <div class="desc">${p.desc}</div>
      <div class="card-buttons">
        <button class="view-details" data-id="${p.id}">View Details</button>
        <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
      </div>
    </div>
  </div>`;
}

// Track product view
function trackProductView(productId) {
  let product = products.find(p => p.id == productId);
  if (product) {
    product.views++;
    totalViews++;
    categoryViews[product.category] = (categoryViews[product.category] || 0) + 1;
    updateAnalyticsDashboard();
    trackEvent('view_content', { product_name: product.name, category: product.category });
  }
}

// Personalization state & recommendation logic
let userAffinities = { category: null, lastViewedProductId: null, cartHistory: [] };

function updateRecommendations() {
  const recContainer = document.getElementById("recommendedGrid");
  if (!recContainer) return;
  let recs = [...products];
  let priorityCat = userAffinities.category || (userAffinities.lastViewedProductId ? products.find(p=>p.id==userAffinities.lastViewedProductId)?.category : null);
  if (priorityCat) {
    recs = products.filter(p => p.category === priorityCat);
    if (recs.length < 3) recs = products;
  } else {
    recs.sort((a,b) => b.views - a.views);
  }
  recContainer.innerHTML = recs.slice(0,4).map(p => createProductCard(p)).join("");
  attachProductEvents();
}

function addPersonalizationSignal(type, value) {
  if (type === 'category') { userAffinities.category = value; updateRecommendations(); }
  if (type === 'view') { userAffinities.lastViewedProductId = value; updateRecommendations(); }
  if (type === 'cart') {
    let product = products.find(p=>p.id==value);
    if(product) userAffinities.category = product.category;
    updateRecommendations();
  }
}

// Event handlers for product buttons
function handleViewDetails(e) {
  let id = parseInt(e.currentTarget.getAttribute('data-id'));
  trackProductView(id);
  addPersonalizationSignal('view', id);
  alert(`✨ Viewing product (demo). Product ID: ${id}\n(Event: view_content)`);
}

function handleAddToCart(e) {
  let id = parseInt(e.currentTarget.getAttribute('data-id'));
  totalCartClicks++;
  updateAnalyticsDashboard();
  addPersonalizationSignal('cart', id);
  trackEvent('add_to_cart', { product_id: id });
  alert(`🛒 Added to cart! Total cart clicks: ${totalCartClicks}`);
}

function attachProductEvents() {
  document.querySelectorAll('.view-details').forEach(btn => {
    btn.removeEventListener('click', handleViewDetails);
    btn.addEventListener('click', handleViewDetails);
  });
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.removeEventListener('click', handleAddToCart);
    btn.addEventListener('click', handleAddToCart);
  });
}

// Filtering & search (products page)
let currentFilter = "all";
let currentSearch = "";

function renderProducts() {
  const container = document.getElementById("productsGrid");
  if (!container) return;
  let filtered = products.filter(p => {
    let matchCat = currentFilter === "all" || p.category === currentFilter;
    let matchSearch = p.name.toLowerCase().includes(currentSearch.toLowerCase()) || p.category.toLowerCase().includes(currentSearch.toLowerCase());
    return matchCat && matchSearch;
  });
  container.innerHTML = filtered.map(p => createProductCard(p)).join("");
  attachProductEvents();
}

function renderFeatured() {
  const featuredContainer = document.getElementById("featuredGrid");
  if (featuredContainer) {
    featuredContainer.innerHTML = products.slice(0,4).map(p => createProductCard(p)).join("");
    attachProductEvents();
  }
}

// Lead form (register page) - unchanged
function initLeadForm() {
  const form = document.getElementById('leadForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const source = document.getElementById('hearAbout').value;
    if (!name || !email || !phone || !source) {
      document.getElementById('formMessage').innerHTML = '<span style="color:#D4AF37;">❌ Please fill all required fields.</span>';
      return;
    }
    const newLead = { name, email, phone, instrument: document.getElementById('instrumentCategory').value, source, date: new Date().toISOString() };
    leadsArray.push(newLead);
    localStorage.setItem("melodyLeads", JSON.stringify(leadsArray));
    trackEvent('generate_lead', { source: source });
    document.getElementById('formMessage').innerHTML = '<span style="color:#34C759;">✅ Thank you! Your interest has been registered.</span>';
    form.reset();
    if (typeof updateAnalyticsDashboard === 'function') updateAnalyticsDashboard();
  });
}

// Contact page interactions
function initContactPage() {
  const emailBtn = document.getElementById('quickEmailBtn');
  const callBtn = document.getElementById('callBtn');
  if (emailBtn) emailBtn.addEventListener('click', () => { trackEvent('contact_click', { method: 'email' }); window.location.href = "mailto:melodymart2003@gmail.com"; });
  if (callBtn) callBtn.addEventListener('click', () => { trackEvent('contact_click', { method: 'phone' }); alert("Call us at 0717151905"); });
  const quickForm = document.getElementById('quickContactForm');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("Message sent (demo). We'll get back soon!");
      trackEvent('contact_submit', {});
    });
  }
}

// Mobile menu toggle
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) toggle.addEventListener('click', () => navLinks.classList.toggle('show'));
}

// Page-specific initialization
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  renderFeatured();
  initLeadForm();
  initContactPage();

  // Products page specific
  if (document.getElementById('productsGrid')) {
    renderProducts();
    setupFiltersAndSearch();
    updateAnalyticsDashboard();
    updateRecommendations();
    trackEvent('page_view', { page: 'Products', utm_source: utmSource });
  } else if (document.querySelector('.hero')) {
    trackEvent('page_view', { page: 'Home' });
  } else if (document.querySelector('.about-page')) {
    trackEvent('page_view', { page: 'About' });
  } else if (document.querySelector('.lead-section')) {
    trackEvent('page_view', { page: 'Register' });
  } else if (document.querySelector('.contact-page')) {
    trackEvent('page_view', { page: 'Contact' });
  }
});

function setupFiltersAndSearch() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-category');
      renderProducts();
    });
  });
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderProducts();
    });
  }
}