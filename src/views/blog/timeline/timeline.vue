<template>
    <timeLine :timelineData="timelineData" :username="headers.username"></timeLine>
</template>
<script>
import timeLine from "@/components/timeline/timeline.vue";
import { blogApi } from "@/api/api.js";

export default {
    created(){
        blogApi.queryBlogArticleInTimeLine(this.data,this.headers).then(res => {
            console.log(res);
            if(res.code == 200){
                this.timelineData = res.data;
            }
        }).catch(e => {

        });
    },
    data:function(){
        return {
            data:{

            },
            headers:{
                username: this.$route.params.username
            },
            timelineData: {}
        };
    },
    methods:{

    },
    components:{
        timeLine
    }
}

</script>
<style lang="less" scoped>

</style>