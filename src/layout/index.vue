<template>
  <div :class="classObj" class="app-wrapper clearfix">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
const mapState = Vuex.mapState;
const WIDTH = 992;

module.exports = {
  name: "Layout",
  components: {
    AppMain: httpVueLoader("src/layout/components/AppMain.vue"),
    Navbar: httpVueLoader("src/layout/components/Navbar.vue"),
    RightPanel: httpVueLoader("src/components/RightPanel/index.vue"),
    Settings: httpVueLoader("src/layout/components/Settings/index.vue"),
    Sidebar: httpVueLoader("src/layout/components/Sidebar/index.vue"),
    TagsView: httpVueLoader("src/layout/components/TagsView/index.vue")
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  watch: {
    $route(route) {
      if (this.device === "mobile" && this.sidebar.opened) {
        this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
      }
    }
  },
  beforeMount() {
    window.addEventListener("resize", this.$_resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.$_resizeHandler);
  },
  mounted() {
    console.log("layout mounted");
    console.log("classObj", this.classObj);
    const isMobile = this.$_isMobile();
    if (isMobile) {
      this.$store.dispatch("app/toggleDevice", "mobile");
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: true });
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      const rect = document.body.getBoundingClientRect();
      return rect.width - 1 < WIDTH;
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile();
        this.$store.dispatch(
          "app/toggleDevice",
          isMobile ? "mobile" : "desktop"
        );

        if (isMobile) {
          this.$store.dispatch("app/closeSideBar", { withoutAnimation: true });
        }
      }
    },
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    }
  }
};
</script>

<style scoped>
.clearfix:after {
  content: "";
  display: table;
  clear: both;
}

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.app-wrapper .mobile.openSidebar {
  position: fixed;
  top: 0;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - var(--sideBarWidth));
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
