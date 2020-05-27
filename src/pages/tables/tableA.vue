<template>
  <div>
    tableA
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
    console.log("tableA beforeCreate");
  },
  created() {
    console.log("tableA created");
  },
  beforeMount() {
    console.log("tableA beforeMount");
  },
  mounted() {
    console.log("tableA mounted");
  },
  activated() {
    console.log("tableA activated");
  },
  deactivated() {
    console.log("tableA deactivated");
  },
  beforeUpdate() {
    console.log("tableA beforeUpdate");
  },
  updated() {
    console.log("tableA updated");
  },
  beforeDestroy() {
    console.log("tableA beforeDestroy");
  },
  destroyed() {
    console.log("tableA destroyed");
  }
};
</script>
