<template>
    <div class="comment">
        <div class="commentInput">
            <el-row :gutter="10">
                <el-col :span="colspan">
                    <el-input
                        placeholder="称呼 (必填)"
                        v-model="comment.username"
                        size="mini"
                        :disabled="commentDisable"
                        clearable>
                    </el-input>
                </el-col>
                <el-col :span="colspan">
                    <el-input
                        placeholder="邮箱 (方便联系,不会公开)"
                        v-model="comment.email"
                        size="mini"
                        :disabled="commentDisable"
                        clearable>
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <textarea
                        class="commentTextarea"
                        ref="commentTextarea"
                        placeholder="写下您的评论~"
                        v-model="comment.content"
                        rows="6"
                        >
                    </textarea>
                    <div class="tipsDiv">
                        <span class="tips"> {{tips}} &nbsp;</span>
                    </div>
                    
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="6" style="text-align: left;">
                    <el-popover
                        ref="emojisPopover"
                        placement="top"
                        width="350"
                        :trigger="popoverMethod">
                        <ul class="emojis" style="padding:0;">
                            <li class="emoji" v-for="emoji in emojiArray" :key="emoji" @click="appendEmoji(emoji)" style="display: inline-block;list-style: none;padding:1px;font-size: 20px;cursor:pointer">
                                {{emoji}}
                            </li>
                        </ul>
                        <el-button size="mini" slot="reference" ><i class="fa fa-smile-o" aria-hidden="true"></i> 表情</el-button>
                    </el-popover>
                    
                </el-col>
                <el-col :span="18" style="text-align: right;">
                    <el-button-group  v-if="isReply">
                        <el-button type="primary" size="mini" icon="el-icon-message" @click="reply"> 回复 @{{this.tempReply.username}}</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="cancelReply">取消</el-button>
                    </el-button-group>
                    
                    <el-button v-if="!isReply" type="primary" icon="el-icon-s-promotion" size="mini" @click="submitComment"> 发送</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="commentlist">
            <!-- 总共 {{commentlist.length}} 评论 -->
            <el-divider content-position="left"><i class="el-icon-chat-dot-square"></i> 评论列表 </el-divider>
            <div class="commentCard" v-for="c in commentlist" :key="c.id">
                <img :src="c.avatar" v-if="c.dataType == '0'" height="25px" width="25px" class="visitor">
                <img :src="c.avatar" v-else-if="c.dataType == '1'" height="25px" width="25px" class="visitor">
                <img :src="visitor" v-else height="25px" width="25px" class="visitor">
                <div class="commentUserInfo"><!-- 评论信息 -->
                    <div class="commentUsername">{{c.username}}</div>
                    <div class="commentTime">{{c.createtime | dateFormate("yyyy-MM-dd hh:mm")}}</div>
                    <div class="replyBtn" @click="toReply(c.id, c.username , c.dataType , c.u_id , c.id)">
                        回复 
                    </div>
                </div>
                <div class="commentBody"><!-- 评论信息 -->
                    {{c.content}}
                </div>
                <div class="commentChildren"><!--回复信息-->
                    <div class="commentCard" v-for="cc in c.commentChildrens" :key="cc.id">
                        <img :src="cc.avatar" v-if="cc.dataType == '0'" height="25px" width="25px" class="visitor">
                        <img :src="cc.avatar" v-else-if="cc.dataType == '1'" height="25px" width="25px" class="visitor">
                        <img :src="visitor" v-else height="25px" width="25px" class="visitor">
                        <div class="commentUserInfo"><!-- 评论信息 -->
                            <div class="commentUsername">{{cc.username}}</div>
                            <div class="commentTime">{{cc.createtime | dateFormate("yyyy-MM-dd hh:mm")}}</div>
                            <div class="replyBtn" @click="toReply(cc.c_id, cc.username , cc.dataType , cc.u_id , cc.id)">
                                回复 
                            </div>
                        </div>
                        <div class="commentBody"><!-- 评论信息 -->
                            <span style="padding:0px 2px;color:#23aef1;font-weight:bold">@{{cc.reply}}</span> {{cc.content}}
                        </div> 
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import {TkApi, userApi} from "@/api/api.js";

