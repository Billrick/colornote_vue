<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      :label-position="labelPosition"
      ref="ruleForm"
      label-width="85px"
      class="article-ruleForm"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="副标题" prop="subtitle">
        <el-input v-model="ruleForm.subtitle"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="colspan">
          <el-form-item label="博客栏目" prop="bc_id">
            <el-select
              v-model="ruleForm.bc_id"
              filterable
              placeholder="请选择博客栏目"
              style="width:100%"
            >
              <el-option v-for="b in blogcategorys" 
                        :key="b.id" 
                        :label="b.categoryName" 
                        :value="b.id" 
                        style="display:flex;">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="colspan">
          <el-form-item label="标签" prop="labels">
            <!-- <el-select
              v-model="ruleForm.labels"
              placeholder="请选择标签"
              style="width:100%"
            >
              <el-option label="暴雪" value="shanghai" style="display:flex;">
                <span style="padding-left:10px">暴雪</span>
              </el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select> -->
            <el-select
              style="width:100%"
              v-model="ruleForm.labels"
              multiple   
              filterable
              allow-create
              default-first-option
              placeholder="请选择文章标签">
              <el-option
                v-for="l in labels"
                :key="l.id"
                :label="l.label"
                :value="l.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="colspan">
          <el-form-item label="天气">
            <el-select
              class="dicSelect"
              @change="showIcon($event, 'weather')"
              v-model="ruleForm.weather"
              placeholder="请选择天气"
              style="width:100%"
            >
              <el-option v-for="w in weather" :key="w.dicCode" :label="w.dicText" :value="w.dicCode" style="display:flex;align-items: center;">
                <img :src="require(`@/assets/img/weather/${w.dicText}.png`)" height="30px">   <span style="padding-left:10px">{{w.dicText}}</span>
                <!-- <span style="padding-left:10px">暴雪</span> -->
              </el-option>
            </el-select>
            <span class="dicIcon"><img :src="wicon" height="30px"></span>
          </el-form-item>
        </el-col>
        <el-col :span="colspan">
          <el-form-item label="心情" prop="mood">
            <el-select
              class="dicSelect"
              @change="showIcon($event, 'face')"
              v-model="ruleForm.mood"
              placeholder="请选择心情"
              style="width:100%"
            >
              <el-option v-for="f in face" :key="f.dicCode" :label="f.dicText" :value="f.dicCode" style="display:flex;align-items: center;">
                <img :src="require(`@/assets/img/face/${f.dicText}.png`)" height="30px">   <span style="padding-left:10px">{{f.dicText}}</span>
                <!-- <span style="padding-left:10px">暴雪</span> -->
              </el-option>
            </el-select>
            <span class="dicIcon"><img :src="ficon" height="30px"></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="colspan">
          <el-form-item label="发布时间" required>
            <el-form-item prop="createtime">
              <el-date-picker
                v-model="ruleForm.createtime"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
              >
              </el-date-picker>
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :span="colspan">
          <el-form-item label="是否公开" prop="isPrivate">
            <el-switch v-model="ruleForm.isPrivate"></el-switch>
          </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="博文内容" prop="content">
          <!-- <el-input type="textarea" v-model="ruleForm.desc"></el-input> -->
          <div class="editor">
            <mavon-editor @imgAdd="$imgAdd" @imgDel="$imgDel" :codeStyle="'atom-one-light'" :autofocus="false" ref=md v-model="ruleForm.content" />
          </div>
        </el-form-item>
        
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { blogApi, TkApi } from "@/api/api.js";

