import Vue from "vue";
import Router from "vue-router";

//------------------- 个人博客
import blog from "@/views/blog/blog.vue";
import blogList from "./views/blog/blogList.vue";
import writeBlogArticle from "@/views/blog/writeBlogArticle.vue";
import editBlogArticle from "@/views/blog/editBlogArticle.vue";
import blogArticleInfo from "@/views/blog/blogArticleInfo.vue";
import login from "@/views/blog/login.vue";
import register from "@/views/blog/register.vue";
import EuserInfo from "@/views/blog/EditUserInfo.vue";
import createBlog from "@/views/blog/createBlog.vue";
import categoryTags from "@/views/blog/tags/categoryTags.vue";
import timeline from "@/views/blog/timeline/timeline.vue";

//------------------- 聊天广场
import chatSquare from "@/views/communityPlatform/chatSquare.vue";
import index from "@/views/communityPlatform/index.vue";


import { TkApi } from "@/api/api.js";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(Router);

const router = new Router({
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition;
  //   } else {
  //     return { x: 0, y: 0 };
  //   }
  // },
  routes: [
    //博客页面
    {
      path: "/:username",
      component: blog,
      children: [
        {
          path: "",
          name: "index", //博客首页
          component: blogList
        },
        {
          path: "blogList",
          name: "blogList", // 标签和分类 跳转 文章列表
          component: blogList
        },
        {
          path: "writeBlogArticle",
          name: "writeBlogArticle", //写博客页面
          component: writeBlogArticle
        },
        {
          path: "editBlogArticle",
          name: "editBlogArticle", //修改博客页面
          component: editBlogArticle
        },
        {
          path: "blogArticleInfo/:id",
          name: "blogArticleInfo", //博客详情
          component: blogArticleInfo
        },
        {
          path: "categoryTags",
          name: "categoryTags", // 分类 和 标签
          component: categoryTags
        },
        {
          path: "userInfo",
          name: "userInfo", //用户信息 编辑
          component: EuserInfo
        },
        {
          path: "timeline",
          name: "timeline", //时间轴
          component: timeline
        },
        {
          path: "about",
          name: "about",
          component: () =>
            import(
              /* webpackChunkName: "about" */ "./views/blog/about/About.vue"
            )
        }
      ]
    },
    {
      path: "/chatSquare", //聊天广场
      component: chatSquare,
      children: [
        {
          path: "index",
          name: "index", //时间轴
          component: index
        }
      ]
    },
    {
      path: "/:username/createBlog",
      name: "createBlog", // 博客创建
      component: createBlog
    },
    {
      path: "/u/login",
      name: "login", //登录
      component: login
    },
    {
      path: "/u/register",
      name: "register", //注册
      component: register
    }
  ]
});

router.beforeEach((to, from, next) => {
  document.querySelector("#app").scrollTo(0, 0);
  NProgress.start();
  let accessToken = Vue.cookies.get("accessToken");
  let blogusername = to.params.username;
  if (
    to.path == "/" + blogusername + "/writeBlogArticle" ||
    to.path == "/" + blogusername + "/createBlog" ||
    to.path == "/" + blogusername + "/userInfo"
  ) {
    if (accessToken != undefined) {
      accessToken = decodeURIComponent(accessToken);
      let publicToken = TkApi.Decrypt(accessToken);
      let accessUser = publicToken.split("-")[0];
      if (accessUser == blogusername) {
        next();
        return;
      }
    }
    next({
      path: "/u/login",
      query: {
        redirect: to.fullPath
      }
    });
    return;
  }
  next();
});

router.afterEach(() => {
  //to, from 形参
  NProgress.done();
});

export default router;
