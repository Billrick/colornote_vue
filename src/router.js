import Vue from "vue";
import Router from "vue-router";
import blog from "@/views/blog/blog.vue";
import blogList from "./views/blog/blogList.vue";
import writeBlogArticle from "@/views/blog/writeBlogArticle.vue";
import editBlogArticle from "@/views/blog/editBlogArticle.vue";
import blogArticleInfo from "@/views/blog/blogArticleInfo.vue";
import login from "@/views/blog/login.vue";
import register from "@/views/blog/register.vue";
import EuserInfo from "@/views/blog/EditUserInfo.vue";
import createBlog from "@/views/blog/createBlog.vue";

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
      name: "home", //主页
      component: blog,
      children: [
        {
          path: "",
          name: "index", //博客首页
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
          path: "userInfo",
          name: "userInfo", //用户信息 编辑
          component: EuserInfo
        },
        {
          path: "about",
          name: "about",
          component: () =>
            import(/* webpackChunkName: "about" */ "./views/blog/About.vue")
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
      let accessUser = accessToken.split("-")[0];
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
