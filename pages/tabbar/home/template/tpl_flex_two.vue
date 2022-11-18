<template>
	<div class="layout">
		<div class="flex-two">
			<div class="title">
				<image class="plate-image" src="../../../../static/img/plate.png"></image>
				<view class="plate-title fs-28 ml-10" style="">我的联德之旅</view>
			</div>
			<div class="content">
				<div class="flex-content">
					<div class="item item-1">
						<view>
							<view class="fs-48 font-weight-600">{{ todayCount }}</view>
							<view class="fs-28 mb-10 font-color-disabled">SSD销毁总量</view>
						</view>
					</div>
					<span class="line-span"></span>
					<div class="item item-2">
						<view>
							<view class="fs-48 font-weight-600">{{ yesterdayCount }}</view>
							<view class="fs-28 mb-10 font-color-disabled">今日销毁量</view>
						</view>
					</div>
				</div>
				<hr style="height:1px;border:none;border-top:1px dashed darkgray;margin-left: 10rpx;margin-right: 10rpx;" />
				<view class="fs-28 mb-10" style="text-align: center;margin-top: 10px;">不要等待机会，而要创造机会</view>
			</div>
			<view class="fs-28 mb-10" style="margin-left: 30rpx;display: inline-block;">百川汇，纳八方</view>
			<div
			  @click="liangdeClick"
			  class="btn"
			>
			  联德时代 >
			</div>
		</div>
  </div>
</template>
<script>
	
	import { homeSSD } from "@/api/home"; //获取楼层装修接口
	
	let getFloat = function(number, n) {
		n = n ? parseInt(n) : 0;
		if(n <= 0) {
			return Math.round(number);
		}
		number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
		return number;
	};
	
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
						self.todayCount = getFloat(data.sum, 4);
						self.yesterdayCount = getFloat(data.yesterdayCount, 4);
					}
				});
			},
			liangdeClick() {
				console.log('liangdeClick')
				uni.navigateTo({
				  url: `/pages/tabbar/screen/tpl_video?src=http://wangzix.com:9000/hlm/c0313e34795a5cf5efead33421b23733.mp4`,
				});
			},
		}
	};
</script>
<style lang="scss" scoped>
@import "./tpl.scss";
.flex-two {
	width: 100%;
	height: 315rpx;
	background-color: #EDE943;
	border-radius: 10rpx;
}

.content {
	height: 196rpx;
	background-color: white;
	margin: 10rpx 30rpx 10rpx 30rpx ;
	border-radius: 10rpx;
	
}
.flex-content {
	display: flex;
	
	.item {
		height: 122rpx;
		width: calc(50%);
		align-items: center;
		text-align: center;
		padding-top: 15rpx;
	}
	
	.item-1 {
		// background-color:#72c5b3;
		// background-image:-webkit-gradient(linear, left bottom, right top, color-stop(0.32, #51708c87), color-stop(0.83, #72c5b3));
	}
	
	.item-2 {
		// background-color:#d41a1a;
		// background-image:-webkit-gradient(linear, left bottom, right top, color-stop(0.32, #ae8d8d96), color-stop(0.83, #ffc107));
	}
}
	
.plate-image {
	width: 30rpx;
	height: 30rpx;
	margin-left: 10rpx;
	display: inline-block;
	vertical-align: middle;
}

.title{
	display: inline-block;
	vertical-align: middle;
	height: 40rpx;
}

.plate-title {
	display: inline-block;
	vertical-align: middle;
}

.line-span{
margin-top: 30rpx;
margin-bottom: 10rpx;
border-left: 1px solid darkgray;
font-size: 0;
}

.line-span2 {
	margin-left: 10rpx;
	margin-right: 10rpx;
	margin-bottom: 60rpx;
	border-left: 1px solid darkgray;
	font-size: 0;
}

.btn {
	float: right;
	width: 150rpx;
	height: 40rpx;
	font-size: 20rpx;
	line-height: 40rpx;
	text-align: center;
	color: #ffffff;
	margin-right: 30px;
	border-radius: 5rpx;
	background-color: #3B3838;
}

</style>