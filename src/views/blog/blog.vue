<template>
    <div>
        <el-container>
        <transition name = "fade">
            <el-aside class="leftPanel" ref="leftPanel" :width="leftPanel + 'px'">
            <leftcenter @togglePanel="togglePanel" :userBlogBody="userBlogBody"></leftcenter>
            <div class="showIcon" :style="{right:showIconLeft+'px'}">
                <i class="fa fa-chevron-circle-left fa-2x" @click="togglePanel" v-show="!iconShow" aria-hidden="true"></i>
                <i class="fa fa-chevron-circle-right fa-2x" @click="togglePanel" style="color:white;" v-show="iconShow" aria-hidden="true"></i>
            </div>
            </el-aside>
        </transition>
        <el-container>
            <el-header>
            <!-- <router-view name="header" /> -->
            <mheader :username="username" :userBlogBody="userBlogBody"></mheader>
            </el-header>
            <el-main>
              <router-view @getChildComponentVal="getChildComponentVal" :userBlogBody="userBlogBody" :scrollTopHeight="scrollTopHeight" />
            </el-main>
            <el-footer>
            <!-- <router-view name="footer" /> -->
            <mfooter></mfooter>
            </el-footer>
        </el-container>
        </el-container>
    </div>
</template>
<script>
import mheader from "@/views/common/Header.vue";
import mfooter from "@/views/common/Footer.vue";
import leftcenter from "@/views/common/LeftUserCenter.vue";

import { setHeader } from "@/api/axiosUtil.js";
import { blogApi } from "@/api/api.js";

export default {
  created: function() {
    this.username = this.$route.params.username;
    this.headers = {username: this.username};
    blogApi.queryBlogSiteByUsername(this.username, this.headers).then(res => {
          if (res.code == 200) {
            this.userBlogBody = res.data;
            let accessToken = this.$cookies.get("accessToken");
            let accessUsername = accessToken.split("-")[0];
            console.log(accessUsername , this.username);
            if(accessUsername == this.username){
              this.userBlogBody.accessToken = accessToken;
              setHeader("accessToken", accessToken);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
  },
  props:["scrollTopHeight"],
  data: function() {
    return {
      username: this.$route.params.username,
      //侧边栏面板宽度
      leftPanel: 0,
      //侧边栏ICON 距离左边距离
      showIconLeft:20,
      //侧边栏ICON
      iconShow:false,
      //请求头
      headers:{},
      //博客信息
      userBlogBody:{},
      //回到顶部ICON
      //topiconShow:false,
      timer:null
    };
  },
  methods:{
    togglePanel:function(){//切换侧边栏
      if(this.leftPanel==0){
          var i = setInterval(() => {
            this.leftPanel = this.leftPanel + 7;
            //this.showIconLeft = this.showIconLeft + 7;   //ICON的移动
            if(this.leftPanel>=260){
              clearInterval(i);
              this.leftPanel = 250;
              //this.showIconLeft = 265;
              this.iconShow = true;
            }
          }, 5);
      }else if(this.leftPanel==250){
          var i = setInterval(() => {
            this.leftPanel = this.leftPanel - 7;
            //this.showIconLeft = this.showIconLeft - 7;
            if(this.leftPanel<=10){
              clearInterval(i);
              this.leftPanel = 0;
              //this.showIconLeft = 15;
              this.iconShow = false;
            }
          }, 5);
      }
    },
    getChildComponentVal(field,v){ //子组件传值给父组件
      this[field] = v;
    }
  },
  components: {
    mheader,
    mfooter,
    leftcenter
  }
};
</script>
<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
body {
  margin: 0;
  padding: 0;
}
.el-header {
  padding: 0 0 !important;
  height: 79px !important;
  border-bottom: 1px solid #dadada;
  box-shadow: 0 0 5px 0 rgba(38, 42, 48, 0.1);
}
.el-footer {
  padding: 0 0 !important;
  height: auto!important;
}
.el-main {
  min-height: calc(100vh - 120px);
  max-width: 1050px;
  margin: 0 auto;
  width: 100%;
}
//侧边栏
.el-aside{
  position: fixed;
  z-index: 9999;
  height: 100%;
  background: #122e4a;
  box-shadow: 0px 2px 11px #000;
  right: 0px;
}
.showIcon{
    position: fixed;
    width: 28px;
    right: 250px;
    bottom: 160px;
    cursor: pointer;
}
.showTopIcon{
    position: fixed;
    left: 250px;
    bottom: 120px;
    cursor: pointer;
}

@media only screen and (max-width: 878px) {
  .el-main {
    padding: 8px!important;
  }
}
</style>