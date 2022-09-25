<template>
	<view class="container">
		<view class="mine-header">
			<view>
				<view>总积分</view>
				<view class="uni-top-2">{{ sumProfit || 0 }}</view>
			</view>
			<view>
				<view>商铺总做单数量</view>
				<view class="uni-top-2">{{ makeCount || 0 }}</view>
			</view>
		</view>

		<view class="items">
			<u-search placeholder="清输入手机号" shape="square" style="margin-left: 10px;" @change="searchMobile()" v-model="params.mobile"></u-search>
			
			<view class="card">
				<text>会员列表</text>
			</view>
			
			<view class="card-area" v-for="(item, index) in list" :key="index">
				<view class="card-title d-flex justify-content-space-between align-items-center">
					<view class="fs-24">
						<text >{{ item.username }}</text> 
					</view>
				</view>
				
				<view class="card-body break-all">
					
					<view>
						<text class="label-title">积分：</text>
						<text>{{ item.point }}</text>
					</view>
					
					<view>
						<text class="label-title">ssd：</text>
						<text>{{ item.ssd }}</text>
					</view>
					
				</view>
			</view>
			
		</view>
		
		<view class="text-center loadStatus font-color-disabled">{{ loadStatus }}</view>
		

	</view>
</template>

<script>
	import {  getStoreMemberTop,getStoreMember} from "@/api/members.js";

	export default {
		data() {
			return {
				list: [], //积分数据集合
				params: {
					pageNumber: 1,
					pageSize: 10,
					mobile:""
				},
				userInfo: null,
				loadStatus: "加载更多",
				pages: 1,
				total: 0,
				sumProfit: 0,
				makeCount: 0,
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
				this.getStoreMemberTop();
		
			},
			getStoreMemberTop(){
				getStoreMemberTop().then((res) =>{
					if (res.data.success) {
						this.sumProfit = res.data.result.sumProfit;
						this.makeCount = res.data.result.makeCount;
					}
				})
			},
			searchMobile(){
				this.list = [];
				this.getList();
			},
			getList() {
				let self = this;
				let params = this.params;
				uni.showLoading({
					title: "加载中",
				});
				getStoreMember(params).then((res) => {
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
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		
		.mine-header {
			background-image: url("/static/img//myShopp.png");
			background-size: cover;
			background-repeat: no-repeat;
			border-radius: 0 0 30rpx 30rpx;
			position: fixed;
			// top: 80rpx !important;
			left: -25rpx;
			top: -30rpx;
			right: 0;
			width: 107%;
			display: flex;
			align-items: center;
			justify-content: space-around;
			color: #FFFFFF;
			height: 240rpx;
			text-align: center;
			z-index: 10;
			box-shadow: 0px 4rpx 8rpx 0px rgba(255, 0, 0, 0.2);
		}
		
		.items {
			padding-top: 220rpx;
			
			.card{
				margin: 10px 13px;
			}		

			.card-area {
				margin-left: 20rpx;
			}

		}
		
		.loadStatus {
			padding-bottom: 180rpx;
		}
	}
</style>
