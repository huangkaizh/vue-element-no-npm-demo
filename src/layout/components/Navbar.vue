<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
    ></hamburger>

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <header-search id="header-search" class="right-menu-item"></header-search>

        <error-log class="errLog-container right-menu-item hover-effect"></error-log>

        <screenfull id="screenfull" class="right-menu-item hover-effect"></screenfull>

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect"></size-select>
        </el-tooltip>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar"></img>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <a
            target="_blank"
            href="https://github.com/PanJiaChen/vue-element-admin/"
          >
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a
            target="_blank"
            href="https://panjiachen.github.io/vue-element-admin-site/#/"
          >
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
const mapGetters = Vuex.mapGetters;
// import { mapGetters } from 'Vuex'
// import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'

module.exports = {
  components: {
    Breadcrumb: httpVueLoader("src/components/Breadcrumb/index.vue"),
    Hamburger: httpVueLoader("src/components/Hamburger/index.vue"),
    ErrorLog: httpVueLoader("src/components/ErrorLog/index.vue"),
    Screenfull: httpVueLoader("src/components/Screenfull/index.vue"),
    SizeSelect: httpVueLoader("src/components/SizeSelect/index.vue"),
    HeaderSearch: httpVueLoader("src/components/HeaderSearch/index.vue")
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"])
    // ...mapGetters(["sidebar", "device"])
  },
  created() {
    console.log("avatar", this.avatar);
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.navbar .hamburger-container {
  line-height: 46px;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
}

.navbar .hamburger-container:hover {
  background: rgba(0, 0, 0, 0.025);
}

.navbar .breadcrumb-container {
  float: left;
}

.navbar .errLog-container {
  display: inline-block;
  vertical-align: top;
}

.navbar .right-menu {
  float: right;
  height: 100%;
  line-height: 50px;
}

.navbar .right-menu:focus {
  outline: none;
}

.navbar .right-menu .right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: #5a5e66;
  vertical-align: text-bottom;
}

.navbar .right-menu .right-menu-item.hover-effect {
  cursor: pointer;
  transition: background 0.3s;
}

.navbar .right-menu .right-menu-item.hover-effect:hover {
  background: rgba(0, 0, 0, 0.025);
}

.navbar .right-menu .avatar-container {
  margin-right: 30px;
}

.navbar .right-menu .avatar-container .avatar-wrapper {
  margin-top: 5px;
  position: relative;
}

.navbar .right-menu .avatar-container .avatar-wrapper .user-avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

.navbar .right-menu .avatar-container .avatar-wrapper .el-icon-caret-bottom {
  cursor: pointer;
  position: absolute;
  right: -20px;
  top: 25px;
  font-size: 12px;
}
</style>
