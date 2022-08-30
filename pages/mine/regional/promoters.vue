<template>
	<view class="container">
		
		<uni-table border stripe>
			<uni-tr>
				<uni-th width="60" align="center">姓名</uni-th>
				<uni-th width="100" align="center">电话号码</uni-th>
				<uni-th width="120" align="center">操作</uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in list" :key="index">
				<uni-td align="center">{{ item.name }}</uni-td>
				<uni-td align="center"> {{ item.userName }} </uni-td>
				<uni-td align="center">
					<button class="uni-button mr-10" size="mini" type="primary" @click="handleEdit(item)">
						修改
					</button>
					<button class="uni-button" size="mini" type="warn" @click="handleDel(item)">
						删除
					</button>
				</uni-td>
			</uni-tr>
		</uni-table>
		
		
		<uni-load-more :status="loadStatus"></uni-load-more>
		
		<view class="btn-bottom"  @click="handleAdd">
			新增推广员
		</view>
	</view>
</template>

<script>
	import { listOfPromoters, deleteOfPromoters } from "@/api/mine-promoter.js";
	export default {
		data() {
			return {
				list: [], //积分数据集合
				params: {
					pageNumber: 1,
					pageSize: 10,
				},
				loadStatus: "more",
				pages: 1,
				total: 0,
				ssd: 0,
				point: 0,
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
				this.loadStatus = "more";
				this.list = [];
				this.params.pageSize = 10;
				this.params.pageNumber = 1;
				this.getList();
			},
			getList() {
				let self = this;
				let params = this.params;
				uni.showLoading({
					title: "加载中",
				});
				listOfPromoters(params).then((res) => {
					uni.hideLoading();
					if (res.data.success) {
						self.pages = res.data.result.pages;
						let data = res.data.result.records;
						self.list.push(...data);
						if (data.length < self.params.pageSize) {
							self.loadStatus = "noMore";
						} else {
							self.loadStatus = "more";
						}
					}
				});
			},
			handleEdit(item) {
				getApp().globalData.promoter = item;
				uni.navigateTo({
					url:'promoterForm'
				})
			},
			handleAdd() {
				getApp().globalData.promoter = null;
				uni.navigateTo({
					url:'promoterForm'
				})
			},
			handleDel(item) {
				let self = this;
				uni.showModal({
					title: '提示',
					content: '是否确认删除“'+item.name+'”?',
					success: function (res) {
						if (res.confirm) {
							let params = {
								'userName': item.userName
							};
							deleteOfPromoters(params).then((res1) => {
								if (res1.data.success) {
									self.initData();
								}
							});
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
		
		.content {
			margin-bottom: 60rpx;
			padding: 20rpx;
			
			.item {
				width: 100%;
			}
			
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
