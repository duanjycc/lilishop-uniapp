<template>
	<view class="container">
		<view class="header">
			<view>
				<view class="title">{{ area }}</view>
				<view class="sub-title">（上级区域是 {{ parentArea }}）</view>
			</view>
		</view>
		
		<view  class="content">
			<view class="card-area">
				<view class="card-title">
					邀请记录
				</view>
				<view class="card-body" style="padding-top: 0;padding-bottom: 0;">
					<view v-for="(i, index) in 15" :key="i">
						<view class="split-line-1" v-if="index > 0"></view>
						<view class="item fs-30 d-flex justify-content-space-between">
							<view class="title">西湖区</view>
							<view>Lv1服务商</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getPointsData, getMemberPointSum } from "@/api/members.js";
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				loadStatus: "more",
				list: [], 
				params: {
					pageNumber: 1,
					pageSize: 10,
				},
				inviter: '',
				tel: '',
				area: '西湖1区',
				parentArea: '西湖区'
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
			handleBind() {
				this.$refs.popupCellphone.open();
			},
			close() {
				this.$refs.popupCellphone.close();
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
		
		.header {
		    background-image: url("/static/img/main-bg.png");
		    background-size: cover;
		    background-repeat: no-repeat;
			border-radius: 0 0 30rpx 30rpx;
			position: fixed;
			top: 80rpx !important;
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
			
			.title {
				font-size: 42rpx;
				font-weight: 900;
			}
			
			.sub-title {
				margin-top: 15rpx;
				font-size: 24rpx;
			}
		}
		
		.content {
			margin-top: 268rpx;
			padding-bottom: 180rpx;
			
			.title {
				font-weight: 900;
			}
			
			.item {
				line-height: 100rpx;
			}
		}
		
	}
	
</style>
