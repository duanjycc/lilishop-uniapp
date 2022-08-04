<template>
	<view class="container pb-120">
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
		
		<view class="card-area">
			<view class="card-title">
				做单记录
			</view>
			<view class="card-body">
				<view v-for="(i, index) in 10" :key="i">
					<view class="split-line-1 mt-20" v-if="index > 0"></view>
					<view class="fs-30 d-flex justify-content-space-between" :class="index>0 ? 'mt-20' : ''">
						<view>张三大杀四方</view>
						<view>2000元</view>
					</view>
					<view class="mt-20 font-light d-flex justify-content-space-between">
						<view>2021-11-11</view>
						<view>17721212211</view>
					</view>
				</view>
			</view>
		</view>
		
		<image src="/static/add.png" mode="" class="add-icon" @click="handleAdd"></image>
	</view>
</template>

<script>
	// import { getPointsData } from "@/api/members.js";
	// import { getMemberPointSum } from "@/api/members.js";
	export default {
		data() {
			return {
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
			// getList() {
			//   let params = this.params;
			//   uni.showLoading({
			//     title: "加载中",
			//   });
			//   getPointsData(params).then((res) => {
			//     uni.hideLoading();
			//     if (res.data.success) {
			//       let data = res.data.result.records;
			//       if (data.length < 10) {
			//         this.$set(this.count, "loadStatus", "noMore");
			//         this.pointList.push(...data);
			//       } else {
			//         this.pointList.push(...data);
			//         if (data.length < 10) this.$set(this.count, "loadStatus", "noMore");
			//       }
			//     }
			//   });
			// },
			
			handleAdd() {
				uni.navigateTo({
					url:'makeForm?makeId=1'
				})
			},

			/**
			 * 获得累计积分使用
			 */
			initPointData() {
				getMemberPointSum().then((res) => {
					this.pointData = res.data.result;
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
@import "../mine-base.scss";
	.container {
		width: 100%;
		
		.add-icon {
			position: fixed;
			bottom: 40rpx;
			right: 20rpx;
			width: 80rpx;
			height: 80rpx;
			background-color: rgba($color: #ffffff, $alpha: 0.8);
			border-radius: 50%;
		}
	}
</style>
