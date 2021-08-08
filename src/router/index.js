import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/AddSecurityRule',
    component: Layout,
    redirect: '/About/index',
    name: '添加规则',
    meta: { title: '添加规则', icon: 'el-icon-s-unfold' },
    children: [
      {
        path: 'AddSecurityRuleToAll',
        name: '向所有安全组',
        component: () => import('@/views/AddSecurityRuleToAll/index'),
        meta: { title: '向所有安全组', icon: 'el-icon-caret-right' }
      },
      {
        path: 'AddSecurityRuleByGroupID',
        name: '根据安全组ID',
        component: () => import('@/views/AddSecurityRuleByGroupID/index'),
        meta: { title: '根据安全组ID', icon: 'el-icon-caret-right' }
      },
      {
        path: 'AddSecurityRuleByIP',
        name: '根据目标地址',
        component: () => import('@/views/AddSecurityRuleByIP/index'),
        meta: { title: '根据目标地址', icon: 'el-icon-caret-right' }
      }
    ]
  },

  {
    path: '/DeleteSecurityRule',
    component: Layout,
    redirect: '/About/index',
    name: '删除规则',
    meta: { title: '删除规则', icon: 'el-icon-s-unfold' },
    children: [
      {
        path: 'DeleteSecurityRuleToAll',
        name: '向所有安全组',
        component: () => import('@/views/DeleteSecurityRuleToAll/index'),
        meta: { title: '向所有安全组', icon: 'el-icon-caret-right' }
      },
      {
        path: 'DeleteSecurityRuleByGroupID',
        name: '根据安全组ID',
        component: () => import('@/views/DeleteSecurityRuleByGroupID/index'),
        meta: { title: '根据安全组ID', icon: 'el-icon-caret-right' }
      },
      {
        path: 'DeleteSecurityRuleByIP',
        name: '根据目标地址',
        component: () => import('@/views/DeleteSecurityRuleByIP/index'),
        meta: { title: '根据目标地址', icon: 'el-icon-caret-right' }
      }
    ]
  },

  {
    path: '/About',
    component: Layout,
    children: [
      {
        path: 'About',
        component: () => import('@/views/About/index'),
        meta: { title: 'About', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
