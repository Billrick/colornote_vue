<template>
  <div class="footer">
    <div class="footer-wrap">
      <p>
        本博客已萌萌哒运行<span>380天14小时41分0秒</span
        ><span class="time-jump">(●'◡'●)ﾉ♥</span>
      </p>
      <p>
        @CodeBear ———— android开发、前端开发、php开发...(⊙o⊙)…什么都学的程序员~
      </p>
      <p>
        本站点采用
        <a
          href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh"
          target="_blank"
          >知识共享 署名-非商业性使用-禁止演绎 4.0 国际 许可协议</a
        >
      </p>
      <p data-v-c12bc112="">
        本站由 @CodeBear 创建 - © 2018. 粤ICP备17139665号-1
      </p>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.footer {
  background: #262a30;
  height: 120px;
  .footer-wrap {
    position: relative;
    max-width: 960px;
    padding: 0 20px;
    margin: 0 auto;
    height: 120px;
    font-size: 13px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    -ms-flex-pack: center;
    justify-content: center;
    color: #999;
  }
  p {
    margin: 4px 0;
    text-align: left;
    font-size: 13px;
    line-height: 1.15;
    font-family: Lato, PingFang SC, Microsoft YaHei, sans-serif;
  }
}
@media only screen and (max-width: 878px) {
  .footer {
    p {
      font-size: 12px;
    }
  }
}
</style>
