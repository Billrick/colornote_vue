<template>
    <div>
        <div class="userinfo">
            <div class="useravatar">
                <img :src="require(`@/assets/img/face/酷.png`)" height="90px"/>
            </div>
            <div class="usercard">
                <p class="nname">{{userBlogBody.nickName}}</p>
                <p class="udesc">{{userBlogBody.udesc}}</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    
    props: ["userBlogBody"],
    // methods:{
    //     togglePanel:function(){
    //         this.$emit("togglePanel","子组件调用");
    //     }
    // }
}
</script>
<style lang="less" scoped>
    .useravatar{
        padding-bottom: 10px;
        margin: 40px 10px 0px 10px;
        img{
            border: 3px solid white;
            border-radius: 50%;
        }
    }
    .usercard{
        margin: 0 10px;
        .nname{
            margin: 0 10px;
            font-size: 18px;
            font-weight: 700;
            color: #fff;
        }
        .udesc{
            margin: 10px 5px;
            font-size: 13px;
            color: #969696;
        }
    }
</style>