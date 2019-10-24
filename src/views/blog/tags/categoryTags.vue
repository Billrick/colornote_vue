<template>
    <div class="categoryTags">
        <div class="categorys animated flipInX faster">
            <div class="title">分类</div>
            <div class="category" v-for="c in category" :key="c.id" @click="searchBlogList('category',c.id,c.categoryName)">
                {{c.categoryName}} <span class="total">{{c.total}}篇</span>
            </div>
        </div>
        <div class="tags animated flipInX faster">
            <div class="title">标签</div>
            <div class="tag" v-for="t in tags" :key="t.id" @click="searchBlogList('tag',t.id,t.label)">
                <span>{{t.label}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import { blogApi,TkApi } from "@/api/api.js";

export default {
    created(){
        this.header = {username : this.$route.params.username};
        //博客分类
        blogApi.queryBlogCateByBid(this.header).then(res => {
            if(res.code == 200){
                this.category = res.data;
            }
        }).catch(e => {

        });
        //博客标签
        blogApi.queryBlogLabelByBid(this.header).then(res => {
            if(res.code == 200){
                this.tags = res.data;
            }
        }).catch(e => {

        });
        
    },
    data:function(){
        return {
            category:[],
            tags:[],
            header:{}
        };
    },
    methods:{
        searchBlogList:function(key,val,text){
            let param = key + "-" + val + "-" + text;
            param = TkApi.Encrypt(param);
            this.$router.push({path: "/"+this.$route.params.username+"/blogList",query:{key: param}})
        }
    }
}
</script>
<style lang="less" scoped>
    .categoryTags{
        
        .categorys{
            margin-bottom: 40px;    
            .category{
                    display: inline-block;
                    padding: 3px 18px;
                    border-radius: 5px;
                    border: 1px solid #dcdcdc;
                    margin: 0px 4px;
                    color: #000;
                    font-size: 14px;
                    cursor: pointer;
                    .total{
                        padding: 0px 2px;
                        font-size: 10px;
                        color: gray;
                    }
            }
            .category:hover{
                color: #fff;
                background: #000;
            }
        }
        .tags{
            .tag{
                display: inline-block;
                padding: 3px 11px;
                span {
                    font-size: 15px;
                    color: #c7c7c7;
                    position: relative;
                    text-decoration: none;
                    cursor: pointer;
                    padding: 0px 6px 2px 6px;
                    text-align: center;
                }
                span:before {
                    content: "";
                    position: absolute;
                    left: 50%;
                    bottom: -2px;
                    width: 0;
                    height: 2px;
                    background: #000;
                    transition: all 0.3s;
                }
                span:hover:before {
                    width: 100%;
                    left: 0;
                    right: 0;
                }
            }
        }
    }
    .title{
        color: #5a5a5a;
        padding: 25px 5px;
        font-size: 25px;   
    }
</style>