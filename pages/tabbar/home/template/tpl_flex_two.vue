<template>
	<div class="layout">
		<div class="flex-two">
			<div class="item item-1">
				<view>
					<view class="fs-28 mb-10">SSD销毁总量</view>
					<view class="fs-48 font-weight-700">{{ todayCount }}</view>
				</view>
			</div>
			<div class="item item-2">
				<view>
					<view class="fs-28 mb-10">昨日销毁量</view>
					<view class="fs-48 font-weight-700">{{ yesterdayCount }}</view>
				</view>
			</div>
		</div>
  </div>
</template>
<script>
	
	import { homeSSD } from "@/api/home"; //获取楼层装修接口
	export default {
		title: "两张横图",
		data() {
			return {
				todayCount: 0,
				yesterdayCount: 0
			};
		},
		mounted() {
			this.getData();
		},
		methods: {
			getData() {
				let self = this;
				homeSSD().then((res) => {
					if (res.data.success) {
						let data = res.data.result;
						self.todayCount = data.sum;
						self.yesterdayCount = data.yesterdayCount;
					}
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
@import "./tpl.scss";
.flex-two {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 200rpx;
	
	.item {
		height: 100%;
		width: calc(50% - 10rpx);
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		color: #ffffff;
		border-radius: 10rpx;
	}
	
	.item-1 {
		background-color:#72c5b3;
		background-image:-webkit-gradient(linear, left bottom, right top, color-stop(0.32, #51708c87), color-stop(0.83, #72c5b3));
	}
	
	.item-2 {
		background-color:#d41a1a;
		background-image:-webkit-gradient(linear, left bottom, right top, color-stop(0.32, #ae8d8d96), color-stop(0.83, #ffc107));
	}
}

</style>