<template>
  <div class="userInfo">
    <el-tabs :tab-position="'left'" >
    <el-tab-pane label="用户信息">
        <userInfo :userBlogBody="userBlogBody" @submitChildForm="submitChildForm" :showBtnGroup="true"></userInfo>
    </el-tab-pane>
    <el-tab-pane label="站点信息">站点信息</el-tab-pane>
    <el-tab-pane label="相关链接">相关链接</el-tab-pane>
    <el-tab-pane label="个性配置">个性配置</el-tab-pane>
  </el-tabs>
    
  </div>
</template>
<script>
import userInfo from "@/components/userInfo/userInfo.vue";
import {userApi} from "@/api/api.js";
export default {
  created(){
    
  },
  props: ["userBlogBody"],
  data: function(){
    return {
      
    };
  },
  methods:{
    submitChildForm(componentName,data){
      switch(componentName){
        case "userInfo":
          this.$emit("callMethod","queryUserInfo",data);
          break;
      }
    }
  },
  components:{
      userInfo
  },
  watch:{
    userBlogBody: function(n,o){ //检测属性是否传递到该组件   //直接访问该组件时 需要检测 userBlogBody 是否已经传递完毕  与上面created 形成双重保证
      let id = n.id;
      let username = n.username;
      let data = {id: id , username: username};
      let header = {username:username};
      //this.queryUserInfoById(data,header);
    }
  }
}
</script>
<style lang="less" scoped>
    .userInfo{
        padding-top: 20px;
    }
    /deep/ .el-tabs__item{
      padding: 0 15px;
    }
</style>