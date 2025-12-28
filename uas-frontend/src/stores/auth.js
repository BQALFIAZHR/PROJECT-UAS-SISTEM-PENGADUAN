import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || '', 
        user: null
    }),
    getters: {
        isLoggedIn: (state) => !!state.token 
    },
    actions: {
        async login(username, password) {
            try {
                
                const response = await axios.post('http://localhost:5000/api/auth/login', {
                    username, 
                    password
                });

               
                this.token = response.data.token;
                this.user = response.data.user;
                localStorage.setItem('token', this.token);
                
                return true; 
            } catch (error) {
                console.error("Login Gagal:", error);
                throw error;
            }
        },
        logout() {
            this.token = '';
            this.user = null;
            localStorage.removeItem('token');
            
        }
    }
});