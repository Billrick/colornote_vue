<template>
    <div class="timeline">
       <div class="timeline-card">
           <div class="title-point"></div>
           <p class="timeline-number">目前共计 {{timelineData.total}} 篇文章~</p>
       </div>
       <div class="timeline-card" v-for="(d,i) in timelineData.data" :key="d.id">
           <!-- <p class="timeline-month" >{{d.indate}}</p> -->
           <!-- {{timelineData.data[i-1].indate}} -->
           <div v-if="i != 0">
                <div class="timeline-point" v-if="timelineData.data[i].indate != timelineData.data[i-1].indate"></div>
                <p class="timeline-month" v-if="timelineData.data[i].indate != timelineData.data[i-1].indate" >
                    {{d.indate | dateFormate("yyyy年MM月")}}  
                </p>
            </div>
            <div v-if="i == 0">
                <div class="timeline-point"></div>
                <p class="timeline-month">
                    {{d.indate | dateFormate("yyyy年MM月")}}
                </p>
            </div>
           <div class="timeline-article">
               <div class="article-title"><router-link tag="span" :to="'/'+ username+ '/blogArticleInfo/' + d.id ">{{d.title}}</router-link></div>
               <div class="time"><i data-v-45d3f5fa="" class="el-icon-date"></i> 发布于 {{d.createtime | dateFormate("yyyy年MM月dd日")}}</div>
            </div>
       </div>
      
    </div>
</template>
<script>
export default {
    props: ["timelineData","username"],
    data:function(){
        return {

        };
    },
    methods:{

    },
    watch:{
        timelineData:function(n,o){
            console.log(n);
        }
    }
}
</script>
<style lang="less" scoped>
    .timeline{
        text-align: left;
        border-left: 2px #f5f5f5  solid;
        padding-top: 5px;
        .timeline-card{
            position: relative;
            .title-point{
                padding: 6px;
                position: absolute;
                border-radius: 10px;
                background: #d2d2d2;
                left: -7px;
                top: 6px;
            }
            .timeline-point{
                padding: 6px;
                position: absolute;
                border-radius: 10px;
                background: #d2d2d2;
                left: -7px;
                top: 8px;
            }
            .timeline-month{
                padding-left: 15px;
                font-size: 26px;
            }
            .timeline-number{
                padding-left: 15px;
            }
            .timeline-article{
                margin-left: 30px;
                box-shadow: 0 0 5px 0 rgba(38, 42, 48, 0.1);
                padding: 13px;
                margin-bottom: 10px;
                border-radius: 2px;
                .article-title{
                    font-size: 22px;
                    margin-bottom: 5px;
                    span{
                        cursor: pointer;
                    }
                }
                .time{
                    font-size: 13px;
                    color: gray;
                }
            }
        }
    }
</style>