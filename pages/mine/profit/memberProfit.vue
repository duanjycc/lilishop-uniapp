<template>
	<view class="container">
		<view class="screen">
			<uni-datetime-picker class="datetime-picker" v-model="range" type="daterange" @maskClick="maskClick" />
			
			<view class="bar-border"></view>
		</view>
		
		<view class="items">
			<view class="item" v-for="(item, index) in list" :key="index">
				<view class="split-line-1" v-if="index > 0"></view>
				<view class="item-content">
					<view class="fs-30 d-flex justify-content-space-between">
						<view class="title">{{ item.incomeType|filterType }}</view>
						<view>{{ item.quantity }}</view>
					</view>
					<view class="mt-20 font-light d-flex justify-content-space-between fs-24">
						<view></view>
						<view>{{ item.creationTime }}</view>
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
	
	import { profitMember } from "@/api/mine-profit.js";
	export default {
		filters: {
			filterDate(val) {
				return dateFormat(new Date(val));
			},
			filterType(val) {
				if(val == 0) return '邀请收益';
				return '空投收益';
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
				profitMember(params).then((res) => {
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
			
			/deep/ .uni-date-editor--x {
				height: 80rpx;
				border: 0;
			}
		}
		
		.items {
			padding-top: 100rpx;
			background-color: #ffffff;
			
			.item {
				padding: 0 20rpx;
				
				.item-content {
					padding: 20rpx 0;
				}
			}
			
			.card-area {
				border-radius: 20rpx;
				line-height: 1.8;
				width: calc(100% - 40rpx);
				
				.label {
					flex: 0 0 90rpx;
					color: $font-color-base;
				}
				
				.count-into {
					color: $uni-color-success;
				}
				
				.count-out {
					color: $uni-color-error;
				}
				
				.badge {
					margin-left: 10rpx;
					padding: 0 10rpx;
					line-height: 1.5;
					color: #ffffff;
					font-size: 28rpx;
					border-radius: 10rpx;
				}
				
				.badge-success {
					background-color: $uni-color-success;
				}
				
				.badge-warning {
					background-color: $uni-color-warning;
				}
			}
		}
		
		.loadStatus {
			padding-top: 60rpx;
			padding-bottom: 180rpx;
		}
	}
</style>
