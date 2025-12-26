import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || '', // Ambil token dari local storage
        user: null
    }),
    getters: {
        isLoggedIn: (state) => !!state.token // Cek apakah ada token
    },
    actions: {
        async login(username, password) {
            try {
                // Tembak API Login Backend kamu
                const response = await axios.post('http://localhost:5000/api/auth/login', {
                    username, 
                    password
                });

                // Simpan token ke state & local storage
                this.token = response.data.token;
                this.user = response.data.user;
                localStorage.setItem('token', this.token);
                
                return true; // Login sukses
            } catch (error) {
                console.error("Login Gagal:", error);
                throw error;
            }
        },
        logout() {
            this.token = '';
            this.user = null;
            localStorage.removeItem('token');
            // Redirect ke halaman login akan dihandle di component
        }
    }
});