// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import ProfileView from '../views/ProfileView.vue'
import HomeView from '../views/HomeView.vue'
import MoviesView from '../views/MoviesView.vue'  
import MovieDetailView from '../views/MovieDetailView.vue'  
import InfoView from '../views/InfoView.vue'
import MovieRegistrationView from '../views/MovieRegistrationView.vue'

const routes = [
  { path: '/', name: 'HomeView', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'Signup', component: SignupView },
  { path: '/profile', name: 'Profile', component: ProfileView },
  { path: '/movies', name: 'MoviesView', component: MoviesView },
  { path: '/movieDetail', name: 'MovieDetail', component: MovieDetailView },
  { path: '/info', name: 'Info', component: InfoView },
  { path: '/movies/register', name: 'MovieRegistration', component: MovieRegistrationView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router