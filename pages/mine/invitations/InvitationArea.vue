<template>
	<view class="container">
		<view class="header">
			<view>
				<view class="title">{{ userInfo.member.myRegion || 暂无 }}</view>
				<view class="sub-title" v-if="!!userInfo.member.myParentRegion">（上级区域是 {{ userInfo.member.myParentRegion }}）</view>
			</view>
		</view>
		
		<view  class="content">
			<view class="card-area">
				<view class="card-title">
					邀请记录
				</view>
				<view class="card-body" style="padding-top: 0;padding-bottom: 0;">
					<view v-for="(item, index) in list" :key="index">
						<view class="split-line-1" v-if="index > 0"></view>
						<view class="item fs-30 d-flex justify-content-space-between">
							<view class="title">{{ item.title }}</view>
							<view>{{ item.createTime }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="text-center">{{ loadStatus }}</view>
	</view>
</template>

<script>
	import { queryInvitationRegion } from "@/api/mine-invitation.js";
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				userInfo: null,
				list: [], 
				params: {
					pageNumber: 1,
					pageSize: 10,
				},
				inviter: '',
				tel: '',
				area: '西湖1区',
				parentArea: '西湖区',
				loadStatus: "加载更多",
			};
		},
		onLoad() {
			this.userInfo = this.$options.filters.isLogin();
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
				let self = this;
				let params = self.params;
				uni.showLoading({
					title: "加载中",
				});
				queryInvitationRegion(params, self.userInfo.member.myRegionId).then((res) => {
					uni.hideLoading();
					if (res.data.success) {
						let data = res.data.result.records;
						if (data.length < self.params.pageSize) {
							self.loadStatus = "没有更多";
							self.list.push(...data);
						} else {
							self.list.push(...data);
							if (data.length < 10)  self.loadStatus = "加载更多";
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
			padding-top: 268rpx;
			padding-bottom: 60rpx;
			
			.title {
				font-weight: 900;
			}
			
			.item {
				line-height: 100rpx;
			}
		}
		
	}
	
</style>
