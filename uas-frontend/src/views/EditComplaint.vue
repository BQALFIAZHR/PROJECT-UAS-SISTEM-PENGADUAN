<template>
  <div class="form-page-container">
    <div class="form-card">
      
      <div class="card-header">
        <div class="title-section">
          <div class="icon-bg edit-mode">🛠️</div>
          <div>
            <h2>Edit Pengaduan</h2>
            <p class="subtitle">Perbarui informasi laporan anda</p>
          </div>
        </div>
        
        <button @click="$router.go(-1)" class="btn-back" title="Batal">
          ←
        </button>
      </div>

      <form @submit.prevent="handleUpdate" class="form-content">
        
        <div class="form-row">
           <div class="form-group">
            <label for="date">Tanggal Kejadian</label>
            <input 
              id="date" 
              type="date" 
              v-model="form.report_date" 
              class="form-control"
              required 
            />
          </div>

          <div class="form-group">
            <label for="category">Kategori Masalah</label>
            <div class="select-wrapper">
              <select id="category" v-model="form.category_id" class="form-control" required>
                <option disabled value="">-- Pilih Kategori --</option>
                <option value="1">🔧 Fasilitas Rusak</option>
                <option value="2">📚 Akademik</option>
                <option value="3">🛡️ Keamanan</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="title">Judul Laporan</label>
          <input 
            id="title"
            type="text" 
            v-model="form.title" 
            class="form-control"
            required 
          />
        </div>

        <div class="form-group">
          <label for="description">Deskripsi Detail</label>
          <textarea 
            id="description"
            v-model="form.description" 
            rows="5" 
            class="form-control textarea"
            required
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            <span v-if="!isSubmitting">💾 Simpan Perubahan</span>
            <span v-else class="loading-state">⏳ Menyimpan...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute(); 
const isSubmitting = ref(false);

const form = ref({
  category_id: "",
  title: "",
  description: "",
  report_date: ""
});


onMounted(async () => {
  try {
    const id = route.params.id;
    const response = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    
    const data = response.data;
    
  
    form.value = {
      category_id: data.category_id,
      title: data.title,
      description: data.description,
 
      report_date: new Date(data.report_date).toISOString().substr(0, 10)
    };
  } catch (error) {
    alert("Gagal mengambil data lama.");
    router.push('/dashboard');
  }
});


const handleUpdate = async () => {
  isSubmitting.value = true;
  try {
    const id = route.params.id;
    await axios.put(`http://localhost:5000/api/complaints/${id}`, {
        ...form.value,
        category_id: parseInt(form.value.category_id)
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    
    alert("Data berhasil diperbarui!");
    router.push(`/complaint/${id}`); 
  } catch (error) {
    alert("Gagal update data. Cek backend.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Layout Utama */
.form-page-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 3rem;
  padding-bottom: 3rem;
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Card Styling */
.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  transition: transform 0.3s;
}

/* Header Styling */
.card-header {
  padding: 1.5rem 2rem;
  background: white;
  border-bottom: 1px solid #f1f1f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.icon-bg {
  width: 45px;
  height: 45px;
  background: #fff3cd; /* Warna Background Kuning Pucat (Edit Mode) */
  color: #856404;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.card-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1a2980;
}

.subtitle {
  margin: 2px 0 0;
  font-size: 0.85rem;
  color: #7f8c8d;
}

/* --- TOMBOL KEMBALI (BULAT ARROW) --- */
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
  color: #d32f2f; /* Merah sedikit saat hover (indikasi batal) */
  border-color: #d32f2f;
  transform: translateX(-2px);
}

/* Form Styling */
.form-content {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #34495e;
}

.form-control {
  padding: 12px 15px;
  border: 2px solid #eef2f7;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: #f9fafb;
  color: #2c3e50;
  width: 100%;
}

.form-control:focus {
  outline: none;
  border-color: #ffc107; /* Fokus warna kuning/orange sesuai tema edit */
  background-color: white;
  box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.1);
}

.textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.5;
}

/* Submit Button */
.btn-submit {
  width: 100%;
  padding: 14px;
  /* Gradasi Orange untuk Edit (Membedakan dengan Create yang Hijau) */
  background: linear-gradient(to right, #f2994a, #f2c94c);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 6px rgba(242, 153, 74, 0.3);
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(242, 153, 74, 0.4);
}

.btn-submit:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* Responsive */
@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .form-card {
    border-radius: 0;
    min-height: 100vh;
  }
  .form-page-container {
    padding: 0;
  }
}
</style>