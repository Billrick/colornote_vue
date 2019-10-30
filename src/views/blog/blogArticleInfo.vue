<template>
    <div class="articleDiv">
        <div class="blogArticleCard" v-if="showCard">
            <!-- animated bounceInDown -->
            <div class="toolbar" v-if="userBlogBody.isLogin">
                <div class="writeIcon">
                    <router-link tag="span" :to="'/' + username + '/editBlogArticle?p=' + articleInfo.id"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>编辑</router-link>
                </div>
            </div>
            <div class="blogArticleHead">
                <p class="articleTitle">{{articleInfo.title}}</p>
                <div class="publishinfo">
                    <i class="el-icon-date"></i> {{ articleInfo.createtime }} •
                    <i class="fa fa-folder-open-o" aria-hidden="true"></i>
                    <span v-for="cate in articleInfo.category" :key="cate.id">
                        {{ cate.categoryName }}
                    </span>
                    • <i class="el-icon-view"></i> {{ articleInfo.see }}
                </div>
                <p class="articleSubtitle">{{articleInfo.subtitle}}</p>
            </div>
            <viewer :images="articleInfoImg">
            <div class="blogArticleBody markdown-body" v-highlight v-html="articleInfo.contentHtml">
                <!-- v-html="articleInfo.contentHtml" -->
                
            </div>
            </viewer>
            
            <div class="commentDiv">
                <comment :id="id" :userBlogBody="userBlogBody"></comment>
            </div>
        </div>
        
        <div class="contentMenu">
            <div class="menutitle">
                目录
            </div>
            <div class="menuinfo" >
                
            </div>
        </div>
    </div>
    
</template>
<script>
import { blogApi } from "@/api/api.js";
import $ from "jquery";
import comment from "@/components/comment/comment.vue";

