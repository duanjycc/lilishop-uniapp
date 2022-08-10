<template>
	<view class="container">
		<view class="mine-header">
			<view>
				<view>通证</view>
				<view class="uni-top-2">{{ userInfo.member.ssd || 0 }}</view>
			</view>
			<view>
				<view>积分</view>
				<view class="uni-top-2">{{ userInfo.member.point || 0 }}</view>
			</view>
		</view>
		
		<view  class="mine-content">
			<view class="card-area">
				<view class="card-title">
					做单记录
				</view>
				<view class="card-body">
					<view v-for="(item, index) in list" :key="index">
						<view class="split-line-1 mt-20" v-if="index > 0"></view>
						<view class="fs-30 d-flex justify-content-space-between" :class="index>0 ? 'mt-20' : ''">
							<view class="title">{{ item.merName }}</view>
							<view>{{ item.monetary }}</view>
						</view>
						<view class="mt-20 font-light d-flex justify-content-space-between">
							<view>{{ item.createTime }}</view>
							<view>{{ item.username }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="text-center loadStatus font-color-disabled">{{ loadStatus }}</view>
		
		<view class="btn-bottom"  @click="handleAdd">
			做单
		</view>
	</view>
</template>

<script>
	import { getPointsData, getMemberPointSum } from "@/api/members.js";
	import { queryMakeAccount } from "@/api/mine-make.js";
	export default {
		data() {
			return {
				list: [], //积分数据集合
				params: {
					pageNumber: 1,
					pageSize: 10,
				},
				userInfo: null,
				loadStatus: "加载更多",
				pages: 1,
				total: 0
			};
		},
		onShow() {
			this.initData();
		},
		onReachBottom() {
			if(this.pages > this.params.pageNumber) {
				this.params.pageNumber++;
				this.getList();
			}
		},
		methods: {
			initData() {
				this.total = 0;
				this.pages = 1,
				this.loadStatus = "加载更多";
				this.list = [];
				this.params.pageSize = 10;
				this.params.pageNumber = 1;
				this.userInfo = this.$options.filters.isLogin();
				this.getList();
			},
			getList() {
				let self = this;
				let params = this.params;
				uni.showLoading({
					title: "加载中",
				});
				queryMakeAccount(params).then((res) => {
					uni.hideLoading();
					if (res.data.success) {
						self.pages = res.data.result.pages;
						let data = res.data.result.records;
						if (data.length < self.params.pageSize) {
							self.loadStatus = "没有更多";
							self.list.push(...data);
						} else {
							self.list.push(...data);
							self.loadStatus = "加载更多";
						}
					}
				});
			},
			
			handleAdd() {
				uni.navigateTo({
					url:'makeForm?makeId=1'
				})
			},
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		
		.mine-header {
		    background-image: url("/static/img/main-bg.png");
		    background-size: cover;
		    background-repeat: no-repeat;
			border-radius: 0 0 30rpx 30rpx;
			position: fixed;
			// top: 80rpx !important;
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
		}
		
		.mine-content {
			padding-top: 268rpx;
			margin-bottom: 60rpx;
			background-color: #ffffff;
			
			.title {
				font-weight: 900;
			}
		}
		
		.btn-bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 120rpx;
			line-height: 120rpx;
			background: linear-gradient(91deg, $light-color 1%, $aider-light-color 99%);
			font-size: 20px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
			text-align: center;
		}
		
		.loadStatus {
			padding-bottom: 180rpx;
		}
	}
</style>
