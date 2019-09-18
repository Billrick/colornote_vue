<template>
    <div>
        <div class="loginContainer">
            <img :src="logoImg" alt="" class="logo">
            <div class="loginDiv">
                <div class="mlogo">
                    <img :src="logoImg" alt="">
                </div>
                <div class="loginTitle">登录
                    <span class="to"><router-link to="/u/register" tag="span">前往注册 ></router-link></span> 
                </div>
                <el-form label-position="right" :model="user" label-width="80px" :rules="rules" ref="ruleForm" >
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="user.username" placeholder="用户名/手机号/邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="user.password" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="vlidateCode">
                        <el-input v-model="user.vlidateCode" maxlength="7" placeholder="验证码">
                        </el-input>
                        <img :src="vlidateCode" class="vlidateCode" alt="图片失效" title="点击切换" @click="refreshCode">
                    </el-form-item>
                    <div class="forget">
                        <span>忘记密码?</span>
                    </div>
                    <el-form-item>
                        <el-button type="primary" style="width:100%"  @click="login('ruleForm')" >登录</el-button>
                    </el-form-item>
                    <el-form-item label="快捷登录">
                        <div class="quicklogin">
                            <span class="fa-stack fa-lg" title="腾讯QQ">
                                <i class="fa fa-square-o fa-stack-2x"></i>
                                <i class="fa fa-qq" aria-hidden="true"></i>
                            </span>
                            <span class="fa-stack fa-lg" title="微信Wechat">
                                <i class="fa fa-square-o fa-stack-2x"></i>
                                <i class="fa fa-weixin" aria-hidden="true"></i>
                            </span>
                            <span class="fa-stack fa-lg" title="微博"> 
                                <i class="fa fa-square-o fa-stack-2x"></i>
                                <i class="fa fa-weibo" aria-hidden="true"></i>
                            </span>
                            <span class="fa-stack fa-lg" title="github">
                                <i class="fa fa-square-o fa-stack-2x"></i>
                                <i class="fa fa-github" aria-hidden="true"></i>
                            </span>
                            <span class="fa-stack fa-lg" title="推特twitter">
                                <i class="fa fa-square-o fa-stack-2x"></i>
                                <i class="fa fa-twitter fa-stack-1x"></i>
                            </span>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import { userApi } from "@/api/api.js";
export default {
    created(){
        this.refreshCode();
        
    },
    data: function(){
        return {
            user:{
                username: "",
                password: "",
                vlidateCode:""
            },
            rules:{
                username:[
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                vlidateCode:[
                    {required: true, message: '请输入验证码', trigger: 'blur'}
                ],
            },
            vlidateCode: "",
            logoImg: require("@/assets/img/logo2.png")
        };
    },
    methods:{
        refreshCode: function(){
            userApi.refreshCode().then(res => {
                this.vlidateCode =  'data:image/png;base64,' + new Buffer(res, 'binary').toString('base64');
            })
            .catch(error => {
                console.log(error);
            });
            this.user.vlidateCode = "";
        },
        login: function(formName){
            this.$refs[formName].validate((valid) => {
                console.log(valid);
                userApi.userLogin(this.user).then(res => {
                    console.log(res);
                    if(res.code==200){
                        //this.$emit("setPropData","accessToken",res.data.isLogin);
                        let url = "/"+this.user.username +"/";
                        if(this.$route.query.redirect != undefined && this.$route.query.redirect != null){
                            url = this.$route.query.redirect;
                        }
                        this.$router.push({ path: url});
                        this.$cookies.set("accessToken",res.data.isLogin, '0')
                    }
                }).catch(err => {
                    console.log(err);
                });
            });
        }
    }
}
</script>
<style lang="less" scoped>
.loginContainer{
    width: 1300px;
    margin: 0px auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .loginTitle{
        padding: 15px 30px 5px 15px;
        margin-bottom: 30px;
        text-align: left;
        font-size: 25px;
        border-bottom: 2px lightblue solid;
        font-weight: 700;
        .to{
            float: right;
            font-size: 16px;
            line-height: 48px;
            font-weight: 100;
            cursor: pointer;
        }
    }
    .loginDiv{
        background: #fff;
        .vlidateCode{
            border-radius: 0px 5px 5px 0px;
            height: 38px;
            position: absolute;
            right: 1px;
            top: 1px;
            cursor: pointer;
        }
        .quicklogin{
            span{
                cursor: pointer;
                padding: 0px 1px;
            }
        }
        .forget{
            margin:-12px 0px 9px 0px;
            text-align: right;
            font-size: 13px;
        }
        .forget{
            span:hover{
                text-decoration: underline;
                cursor: pointer;
            }
        }
    }
}
@media screen and (min-width: 878px) {
    .loginContainer{
        margin: 0px auto;
        display: flex;
        align-items: center;
        background: url("../../assets/img/login/loginbg.jpg") no-repeat;
        background-position-y: 130px;
        height: calc(100vh); 
        position: relative;
        .logo{
            position: absolute;
            top: 0px;
            left: 0px;
            display: inline-block;
        }
        .mlogo{
            display: none;
        }
        .loginDiv{
            padding: 0px 30px 30px 30px;
            width: 350px;
            margin-right: 50px;
        }
    }
}

@media only screen and (max-width: 878px) {
    .loginContainer{
        width:100%;
        margin: 0px auto;
        .logo{
            display: none;
        }
        .mlogo{
            display: inline-block;
        }
        .loginDiv{
            padding: 0px 10px 30px 5px;
            width: 100%;
        }
    }
}
</style>