export default {
    created: function(){
        this.queryBlogArticleById(this.id,this.headers);
    },
    components:{
        comment
    },
    props: ["scrollTopHeight","userBlogBody"],
    data:function(){
        return {
            username: this.$route.params.username,
            id: this.$route.params.id,
            headers: {username: this.$route.params.username},
            articleInfo:{},
            articleInfoImg:[],
            contentMenu:"",
            //内容锚点 距离顶部的高度  实际上是数组
            contentMdArr: null,
            //滚动事件
            menuEvent:true,
            appScrollTop: document.querySelector("#app").scrollTop,
            showCard: false
        }
    },
    methods:{
        queryBlogArticleById: function(id, headers) {
            blogApi.queryBlogArticleById(id,headers).then(res => {
                if (res.code == 200) {
                    this.articleInfo = res.data;
                    let contentHtml = res.data.contentHtml;
                    //$(".blogArticleBody").append(contentHtml);
                    //正则取出文章中的图片
                    var imgreg =/<img[^>]+>/g;//规则
                    var imgarr = contentHtml.match(imgreg);//取出的内容数组
                    if(imgarr!=undefined && imgarr != null && imgarr.length > 0){
                        this.articleInfoImg = [];
                        for(var i= 0;i<imgarr.length;i++)
                        {
                            imgarr[i].replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
                                this.articleInfoImg.push({src:capture});
                            });
                        }
                    }
                    
                    //图片处理完毕 end

                    //目录 start
                    this.contentMenu = res.data.contentMenu;
                    let windowWidth = document.documentElement.clientWidth;
                    if(windowWidth>878){ // 移动端不显示目录
                        var menu = $(this.contentMenu);
                        var as = menu.children("a");//所有A标签
                        this.$nextTick(() => {
                            this.showCard = true;
                            var heightArr = [];
                            $.each(as,function(i,e){//给所有目录A标签加事件
                                let id = $(e).attr("id");
                                $(e).removeAttr("id").attr("c_id",id);
                                $(e).click(function(){
                                    document.querySelector("#app").scrollTop = $("#"+id)[0].offsetTop;
                                });
                                heightArr.push({ c_id:id ,height:$("#"+id).offset().top});
                            });
                            this.contentMdArr = heightArr;
                            if(heightArr.length>0){
                                $(".menuinfo").append(menu);
                                $(".contentMenu").show(); 
                            }
                        })

                              
                           
                    }                  
                    
                    //目录 end
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    watch:{
        scrollTopHeight:function(v){
            if(this.contentMdArr){
                let hlength = this.contentMdArr.length;
                $(".menuinfo a").parent().removeClass("active");
                for (let index = 0; index < hlength; index++) {
                   if(v+11 > this.contentMdArr[index].height){
                       $(".menuinfo a[c_id='"+this.contentMdArr[index].c_id+"']").parent().removeClass("active").addClass("active");
                   }
                    
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.articleDiv{
    margin: 10px;
    .blogArticleCard{
        padding: 30px;
        background-color: #fff;
        box-shadow: 0 0 5px 0 rgba(38,42,48,.1);
        .toolbar{
            position: relative;
            .writeIcon{
                position: absolute;
                top: -23px;
                right: -15px;
                color: gray;
                cursor: pointer;
            }
        }
        
        .blogArticleHead{
            .articleTitle{
                font-size: 26px;
                font-weight: bold;
                color: #262a30;
                margin: 0;
                padding: 0;
                line-height: 1.15;
            }
            .publishinfo{
                font-size: 15px;
                padding: 12px 0px;
                letter-spacing: 0.2px;
                color: #616161;
            }
            .articleSubtitle{
                margin: 0;
                padding: 0;
                font-size: 15px;
                color: #989898;
            }
        }
        .blogArticleBody{
            margin-top: 20px;
            text-align: left;
            color: #5a5a5a;
        }
    }
    .contentMenu{
        background-color: #fff;
        box-shadow: 0 0 5px 0 rgba(38,42,48,.1);
        position: fixed;
        top: 109px;
        right: 7px;
        width: 230px;
        display: none;
        .menutitle{
            text-align: left;
            padding: 3px 13px;
            background: #e2e2e2;
            font-weight: 700;
        }
        .menuinfo{
            text-align: left;
            //padding-top: 5px;
            max-height: calc(60vh);
            overflow: auto;
            .active{
                background:#fdddbd;
            }
        }
        .menuinfo /deep/ h1,.menuinfo /deep/ h2,.menuinfo /deep/ h3,.menuinfo /deep/ h4,.menuinfo /deep/ h5,.menuinfo /deep/ h6{
            margin: 0px;
            padding: 0px 10px;
            font-size: 15px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
            a{
                position:absolute;
                height: 100%;
                width: 100%;
                cursor: pointer;
            }
        }
        .menuinfo /deep/ h1.active,.menuinfo /deep/ h2.active,.menuinfo /deep/ h3.active,.menuinfo /deep/ h4.active,.menuinfo /deep/ h5.active,.menuinfo /deep/ h6.active{
            background: #c9e5ef;
        }
        .menuinfo /deep/ h2{
            padding-left: 20px;
        }
        .menuinfo /deep/ h3{
            padding-left: 30px;
        }
        .menuinfo /deep/ h4{
            padding-left: 40px;
        }
        .menuinfo /deep/ h5{
            padding-left: 50px;
        }
        .menuinfo /deep/ h6{
            padding-left: 60px;
        }
    }
}
.markdown-body /deep/ img{
    max-width: calc(100% - 10px)!important;
    padding: 4px;
    border: 1px solid #eee!important;
    cursor: zoom-in;
}


/*屏幕宽度小于878px的时候执行里面的css*/
@media only screen and (max-width: 878px) {
    .blogArticleCard{
        padding: 10px!important;
    }
    .articleTitle{
        font-size: 22px!important;
    }
    .publishinfo{
        font-size: 13px!important;
    }
    .articleSubtitle{
        font-size: 13px!important;
    }
    .contentMenu{
        display: none;
    }

}
</style>