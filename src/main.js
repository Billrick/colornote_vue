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

Vue.filter("dateFormate", function(value, formate) {
  let now = new Date(value);
  let seperator1 = "-";
  //格式化日，如果小于9，前面补0
  let day = ("0" + now.getDate()).slice(-2);
  //格式化月，如果小于9，前面补0
  let month = ("0" + (now.getMonth() + 1)).slice(-2);
  //拼装完整日期格式
  //var today = now.getFullYear() + seperator1 + month + seperator1 + day;
  let today = "";
  let hours = now.getHours();
  let minutes = now.getMinutes();
  hours = hours >= 10 ? hours : "0" + hours;
  minutes = minutes >= 10 ? minutes : "0" + minutes;

  switch (formate) {
    case "yyyy-MM-dd":
      today = now.getFullYear() + seperator1 + month + seperator1 + day;
      break;
    case "yyyy-MM-dd hh:mm":
      today = now.getFullYear() + seperator1 + month + seperator1 + day + " " + hours + ":" + minutes;
      break;
    case "yyyy年MM月dd日":
      today = now.getFullYear() + "年" + month + "月" + day + "日";
      break;
    case "yyyy年MM月":
      today = now.getFullYear() + "年" + month + "月";
      break;
    case "yyyy年MM月 hh:mm":
      today = now.getFullYear() + seperator1 + month + seperator1 + day + " " + hours + ":" + minutes;
      break;
  }
  return today;
});

new Vue({
  router,
  store,
  render: h => h(App),
  watch: {}
}).$mount("#app");
