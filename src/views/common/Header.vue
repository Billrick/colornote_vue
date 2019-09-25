<template>
  <div class="nav">
    <div class="logo">
      <div class="title animated bounceInLeft">{{userBlogBody.blogtitle}}</div>
      <div class="subtitle animated fadeInLeft">{{ userBlogBody.blogsubtitle }}</div>
    </div>
    <transition name="el-zoom-in-center">
      <div v-show="mobileNav" class="pcNav">
        <ul>
          <li v-for="nav in navList" :key="nav.id">
            <router-link tag="div" :to="'/' + username + nav.url">
              <i :class="nav.icon" aria-hidden="true"></i> {{ nav.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </transition>

    <div v-show="!mobileNav" class="mNav">
      <el-collapse-transition>
        <ul v-show="showMobileLi">
          <li v-for="nav in navList" :key="nav.id" @click="showLi">
            <router-link tag="div" :to="'/' + username + nav.url">
              <a href="#"
                ><i :class="nav.icon" aria-hidden="true"></i> {{ nav.name }}</a
              >
            </router-link>
          </li>
        </ul>
      </el-collapse-transition>
    </div>
    <transition name="el-zoom-in-top">
      <img v-show="!mobileNav" :src="moreImg" @click="showLi" />
    </transition>
  </div>
</template>
<script>
export default {
  created: function() {
    if (this.screenWidth >= 878) {
      this.mobileNav = true;
      this.showMobileLi = false;
    }
  },
  props: ["username","userBlogBody"],
  data: function() {
    return {
      mobileNav: false,
      showMobileLi: false,
      moreImg: require("@/assets/img/more.png"),
      screenWidth: document.documentElement.clientWidth,
      navList: [
        { id: "1", icon: "fa fa-home", name: "首页", url: "/" },
        { id: "2", icon: "fa fa-calendar", name: "时间轴", url: "/time" },
        { id: "3", icon: "fa fa-tags", name: "分类/标签", url: "/categoryTags" },
        { id: "4", icon: "fa fa-user-secret", name: "关于我", url: "/about" },
        { id: "5", icon: "fa fa-search", name: "搜索", url: "/search" },
        {
          id: "6",
          icon: "fa fa-pencil-square",
          name: "写博客",
          url: "/writeBlogArticle"
        }
      ]
    };
  },
  methods: {
    showLi: function() {
      this.showMobileLi = !this.showMobileLi;
      if (this.showMobileLi) {
        this.moreImg = require("@/assets/img/close.png");
      } else {
        this.moreImg = require("@/assets/img/more.png");
      }
    }
  },
  mounted() {
    var _this = this;
    window.onresize = function() {
      // 定义窗口大小变更通知事件
      _this.screenWidth = document.documentElement.clientWidth; //窗口宽度
      if (_this.screenWidth >= 878) {
        _this.mobileNav = true;
        _this.showMobileLi = false;
      } else {
        _this.mobileNav = false;
        _this.showMobileLi = false;
      }
    };
  }
};
</script>
<style lang="less" scoped>
.router-link-exact-active{
  background: #f1f1f1;
}
body {
  margin: 0;
  padding: 0;
}
.nav {
  position: relative;
  background-color: #fff;
  height: 78px;
  width: 100%;
  //border-bottom: 1px solid #DADADA;
  display: flex;
  justify-content: center;
  max-width: 1000px;
  margin: 0 auto;
  justify-content: space-between;
  .logo {
    display: inline-block;
    margin-right: 30px;
    position: relative;
    width: 250px;
  }
  .pcNav {
    display: inline-block;
  }
  .title {
    height: 57px;
    line-height: 57px;
    padding: 0 15px;
    text-align: left;
    color: #666;
    font-weight: bold;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
    font-size: 40px;
  }
  .subtitle {
    height: 23px;
    padding: 0 15px;
    text-align: left;
    font-size: 18px;
    font-weight: 600;
    font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
    position: absolute;
  }
  img {
    position: absolute;
    right: 20px;
    top: 30px;
    width: 28px;
    //display: none;
  }
  ul {
    display: inline-block;
    list-style: none;
    margin: 0;
    padding: 0;
    text-align: center;
    li {
      height: 78px;
      width: 108px;
      line-height: 78px;
      text-align: center;
      display: inline-block;
      a {
        text-decoration: none;
        color: #666;
        padding-bottom: 8px;
      }
    }
    li:hover {
      cursor: pointer;
    }
    li .actived {
      border-bottom: 3px solid #ee5c42;
    }
  }
}
.mNv{
  box-shadow: 0 0 5px 0 rgba(38, 42, 48, 0.1);
}
/*屏幕宽度小于878px的时候执行里面的css*/
@media only screen and (max-width: 878px) {
  .nav {
    // img{
    //     //display: inline;
    // }
    ul {
      position: absolute;
      right: 0;
      text-align: right;
      top: 78px;
      width: 100%;
      background: #fff;
      z-index: 100;
      //display: none;
      li {
        display: block;
        border-bottom: 1px solid #f5f5f5;
        height: 35px;
        line-height: 35px;
        width: 100%;

        // width: 98px;
        a {
          display: block;
          padding-bottom: 0;
          text-align: left;
          padding-left: 15px;
        }
        a:hover {
          background-color: #6e6e6e;
          color: #fff;
        }
      }
      li .actived {
        border-bottom: none;
      }
    }
  }
}
</style>
