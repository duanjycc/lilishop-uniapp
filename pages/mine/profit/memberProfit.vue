<template>
	<view class="container">
		<view class="header">
			<view class="screen">
				<uni-datetime-picker class="datetime-picker" v-model="range" type="daterange" @maskClick="maskClick" />
			</view>
			<view class="header-tabs">
				<view class="tab" :class="type == 1 ? 'activity' : ''" @click="type = 1">转入</view>
				<view class="tab" :class="type == 2 ? 'activity' : ''" @click="type = 2">转出</view>
			</view>
		</view>
		<view class="items">
			<view class="card-area ml-20 mr-20" v-for="(item, index) in list" :key="index">
				<view class="card-title d-flex justify-content-space-between align-items-center">
					<view v-if="type == 1">{{ item.intoTime | filterDate }}</view>
					<view v-else>{{ item.rechargeTime | filterDate }}</view>
					
					<view v-if="type == 1">
						<view class="badge badge-success" v-if="item.rechargeStatus == 0">成功</view>
						<view v-else class="badge badge-warning">转出中</view>
					</view>
					<view v-if="type == 2">
						<view class="badge badge-success" v-if="item.receiptStatus == 0">成功</view>
						<view v-else class="badge badge-warning">转出中</view>
					</view>
				</view>
				<view class="card-body break-all">
					<view class="d-flex">
						<text class="label">数量：</text>
						<text v-if="type == 1">{{ item.arrivalAmount }}</text>
						<text v-else>{{ item.rechargeAmount }}</text>
					</view>
					<view class="d-flex">
						<text class="label">账户：</text>
						<text v-if="type == 1">{{ item.paymentAddress }}</text>
						<text v-else>{{ item.intoAddress }}</text>
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
			this.initPointData();
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
			
			initPointData() {
				// getMemberPointSum().then((res) => {
				// 	this.pointData = res.data.result;
				// });
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
		
		.header {
			position: fixed;
			// top: 80rpx;
			left: 0;
			right: 0;
			
			.screen {
				background-color: #ffffff;
				height: 80rpx;
				
				/deep/ .uni-date-editor--x {
					height: 80rpx;
					border: 0;
				}
			}
			
			.header-tabs {
				height: 100rpx;
				line-height: 100rpx;
				width: 100vw;
				display: flex;
				color: #ffffff;
				
				.tab {
					width: 50%;
					background: linear-gradient(91deg, #facdbb 1%, #fae6ce 99%);
					color: #ffffff;
					text-align: center;
				}
				
				.activity {
					background: linear-gradient(91deg, $light-color 1%, $aider-light-color 99%);
				}
			}
			
		}
		
		.items {
			padding: 180rpx 20rpx 0 20rpx;
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
