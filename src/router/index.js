import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '../views/Register.vue'
import Homepage from '../views/Homepage.vue'
import CourseTask from '../views/CourseTask.vue'
import CourseExam from '../views/CourseExam.vue'
import Info from '../views/PersonalInfo.vue'
import ReadFile from '../views/ReadFile.vue'
import Notice from '../views/Notice.vue'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/homepage',
    name: 'Homepage',
    component: Homepage
  },
  {
    path: '/course',
    name: 'Course',
    component: resolve => (require(['@/views/Course'], resolve)),

  },
  {
    path: '/courseExam',
    name: 'courseExam',
    component: CourseExam,
   
  },
  {
    path: '/info',
    name: 'Info',
    component: Info,

  },
  {
    path: '/courseTask',
    name: 'CourseTask',
    component: CourseTask,
    meta: {
      requireAuth: true,
    },
  },
  {
    path:'/readFile',
    name:'readFile',
    component:ReadFile,
  },
  {
    path:'/notice',
    name:'notice',
    component:Notice
  }
]

const router = new VueRouter({
  //  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
