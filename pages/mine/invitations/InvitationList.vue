<template>
	<view class="container">
		<view class="header">
			<view>
				<view>邀请人数</view>
				<view class="uni-top-2">10</view>
			</view>
			<view v-if="inviter">
				<view>谁邀请我</view>
				<view class="uni-top-2">{{ inviter }}</view>
			</view>
			<view v-else class="bind" @click="handleBind">绑定邀请人</view>
		</view>
		
		<view  class="content">
			<view class="card-area">
				<view class="card-title">
					邀请记录
				</view>
				<view class="card-body" style="padding-top: 0;padding-bottom: 0;">
					<view v-for="(i, index) in 15" :key="i">
						<view class="split-line-1" v-if="index > 0"></view>
						<view class="item fs-30 d-flex justify-content-space-between">
							<view class="title">1330000001</view>
							<view>2020-11-11</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<uni-popup ref="popupCellphone" type="center" :maskClick="true">
			<view class="popup">
				<view class="close" @click="close">
					<image src="../../../static/icons/close.png" mode=""></image>
				</view>
				<view class="popup-title">
					绑定邀请人
				</view>
				<view class="popup-content">
					<view class="form-label">邀请人手机号码</view>
					<input class="form-text mt-10" type="text" v-model="tel" placeholder="请输入邀请人手机号码"/>
					<view class="btn-submit" @click="handleSubmit">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { queryInvitation, queryMyInvitee } from "@/api/mine-invitation.js";
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				loadStatus: "more",
				list: [], 
				params: {
					pageNumber: 1,
					pageSize: 10,
				},
				inviter: '',
				tel: '',
			};
		},

		onLoad() {
			this.initPointData();
			this.getList();
		},

		/**
		 * 触底加载
		 */
		onReachBottom() {
			this.params.pageNumber++;
			this.getList();
		},
		methods: {
			handleBind() {
				this.$refs.popupCellphone.open();
			},
			close() {
				this.$refs.popupCellphone.close();
				uni.switchTab({
					url: '/pages/home/index'
				});
			},
			getList() {
				let params = this.params;
				uni.showLoading({
					title: "加载中",
				});
				queryInvitation(params).then((res) => {
					uni.hideLoading();
					if (res.data.success) {
						let data = res.data.result.records;
						if (data.length < 10) {
							this.$set(this.count, "loadStatus", "noMore");
							this.list.push(...data);
						} else {
							this.list.push(...data);
							if (data.length < 10) this.$set(this.count, "loadStatus", "noMore");
						}
					}
				});
			},
			
			handleAdd() {
				uni.navigateTo({
					url:'makeForm?makeId=1'
				})
			},
			
			initPointData() {
				let self = this;
				queryMyInvitee().then((res) => {
					if (res.data.success) {
						console.log(res.data.result)
						// self.invitee = res.data.result
					}
				});
			},
			handleSubmit() {
				console.log(111);
			}
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		
		.header {
		    background-image: url("/static/img/main-bg.png");
		    background-size: cover;
		    background-repeat: no-repeat;
			border-radius: 0 0 30rpx 30rpx;
			position: fixed;
			top: 80rpx !important;
			left: 0;
			right: 0;
			display: flex;
			align-items: center;
			justify-content: space-around;
			color: #FFFFFF;
			height: 240rpx;
			text-align: center;
			z-index: 10;
			box-shadow: 0px 4rpx 8rpx 0px rgba(255, 0, 0, 0.2);
			
			.bind {
				height: 60rpx;
				line-height: 60rpx;
				color: #ffffff;
				padding: 0 30rpx;
				border-radius: 30rpx;
				background: linear-gradient(91deg, $light-color 1%, $aider-light-color 99%);
			}
		}
		
		.content {
			margin-top: 268rpx;
			padding-bottom: 180rpx;
			
			.title {
				font-weight: 900;
			}
			
			.item {
				line-height: 100rpx;
			}
		}
		
	}
	
	.popup {
		background: #ffffff;
		background-size: cover;
		width: calc(100vw - 120rpx);
		color: $font-color-dark;
		text-align: center;
		opacity: 0.95;
		border-radius: 20rpx;
		padding: 30rpx 30rpx 60rpx 30rpx;
		
		.close {
			position: absolute;
			left: 0;
			top: 5rpx;
			
			image {
				padding: 30rpx 20rpx;
				width: 50rpx;
				height: 50rpx;
			}
		}
		
		.popup-title {
			font-size: 36rpx;
			font-weight: 700;
			text-align: center;
		}
		
		.popup-content {
			font-size: 28rpx;
			line-height: 1.6;
			margin-top: 80rpx;
			
			.form-label {
				font-size: 32rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: $font-color-dark;
				line-height: 2;
				text-align: left;
			}
			
			.form-text {
				text-align: left;
				border: 2rpx $border-color-base solid;
				height: 100rpx;
				border-radius: 15rpx;
				line-height: 100rpx;
				font-size: 32rpx;
				font-weight: 400;
				padding: 0 114rpx 0 24rpx;
			}
			
			.btn-submit {
				margin-left: 30rpx;
				margin-top: 60rpx;
				width: calc(100% - 60rpx);
				height: 100rpx;
				background: linear-gradient(91deg, $light-color 1%, $aider-light-color 99%);
				font-size: 40rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 100rpx;
				border-radius: 50rpx;
				text-align: center;
			}
		}
		
		.popup-logo {
			margin-top: 60rpx;
			width: 100rpx;
			height: 100rpx;
		}
	}
</style>
