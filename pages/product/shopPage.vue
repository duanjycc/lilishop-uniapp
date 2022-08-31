<template>
	<div>
		<div class="wrapper">
			<!-- 店铺信息模块 -->
			<div class="store flex">
				<u-image border-radius="10" width="150" height="150" :src="storeInfo.storeLogo" mode="aspectFit">
				</u-image>
				<div class="box">
					<div class="store-name" >
						{{ storeInfo.storeName || ''}}
						<!-- <u-icon style="margin-left:10rpx;" name="arrow-right"></u-icon> -->
					</div>
					<div class="flex store-message">
						<view class="fs-20" > {{ storeInfo.memberName  }} </view>
						<a :href="'tel:' + storeInfo.memberName" style="text-decoration:  none;"> <u-icon style="margin-left:10rpx;" name="phone"></u-icon></a>
					</div>
					<div class="flex store-message">
						<view class="fs-20" > {{ storeInfo.storeAddressDetail  }} <u-icon @click="goMap()"  style="margin-left:10rpx;" name="address"></u-icon> </view>
					</div>
				</div>
				<div class="collection">
					<div class="collection-btn" @click="whetherCollection"> {{ isCollection  ? '已关注' : '+ 关注' }}</div>
				</div>
			</div>
		</div>

		<div>
			<view class="detail-box">
				<view class="goods-detail">
					<view class="detail_padding">
						<div class="goods-detail-box">
							<div class="goods-detail-item goods-active">商铺介绍</div>
						</div>
						<u-empty class="empty" text="暂无商铺介绍" mode="data"	v-if="!storeInfo.storeDesc"></u-empty>
						<u-parse class="vhtml" :lazy-load="true"	:use-cache="true" :show-with-animation="true"	>
							{{storeInfo.storeDesc}}
						</u-parse>
					</view>
				</view>
			</view>
		</div>

		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</div>
</template>

<script>
import { getStoreBaseInfo, getStoreCategory } from "@/api/store.js";
import {  receiveCoupons,  deleteStoreCollection,  collectionGoods,  getGoodsIsCollect,} from "@/api/members.js";
import config from "@/config/config";
import storage from "@/utils/storage";
export default {
	data() {
		return {
			config,
			scrollTop: 0,
			mainColor: this.$mainColor, //主色调
			current: 0, //初始tabs的索引
			storeId: "",
			storeInfo: {}, //店铺详情
			isCollection: false, //是否关注
		};
	},

	/**
	 * 加载
	 */
	async onLoad(options) {
		this.storeId = options.id;
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onPullDownRefresh() {
		this.init();
	},
	mounted() {
		// #ifdef MP-WEIXIN
		// 小程序默认分享
		uni.showShareMenu({ withShareTicket: true });
		// #endif
		this.init();
	},

	// 下拉加载
	onReachBottom() {
		this.goodsParams.pageNumber++;
	},

	methods: {
		init() {
			// 店铺信息
			this.getStoreData();
			this.enableGoodsIsCollect();
		},
		/**是否收藏店铺 */
		async enableGoodsIsCollect() {
			let res = await getGoodsIsCollect("STORE", this.storeId);
			if (res.data.success) {
				this.isCollection = res.data.result;
			}
		},
		goMap() {
			console.log('打开地图');
			let self = this
			uni.showActionSheet({
				title: '选择地图应用',
				itemList: ['高德地图', '百度地图', '腾讯地图'],
				success: function(res) {
					self.guide(res.tapIndex)
				},
				fail: function(res) {
					console.log(res.errMsg);
				}
			});
		},
		guide(signMap) {
			let self = this;
			uni.showLoading({
				title: '跳转中'
			});
			let { position } = this;
			let local = self.storeInfo.storeCenter.split(",");
			let addressName = self.storeInfo.storeAddressDetail;
			if (addressName && addressName != '') {
				var lng = local[1];
				var lat = local[0];
				
				// 高德地图
				uni.getSystemInfo({
					success: (res) => {
						if (res.platform === "android") {
							window.location.href = "androidamap://viewMap?sourceApplication=appname&poiname=" + addressName + "&lat=" + lat + "&lon=" + lng + "&dev=0";
						} else {
							window.location.href ="iosamap://viewMap?sourceApplication=appname&poiname=" + addressName + "&lat=" + lat + "&lon=" + lng + "&dev=0";
						}
						setTimeout(function() {
							if (signMap == 0) {
								window.location.href = "https://uri.amap.com/marker?position=" + lng + "," + lat + "&name=" + addressName;
							} else if (signMap == 1) {
								window.location.href = "https://api.map.baidu.com/marker?location=" + lat + "," + lng + "&title=" + addressName + "&output=html&src=webapp.baidu.openAPIdemo";
							} else {
								window.location.href = `https://apis.map.qq.com/uri/v1/marker?marker=coord:(${lat},${lng})&addr:${addressName}`
							}
						}, 3000);
					}
				})
				
			} else {
				uni.showToast({
					title: '暂不知道该地点位置',
					icon: 'none',
					duration: 3000,
				});
			}
			setTimeout(function() {
				uni.hideLoading();
			}, 3000);
		},

		/**
		 * 店铺信息
		 */
		async getStoreData() {
			let res = await getStoreBaseInfo(this.storeId);
			res.data.success
				? (this.storeInfo = res.data.result)
				: uni.reLaunch({ url: "/" });
		},

		/**
		 *  是否收藏
		 */
		whetherCollection() {
			if (this.isCollection) {
				deleteStoreCollection(this.storeId).then((res) => {
					if (res.data.success) {
						this.isCollection = false;
						uni.showToast({
							icon: "none",
							duration: 3000,
							title: "取消关注成功！",
						});
					}
				});
			} else {
				collectionGoods("STORE", this.storeId).then((res) => {
					if (res.data.success) {
						this.isCollection = true;
						uni.showToast({
							icon: "none",
							duration: 3000,
							title: "关注成功！",
						});
					}
				});
			}
		},

	},
};
</script>

<style lang="scss" scoped>
@import "product/product.scss";

.wrapper {
	background: #fff;
	padding: 32rpx;
}
.store {
	align-items: center;
	> .box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-left: 30rpx;
		font-size: 24rpx;
		color: #999;
		flex: 2;
		> .store-name {
			font-size: 34rpx;
			color: #333;
			letter-spacing: 1rpx;
			font-weight: bold;
		}
		> .store-message {
			margin-top: 18rpx;
			> div {
				font-size: 26rpx;
				margin: 0 2rpx;
				> span {
					font-size: 26rpx;
					font-weight: bold;
					color: #333;
					margin-right: 8rpx;
				}
			}
		}
	}
}
.collection-btn {
	background: $main-color;
	padding: 6rpx 0;
	width: 140rpx;
	font-size: 24rpx;
	color: #fff;
	border-radius: 100px;
	text-align: center;
}
.store-desc {
	margin: 40rpx 0 0 0;
	color: #999;
}

