import Layout from "../layout/index.vue.js";

const tablesRouter = {
  path: "/tables",
  component: Layout,
  redirect: "/tables/user",
  name: "tables",

  meta: {
    title: "已生成表格",
    icon: "table"
  },

  children: [{
    path: "user",
    component: httpVueLoader("src/pages/tables/user.vue"),
    name: "user",

    meta: {
      title: "用户",
      noCache: true
    }
  }, {
    path: "tableA",
    component: httpVueLoader("src/pages/tables/tableA.vue"),
    name: "tableA",

    meta: {
      title: "表格A",
      noCache: true
    }
  }, {
    path: "tableB",
    component: httpVueLoader("src/pages/tables/tableB.vue"),
    name: "tableB",

    meta: {
      title: "表格B",
      noCache: true
    }
  }, {
    path: "account",
    component: httpVueLoader("src/pages/tables/account.vue"),
    name: "account",

    meta: {
      title: "账号",
      noCache: true
    }
  }]
};

export default tablesRouter;