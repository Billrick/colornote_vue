<template>
  <div id="app" class="app" ref="app">
    <el-backtop2 target=".app" :bottom="125" :right="20" @setPropData="setPropData"></el-backtop2>
    <router-view :scrollTopHeight="scrollTopHeight" ></router-view>
  </div>
</template>
<script>
import ElBacktop2 from "@/components/backtop/backtop.vue"

export default {
  data:function(){
    return {
      scrollTopHeight:0,
    };
  },
  methods:{
    setPropData:function(prop,v){
      this[prop] = v;
    }
  },
  components:{
    ElBacktop2
  }
};
</script>
<style lang="less" scoped>
  .app{
    height: ceil(100vh);
    overflow-y: scroll;
  }
  .el-backtop{
    z-index: 99999;
    width: 28px;
    height: 28px;
  }
</style>
