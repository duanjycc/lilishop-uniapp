<template>
	<view class="b-content">
		
		<view class="navbar">
			<!-- 循环出头部tab栏 -->
			<view v-for="(item, index) in navList" :key="index" class="nav-item" @click="handleTabClick(index)">
				<text :class="{ current: tabCurrentIndex === index }">{{ item.text }}</text>
			</view>
		</view>
		<view class="screen">
			<uni-datetime-picker class="datetime-picker" v-model="range" type="daterange" @maskClick="maskClick" />
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(navItem, navIndex) in navList" :key="navIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">

					<view class="items">
						<view class="item" v-for="(item, index) in navItem.dataList" :key="index">
							<view class="split-line-1" v-if="index > 0"></view>
							<view class="fs-32 d-flex justify-content-space-between" :class="index > 0 ? 'mt-20' : ''">
								<view class="title">{{ item.merName }}</view>
								<view>{{ item.quantity }}</view>
							</view>
							<view class="font-light d-flex justify-content-space-between mt-10 fs-26">
								<view><text v-show="tabCurrentIndex == 1">{{ item.subArea }}</text></view>
								<view>{{ item.creationTime|filterDateTime }}</view>
							</view>
						</view>
					</view>
					<uni-load-more :status="navItem.loadStatus"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	
	</view>
</template>

<script>
	function getMonth() {
		let fdate = new Date()
		let fyears = fdate.getFullYear()
		let fmoths = fdate.getMonth()
		let fdate_sgy = new Date(fyears, fmoths - 1, fdate.getDate())
		return fdate_sgy;
	}
	function dateFormat(dat){
		//获取年月日，时间
		var year = dat.getFullYear();
		var mon = (dat.getMonth()+1) < 10 ? "0"+(dat.getMonth()+1) : dat.getMonth()+1;
		var data = dat.getDate()  < 10 ? "0"+(dat.getDate()) : dat.getDate();
		var newDate = year +"-"+ mon +"-"+ data;
		return newDate;
	}
	
	
	function dateTimeFormat(dat){
		var hours = dat.getHours()  < 10 ? "0"+(dat.getHours()) : dat.getHours();
		var minutes = dat.getMinutes()  < 10 ? "0"+(dat.getMinutes()) : dat.getMinutes();
		var seconds = dat.getSeconds()  < 10 ? "0"+(dat.getSeconds()) : dat.getSeconds();
		return dateFormat(dat)+' '+ hours +"-"+minutes+"-"+seconds;
	}
	
	import { profitArea } from "@/api/mine-profit.js";
	
	export default {
		filters: {
			filterDateTime(val) {
				return dateTimeFormat(new Date(val));
			}
		},
		data() {
			return {
				tabCurrentIndex: 0, 
				range: [this.dateToStr(getMonth()) , this.dateToStr(new Date())],
				navList: [
					{
						text: "区域收益",
						loadStatus: "more",
						dataList: [],
						params: {
							pageNumber: 1,
							pageSize: 10,
							status: 1,
							incomeType: 0
						}
					},
					{
						text: "子区域收益",
						loadStatus: "more",
						dataList: [],
						params: {
							pageNumber: 1,
							pageSize: 10,
							status: 2,
							incomeType: 1
						}
					},
				]
			};
		},
		onShow() {
			this.navList[this.tabCurrentIndex].params.pageNumber = 1
			this.navList[this.tabCurrentIndex].dataList = [];
			this.getData();
		},
		watch: {
			tabCurrentIndex(val) {
				if (this.navList[val].dataList.length == 0) this.getData();
			},
			range(newVal, oldVal) {
				this.getInitPage();
			},
		},
		methods: {
			getInitPage() {
				this.navList = [
					{
						text: "区域收益",
						loadStatus: "more",
						dataList: [],
						params: {
							pageNumber: 1,
							pageSize: 10,
							status: 1,
							incomeType: 0
						}
					},
					{
						text: "子区域收益",
						loadStatus: "more",
						dataList: [],
						params: {
							pageNumber: 1,
							pageSize: 10,
							status: 2,
							incomeType: 1
						}
					},
				];
				this.getData();
			},
			handleTabClick(index) {
				this.tabCurrentIndex = index;
			},

			async getData() {
				let index = this.tabCurrentIndex;
				let params = this.navList[index].params;
				params['beginDate'] = this.range[0];
				params['endDate'] = this.range[1];
				let res = null;
				
				uni.showLoading({ title: "加载中" });
				res = await profitArea(params);
				uni.hideLoading();
				
				if (!!res && !!res.data && res.data.success) {
					let data = res.data.result.records;
					if (data.length < 10) {
						this.navList[index].loadStatus = "noMore";
						this.navList[index].dataList.push(...data);
					} else {
						this.navList[index].dataList.push(...data);
					}
				}
			},
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
			},
			loadData() {
				let index = this.tabCurrentIndex;
				if (this.navList[index].loadStatus != "noMore") {
					this.navList[index].params.pageNumber++;
					this.getData();
				}
			},
			useItNow(item) {
				if (item.storeId && item.storeId!='0') {
					uni.navigateTo({
						url: `/pages/product/shopPage?id=${item.storeId}`,
					});
				} else {
					uni.switchTab({
						url: "/pages/navigation/search/searchPage",
					});
				}
			},
			dateToStr(date) {
				var year = date.getFullYear();//年
				var month = date.getMonth();//月
				var day = date.getDate();//日
				return year + "-" +
					((month + 1) > 9 ? (month + 1) : "0" + (month + 1)) + "-" +
					(day > 9 ? day : ("0" + day))
			 }
		},
	};
