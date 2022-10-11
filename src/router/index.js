import Vue from 'vue'
import VueRouter from 'vue-router'
// import i18n from './i18n/index';

Vue.use(VueRouter)

//动态设置网站标题
// Vue.directive('title',{
//   inserted:function (el,binding) {
//     document.title = el.dataset.title
//   }
// })

const routes = [
  {
    path: '/',
    name: 'Manager',
    component: ()=> import('../views/Manager.vue'),
    meta:{title:"首页",requireAuth: true},
    //  / 会重定向至/home
    redirect:"/community/table",
    children:[
      //主页界面  requireAuth 是否需要登录权限
      // {path: 'home', name: 'Home', component: ()=> import('../views/Home.vue'), meta:{title:"小区疫情信息",requireAuth: true}},
        //个人信息界面
      // {path: 'person', name: 'Person', component: ()=> import('../views/Person.vue'), meta:{title:"用户信息",requireAuth: true}},


    ]
  },

  // {
  //   path:'/admin',
  //   name:'Admin',
  //   component: ()=> import('../views/Manager.vue'),
  //   meta:{title:"管理",requireAuth: true},
  //   redirect: "admin/user",
  //   children:[
  //     // {path: 'user', name: 'User', component: ()=> import('../views/User.vue'), meta:{title:"后台管理人员信息",requireAuth: true}},
  //   ]
  // },


  {
    path: '/community',
    component: ()=> import('../views/Manager.vue'),
    name: 'table',
    meta: { title: '小区管理', icon: 'el-icon-s-help' ,requireAuth: true},
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('../views/table/index.vue'),
        meta: { title: '小区列表', icon: 'table' ,requireAuth: true}
      },

    ]
  },

  {
    path: '/owner',
    component: ()=> import('../views/Manager.vue'),
    name: 'owner',
    meta: { title: '业主信息管理', icon: 'el-icon-s-help' ,requireAuth: true},
    children: [
      {
        path: 'info',
        name: 'Info',
        component: () => import('../views/owner/info.vue'),
        meta: { title: '人员管理', icon: 'table' ,requireAuth: true}
      },
      {
        path: 'car',
        name: 'Car',
        component: () => import('../views/owner/car.vue'),
        meta: { title: '车辆管理', icon: 'table',requireAuth: true }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('../views/role/owner-role.vue'),
        meta: { title: '注册用户管理', icon: 'table',requireAuth: true }
      },
    ]
  },

  {
    path: '/parking',
    component: ()=> import('../views/Manager.vue'),
    name: 'table',
    meta: { title: '停车位管理', icon: 'el-icon-s-help',requireAuth: true },
    children: [
      {
        path: 'info',
        name: 'Info',
        component: () => import('../views/parking/info.vue'),
        meta: { title: '车位管理', icon: 'table' ,requireAuth: true}
      },

    ]
  },
  {
    path: '/property',
    component: ()=> import('../views/Manager.vue'),
    name: 'table',
    meta: { title: '服务管理', icon: 'el-icon-s-help',requireAuth: true },
    children: [
      {
        path: 'activity',
        name: 'Activity',
        component: () => import('../views/property/activity.vue'),
        meta: { title: '活动管理', icon: 'table',requireAuth: true }
      },
      {
        path: 'complaint',
        name: 'Complaint',
        component: () => import('../views/property/complaint.vue'),
        meta: { title: '投诉管理', icon: 'table' ,requireAuth: true}
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('../views/property/chat.vue'),
        meta: { title: '在线对话', icon: 'table' ,requireAuth: true}
      },
      // {
      //   path: 'complaintUser',
      //   name: 'ComplaintUser',
      //   component: () => import('../views/user/complaintInfo.vue'),
      //   meta: { title: '我要投诉', icon: 'table' ,requireAuth: true}
      // },
    ]
  },

  //登录页面
  {
    path:'/login',
    name:'Login',
    component: ()=> import('../views/login/index.vue'),
    meta:{title: "登录页面"}
  },
  //注册页面
  {
    path:'/register',
    name:'Register',
    component: () => import('../views/register/index.vue'),
    meta:{title:"注册页面"}
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//路由守卫
router.beforeEach((to, from, next) => {

  let token = localStorage.getItem("role")

  console.log('token',JSON.stringify(token))
  console.log('beforeEach',to,from)
  // document.title = to.meta.title
  console.log(to.meta.requireAuth)
  if (to.meta.requireAuth) { // 判断跳转的路由是否需要登录
    console.log('=======是否需要登录========',to.meta.requireAuth)

    if (token!=null) { // vuex.state判断token是否存在
      console.log('=======路由守卫1====',token)

      next() // 已登录
      if (to.path.includes('admin')){
        console.log('进入admin',)
        if (token.isAdmin===1){
          // Vue.prototype.$message('您是管理员用户')
          next()
        }else {
          Vue.prototype.$message({message:'非管理员,非法访问！',type:'error'})
          next({
            path:'/home',
            query: {redirect: to.fullPath}
          })

        }
      }


    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }



})


export default router
