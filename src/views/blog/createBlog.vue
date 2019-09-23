<template>
    <div>
        <img :src="logoImg" alt="" class="logo">
        <el-container>
            <el-main>
              <component :is="'createBlogSetps'" :userBlogBody="userBlogBody"></component>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import createBlogSetps from "@/views/blog/createBlogSteps.vue";
import { blogApi } from "@/api/api.js";
import { setHeader } from "@/api/axiosUtil.js";

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
      userBlogBody: {},
      logoImg: require("@/assets/img/logo2.png")
    };
  },
  methods:{
    getChildComponentVal(field,v){ //子组件传值给父组件
      this[field] = v;
    }
  },
  components:{
    createBlogSetps
  }
};
</script>
<style lang="less" scoped>
  .logo{
    margin: 15px 0px 20px 0px;
  }
</style>