</script>

<style lang="scss" scoped>
	$item-color: #fff;
	page {
		height: 100%;
	}
	
	
	.screen {
		background-color: #ffffff;
		height: 80rpx;
		box-shadow: 0rpx 12rpx 80rpx 0px rgb(142, 142, 142);
		
		/deep/ .uni-date-editor--x {
			height: 80rpx;
			border: 0;
		}
	}
	
	.items {
		background-color: #ffffff;
		
		.item {
			padding: 20rpx;
		}
	}

	.b-content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100vh - 152rpx);
	}

	.list-scroll-content {
		height: 100%;
		width: 100%;

		.coupon-item {
			display: flex;
			align-items: center;
			height: 220rpx;
			margin: 20rpx;

			.left {
				height: 100%;
				width: 260rpx;
				background-color: $light-color;
				position: relative;

				.message {
					color: $font-color-white;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					margin-top: 40rpx;

					view:nth-child(1) {
						font-weight: bold;
						font-size: 60rpx;
					}

					view:nth-child(2) {
						font-size: $font-sm;
					}
				}

				.wave-line {
					height: 220rpx;
					width: 8rpx;
					position: absolute;
					top: 0;
					left: 0;
					background-color: $light-color;
					overflow: hidden;

					.wave {
						width: 8rpx;
						height: 16rpx;
						background-color: #ffffff;
						border-radius: 0 16rpx 16rpx 0;
						margin-top: 4rpx;
					}
				}

				.circle {
					width: 40rpx;
					height: 40rpx;
					background-color: $bg-color;
					position: absolute;
					border-radius: 50%;
					z-index: 111;
				}

				.circle-top {
					top: -20rpx;
					right: -20rpx;
				}

				.circle-bottom {
					bottom: -20rpx;
					right: -20rpx;
				}
			}

			.right {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 450rpx;
				font-size: $font-sm;
				height: 100%;
				background-color: #ffffff;
				overflow: hidden;
				position: relative;

				.content {
					color: #666666;
					margin-left: 20rpx;
					line-height: 2em;
					
					> view:nth-child(1) {
						color: #ff6262;
						font-size: 30rpx;
					}

					.title-1, .title-2, .title-3 {
						font-size: 25rpx;
					}
				}
				
				.receive {
					color: #ffffff;
					background-color: $main-color;
					border-radius: 50%;
					width: 86rpx;
					height: 86rpx;
					text-align: center;
					margin-right: 48rpx;
					vertical-align: middle;
					padding-top: 8rpx;
					position: relative;
					z-index: 2;
				}

				.jiao-1 {
					background-color: #ffc71c;
					width: 400rpx;
					transform: rotate(45deg);
					text-align: center;
					position: absolute;
					color: #ffffff;
					right: -130rpx;
					top: 0;
					
					.text-1 {
						margin-left: 68rpx;
						font-size: 28rpx;
					}
					
					.text-2 {
						margin-left: 68rpx;
						font-size: 28rpx;
					}
				}
				
				.no-icon {
					border-radius: 50%;
					width: 86rpx;
					height: 86rpx;
					margin-right: 48rpx;
					position: relative;
					z-index: 2;
				}
				
				.bg-quan {
					width: 244rpx;
					height: 244rpx;
					border: 6rpx solid $main-color;
					border-radius: 50%;
					opacity: 0.1;
					color: $main-color;
					text-align: center;
					padding-top: 30rpx;
					font-size: 130rpx;
					position: absolute;
					right: -54rpx;
					bottom: -60rpx;
				}
			}
		}
	}

	.navbar {
		display: flex;
		height: 80rpx;
		padding: 0 5px;
		background: #fff;
		color: $light-color;
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			height: 100%;
			font-size: 26rpx;
			color: $light-color;
			position: relative;
			text-align: center;
			text {
				line-height: 80rpx;
			}
			
			.current {
				font-weight: bold;
				font-size: 28rpx;
				padding-bottom: 10rpx;
				border-bottom: 2px solid $light-color;
			}
		}
	}
</style>
