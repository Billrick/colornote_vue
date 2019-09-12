import Hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css";
//这里解释一下为什么要安装两个依赖：vue-highlight.js只是实现了代码高亮的功能，他的安装包里是没有css的样式文件的，
//因此我们还需要安装一个highlight.js来实现真正的样式。
//import 'highlight.js/styles/googlecode.css'

let Highlight = {};
//绑定指令
Highlight.install = (Vue /*, options*/) => {
  Vue.directive("highlight", el => {
    let blocks = el.querySelectorAll("pre code");
    blocks.forEach(block => {
      Hljs.highlightBlock(block);
    });
  });
};

export default Highlight;
