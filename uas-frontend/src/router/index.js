import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import ComplaintForm from '../views/ComplaintForm.vue';
import ComplaintDetail from '../views/ComplaintDetail.vue'; 
import EditComplaint from '../views/EditComplaint.vue';     
import AdminDashboard from '../views/AdminDashboard.vue'; 
import NewsFeed from '../views/NewsFeed.vue';

const routes = [
    { path: '/', name: 'Login', component: Login },
    { 
        path: '/dashboard', 
        name: 'Dashboard', 
        component: Dashboard, 
        meta: { requiresAuth: true } 
    },
    {
        path: '/complaint/create',
        name: 'CreateComplaint',
        component: ComplaintForm,
        meta: { requiresAuth: true }
    },
    {
        path: '/complaint/:id',
        name: 'ComplaintDetail',
        component: ComplaintDetail,
        meta: { requiresAuth: true }
    },
    {
        path: '/complaint/:id/edit',
        name: 'EditComplaint',
        component: EditComplaint,
        meta: { requiresAuth: true }
    },

    {
        path: '/admin-dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true }
    },
    
    {
        path: '/news',
        name: 'NewsFeed',
        component: NewsFeed,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    
    if (to.meta.requiresAuth && !token) {
        next('/'); 
    } else {
        next();
    }
});

export default router;