<template>
  <div class="about">
    <div class="left">
      <div class="user">
        <div class="useravatar">
          <img :src="require('@/assets/img/face/酷.png')" height="70px">
        </div>
        <div class="userinfo">
          <div class="nickname">
            {{userInfo.nickName}}
          </div>
          <div class="desc">
            {{userInfo.udesc}}
          </div>
          <div class="link">
            <div class="linkhr">link</div>
            <div class="QQlink" v-if="userInfo.qq != undefined && userInfo.qq != null && userInfo.qq != 'undefined' && userInfo.qq != 'null' && userInfo.qq != ''">
              <span class="linktitle">Q &nbsp;Q：</span>  {{userInfo.qq}}
            </div>
            <div class="Wechatlink" v-if="userInfo.wechat != undefined && userInfo.wechat != null && userInfo.wechat != 'undefined' && userInfo.wechat != 'null' && userInfo.wechat != ''">
              <span class="linktitle">微信：</span> {{userInfo.wechat}}
            </div>
            <div class="githublink" v-if="userInfo.githublink != undefined && userInfo.githublink != null && userInfo.githublink != 'undefined' && userInfo.githublink != 'null' && userInfo.githublink != ''">
              <span class="linktitle">github：</span> {{userInfo.githublink}}
            </div>
            <div class="emaillink" v-if="userInfo.email != undefined && userInfo.email != null && userInfo.email != 'undefined' && userInfo.email != 'null' && userInfo.email != ''">
              <span class="linktitle">邮箱：</span> {{userInfo.email}}
            </div>
          </div>
        </div>
      </div>
      <div class="QQ">
        <div class="imgtitle">秋秋QQ</div>
        <img :src="require('@/assets/img/about/wx.jpg')" width="100%" alt="">
      </div>
      <div class="Wechat">
        <div class="imgtitle">微信</div>
        <img :src="require('@/assets/img/about/wx.jpg')" width="100%" alt="">
      </div>
    </div>
    <div class="right">
      <div class="aboutdiv" v-if="!isEditer">
        <div class="toolbar">
            <div class="writeIcon">
                <span @click="isEditer = !isEditer"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>编辑</span>
            </div>
        </div>
        <viewer :images="articleInfoImg">
        <div class="aboutcontent markdown-body" v-highlight v-html="userInfo.aboutHtml">
        </div>
        </viewer>
      </div>
      <div class="editAbout" v-if="isEditer">
          <div class="editor">
            <mavon-editor @imgAdd="$imgAdd" @imgDel="$imgDel" :codeStyle="'atom-one-light'" :autofocus="false" ref=md v-model="about" />
          </div>
          <div style="text-align:right;padding:13px 0px">
            <el-button type="primary" @click="submitForm()">立即创建</el-button>
          </div>
      </div>
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
      let header = {username:username};
      this.queryUserInfoById(data,header);
    }
  },
  props: ["userBlogBody"],
  data: function(){
    return {
      userInfo:{},
      articleInfoImg:[],
      isEditer: false,
      about:"",
      aboutHtml:""
    };
  },
  methods:{
    //编辑关于我
    submitForm: function(){
      let id = this.userInfo.id;
      let aboutHtml = document.querySelector(".v-show-content").innerHTML;
      let data = {
        id: id, 
        about: this.about,
        aboutHtml: aboutHtml
        }
      let header = {
        username: this.userInfo.username
      }
      let data2 = {
        id: id, 
        username: this.userInfo.username
      }
      userApi.updateUserInfo(data,header).then(res => {
        this.queryUserInfoById(data2,header);
        this.isEditer = false;
        if(res.code == 200){
          this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success',
            duration: 1000
          });
        }
      }).catch(err => {

      })
    },
    queryUserInfoById: function(data,header){
      userApi.queryUserInfoById(data,header).then(res => {
        this.userInfo = res.data;
        let contentHtml = res.data.aboutHtml;
        this.about = res.data.about;
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
      }).catch(er => {

      });
    },
    $imgAdd(pos, $file){
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        formdata.append('file', $file);
        this.headers = { 'Content-Type': 'multipart/form-data' },
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        // $vm.$img2Url 详情见本页末尾
        blogApi.saveFile(formdata, this.myheaders)
        .then(res => {
          if (res.code == 200) {
            //$vm.$img2Url(pos, url);
            console.log(res.data.fileUrl);
            this.$refs.md.$img2Url(pos, res.data.fileUrl);
            this.imgFile[res.data.fileUrl] = {
              id: res.data.id,
              rname: res.data.remoteFileName
              };
          }
        })
        
        
    },
    $imgDel(pos){
        let fileid = this.imgFile[pos[0]].id;
        let rname = this.imgFile[pos[0]].rname;
        let data = {};
        data.id = fileid;
        data.usestatus = 1;
        data.fileName = rname;
        blogApi.removeFile(data, this.myheaders)
        .then(res => {
          if (res.code == 200) {
            console.log(res);
          }
        })
        delete this.imgFile[pos];
    }
  },
  watch:{
    userBlogBody: function(n,o){//检测属性是否传递到该组件   //直接访问该组件时 需要检测 userBlogBody 是否已经传递完毕  与上面created 形成双重保证
      let id = n.id;
      let username = n.username;
      let data = {id: id , username: username};
      let header = {username:username};
      this.queryUserInfoById(data,header);
    }
  }
}
</script>
<style lang="less" scoped>
  .about{
    margin: -20px;
    padding-top: 15px;
    height: ceil(100vh);
    .left{
      margin: 5px;
      .user{
        background-color: #fff;
        border-radius: 3px;
        box-shadow: 2px 1px 5px 1px rgba(38, 42, 48, 0.1);
        border: 1px #e2e2e2 solid;
        .useravatar{
          height: 90px;
          background: url("../../assets/img/about/banner.png");
          img{
            border-radius: 50%;
            margin-top: 42px;
          }
        }
        .userinfo{
          margin-top: 25px;
          .nickname{
            font-size: 20px;
            font-weight: 700;
            color: #49516f;
          }
          .desc{
            padding: 8px;
            font-size: 13px;
            color: #9c9b9b;
          }
        }
        .link{
          text-align: left;
          padding: 5px 15px;
          font-size: 12px;
          color: #848484;
          .linkhr{
            padding-left: 10px;
            border-bottom: 1px solid #e6e6e6;
            font-size: 16px;
            font-weight: 700;
            font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif;
          }
          div{
            line-height: 1.7;
          }
          span{
            width: 50px;
            display: inline-block;
            text-align: right;
          }
        }
      }
      .QQ,.Wechat{
        margin-top: 20px;
        padding: 10px;  
        background-color: #fff;
        border-radius: 3px;
        box-shadow: 2px 1px 5px 1px rgba(38, 42, 48, 0.1);
        border: 1px #e2e2e2 solid;
        .imgtitle{
          text-align: left;
          margin-bottom: 8x;
          padding-bottom: 2px;
          border-bottom: 2px #bfbfbf solid;
          font-size: 15px;
          font-weight: 700;
          color: #585757;
        }
      }
      
    }
    .right{
      margin: 5px;
      padding: 5px;
      background-color: #fff;
      border-radius: 3px;
      box-shadow: 2px 1px 5px 1px rgba(38, 42, 48, 0.1);
      border: 1px #e2e2e2 solid;
      .aboutcontent{
        text-align: left;
        padding: 30px 10px 5px 10px;
      }
      .editor{
        height: ceil(83vh);
        .markdown-body {
          height: 100%;
        }
      }
      .toolbar{
          position: relative;
          .writeIcon{
              position: absolute;
              top: 0px;
              right: 3px;
              color: gray;
              cursor: pointer;
          }
      }
    }
  }

//PC
@media screen and (min-width: 878px) {
  .about{
      .left{  
        float: left;
        width: 265px;
      }
      .right{  
        float: right;
        width: 740px;
      }
  }
}

//移动端
@media only screen and (max-width: 878px) {
  .about{
      .left{  
      }
      .right{ 
        margin-top: 20px; 
      }
  }
}
</style>