<template>
	<view class="container">
		<view class="mine-header">
			<view>
				<view>通证</view>
				<view class="uni-top-2">{{ pointData.totalPoint || 2323233.23232 }}</view>
			</view>
			<view>
				<view>积分</view>
				<view class="uni-top-2">{{ pointData.point || 0 }}</view>
			</view>
		</view>
		
		<view  class="mine-content">
			<view class="card-area">
				<view class="card-title">
					做单记录
				</view>
				<view class="card-body">
					<view v-for="(i, index) in 15" :key="i">
						<view class="split-line-1 mt-20" v-if="index > 0"></view>
						<view class="fs-30 d-flex justify-content-space-between" :class="index>0 ? 'mt-20' : ''">
							<view class="title">张三大杀四方{{ i }}</view>
							<view>2000</view>
						</view>
						<view class="mt-20 font-light d-flex justify-content-space-between">
							<view>2021-11-11</view>
							<view>17721212211</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="btn-bottom"  @click="handleAdd">
			做单
		</view>
	</view>
</template>

<script>
	import { getPointsData, getMemberPointSum } from "@/api/members.js";
	export default {
		data() {
			return {
				loadStatus: "more",
				pageNumber: 1,
				count: {
					loadStatus: "more",
				},
				pointList: [], //积分数据集合
				params: {
					pageNumber: 1,
					pageSize: 10,
				},
				pointData: {}, //累计获取 未输入 集合
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
			/**
			 * 获取积分数据
			 */
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

			/**
			 * 获得累计积分使用
			 */
			initPointData() {
				// getMemberPointSum().then((res) => {
				// 	this.pointData = res.data.result;
				// });
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
			top: 88rpx;
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
			margin-top: 268rpx;
			padding-bottom: 180rpx;
			
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
	}
</style>
