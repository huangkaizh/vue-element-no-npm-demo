<template>
  <div>
    pageB
  </div>
</template>

<script>
// const path = requirejs("./src/utils/path-browserify.js");
// import path from "../utils/path-browserify.js";
// loadScript("src/utils/path-browserify.js").then(() => {
//   console.log("path", path);
// });
// console.log("path", path);
module.exports = {
  data() {
    return {
      b: null
    };
  },
  beforeCreate() {
    console.log("pageB beforeCreate");
  },
  created() {
    console.log("pageB created");
  },
  beforeMount() {
    console.log("pageB beforeMount");
  },
  mounted() {
    console.log("pageB mounted");
  },
  activated() {
    console.log("pageB activated");
  },
  deactivated() {
    console.log("pageB deactivated");
  },
  beforeUpdate() {
    console.log("pageB beforeUpdate");
  },
  updated() {
    console.log("pageB updated");
  },
  beforeDestroy() {
    console.log("pageB beforeDestroy");
  },
  destroyed() {
    console.log("pageB destroyed");
  }
};
</script>
