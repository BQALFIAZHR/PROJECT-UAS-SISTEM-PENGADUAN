<template>
  <div class="admin-container">
    <nav class="admin-navbar">
      <div class="nav-brand">
        <span class="brand-icon">🛡️</span>
        <h3>ADMIN PANEL</h3>
      </div>
      
      <div class="user-info">
        <div class="user-pill">
          <span class="avatar">👤</span>
          <span class="username">{{ user?.username }}</span>
        </div>
        <button @click="handleLogout" class="btn-logout" title="Keluar">
          ⏻ Logout
        </button>
      </div>
    </nav>

    <div class="content">
      <div class="header-content">
        <div>
          <h2>Daftar Masuk Pengaduan</h2>
          <p class="subtitle">Kelola laporan masuk dari mahasiswa</p>
        </div>
        
        <div class="legend-card">
          <span class="legend-title">Keterangan:</span>
          <div class="badges-row">
            <span class="badge-hint fas">🛠️ Fasilitas (Publik)</span>
            <span class="badge-hint aka">📚 Akademik (Privat)</span>
          </div>
        </div>
      </div>
      
      <div class="table-card">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th width="10%">Tiket</th>
                <th width="20%">Pelapor</th>
                <th width="35%">Detail Masalah</th>
                <th width="15%">Status</th>
                <th width="20%" class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in complaints" :key="item.id" class="hover-row">
                <td>
                  <span class="ticket-id">#{{ item.ticket_number }}</span>
                </td>
                
                <td>
                  <div class="reporter-info">
                    <span class="reporter-name">{{ item.reporter_name }}</span>
                    <span class="reporter-date">📅 {{ formatDate(item.report_date) }}</span>
                  </div>
                </td>
                
                <td>
                  <div class="issue-info">
                    <span :class="getCategoryBadgeClass(item.category_name)">
                      {{ item.category_name === 'Fasilitas Rusak' ? '🛠️' : '📚' }} {{ item.category_name }}
                    </span>
                    <span class="issue-title">{{ item.title }}</span>
                  </div>
                </td>
                
                <td>
                  <span :class="['status-pill', item.status]">
                    {{ item.status }}
                  </span>
                </td>
                
                <td class="text-right">
                  <div class="action-buttons">
                    <button 
                      v-if="item.status === 'pending'" 
                      @click="updateStatus(item, 'proses')" 
                      class="btn-action btn-proses"
                      title="Proses Laporan"
                    >
                      ⚙️ Proses
                    </button>
                    
                    <button 
                      v-if="item.status === 'proses'" 
                      @click="openModal(item)" 
                      class="btn-action btn-selesai"
                      title="Selesaikan Laporan"
                    >
                      ✅ Selesai
                    </button>
                    
                    <div v-if="item.status === 'selesai'" class="done-wrapper">
                      <span class="done-text">Tuntas</span>
                      <button @click="openModal(item)" class="btn-icon-edit" title="Edit Penyelesaian">
                        ✏️
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="complaints.length === 0" class="empty-state">
            <p>Belum ada data pengaduan masuk.</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h3>Selesaikan Tiket #{{ selectedItem.ticket_number }}</h3>
            <span :class="getCategoryBadgeClass(selectedItem.category_name)">{{ selectedItem.category_name }}</span>
          </div>
          <button @click="showModal = false" class="btn-close">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Pesan Balasan Admin <span class="required">*</span></label>
            <textarea 
              v-model="responseText" 
              rows="4" 
              placeholder="Jelaskan tindakan yang telah diambil..."
              class="form-control"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Link Foto Bukti (URL)</label>
            <input 
              type="text" 
              v-model="evidenceLink" 
              placeholder="https://imgur.com/..." 
              class="form-control"
            />
            <div v-if="selectedItem.category_name === 'Fasilitas Rusak'" class="info-box">
              ℹ️ Foto ini akan ditampilkan di <strong>Galeri Kabar Kampus</strong>.
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showModal = false" class="btn-cancel">Batal</button>
          <button @click="submitResolution" class="btn-confirm">
            🚀 Kirim & Selesai
          </button>
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

const showModal = ref(false);
const selectedItem = ref(null);
const responseText = ref("");
const evidenceLink = ref("");

const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
});

const getCategoryBadgeClass = (categoryName) => {
  return categoryName === 'Fasilitas Rusak' ? 'cat-badge fas' : 'cat-badge aka';
};

