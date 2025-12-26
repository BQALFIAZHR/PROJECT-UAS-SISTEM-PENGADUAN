<template>
  <div class="detail-container">
    <div v-if="complaint" class="detail-card">
      
      <div class="card-header">
        <button @click="$router.push('/dashboard')" class="btn-back" title="Kembali ke Dashboard">
          ←
        </button>
        
        <div class="header-right">
          <button 
            v-if="complaint.status === 'pending'" 
            @click="$router.push(`/complaint/${complaint.id}/edit`)" 
            class="btn-edit"
            title="Edit Laporan"
          >
            ✏️ Edit
          </button>
          <span class="ticket-badge">#{{ complaint.ticket_number }}</span>
        </div>
      </div>

      <div class="main-content">
        <div class="status-section">
          <span :class="['status-pill', complaint.status]">
            {{ complaint.status }}
          </span>
        </div>

        <h2 class="title">{{ complaint.title }}</h2>

        <div class="meta-grid">
          <div class="meta-item">
            <span class="icon">📅</span>
            <div class="meta-text">
              <span class="label">Tanggal Kejadian</span>
              <span class="value">{{ formatDate(complaint.report_date) }}</span>
            </div>
          </div>
          
          <div class="meta-item">
            <span class="icon">📂</span>
            <div class="meta-text">
              <span class="label">Kategori</span>
              <span class="value">{{ complaint.category_name }}</span>
            </div>
          </div>
        </div>

        <div class="description-box">
          <h4 class="section-label">Deskripsi Masalah</h4>
          <p class="description-text">{{ complaint.description }}</p>
        </div>
      </div>

      <div v-if="complaint.status === 'selesai'" class="resolution-card">
        <div class="resolution-header">
          <span class="check-icon">✅</span>
          <h3>Laporan Selesai</h3>
        </div>
        
        <div class="admin-response">
          <p class="response-label">Tanggapan Petugas:</p>
          <p class="response-text">"{{ complaint.response_message || 'Perbaikan telah selesai dilakukan.' }}"</p>
        </div>
        
        <div class="evidence-box">
          <p class="evidence-label">Bukti Foto:</p>
          <div class="image-wrapper">
            <img 
              :src="complaint.evidence_photo || 'https://via.placeholder.com/600x300?text=Bukti+Penyelesaian'" 
              alt="Bukti Perbaikan" 
              class="evidence-img"
            />
          </div>
        </div>
      </div>

      <div v-else class="pending-info">
        <span class="info-icon">ℹ️</span>
        <p>Laporan ini sedang dalam antrean tinjauan atau pengerjaan petugas.</p>
      </div>

    </div>

    <div v-else class="loading-state">
      <div class="spinner"></div>
      <p>Memuat data laporan...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const complaint = ref(null);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

onMounted(async () => {
  try {
    const id = route.params.id;
    const response = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    complaint.value = response.data;
  } catch (error) {
    console.error(error);
    alert("Gagal memuat detail data");
    router.push('/dashboard');
  }
});
</script>

<style scoped>
/* Container & Layout */
.detail-container {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

.detail-card {
  background: white;
  width: 100%;
  max-width: 650px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  overflow: hidden;
  padding-bottom: 2rem;
}

/* Header Section */
.card-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f1f1;
}

/* Tombol Kembali Bulat */
.btn-back {
  background: transparent;
  border: 1px solid #e1e1e1;
  width: 40px; 
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: #f0f2f5;
  color: #1a2980;
  border-color: #1a2980;
  transform: translateX(-2px);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ticket-badge {
  background: #f1f5f9;
  color: #475569;
  padding: 6px 12px;
  border-radius: 8px;
  font-family: monospace;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-edit {
  background-color: #fff7ed;
  border: 1px solid #ffedd5;
  color: #c2410c;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
}
.btn-edit:hover {
  background-color: #ffedd5;
}

/* Main Content */
.main-content {
  padding: 2rem;
}

.status-pill {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 15px;
}

.status-pill.pending { background: #fff7ed; color: #ea580c; border: 1px solid #ffedd5; }
.status-pill.proses { background: #eff6ff; color: #2563eb; border: 1px solid #dbeafe; }
.status-pill.selesai { background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7; }
.status-pill.ditolak { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }

.title {
  margin: 0 0 25px 0;
  color: #1e293b;
  font-size: 1.6rem;
  line-height: 1.3;
}

/* Meta Grid (Date & Category) */
.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 30px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.meta-item .icon { font-size: 1.5rem; }

.meta-text { display: flex; flex-direction: column; }
.meta-text .label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 600; }
.meta-text .value { font-size: 0.95rem; color: #334155; font-weight: 500; }

/* Description Box */
.description-box {
  background: white;
}

.section-label {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.description-text {
  color: #334155;
  line-height: 1.7;
  font-size: 1rem;
  white-space: pre-wrap;
  background: #fcfcfc;
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid #e2e8f0;
}

/* Resolution Card (Selesai) */
.resolution-card {
  margin: 0 2rem;
  background: linear-gradient(to bottom right, #f0fdf4, #ffffff);
  border: 1px solid #dcfce7;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}

.resolution-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: #166534;
}

.resolution-header h3 { margin: 0; font-size: 1.1rem; }

.admin-response {
  background: rgba(255,255,255,0.6);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.response-label { font-weight: bold; font-size: 0.9rem; color: #166534; margin-bottom: 5px; }
.response-text { color: #14532d; font-style: italic; }

.evidence-box {
  margin-top: 15px;
}
.evidence-label { font-size: 0.85rem; color: #166534; margin-bottom: 8px; font-weight: 600; }

.image-wrapper {
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid #bbf7d0;
}

.evidence-img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s;
}

.evidence-img:hover {
  transform: scale(1.02);
}

/* Pending Info */
.pending-info {
  margin: 0 2rem;
  background: #f8fafc;
  padding: 15px;
  border-radius: 10px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #94a3b8;
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 600px) {
  .meta-grid { grid-template-columns: 1fr; }
  .detail-card { border-radius: 0; min-height: 100vh; }
  .detail-container { padding: 0; }
  .resolution-card, .main-content, .card-header, .pending-info { padding-left: 1.5rem; padding-right: 1.5rem; margin-left: 0; margin-right: 0; }
}
</style>