import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//elementui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
//icon
import "font-awesome/css/font-awesome.min.css";
//动画效果
import animate from "animate.css";
//markdown编辑器
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
//markdown 样式
import "github-markdown-css";
//代码高亮
import highlight from "@/config/highlightConf.js";

//图片预览组件
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";

//cookie 操作
import VueCookies from "vue-cookies";

// //滚动条插件
// import { HappyScroll } from "vue-happy-scroll";
// //自定义组件名
// Vue.component("happy-scroll", HappyScroll);
// // 引入css
// import "vue-happy-scroll/docs/happy-scroll.css";

Vue.use(animate);
Vue.use(ElementUI);
Vue.use(mavonEditor);
Vue.use(Viewer);
Vue.use(VueCookies);

//绑定指令  使用v-highlight 开启高亮
Vue.use(highlight);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  watch: {}
}).$mount("#app");
