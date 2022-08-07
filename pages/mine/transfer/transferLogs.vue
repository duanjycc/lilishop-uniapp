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
			<view class="card-area ml-20 mr-20" v-for="(item, index) in 15" :key="i">
				<view class="card-title d-flex justify-content-space-between align-items-center">
					<view>2020-11-11</view>
					<view>
						<view class="badge badge-into">转入</view>
						<!-- <view class="badge badge-out">转出</view> -->
					</view>
				</view>
				<view class="card-body break-all">
					<view class="d-flex">
						<text class="label">数量：</text>
						<text class="count-into">10 SSD</text>
					</view>
					<view class="d-flex">
						<text class="label">账户：</text>
						<text>sdfdssddsdfdsfasewrwefsadsfadsf344t54545345435fedfds</text>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { getPointsData, getMemberPointSum } from "@/api/members.js";
	export default {
		data() {
			return {
				single: '',
				datetimesingle: '',
				range: ['2021-02-1', '2021-3-28'],
				datetimerange: [],
				start: Date.now() - 1000000000,
				end: Date.now() + 1000000000,
				loadStatus: "more",
				list: [], 
				params: {
					pageNumber: 1,
					pageSize: 10,
				},
				inviter: '',
				tel: '',
				type: 1,
			};
		},
		mounted() {
			setTimeout(() => {
				this.datetimesingle = Date.now() - 2*24*3600*1000
				this.single = '2021-2-12'
				this.datetimerange = ["2021-07-08 0:01:10", "2021-08-08 23:59:59"]
			},3000)
		},
		onLoad() {
			this.initPointData();
			this.getList();
		},
		onReachBottom() {
			this.params.pageNumber++;
			this.getList();
		},
		methods: {
			change(e) {
				this.single = e
				console.log('change事件:', this.single = e);
			},
			changeLog(e) {
				console.log('change事件:', e);
			},
			maskClick(e){
				console.log('maskClick事件:', e);
			},
			handleBind() {
				this.$refs.popupScreen.open();
			},
			close() {
				this.$refs.popupScreen.close();
				uni.switchTab({
					url: '/pages/home/index'
				});
			},
			getList() {
				let params = this.params;
				uni.showLoading({
					title: "加载中",
				});
				getPointsData(params).then((res) => {
					uni.hideLoading();
					if (res.data.success) {
						let data = res.data.result.records;
						if (data.length < 10) {
							this.$set(this.count, "loadStatus", "noMore");
							this.pointList.push(...data);
						} else {
							this.pointList.push(...data);
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
			top: 80rpx;
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
			margin-top: 200rpx;
			padding: 0 20rpx 180rpx 20rpx;
			
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
					border-radius: 10rpx;
				}
				
				.badge-into {
					background-color: $uni-color-success;
				}
				
				.badge-out {
					background-color: $uni-color-error;
				}
			}
		}
		
	}
	
</style>