export default {
  created: function() {
    if (this.screenWidth <= 878) {//移动端
      this.colspan = 24;
      this.labelPosition = "top";
    } else {//pc
      this.labelPosition = "right";
    }
    this.queryBlogDic();
  },
  data() {
    return {
      //表单校验
      ruleForm: {
        bc_id:"",//category
        b_id:"1",
        title:"",
        subtitle:"",
        content:"",
        weather:"",
        mood:"",
        isPrivate: false,
        labels: [],
        labelstext:"",
        createtime: "",
        contentHtml:"",
        usestatus:"0",
        category:[],
        contentMenu:""
      },
      rules: {
        title: [
          { required: true, message: "请输入博客标题", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ],
        subtitle: [
          { required: true, message: "请输入博客副标题", trigger: "blur" },
          { min: 1, max: 500, message: "长度在 1 到 500 个字符", trigger: "blur" }
        ],
        bc_id: [
          { required: true, message: "请选择文章分类", trigger: "blur" }
        ],
        createtime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        content: [
          {
            required: true,
            message: "请填写博文内容",
            trigger: "blur"
          }
        ]
      },
      //公共资源  face 和 weather
      face:[],
      weather:[],
      labels:[],
      blogcategorys:[],
      labelPosition: "top",
      //响应式
      colspan: 12,
      imgFile: {},//已上传的文件
      screenWidth: document.documentElement.clientWidth,
      //header
      myheaders: {
        username: this.$route.params.username
      },
      wicon:"",
      ficon:""
    };
  },
  methods: {
    queryBlogDic(){
      //天气
      blogApi
        .queryBlogDic("999")
        .then(res => {
          if (res.code == 200) {
            this.weather = res.data;
          }
        })
      //face
      blogApi
        .queryBlogDic("998")
        .then(res => {
          if (res.code == 200) {
            this.face = res.data;
          }
        })
      //标签
      blogApi.queryBlogLabelByBid(this.myheaders)
        .then(res => {
          if (res.code == 200) {
            this.labels = res.data;
          }
        })
      //博文分类
      blogApi.queryBlogCateByBid(this.myheaders)
      .then(res => {
        if (res.code == 200) {
          this.blogcategorys = res.data;
        }
      })
    },
    submitForm(formName) {
      this.ruleForm.contentHtml = document.querySelector(".v-show-content").innerHTML;
      let menuReg = /<(h[1-6])>([\S\s]*?)<\/\1>/gi;
      let menuArr = this.ruleForm.contentHtml.match(menuReg);
      if(menuArr != null){
        this.ruleForm.contentMenu = menuArr.join("");
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.category = [];
          this.ruleForm.labelstext = "";
          let labels = this.ruleForm.labels;
          //区分 新增的标签 和 历史标签
          for(var i = 0 ; i < labels.length; i++){
            if(typeof(labels[i])=='string'){ //如果标签类型为字符串 表示是新增的标签
              this.ruleForm.category.push(i);              //暂时先把 新增的标签ID的索引放入category中  ， 在后台代码中 根据索引把新增标签插入到历史标签库中
              this.ruleForm.labelstext += labels[i] + ","; //把标签文本都放入labeltext
            }else{ //如果是数组类型  说明是历史标签
              let obj = this.labels.find((item)=>{
                return item.id === labels[i];
              });
              this.ruleForm.labelstext += obj.label + ","; //把标签文本都放入labeltext
            }
          }
          //保存
          blogApi.insertBlogArticle(this.ruleForm,this.myheaders)
          .then(res => {
            if (res.code == 200) {
              console.log(res);
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success',
                duration: 1000
              });
              this.$router.push({ path: "/"+ this.$route.params.username +"/blogArticleInfo/"+res.data.id});
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //select 选中 显示图标
    showIcon(v, d){//d:元素  v:值
      let arr = [];
      if(d=="weather"){//天气
        arr = this.weather;
      }else if(d=="face"){//心情
        arr = this.face;
      }
      let dic = arr.filter(item => {
        if(item.dicCode==v){
          return item;
        }
      })
      let dicText = dic[0].dicText;
      if(d=="weather"){//天气
        this.wicon = require(`@/assets/img/weather/${dicText}.png`);
      }else if(d=="face"){//心情
        this.ficon = require(`@/assets/img/face/${dicText}.png`);
      }
      
    },
    // 绑定@imgAdd event
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.article-ruleForm {
  text-align: left;
}
.editor {
  height: 500px;
}
.markdown-body {
  height: 100%;
}
@media only screen and (max-width: 878px) {
  .el-form-item {
      margin-bottom: 15px;
  }
}
.dicIcon{
  position: absolute;
  right: 35px;
  img{
    vertical-align: middle;
  }
}
</style>
