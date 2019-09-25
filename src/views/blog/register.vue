<template>
    <div>
        <div class="loginContainer">
            <img :src="logoImg" alt="" class="logo">
            <div class="loginDiv">
                <div class="mlogo">
                    <img :src="logoImg" alt="">
                </div>
                <div class="loginTitle">注册
                    <span class="to"><router-link to="/u/login" tag="span">已有账号 前往登录 ></router-link></span> 
                </div>
                <el-form label-position="right" label-width="80px" :rules="rules" :model="user" ref="ruleForm" >
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="user.username" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="user.phone" placeholder="手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="user.email" placeholder="邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="user.password" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="rpassword">
                        <el-input type="password" v-model="user.rpassword" placeholder="确认密码"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="vlidateCode">
                        <el-input v-model="user.vlidateCode" maxlength="7" placeholder="验证码">
                        </el-input>
                        <img :src="vlidateCode" class="vlidateCode" alt="图片失效" title="点击切换" @click="refreshCode">
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="width:100%" @click="register('ruleForm')" >注册</el-button>
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
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码!'))
            } else if (value !== this.user.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }

        return {
            user:{
                username: "",
                phone:"",
                email:"",
                password: "",
                rpassword:"",
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
                rpassword: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                vlidateCode:[
                    {required: true, message: '请输入验证码', trigger: 'blur'}
                ]
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
        register: function(formName){
            this.$refs[formName].validate((valid) => {
                console.log(valid)
                //this.$router.push({ path: "/"+this.user.username})
                userApi.registerUser(this.user,{}).then(res => {
                    if(res.code == "200"){
                        this.$router.push({path : "/u/login"});
                    }
                }).catch(e => {

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
                padding: 0px 5px;
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
        background: url("../../assets/img/register/registerbg.jpg") no-repeat;
        background-position-y: 145px;
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
            padding: 10px 10px 30px 5px;
            width: 100%;
        }
    }
}
</style>