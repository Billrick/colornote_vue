<template>
    <div class="blogSite">
        <el-form ref="ruleForm" :label-position="'right'" label-width="120px" :rules="rules" :model="blogSite" >
            <el-form-item label="博客标题" prop="blogtitle">
                <el-input v-model="blogSite.blogtitle"></el-input>
            </el-form-item>
            <el-form-item label="博客副标题">
                <el-input v-model="blogSite.blogsubtitle"></el-input>
            </el-form-item>
            <el-form-item v-if="showBtnGroup">
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {blogApi} from "@/api/api.js";

export default {
    created(){
        if((this.userBlogBody.id!=undefined&&this.userBlogBody.username!=undefined)){
            let u_id = this.userBlogBody.id;
            this.blogSite.u_id = u_id;
            let username = this.userBlogBody.username;
            this.header = {username: username};
            this.queryBlogSiteByUid({u_id,u_id},this.header);
        }
    },
    props:["userBlogBody","showBtnGroup"],
    data:function(){
        return {
            header:{},
            blogSite:{
                id:"",
                u_id: "",
                blogtitle:"",
                blogsubtitle:""
            },
            rules: {
                blogtitle: [
                    { required: true, message: '请输入博客标题', trigger: 'blur' }
                ],
            }
        };
    },
    methods:{
        callMethod: function(methodName,formName){
            if(methodName=="submitForm"){
                this.submitForm(formName);
            }
        },
        submitForm:function(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    blogApi.updateBlogSite(this.blogSite,this.header).then(res => {
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
                            }
                        }
                    }).catch(e => {
                        console.log(e);
                    })
                    alert("submit");
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        queryBlogSiteByUid:function(data,header){
            blogApi.queryBlogSiteByUid(data,header).then(res => {
                if(res.code == 200){
                    Object.keys(this.blogSite).forEach(key => {
                        this.blogSite[key] = res.data[key];
                    });
                }
            }).catch(e => {
                cosole.log(e);
            })
        }
    },
    watch:{
        userBlogBody: function(n,o){//检测属性是否传递到该组件   //直接访问该组件时 需要检测 userBlogBody 是否已经传递完毕  与上面created 形成双重保证
            let u_id = n.id;
            this.blogSite.u_id = u_id;
            let username = n.username;
            this.header = {username:username};
            this.queryBlogSiteByUid({u_id,u_id},this.header);
        }
    }
}
</script>
<style lang="less" scoped>
    .blogSite{
        padding: 15px;
    }
</style>