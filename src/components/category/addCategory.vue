<template>
    <div class="addCategory">
        <el-dialog
            title="创建分类"
            :visible.sync="dialogVisible"
            :width="dialogWidth+'%'"
            :before-close="handleClose">
            <span>
                <el-form
                    :model="category"
                    :rules="rules"
                    :label-position="labelPosition"
                    ref="ruleForm"
                    label-width="85px"
                    class="article-ruleForm">
                    <el-form-item label="栏目标题" prop="categoryName">
                        <el-input v-model="category.categoryName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="是否私人" prop="isPrivate">
                        <el-switch v-model="category.isPrivate"
                        active-value="1"
                        inactive-value="0"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')"
                        >立即创建</el-button
                        >
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
            </span>
        </el-dialog>

    </div>
</template>
<script>
import { blogApi, TkApi } from "@/api/api.js";

export default {
    created(){
        if (this.screenWidth <= 878) {//移动端
            this.labelPosition = "top";
            this.dialogWidth = "98";
        } else {//pc
            this.labelPosition = "right";
            this.dialogWidth = "30";
        }
        this.headers.username = this.userBlogBody.username;
    },
    props:["userBlogBody"],
    data:function(){
        return {
            screenWidth: document.documentElement.clientWidth,
            labelPosition:"right",
            dialogVisible:false,
            dialogWidth: "30",
            category:{
                categoryName:"",
                isPrivate: "0",
                usestatus: "0"
            },
            headers:{ username : this.userBlogBody.username },
            rules: {
                categoryName:[
                    { required: true, message: "请输入博客栏目", trigger: "blur" }
                ]
            }
        };
    },
    methods:{
        submitForm:function(formName){
            this.$refs[formName].validate(valid => {
                blogApi.insertBlogCategory(this.category, this.headers).then(res => {
                    if(res.code == 200){
                        this.dialogVisible = false;
                        this.$emit("callMethods","refreshCategory",res.data);
                        TkApi.notify("成功","编辑成功","success",1000);
                    }
                }).catch(e => {

                });
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleClose:function(done){
            done();  
        }
    },
    watch:{
        userBlogBody: function(n,o){//检测属性是否传递到该组件   //直接访问该组件时 需要检测 userBlogBody 是否已经传递完毕  与上面created 形成双重保证
            this.headers.username = n.username;
        }
    }
}
</script>
<style lang="less" scoped>
    .el-form-item{
        margin-bottom: 15px!important;
    }
@media only screen and (max-width: 878px) {
    .el-dialog{
        width: 98%!important;
    }
}
</style>