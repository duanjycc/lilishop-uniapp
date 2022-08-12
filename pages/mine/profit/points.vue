<template>
	<view class="container">
		<view class="items">
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
		<view class="text-center loadStatus font-color-disabled">{{ loadStatus }}</view>
		
	</view>
</template>

<script>
	import { queryMakeAccount } from "@/api/mine-make.js";
	export default {
		data() {
			return {
				list: [], //积分数据集合
				params: {
					pageNumber: 1,
					pageSize: 10,
				},
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
			}
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		
		.items {
			background-color: #ffffff;
		}
		
		.loadStatus {
			padding-top: 60rpx;
			padding-bottom: 180rpx;
		}
	}
</style>
