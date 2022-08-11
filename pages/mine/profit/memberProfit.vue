<template>
	<view class="container">
		<view class="screen">
			<uni-datetime-picker class="datetime-picker" v-model="range" type="daterange" @maskClick="maskClick" />
		</view>
		<view class="items">
			<view class="card-area ml-20 mr-20" v-for="(item, index) in list" :key="index">
				<view class="card-title d-flex justify-content-space-between align-items-center">
					<view>{{ item.intoTime | filterDate }}</view>
					
					<view class="badge badge-success" v-if="item.rechargeStatus == 0">成功</view>
					<view v-else class="badge badge-warning">转入中</view>
				</view>
				<view class="card-body break-all">
					<view class="d-flex">
						<text class="label">数量：</text>
						<text>{{ item.arrivalAmount }}</text>
					</view>
					<view class="d-flex">
						<text class="label">账户：</text>
						<text>{{ item.paymentAddress }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="text-center font-color-disabled">{{ loadStatus }}</view>
	</view>
</template>

<script>
	import { transferInDetails, transferOutDetails } from "@/api/mine-transfer.js";
	
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
	export default {
		filters: {
			filterDate(val) {
				return dateFormat(new Date(val));
			}
		},
		data() {
			return {
				range: [getMonth() , Date.now()],
				list: [], 
				params: {
					pageNumber: 1,
					pageSize: 10,
					beginDate: dateFormat(getMonth()),
					endDate: dateFormat(new Date())
				},
				type: 1,
				loadStatus: "加载更多",
				pages: 1,
				total: 0
			};
		},
		onLoad() {
			this.getList();
			
		},
		onReachBottom() {
			if(this.pages > this.params.pageNumber) {
				this.params.pageNumber++;
				this.getList();
			}
		},
		watch: {
			range(newVal, oldVal) {
				this.params.beginDate = this.range[0];
				this.params.endDate = this.range[1];
				this.getInitPage();
			},
			type(newVal, oldVal) {
				this.getInitPage();
			},
		},
		methods: {
			getInitPage() {
				this.params.pageNumber = 1;
				this.params.pageSize = 10;
				this.loadStatus = '加载更多';
				this.pages = 1;
				this.total = 0;
				this.list = [];
				this.getList();
			},
			async getList() {
				let self = this;
				let params = this.params;
				let res = null;
				uni.showLoading({
					title: "加载中",
				});
				if(self.type == 1)  res = await transferInDetails(params);
				else res = await transferOutDetails(params);
				uni.hideLoading();
				if (res.data.success) {
					self.pages = res.data.result.pages;
					self.total = res.data.result.total;
					let data = res.data.result.records;
					if (data.length < self.params.pageSize) {
						self.loadStatus = "没有更多";
						self.list.push(...data);
					} else {
						self.list.push(...data);
						self.loadStatus = "加载更多";
					}
				}
			},
			handleAdd() {
				uni.navigateTo({
					url:'makeForm?makeId=1'
				})
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
		min-height: calc(100vh - 80rpx);
		
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
			padding: 90rpx 20rpx 0 20rpx;
			margin-bottom: 60rpx;
			
			.card-area {
				border-radius: 20rpx;
				line-height: 1.8;
				
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
		
	}
	
</style>
