const mapGetters = Vuex.mapGetters;
import SidebarItem from "./SidebarItem.vue.js";

export default {
  name: "Sidebar",
  template: `
    <div :class="{ 'has-logo': showLogo }">
      <logo v-if="showLogo" :collapse="isCollapse" />
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          background-color="var(--menuBg)"
          text-color="var(--menuText)"
          :unique-opened="false"
          active-text-color="var(--menuActiveText)"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item
            v-for="route in permission_routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </el-scrollbar>
    </div>
  `,
  components: {
    SidebarItem: SidebarItem,
    Logo: httpVueLoader("src/layout/components/Sidebar/Logo.vue")
  },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
