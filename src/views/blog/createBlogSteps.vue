<template>
    <div class="createBlog">
        <el-steps :active="active" finish-status="success" align-center>
            <el-step title="完善用户信息"></el-step>
            <el-step title="填写站点信息"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        <div class="stepContent">
            <component ref="com" v-if="!finish" :is="comName" :userBlogBody="userBlogBody" @next="next" :showBtnGroup="false"></component>
            <img :src="finishImg" class="finishImg" alt="" v-if="finish" >
        </div>
        <div class="btngroup">
            <el-button v-if="prevBtn" style="margin-top: 12px;" @click="prev">上一步</el-button>
            <el-button v-if="nextBtn" type="primary" style="margin-top: 12px;" @click="next('0')">下一步</el-button>
            <el-button v-if="completeBtn" type="success" style="margin-top: 12px;" @click="toHome">完成</el-button>
        </div>
    </div>
</template>
<script>
import userInfo from "@/components/userInfo/userInfo.vue";
import blogSite from "@/components/blogSite/blogSite.vue";

export default {
    data() {
      return {
        componentsArr: ["userInfo","blogSite",""],
        active: 0,
        prevBtn: false,
        nextBtn: true,
        completeBtn: false,
        finish: false,
        //组件名称
        comName: "userInfo",
        finishImg: require("@/assets/img/finish.png")
      };
    },
    props: ["userBlogBody"],
    methods: {
      prev() {
        this.completeBtn = false;
        this.nextBtn = true;
        this.finish = false;
        if (--this.active == 0 ){
            this.active = 0; 
            this.prevBtn = false; 
        }else{
            this.prevBtn = true; 
        }
        this.comName = this.componentsArr[this.active];
      },
      next(flag) {
        if(flag=="0"){
            if ((this.active) == 2){
                this.active = 2; 
            }else{
                this.$refs.com.callMethod("submitForm","ruleForm")
            }
        }else if(flag=="1"){
            this.prevBtn = true; 
            if (++this.active == 2){
                this.finish = true;
                this.active = 2; 
                this.nextBtn = false;
                this.completeBtn = true;
            }else{
                this.finish = false;
                this.nextBtn = true;
                this.completeBtn = false;
            }
            this.comName = this.componentsArr[this.active];
        }
      },toHome(){
          this.$router.push({path : "/" + this.userBlogBody.username + "/"});
      }
    },
    components:{
        userInfo,
        blogSite
    }
}
</script>
<style lang="less" scoped>
    .createBlog{
        text-align: left;
        .stepContent{
            padding: 10px;
            border-radius: 7px;
            box-shadow: 0 0 5px 0 rgba(38, 42, 48, 0.1);
            margin: 10px;
            .finishImg{
                width: 50%;
                margin: 0 auto;
                display: inherit;
            }
        }
        .btngroup{
            text-align: center;
        }
    }
</style>