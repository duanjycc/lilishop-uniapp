<template>
	<view class="container">
		<view class="screen">
			<uni-datetime-picker class="datetime-picker" v-model="range" type="daterange" @maskClick="maskClick" />
		</view>
		<view class="items">
			<view class="item" v-for="(item, index) in list" :key="index">
				<view class="split-line-1" v-if="index > 0"></view>
				<view class="item-content">
					<view class="fs-30 d-flex justify-content-space-between">
						<view class="title">{{ item.merName }}</view>
						<view>{{ item.userReturnPower }}</view>
					</view>
					<view class="font-light d-flex justify-content-space-between">
						<view></view>
						<view>{{ item.createTime }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="text-center loadStatus font-color-disabled">{{ loadStatus }}</view>
		
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
	
	import { queryMakeAccount } from "@/api/mine-make.js";
	export default {
		filters: {
			filterDate(val) {
				return dateFormat(new Date(val));
			}
		},
		data() {
			return {
				range: [getMonth() , Date.now()],
				list: [], //积分数据集合
				params: {
					pageNumber: 1,
					pageSize: 10,
					beginDate: dateFormat(getMonth()),
					endDate: dateFormat(new Date())
				},
				loadStatus: "加载更多",
				pages: 1,
				total: 0
			};
		},
		watch: {
			range(newVal, oldVal) {
				this.params.beginDate = this.range[0];
				this.params.endDate = this.range[1];
				this.initData();
			},
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
		
		
		.screen {
			background-color: #ffffff;
			height: 80rpx;
			position: fixed;
			left: 0;
			right: 0;
			border-bottom: 1rpx $border-color-base solid;
			
			/deep/ .uni-date-editor--x {
				height: 80rpx;
				border: 0;
			}
		}
		
		.items {
			padding-top: 82rpx;
			background-color: #ffffff;
			
			.item {
				padding: 0 20rpx;
				
				.item-content {
					padding: 20rpx 0;
				}
			}
		}
		
		.loadStatus {
			padding-top: 60rpx;
			padding-bottom: 180rpx;
		}
	}
</style>
