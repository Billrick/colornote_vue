<template>
    <div>
        <div class="toolbar" v-if="$cookies.get('accessToken') != undefined && $cookies.get('accessToken').split('-')[0] == $route.params.username">
            <span class="toolIcon" title="登出"><i class="fa fa-sign-out fa-lg" aria-hidden="true"></i></span>
        </div>
        <div class="userinfo">
            <span class="toolIcon toolIcon-bj" title="编辑个人信息"  v-if="$cookies.get('accessToken') != undefined && $cookies.get('accessToken').split('-')[0] == $route.params.username">
                <router-link :to="'/' + userBlogBody.username + '/userInfo'" tag="span"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></router-link>
            </span>
            <div class="useravatar">
                <img :src="userBlogBody.avatar" height="90px"/>
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
    .toolbar{
        text-align: right;  
    }
    .toolIcon{
        display: inline-block;
        color: #dcdcdc;
        padding: 5px;
        cursor: pointer;
    }
    .toolIcon-bj{
        position: absolute;
        right: 3px;
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