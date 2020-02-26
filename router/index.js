import Vue from 'vue'
import VueRouter from 'vue-router'

// import Home from '@/components/home.vue'
const Home = () => import(/* webpackChunkName: "home-login-welcome" */ '@/components/home.vue')

// import Login from '@/components/login.vue'
const Login = () => import(/* webpackChunkName: "home-login-welcome" */ '@/components/login.vue')
// import welcome from '@/components/welcome.vue'
const welcome = () => import(/* webpackChunkName: "home-login-welcome" */ '@/components/welcome.vue')

// import Users from '@/components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "user" */ '@/components/user/Users.vue')


// import Rights from '@/components/power/rights.vue'
const Rights = () => import(/* webpackChunkName: "rights-roles" */ '@/components/power/rights.vue')
// import Roles from '@/components/power/roles.vue'
const Roles = () => import(/* webpackChunkName: "rights-roles" */  '@/components/power/roles.vue')

// import cate from '@/components/goods/cate.vue'
const cate = () => import(/* webpackChunkName: "cate-params-goods-add" */  '@/components/goods/cate.vue')
// import params from '@/components/goods/params.vue'
const params = () => import(/* webpackChunkName: "cate-params-goods-add" */  '@/components/goods/params.vue')
// import goods from '@/components/goods/goods.vue'
const goods = () => import(/* webpackChunkName: "cate-params-goods-add" */ '@/components/goods/goods.vue')
// import add from '@/components/goods/add.vue'
const add = () => import(/* webpackChunkName: "cate-params-goods-add" */ '@/components/goods/add.vue')

// import orders from '@/components/order/orders.vue'
const orders = () => import(/* webpackChunkName: "orders" */'@/components/order/orders.vue')

// import reports from '@/components/reports/reports.vue'
const reports = () => import(/* webpackChunkName: "reports" */'@/components/reports/reports.vue')

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    name: 'Login',
    component: Login,
  }, {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      name: 'welcome',
      component: welcome
    },{
      path:'/users',
      name:'user',
      component:Users
    },{
      path:'/rights',
      name:'rights',
      component:Rights
    },{
      path:'/roles',
      name:'roles',
      component:Roles
    },
    {
      path:'/categories',
      name:'cate',
      component:cate
    },
    {
      path:'/params',
      name:'params',
      component:params
    },
    {
      path:'/goods',
      name:'goods',
      component:goods
    },
    {
      path:'/goods/add',
      name:'add',
      component:add
    },
    {
      path:'/orders',
      name:'orders',
      component:orders
    },
    {
      path:'/reports',
      name:'reports',
      component:reports
    }
  ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, form, next) => {
  //next() 放行 next('/login')强制跳转
  if (to.path == '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router