export default {
    created(){
        if (this.screenWidth <= 878) {//移动端
            this.colspan = 24;
            this.popoverMethod = "click";
        }
        this.queryCommentList();
        if(this.$cookies.get("commentUsername")!=undefined){
            this.comment.username = this.$cookies.get("commentUsername");
        }
        if(this.$cookies.get("commentEmail")!=undefined){
            this.comment.email = this.$cookies.get("commentEmail");
        }
        let accessToken = this.$cookies.get("accessToken");

        //默认是游客评论 
        //dataType  0:用户评论，1:用户回复  2:游客评论，3:游客回复
        this.dataType = ""
        this.comment.dataType = "2";
        if(Object.keys(this.userBlogBody).length != 0 && accessToken != undefined){
            if(this.userBlogBody.isLogin){
                console.log("从created获取用户信息!");
                let accessUsername = TkApi.Decrypt(accessToken).split("-")[0];
                let accessUserid = TkApi.Decrypt(accessToken).split("-")[2];
                if((accessUsername!=undefined&&accessUserid!=undefined)){//这个是从其他组件转到这个组件时，获取about信息 
                    let data = {id: accessUserid , username: accessUsername};
                    let header = {username: accessUsername};
                    this.queryUserInfoById(data,header);
                }
                
            }
        }
    },
    props:["id","userBlogBody"],
    data:function(){
        return {
            //提交评论JSON
            comment:{
                username: "",
                email: "",
                content: "",
                commentType: "0",
                dataType: "2",
                reply: "",
                u_id: "",
                c_id: "",
                ba_id: ""
            },
            //是否用户登录  禁用评论用户名和邮箱
            commentDisable:false,
            //回复用户的临时JSON
            tempReply:{
                username: "",
                u_id: "",
                c_id: "",
                cc_id: ""
            },
            visitor: require("@/assets/img/visitor.jpg"),
            //是否是回复模式
            isReply:false,
            //评论列表
            commentlist: [],
            emojiArray:[
                    "💯","🔢","😀","😬","😁",
                    "😂","🤣","😃","😄","😅",
                    "😆","😇","😉","😊","🙂",
                    "🙃","😋","😌","😍","😘",
                    "😗","😙","😚","😜","🤪",
                    "🤨","🧐","😝","😛","🤑",
                    "🤓","😎","🤩","🤡","🤠",
                    "🤗","😏","😶","😐","😑",
                    "😒","🙄","🤔","🤥","🤭",
                    "🤫","🤬","🤯","😳","😞",
                    "😟","😠","😡","😔","😕",
                    "🙁","😣","😖","😫","😩",
                    "😤","😮","😱","😨","😰",
                    "😯","😦","😧","😢","😥",
                    "🤤","😪","😓","😭","😵",
                    "😲","🤐","🤢","🤧","🤮",
                    "😷","🤒","🤕","😴","💤",
                    "💩","😈","👿","👹","👺",
                    "💀","👻","👽","🤖","😺",
                    "😸","😹","😻","😼","😽",
                    "🙀","😿","😾","🤲","🙌",
                    "👏","👋","🤙","👍","👎",
                    "👊","✊","🤛","🤜","✌",
                    "👌","✋","🤚","👐","💪",
                    "🙏","🤝","☝","👆","👇",
                    "👈","👉","🖕","🖐","🤟",
                    "🤘","🤞","🖖","✍","🤳",
                    "💅","👄","👅","👂","👃","👁"],
            colspan: 12,
            //表情显示模式
            popoverMethod:"hover",
            //提交表单提示
            tips:"",
            screenWidth: document.documentElement.clientWidth
        };
    },
    methods:{
        async appendEmoji(v){ //根据光标添加 表情
            //this.comment.comment = this.comment.comment + v;
            const commentTextarea = this.$refs.commentTextarea;
            console.log(commentTextarea.selectionStart,commentTextarea.selectionEnd);
            if (commentTextarea.selectionStart || commentTextarea.selectionStart === 0) {
                var startPos = commentTextarea.selectionStart
                var endPos = commentTextarea.selectionEnd
                this.comment.content = commentTextarea.value.substring(0, startPos) + v 
                            + commentTextarea.value.substring(endPos, commentTextarea.value.length)
                await this.$nextTick() // 这句是重点, 圈起来
                commentTextarea.focus()
                commentTextarea.setSelectionRange(endPos + v.length, endPos + v.length)
            } else {
                this.comment.content += v
            }
            this.$refs.emojisPopover.doClose()
        },
        queryCommentList: function(){
            TkApi.queryCommentList({id:this.id}).then(res => {
                this.commentlist = res.data;
            }).catch(e => {

            }); 
        },
        //提交评价
        submitComment:function(){
            if(this.comment.content == "" || this.comment.username == ""){
                this.tips = "称呼和评论内容不能为空!"
                setTimeout(()=>{this.tips = ""},2000);
                return;
            }
            this.comment.ba_id = this.id;
            TkApi.insertComment(this.comment).then(res => {
                console.log(res);
                if(res.code == 200){
                    this.$cookies.set("commentUsername", this.comment.username, '0');
                    this.$cookies.set("commentEmail", this.comment.email, '0');
                    TkApi.notify("成功","评论成功","success",1000);
                    this.queryCommentList();
                    this.comment.content = "";
                }
            }).catch(e => {

            })
        },
        //获取评论是的用户信息
        queryUserInfoById: function(data,header){
            userApi.queryUserInfoById(data,header).then(res => {
                if(res.code==200){
                    this.comment.username = res.data.nickName;
                    this.comment.email = res.data.email;
                    this.commentDisable = true;
                    //如果登录
                    this.comment.dataType = "0";
                    this.comment.u_id = res.data.id;
                }
            }).catch(er => {

            });
        },
        //赋值回复人员的信息，提交表单
        reply:function(){
            this.comment.reply = this.tempReply.username;
            this.comment.c_id = this.tempReply.c_id;
            this.comment.cc_id = this.tempReply.cc_id;

            //dataType  0:用户评论，1:用户回复  2:游客评论，3:游客回复
            if(this.commentDisable){//用户已登录
                this.comment.dataType = "1";
            }else{
                this.comment.dataType = "3";
            }
            this.submitComment();
        },
        //到回复  把回复的用户信息放到临时对象中
        toReply:function(id, username, dataType, u_id, cc_id){// id:根评论ID, username:@的人, dataType:评论类型, u_id:是否用户 用户信息, cc_id:真是的评论父ID
            this.tempReply.username = username;
            this.tempReply.u_id = u_id;
            this.tempReply.c_id = id;
            this.tempReply.cc_id = cc_id;
            this.isReply = true;
            let height = document.querySelector(".commentInput").offsetTop;
            document.querySelector("#app").scrollTop = height;
            
        },
        //取消回复  
        cancelReply: function(){
            this.tempReply = {
                username: "",
                u_id: "",
                c_id: ""
            };
            this.isReply = false;

            //dataType  0:用户评论，1:用户回复  2:游客评论，3:游客回复
            if(this.commentDisable){//用户已登录
                this.comment.dataType = "0";
            }else{
                this.comment.dataType = "2";
            }
        }

    },
    watch:{
        userBlogBody:function(n,o){ //检测属性是否传递到该组件   //直接访问该组件时 需要检测 userBlogBody 是否已经传递完毕  与上面created 形成双重保证
            let accessToken = this.$cookies.get("accessToken");
            if(n != undefined && accessToken != undefined){
                console.log("从watch获取用户信息!");
                let accessUsername = TkApi.Decrypt(accessToken).split("-")[0];
                if(n.isLogin){
                    let accessUsername = TkApi.Decrypt(accessToken).split("-")[0];
                    let accessUserid = TkApi.Decrypt(accessToken).split("-")[2];
                    if((accessUsername!=undefined&&accessUserid!=undefined)){//这个是从其他组件转到这个组件时，获取about信息 
                        let data = {id: accessUserid , username: accessUsername};
                        let header = {username: accessUsername};
                        this.queryUserInfoById(data,header);
                    }
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .comment{
        margin-top: 100px;
        .commentInput{
            padding: 10px;
            padding-top: 30px;
            padding-bottom: 0px;
            background: #f9f9f9;
            border-radius: 4px;
            .el-button--mini, .el-button--mini.is-round {
                padding: 7px 7px;
            }
        }
        .commentCard{
            text-align: left;
            font-size: 15px;
            border-radius: 1px;
            padding: 5px 20px;
            position: relative;
            .visitor{
                border-radius:50%;
                border:2px solid black;
                position:absolute;
            }
            .commentUserInfo{
                position: relative;
                padding-left: 33px;
                .commentUsername{
                    font-size: 14px;
                }
                .commentTime{
                    font-size: 12px;
                    color: #adadad;
                }
                .replyBtn{
                    color: #6b6b6b;
                    position: absolute;
                    right: 5px;
                    top: 3px;
                    font-size: 12px;
                    cursor: pointer;
                }
            }
            .commentBody{
                padding: 5px 7px 12px 35px;
                font-size: 14px;
            }
            .commentChildren{
                margin-left: 12px;
                border-left: 2px solid #999;
                .commentCard{
                    position: relative;
                    padding: 5px 0px 5px 20px;
                    .visitor{
                        border-radius:50%;
                        border:2px solid black;
                        position:absolute;
                    }
                }
                .commentCard:hover{
                    background: #dcdcdc;
                }
            }
        }
        .commentCard:hover{
            background: #eee;
        }
    }
    .el-col{
        margin-bottom: 15px;
    }
    .commentTextarea{
        font: 400 15.3333px Arial;
        border-color: rgb(192, 196, 204);
        border-radius: 4px;
        width: 97%;
        max-width: 97%;
        color: #676767;
        line-height: 16px;
        padding: 7px 12px;
        resize: none;
    }
    .commentTextarea::-webkit-input-placeholder {
        color: #c0c4cc;
    }
    .commentTextarea:-moz-placeholder {/* Firefox 18- */
        color: #c0c4cc;
    }
    .commentTextarea::-moz-placeholder{/* Firefox 19+ */
        color: #c0c4cc;
    }
    .commentTextarea:-ms-input-placeholder {
        color: #c0c4cc;
    }
    .tipsDiv{
        position: relative;
        .tips{
            color: red;
            position: absolute;
            font-size: 12px;
            left: 0;
            right: 0;
            top: -3px;
        }
    }
    
</style>