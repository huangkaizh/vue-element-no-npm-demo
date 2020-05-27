// const Layout = httpVueLoader("src/layout/index.vue");
import Layout from "../layout/index.vue.js";
import Redirect from "../pages/redirect/index.vue.js";
import tablesRouter from "./tables.js";

window.tablesRouter = tablesRouter;

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: Redirect
      }
    ]
  },
  {
    name: "login",
    path: "/login",
    component: httpVueLoader("src/pages/login.vue"),
    hidden: true
  },
  // {
  //   path: '/auth-redirect',
  //   component: () => import('@/views/login/auth-redirect'),
  //   hidden: true
  // },
  {
    path: "/404",
    component: httpVueLoader("src/pages/error-page/404.vue"),
    hidden: true
  },
  {
    path: "/401",
    component: httpVueLoader("src/pages/error-page/401.vue"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: httpVueLoader("src/pages/pageA.vue"),
        name: "dashboard",
        meta: { title: "仪表板", icon: "dashboard", affix: true }
      }
    ]
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/tableGenerator",
    component: Layout,
    children: [
      {
        path: "index",
        component: httpVueLoader("src/pages/tableGenerator/index.vue"),
        name: "tableGenerator",
        meta: { title: "表格生成器", icon: "table", noCache: true }
      }
    ]
  },
  tablesRouter,
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new VueRouter({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
