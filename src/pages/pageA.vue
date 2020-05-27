<template>
  <div id="pageA">
    pageA
    <page-a-child></page-a-child>
    <span>{{ obj.a }}</span>
  </div>
</template>

<script>
module.exports = {
  components: {
    PageAChild: httpVueLoader("src/components/pageA/PageAChild.vue")
  },
  data() {
    return {
      obj: {
        a: 1
      }
    };
  },
  //   methods: {
  //     loadScript(url) {
  //       return new Promise(resolve => {
  //         var script = document.createElement("script");
  //         script.type = "text/javascript";
  //         script.src = url;
  //         document.body.appendChild(script);
  //         console.log("loadScript url", url);
  //         script.onload = () => {
  //           resolve();
  //         };
  //       });
  //     }
  //   },
  beforeCreate() {
    console.log("pageA beforeCreate");
  },
  created() {
    console.log("pageA created");
  },
  beforeMount() {
    console.log("pageA beforeMount");
  },
  mounted() {
    console.log("pageA mounted");
    loadScript("https://code.jquery.com/jquery-3.4.1.min.js").then(() => {
      var root = $("#root");
      console.log("root", root);
    });
  },
  activated() {
    console.log("pageA activated");
  },
  deactivated() {
    console.log("pageA deactivated");
  },
  beforeUpdate() {
    console.log("pageA beforeUpdate");
  },
  updated() {
    console.log("pageA updated");
  },
  beforeDestroy() {
    console.log("pageA beforeDestroy");
  },
  destroyed() {
    console.log("pageA destroyed");
  },
  errorCaptured(err, vm, info) {
    console.log("pageA errorCaptured");
    console.log("err", err);
    console.log("vm", vm);
    console.log("info", info);
    return false;
  }
};
</script>
