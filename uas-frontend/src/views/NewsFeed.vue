<template>
  <div class="news-page">
    
    <nav class="navbar">
      <div class="nav-brand">
        <span class="brand-icon">📢</span>
        <h3>Kabar Kampus</h3>
      </div>
      <div class="nav-links">
        <button @click="$router.push('/dashboard')" class="btn-dashboard">
          <span class="icon">🏠</span> Dashboard Saya
        </button>
        <button @click="handleLogout" class="btn-logout">
          Logout
        </button>
      </div>
    </nav>

    <div class="content-wrapper">
      <div class="hero-section">
        <h1>Galeri Perbaikan Fasilitas</h1>
        <p>Bukti nyata tindak lanjut laporan sarana dan prasarana kampus demi kenyamanan bersama.</p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Sedang memuat berita...</p>
      </div>

      <div v-else class="news-grid">
        <div v-for="item in newsList" :key="item.id" class="news-card">
          
          <div class="card-image">
            <img 
              :src="item.evidence_photo || 'https://via.placeholder.com/400x250?text=Perbaikan+Selesai'" 
              alt="Bukti Perbaikan" 
            />
            <div class="status-overlay">
              <span class="badge-check">✅ Tuntas</span>
            </div>
          </div>

          <div class="card-content">
            <div class="meta-top">
              <span class="date">📅 {{ formatDate(item.resolved_at) }}</span>
            </div>
            
            <h3 class="card-title">{{ item.title }}</h3>
            
            <div class="admin-quote">
              <p>"{{ item.response_message }}"</p>
            </div>
            
            <div class="card-footer">
              <div class="footer-item">
                <span class="icon">🛠️</span> {{ item.category_name }}
              </div>
              <div class="footer-item">
                <span class="icon">👤</span> {{ item.reporter_name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && newsList.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>Belum ada kabar terbaru</h3>
        <p>Saat ini belum ada perbaikan fasilitas yang dipublikasikan.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const newsList = ref([]);
const loading = ref(true);

const formatDate = (date) => {
  if(!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  });
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/complaints/public/news', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    newsList.value = res.data;
  } catch (error) {
    console.error("Gagal ambil berita");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Base Layout */
.news-page {
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

/* Navbar Style (Sama dengan Dashboard) */
.navbar {
  background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(26, 41, 128, 0.2);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand { display: flex; align-items: center; gap: 10px; }
.brand-icon { font-size: 1.5rem; }
.navbar h3 { margin: 0; font-weight: 600; font-size: 1.2rem; }

.nav-links { display: flex; gap: 10px; }

.btn-dashboard {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.btn-dashboard:hover { background: rgba(255, 255, 255, 0.3); }

.btn-logout {
  background-color: #ff5e57;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-logout:hover { background-color: #ff3b30; }

/* Content Wrapper */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Hero Section */
.hero-section {
  text-align: center;
  margin-bottom: 50px;
}
.hero-section h1 {
  color: #1a2980;
  font-size: 2.2rem;
  margin-bottom: 10px;
}
.hero-section p {
  color: #64748b;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

/* News Grid */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 30px;
}

/* Card Styling */
.news-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

/* Card Image */
.card-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.news-card:hover .card-image img {
  transform: scale(1.05);
}

.status-overlay {
  position: absolute;
  top: 15px;
  right: 15px;
}
.badge-check {
  background: #10b981; /* Hijau Emerald */
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Card Content */
.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.meta-top { margin-bottom: 10px; }
.date {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 600;
  background: #f8fafc;
  padding: 4px 8px;
  border-radius: 4px;
}

.card-title {
  margin: 0 0 15px 0;
  font-size: 1.25rem;
  color: #1e293b;
  line-height: 1.4;
}

/* Admin Quote Style */
.admin-quote {
  background: #f0fdf4; /* Hijau pudar banget */
  border-left: 4px solid #22c55e;
  padding: 12px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 20px;
  flex-grow: 1; /* Agar footer terdorong ke bawah */
}
.admin-quote p {
  margin: 0;
  font-size: 0.95rem;
  color: #15803d;
  font-style: italic;
  line-height: 1.5;
}

/* Footer Card */
.card-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  border-top: 1px solid #f1f5f9;
  font-size: 0.85rem;
  color: #64748b;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Loading & Empty States */
.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #26d0ce;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* Mobile */
@media (max-width: 600px) {
  .hero-section h1 { font-size: 1.8rem; }
  .navbar { flex-direction: column; gap: 15px; padding: 15px; }
}
</style>