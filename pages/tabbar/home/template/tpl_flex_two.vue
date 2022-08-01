<template>
  <div class="layout">
    <div class="flex-two">
      <div class="flex-item" @click="modelNavigateTo(res.list[0])">
        <u-image height="250rpx" borderRadius="10px" width="100%" mode="scaleToFill" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01514658cf4a5ba801219c777b5eda.png&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661933864&t=f04be5975357f2028362df477b433d33" alt>
          <u-loading slot="loading"></u-loading>
		
        </u-image>
      </div>
      <div class="flex-item" @click="modelNavigateTo(res.list[1])">
        <u-image height="250rpx"  borderRadius="10px" width="100%" mode="scaleToFill" :src="res.list[1].img" alt>
          <u-loading slot="loading"></u-loading>
        </u-image>
      </div>
    </div>
  </div>
</template>
<script>
import uImage from "@/uview-ui/components/u-image/u-image.vue";
import { modelNavigateTo } from "./tpl";
export default {
  components: { uImage },
  title: "两张横图",
  props: ["res"],
  mounted() {
   
  },
  data() {
    return {
      modelNavigateTo,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./tpl.scss";
.flex-two {
  width: 100%;
  display: flex;
  overflow: hidden;
}
.flex-item {
  width: 50%;
  > img {
    display: flex;
    max-width: 100%;
    height: 100%;
  }
}
</style>