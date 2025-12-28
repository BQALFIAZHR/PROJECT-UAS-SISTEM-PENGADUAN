<template>
  <div class="dashboard-container">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="brand-icon">🎓</span>
        <h3>Sistem Pengaduan Kampus</h3>
      </div>
      
      <div class="user-info">
        <div class="user-pill">
          <span class="avatar">👤</span>
          <span class="username">Halo, <strong>{{ user?.username }}</strong></span>
        </div>
        <button @click="handleLogout" class="btn-logout" title="Keluar Aplikasi">
          <span class="icon-logout">⏻</span> Logout
        </button>
      </div>
    </nav>

    <div class="content">
      <div class="header-section">
        <div class="title-group">
          <h2>Riwayat Pengaduan</h2>
          <p class="subtitle">Pantau status laporan anda di sini</p>
        </div>
        
        <div class="button-group">
            <button class="btn-secondary" @click="$router.push('/news')">
              📰 Galeri Info
            </button>
            <button class="btn-primary" @click="$router.push('/complaint/create')">
              ➕ Buat Pengaduan
            </button>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table v-if="complaints.length > 0">
            <thead>
              <tr>
                <th width="15%">No. Tiket</th>
                <th width="20%">Kategori</th>
                <th>Judul Masalah</th>
                <th width="15%">Tanggal</th>
                <th width="15%">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                  v-for="item in complaints" 
                  :key="item.id" 
                  @click="$router.push(`/complaint/${item.id}`)"
                  class="hover-row"
              >
                <td class="ticket-id">#{{ item.ticket_number }}</td>
                <td>
                  <span class="category-tag">{{ item.category_name }}</span>
                </td>
                <td class="title-text">{{ item.title }}</td>
                <td class="date-text">{{ formatDate(item.report_date) }}</td>
                <td>
                  <span :class="['status-badge', item.status.toLowerCase()]">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-else class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>Belum ada pengaduan</h3>
            <p>Anda belum membuat laporan apapun. Silakan buat pengaduan baru.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const complaints = ref([]);

const user = computed(() => authStore.user);

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/complaints/my', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    complaints.value = response.data;
  } catch (error) {
    console.error("Gagal ambil data:", error);
    if (error.response && error.response.status === 401) {
      handleLogout();
    }
  }
});
</script>

<style scoped>
/* Reset & Base Fonts */
.dashboard-container { 
  min-height: 100vh; 
  background-color: #f0f2f5; 
  font-family: 'Segoe UI', sans-serif;
}

/* Navbar Styles */
.navbar {
  background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%); /* Konsisten dengan Login */
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(26, 41, 128, 0.2);
  color: white;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon { font-size: 1.5rem; }
.navbar h3 { margin: 0; font-weight: 600; font-size: 1.2rem; }

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-pill {
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 15px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(5px);
}

.btn-logout {
  background-color: #ff5e57;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-logout:hover { background-color: #ff3b30; transform: translateY(-1px); }

/* Content Layout */
.content { 
  padding: 2rem; 
  max-width: 1100px; 
  margin: 0 auto; 
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 25px;
}

.title-group h2 { margin: 0; color: #2c3e50; font-size: 1.8rem; }
.subtitle { margin: 5px 0 0; color: #7f8c8d; font-size: 0.95rem; }

.button-group { display: flex; gap: 12px; }

/* Buttons */
button { border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.2s; font-size: 0.9rem; }

.btn-primary {
  background: linear-gradient(to right, #11998e, #38ef7d);
  color: white;
  box-shadow: 0 4px 6px rgba(56, 239, 125, 0.3);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(56, 239, 125, 0.4); }

.btn-secondary {
  background-color: white;
  color: #1a2980;
  border: 1px solid #1a2980;
}
.btn-secondary:hover { background-color: #f0f2f5; }

/* Table Card */
.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  overflow: hidden; /* Round corners fix */
  padding: 5px;
}

.table-responsive { overflow-x: auto; }

table { width: 100%; border-collapse: separate; border-spacing: 0; }

th {
  background-color: #f8fafc;
  color: #64748b;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  color: #475569;
}

.hover-row { cursor: pointer; transition: background 0.2s; }
.hover-row:hover { background-color: #f8fafc; }

/* Styles for Table Content */
.ticket-id { font-family: monospace; font-weight: bold; color: #1a2980; }
.category-tag { background: #e0f2f1; color: #00695c; padding: 4px 10px; border-radius: 4px; font-size: 0.85rem; }
.title-text { font-weight: 500; color: #334155; }
.date-text { color: #94a3b8; font-size: 0.9rem; }

/* Status Badges */
.status-badge {
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
}

.status-badge.pending, .status-badge.menunggu { 
  background-color: #fff7ed; color: #c2410c; border: 1px solid #ffedd5; 
}
.status-badge.proses { 
  background-color: #eff6ff; color: #1d4ed8; border: 1px solid #dbeafe; 
}
.status-badge.selesai { 
  background-color: #f0fdf4; color: #15803d; border: 1px solid #dcfce7; 
}
.status-badge.ditolak {
  background-color: #fef2f2; color: #b91c1c; border: 1px solid #fee2e2;
}

/* Empty State */
.empty-state { padding: 4rem 2rem; text-align: center; color: #94a3b8; }
.empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }

/* Responsive */
@media (max-width: 768px) {
  .header-section { flex-direction: column; align-items: flex-start; gap: 15px; }
  .navbar { flex-direction: column; gap: 10px; }
  .user-info { width: 100%; justify-content: space-between; }
}
</style>