<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-wrapper">
        <img src="https://unram.ac.id/wp-content/uploads/2018/09/UNRAM-LOGO-FIX-STATUTA-.png" alt="Logo Universitas" class="logo" />
      </div>

      <div class="header-text">
        <h2>Sistem Pengaduan Kampus</h2>
        <p class="subtitle">Silakan login untuk melapor</p>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <div class="input-wrapper">
            <input 
              id="username"
              type="text" 
              v-model="username" 
              placeholder="NIM / NIDN" 
              required 
            />
            <span class="icon">👤</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <input 
              id="password"
              type="password" 
              v-model="password" 
              placeholder="Masukan password" 
              required 
            />
            <span class="icon">🔒</span>
          </div>
        </div>

        <button type="submit" class="btn-login">
          LOGIN
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    await authStore.login(username.value, password.value);
    
    // CEK ROLE DISINI
    if (authStore.user.role === 'admin') {
        router.push('/admin-dashboard');
    } else {
        router.push('/dashboard');
    }
    
    alert("Login Berhasil!");
  } catch (error) {
    alert("Login Gagal!");
  }
};
</script>

<style scoped>
/* Reset dasar & Font */
* {
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* Background Gradient Biru Kampus */
  background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
  padding: 20px;
}

.login-card {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 20px;
  /* Shadow yang lebih dalam agar card terlihat melayang */
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  transition: transform 0.3s ease;
}

.logo-wrapper {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.logo {
  width: 80px; /* Sesuaikan ukuran logo */
  height: 80px;
  object-fit: contain;
  margin-bottom: 10px;
}

.header-text h2 {
  color: #333;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: #444;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

input {
  width: 100%;
  padding: 12px 15px 12px 40px; /* Padding kiri lebih besar untuk icon */
  border: 2px solid #e1e1e1;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  outline: none;
  background-color: #f9f9f9;
}

.icon {
  position: absolute;
  left: 12px;
  font-size: 1.1rem;
  opacity: 0.5;
}

/* Efek saat input diklik/fokus */
input:focus {
  border-color: #26d0ce;
  background-color: #fff;
  box-shadow: 0 0 0 4px rgba(38, 208, 206, 0.1);
}

.btn-login {
  width: 100%;
  padding: 14px;
  background: linear-gradient(to right, #1a2980, #26d0ce);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  letter-spacing: 0.5px;
  margin-top: 10px;
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(26, 41, 128, 0.4);
}

.btn-login:active {
  transform: translateY(0);
}

/* Responsif untuk layar kecil */
@media (max-width: 480px) {
  .login-card {
    padding: 2rem;
  }
}
</style>