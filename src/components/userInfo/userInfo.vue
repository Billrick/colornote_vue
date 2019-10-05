<template>
  <div class="userInfo">
    <div class="user">
      <el-form :label-position="labelPosition" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="userinfo-form">
        <el-form-item label="头像" prop="avatar">
          <div class="avatar">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:8762/colornote-common/file/saveFile"
              :show-file-list="false"
              :data="uploadParam"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="ruleForm.avatar" :src="ruleForm.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="ruleForm.nickName"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="colspan">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="ruleForm.gender">
                <el-radio label="1" border>男</el-radio>
                <el-radio label="2" border>女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="colspan">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                  style="width:100%"
                  v-model="ruleForm.birthday"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  align="right"
                >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="colspan">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="ruleForm.phone" placeholder="请输入手机号码, 登录时可使用"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="colspan">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="ruleForm.email" placeholder="请输入邮箱号码, 登录时可使用"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="个性签名" prop="udesc">
          <el-input type="textarea" :rows="4" v-model="ruleForm.udesc"></el-input>
        </el-form-item>
        <el-form-item v-if="showBtnGroup">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {userApi} from "@/api/api.js";
export default {
  created(){
    let id = this.userBlogBody.id;
    let username = this.userBlogBody.username;
    if((this.userBlogBody.id!=undefined&&this.userBlogBody.username!=undefined)){//这个是从其他组件转到这个组件时，获取about信息 
      let data = {id: id , username: username};
      this.header = {username: username};
      this.queryUserInfoById(data,this.header);
    }
    if (this.screenWidth <= 878) {//移动端
      this.colspan = 24;
      this.labelPosition = "top";
    } else {//pc
      this.labelPosition = "right";
    }
  },
  props: ["userBlogBody","showBtnGroup"],
  data: function(){
    return {
      screenWidth: document.documentElement.clientWidth,
      labelPosition: "right",
      colspan: 12,
      uploadParam:{func:"avatar"},
      header:{},
      ruleForm: {
        id:"",
        nickName: "",
        gender: "",
        birthday: "",
        phone: "",
        email:"",
        qq: "",
        wechat:"",
        githublink:"",
        avatar:"",
        udesc:"",
        area:""//地区
      },
      rules: {
        avatar: [
          { required: true, message: '请上传头像', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请选择所在地区', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        // phone: [
        //   { required: true, message: '请输入手机号码', trigger: 'blur' }
        // ],
        // email: [
        //   { required: true, message: '请输入邮箱', trigger: 'blur' }
        // ]
      }
    };
  },
  methods:{
    callMethod: function(methodName,formName){
      if(methodName=="submitForm"){
        this.submitForm(formName);
      }
    },
    handleAvatarSuccess: function(res, file) {
      if(res.code==200){
        this.imageUrl = res.data.fileUrl;
        this.ruleForm.avatar = res.data.fileUrl;
      }
      //this.imageUrl = URL.createObjectURL(file.raw)
      //this.ruleForm.avatar = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload: function(file) {
      const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userApi.updateUserInfo(this.ruleForm,this.header).then(res => {
            if(res.code==200){
              if(!this.showBtnGroup){
                this.$emit("next","1");// 父页面调用提交方法  返回信息
              }else{
                this.$notify({
                  title: '成功',
                  message: '编辑成功',
                  type: 'success',
                  duration: 1000
                });
                this.$emit("submitChildForm","userInfo",{username: this.userBlogBody.username,headers:{username: this.userBlogBody.username}});
              }
            }
          }).catch(e => {
            console.log(e);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    queryUserInfoById: function(data,header){
      userApi.queryUserInfoById(data,header).then(res => {
        if(res.code==200){
          Object.keys(this.ruleForm).forEach(key => {
            this.ruleForm[key] = res.data[key];
          });
        }
      }).catch(er => {

      });
    }
  },
  watch:{
    userBlogBody: function(n,o){//检测属性是否传递到该组件   //直接访问该组件时 需要检测 userBlogBody 是否已经传递完毕  与上面created 形成双重保证
      let id = n.id;
      let username = n.username;
      let data = {id: id , username: username};
      this.header = {username:username};
      this.queryUserInfoById(data,this.header);
    }
  }
}
</script>
<style lang="less">
  .userinfo-form{
    text-align: left;
  }
  .avatar {
    width: 108px;
    height: 108px;
    display: block;
    .avatar-uploader{
      .el-upload {
        border: 1px dashed #d9d9d9!important;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 108px;
          height: 108px;
          line-height: 108px;
          text-align: center;
        }
      }
      .el-upload:hover {
        border-color: #409EFF;
      }
    }
  }
</style>