.contant {
	margin-top: 20rpx;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	> .empty {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 40rpx;
	}
}
.discount {
	height: 154rpx;
	border-top: 1px solid #f6f6f6;
	border-bottom: 18rpx solid #f6f6f6;
	background: #f6f6f6;
	overflow: hidden;
	white-space: nowrap;
	.card-box {
		display: inline-block;
		padding-top: 25rpx;
	}
	.card {
		width: 324rpx;
		height: 116rpx;
		background: #fff;
		margin-left: 20rpx;
		border-radius: 5px;
		display: flex;
		align-items: center;
		.money {
			width: 45%;
			color: #fd6466;
			font-weight: 500;
			text-align: center;
			text {
				font-size: 50rpx;
			}
		}
		.xian {
			height: 66rpx;
			border: 1px dashed #f6f6f6;
			position: relative;
			&:before,
			&:after {
				content: "";
				width: 22rpx;
				height: 12rpx;
				position: absolute;
				background: #f6f6f6;
			}
			&:before {
				border-radius: 0 0 22rpx 22rpx;
				top: -30rpx;
				left: -10rpx;
			}
			&:after {
				border-radius: 22rpx 22rpx 0 0;
				bottom: -30rpx;
				left: -10rpx;
			}
		}
		.text {
			flex: 1;
			color: $aider-light-color;
			font-size: 24rpx;
			display: flex;
			flex-direction: column;
			margin-left: 14rpx;
			text:nth-of-type(2) {
				color: #ccc;
			}
			.cur:nth-of-type(1) {
				color: #ccc;
			}
		}
	}
}
.category-item {
	background: #fff;
	padding: 22rpx;
	margin: 20rpx 10rpx;
	> .flex {
		color: #666;
		justify-content: space-between;
	}
	> .child-list {
		display: flex;
		margin: 20rpx 0;
		flex-wrap: wrap;
		> .child {
			justify-content: center;
			margin: 1% 0;
			display: flex;
			width: 48%;
			font-size: 24rpx;
			color: #999;
			margin-right: 1%;
			border: 1rpx solid #ededed;
			box-sizing: border-box;
			height: 70rpx;
			text-align: center;
			line-height: 70rpx;
		}
	}
}
.kefu {
	background: #f7f7f7;
	height: 70rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 32rpx;
	border-radius: 10rpx;
	font-size: 24rpx;
	color: #999;
}

.param-list {
	padding: 40rpx 0 80rpx 0;
}
.param-item {
	display: flex;
	justify-content: center;
	border-bottom: none;

	> .param-left,
	> .param-right {
		padding: 16rpx 0;
		font-size: 24rpx;
		color: #666;
		border: 1px solid rgb(220, 223, 230);
		border-bottom: none;
	}
	> .param-left {
		text-align: center;
		border-right: none;
		flex: 3;
	}

	> .param-right {
		padding: 0 10rpx;
		align-items: center;
		display: flex;
		flex: 7;
	}
}
.param-item:nth-last-of-type(1) {
	> .param-left,
	> .param-right {
		border-bottom: 1px solid rgb(220, 223, 230);
	}
}
.empty {
	margin: 40rpx 0;
}
.goods-detail /deep/ .vhtml {
	overflow: hidden;

	width: 100%;
}
.vhtml {
	/deep/ img {
		display: block !important;
	}
}

/deep/ img {
	width: 100%;
}
.goods-detail-box {
	display: flex;
	justify-content: space-between;
	// padding: 0 80rpx;
	height: 120rpx;
	line-height: 120rpx;
	> .goods-active {
		font-weight: 700;
		&::before {
			position: absolute;
			left: 47%;
			bottom: 15px;
			-webkit-transform: translateX(-50%);
			transform: translateX(-50%);
			content: "";
			display: block;
			width: 100rpx;
			height: 6rpx;

			background-image: linear-gradient(90deg, $price-color, $price-light-color);
		}
	}
	> .goods-detail-item {
		color: #262626;
		position: relative;
	}
}
.detail_padding {
}
</style>