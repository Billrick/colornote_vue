<template>
  <div class="blogContent animated fadeIn">
    <div class="ss" v-show="searchOrder || key != null">
      <div class="fromCT" v-if="key">
        <!-- 从分类和标签过来的查询 -->
        搜索 ：<div class="tag">{{text}} <div class="closeTag" @click="removeTag">&times;</div> </div>
      </div>
    </div>
    <div>
      <div class="blogCard" v-for="blog in blogList" :key="blog.id">
        <div class="blogimg">
          <div></div>
          <div class="title">
            <span><router-link tag="span" :to="'/' + username + '/blogArticleInfo/' + blog.id ">{{ blog.title }}</router-link></span>
          </div>
        </div>
        <div class="publishinfo">
          <i class="el-icon-date"></i> {{ blog.createtime | dateFormate("yyyy年MM月dd日")}} •
          <i class="fa fa-folder-open-o" aria-hidden="true"></i>
          <!-- {{ blog.bc_id }} -->
          <span v-for="cate in blog.category" :key="cate.id">
            {{ cate.categoryName }}
          </span>
          • <i class="el-icon-view"></i> {{ blog.see }}
        </div>
        <div class="subtitle">{{ blog.subtitle }}</div>
        <div class="label">
          <span v-for="label in blog.labelstext" :key="label">
            <i class="fa fa-tags" aria-hidden="true"></i> {{ label }} &nbsp;
          </span>
        </div>
        <hr />
        <span><router-link tag="span" :to="'/' + username + '/blogArticleInfo/' + blog.id ">阅读全文 >></router-link></span>
      </div>
    </div>
    <div>
      <el-pagination
        v-show="pageShow"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="page.total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { blogApi,TkApi } from "@/api/api.js";
//import { Loading /*, Message */ } from "element-ui";

export default {
  created: function() {
    let query = this.$route.query;
    if(query.key != undefined){
      let param = TkApi.Decrypt(query.key);
      let queryarr = param.split("-");
      this.key = queryarr[0];
      this.val = queryarr[1];
      this.text = queryarr[2];
    }
    this.getBlogListData(1);
  },
  data: function() {
    return {
      blogList: [],
      page: {
        total: 0,
        pageNum: 2
      },
      pageShow: false,
      searchOrder: true,
      username: this.$route.params.username,
      key: "",
      val: "",
      text: "",
      myheaders: {
        username: this.$route.params.username
      }
    };
  },
  methods: {
    removeTag: function(){
      this.$router.push({path: "/"+this.$route.params.username + "/blogList"});
    },
    handleSizeChange: function() {
      alert("页显示数变化");
    },
    handleCurrentChange: function(currentPage) {
      console.log("翻页:" + currentPage);
      this.getBlogListData(currentPage);
    },
    getBlogListData: function(pageNum) {
      let data = {};
      if (pageNum != undefined) {
        data.pageNum = pageNum;
      }
      // 分类 标签 筛选
      if(this.key != undefined){
        switch(this.key) {
            case "category":
                data.blogcategory = this.val;
                break;
            case "tag":
                data.label = this.text;
                break;
        } 
      }
      blogApi
        .queryBlogArticleList(data, this.myheaders)
        .then(res => {
          if (res.code == 200) {
            this.page.total = res.data.total;
            this.page.pageNum = res.data.pageNum;
            this.blogList = res.data.data;
            if (res.data.totalPage > 1 && res.data != undefined) {
              this.pageShow = true;
            } else {
              this.pageShow = false;
              this.searchOrder = false;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
      //console.log(data);
    }
  }
};
</script>
<style lang="less" scoped>
.blogContent {
  .fromCT{
    text-align: left;
    height: 30px;
    padding: 0px 20px;
    font-size: 15px;
    box-shadow: 0 0 5px 0 rgba(38, 42, 48, 0.1);
    padding: 20px;
    .tag{
      display: inline-block;
      padding: 1px 10px;
      border-radius: 5px;
      color: #a7a7a7;
      border: 1px solid #ccc;
      font-size: 14px;
      .closeTag{
        display: inline-block;
        padding: 0px 1px;
        cursor: pointer;
      }
    }
  }
  .blogCard {
    padding: 15px;
    margin: 25px 5px;
    box-shadow: 0 0 5px 0 rgba(38, 42, 48, 0.1);
    //font-family: 'Courier New', Courier, monospace;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    letter-spacing: 0.5px;
    hr {
      border: 0.5px #f1f1f1 solid;
    }
    span {
      position: relative;
      text-decoration: none;
      cursor: pointer;
    }
    .blogimg {
      background: lightblue;
      height: 350px;
      position: relative;
      .title {
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        display: flex;
        z-index: 0;
        span {
          color: #ffffff;
          font-weight: 700;
          font-size: 23px;
          position: relative;
          text-decoration: none;
          cursor: pointer;
          padding: 0px 1px 0px 1px;
        }
        span:before {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -2px;
          width: 0;
          height: 2px;
          background: #fff;
          transition: all 0.3s;
        }
        span:hover:before {
          width: 100%;
          left: 0;
          right: 0;
        }
      }
    }
    .publishinfo {
      padding: 5px 0px;
    }
    .subtitle {
      text-align: left;
      border-left: 2px black solid;
      padding: 1px 15px;
      font-size: 15px;
      color: lightslategrey;
    }
    .label {
      text-align: left;
      font-size: 15px;
      padding: 5px 13px;
    }
  }
}
</style>