const fetchComplaints = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/complaints/admin/all', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    complaints.value = res.data;
  } catch (error) {
    alert("Gagal ambil data. Pastikan anda login sebagai ADMIN.");
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

const updateStatus = async (item, status) => {
  if(!confirm(`Mulai proses pengerjaan tiket #${item.ticket_number}?`)) return;
  
  try {
    await axios.post(`http://localhost:5000/api/complaints/admin/process/${item.id}`, {
      status: status,
      response_message: "Sedang dikerjakan oleh petugas.",
      evidence_photo: null
    }, { headers: { Authorization: `Bearer ${authStore.token}` } });
    
    fetchComplaints(); 
  } catch (e) { alert("Gagal update status"); }
};

const openModal = (item) => {
  selectedItem.value = item;
  responseText.value = item.response_message || ""; 
  evidenceLink.value = item.evidence_photo || "";
  showModal.value = true;
};

const submitResolution = async () => {
  if(!responseText.value) {
    alert("Wajib isi pesan balasan!");
    return;
  }

  try {
    await axios.post(`http://localhost:5000/api/complaints/admin/process/${selectedItem.value.id}`, {
      status: 'selesai',
      response_message: responseText.value,
      evidence_photo: evidenceLink.value 
    }, { headers: { Authorization: `Bearer ${authStore.token}` } });
    
    showModal.value = false;
    fetchComplaints();
    alert("Laporan berhasil diselesaikan!");
  } catch (e) { alert("Gagal memproses data."); }
};

onMounted(() => {
  if (user.value?.role !== 'admin') {
    alert("Halaman Khusus Admin!");
    router.push('/dashboard');
  } else {
    fetchComplaints();
  }
});
</script>

<style scoped>
/* Global Layout */
.admin-container {
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

/* Navbar */
.admin-navbar {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  color: white;
}

.nav-brand { display: flex; align-items: center; gap: 10px; }
.nav-brand h3 { margin: 0; font-size: 1.2rem; letter-spacing: 1px; }
.brand-icon { font-size: 1.5rem; }

.user-info { display: flex; align-items: center; gap: 15px; }

.user-pill {
  background: rgba(255,255,255,0.1);
  padding: 5px 15px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255,255,255,0.2);
}

.btn-logout {
  background: #ff5e57;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-logout:hover { background: #ff3b30; transform: translateY(-1px); }

/* Content */
.content { max-width: 1200px; margin: 0 auto; padding: 30px 20px; }

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 25px;
}

.header-content h2 { margin: 0; color: #2c3e50; font-size: 1.8rem; }
.subtitle { margin: 5px 0 0; color: #7f8c8d; font-size: 0.95rem; }

/* Legend Card */
.legend-card {
  background: white;
  padding: 10px 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.legend-title { font-size: 0.75rem; color: #999; font-weight: bold; text-transform: uppercase; }
.badges-row { display: flex; gap: 10px; }

/* Table Styles */
.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  overflow: hidden;
  padding: 5px;
}

.table-responsive { overflow-x: auto; }
table { width: 100%; border-collapse: separate; border-spacing: 0; }

th {
  background: #f8fafc;
  color: #64748b;
  padding: 16px;
  text-align: left;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  border-bottom: 2px solid #e2e8f0;
}

td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.text-right { text-align: right; }
.hover-row:hover { background-color: #f8fafc; }

/* Column Specifics */
.ticket-id { font-family: monospace; font-weight: bold; color: #2c3e50; background: #e2e8f0; padding: 4px 8px; border-radius: 4px; }

.reporter-info { display: flex; flex-direction: column; }
.reporter-name { font-weight: 600; color: #333; }
.reporter-date { font-size: 0.8rem; color: #94a3b8; }

.issue-info { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.issue-title { font-weight: 600; color: #2c3e50; font-size: 0.95rem; }

/* Status Pills */
.status-pill { padding: 6px 12px; border-radius: 50px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.status-pill.pending { background: #fff7ed; color: #c2410c; border: 1px solid #ffedd5; }
.status-pill.proses { background: #eff6ff; color: #1d4ed8; border: 1px solid #dbeafe; }
.status-pill.selesai { background: #f0fdf4; color: #15803d; border: 1px solid #dcfce7; }

/* Category Badges */
.cat-badge { font-size: 0.75rem; padding: 4px 8px; border-radius: 6px; font-weight: 600; }
.cat-badge.fas { background: #e0f2f1; color: #00695c; }
.cat-badge.aka { background: #f3e5f5; color: #6a1b9a; }

/* Action Buttons */
.action-buttons { display: flex; justify-content: flex-end; align-items: center; gap: 8px; }
.btn-action { border: none; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.btn-action:hover { transform: translateY(-2px); }

.btn-proses { background: linear-gradient(to right, #3494e6, #ec6ead); color: white; }
.btn-selesai { background: linear-gradient(to right, #11998e, #38ef7d); color: white; }

.done-wrapper { display: flex; align-items: center; gap: 8px; }
.done-text { font-weight: bold; color: #15803d; font-size: 0.9rem; }
.btn-icon-edit { background: #fff; border: 1px solid #cbd5e1; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.btn-icon-edit:hover { border-color: #f59e0b; color: #f59e0b; }

/* Empty State */
.empty-state { text-align: center; padding: 3rem; color: #94a3b8; font-style: italic; }

/* Modal Styling */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
}

.modal-card {
  background: white; width: 100%; max-width: 500px;
  border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.modal-header {
  padding: 20px; border-bottom: 1px solid #f1f5f9;
  display: flex; justify-content: space-between; align-items: flex-start;
}
.modal-header h3 { margin: 0 0 5px 0; font-size: 1.2rem; color: #2c3e50; }
.btn-close { background: none; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer; }

.modal-body { padding: 20px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; color: #334155; }
.required { color: red; }

.form-control {
  width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px;
  font-family: inherit; transition: border-color 0.3s;
}
.form-control:focus { outline: none; border-color: #38ef7d; }

.info-box {
  margin-top: 8px; font-size: 0.85rem; color: #15803d;
  background: #f0fdf4; padding: 10px; border-radius: 6px; border: 1px solid #bbf7d0;
}

.modal-footer {
  padding: 20px; border-top: 1px solid #f1f5f9; background: #f8fafc;
  display: flex; justify-content: flex-end; gap: 10px; border-radius: 0 0 16px 16px;
}

.btn-confirm { background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; }
.btn-confirm:hover { background: #059669; }
.btn-cancel { background: white; border: 1px solid #cbd5e1; padding: 10px 20px; border-radius: 8px; cursor: pointer; color: #64748b; font-weight: 600; }
.btn-cancel:hover { background: #f1f5f9; }
</style>