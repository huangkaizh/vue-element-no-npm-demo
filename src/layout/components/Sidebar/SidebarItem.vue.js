import Item from "./Item.vue.js";

export default {
  name: "SidebarItem",
  template: `
    <div v-if="!item.hidden" class="menu-wrapper">
      <template
        v-if="
          hasOneShowingChild(item.children, item) &&
            (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
            !item.alwaysShow
        "
      >
        <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
          <el-menu-item
            :index="resolvePath(onlyOneChild.path)"
            :class="{ 'submenu-title-noDropdown': !isNest }"
          >
            <item
              :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
              :title="onlyOneChild.meta.title"
            ></item>
          </el-menu-item>
        </app-link>
      </template>

      <el-submenu
        v-else
        ref="subMenu"
        :index="resolvePath(item.path)"
        popper-append-to-body
      >
        <template slot="title">
          <item
            v-if="item.meta"
            :icon="item.meta && item.meta.icon"
            :title="item.meta.title"
          ></item>
        </template>
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :is-nest="true"
          :item="child"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        ></sidebar-item>
      </el-submenu>
    </div>
  `,
  components: {
    Item: Item,
    AppLink: httpVueLoader("src/layout/components/Sidebar/Link.vue")
  },
  // mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null;
    return {};
  },
  computed: {
    device() {
      return this.$store.state.app.device;
    }
  },
  mounted() {
    // In order to fix the click on menu on the ios device will trigger the mouseleave bug
    // https://github.com/PanJiaChen/vue-element-admin/issues/1135
    this.fixBugIniOS();
  },
  methods: {
    fixBugIniOS() {
      const $subMenu = this.$refs.subMenu;
      if ($subMenu) {
        const handleMouseleave = $subMenu.handleMouseleave;
        $subMenu.handleMouseleave = e => {
          if (this.device === "mobile") {
            return;
          }
          handleMouseleave(e);
        };
      }
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    }
  }
};