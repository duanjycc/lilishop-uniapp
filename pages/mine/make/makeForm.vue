<template>
	<view class="container pb-120">
		<view class="content">
			<view class="form-group">
				<view class="form-label">消费金额</view>
				<input class="form-text" type="text" v-model="form.price" placeholder="金额"/>
			</view>
			<view class="form-group">
				<view class="form-label">店铺</view>
				<picker @change="bindPickerShopChange" :value="shopIndex" :range="shopNames">
					<view class="form-text">{{ shopNames[shopIndex] }}</view>
				</picker>
				<view class="arrow-right"></view>
			</view>
			<view class="form-group">
				<view class="form-label">让利比例</view>
				<picker @change="bindPickerChange" :value="discountIndex" :range="discountRatioDescs">
					<view class="form-text">{{ discountRatioDescs[discountIndex] }}</view>
				</picker>
				<view class="arrow-right"></view>
			</view>
			<view class="form-group">
				<view class="form-label">让利金额</view>
				<input class="form-text" type="text" v-model="form.discountPrice" placeholder="金额"/>
			</view>
			<view class="form-group">
				<view class="form-label">手机号码</view>
				<input class="form-text" type="text" v-model="form.tel" placeholder="输入会员手机号"/>
			</view>
			<view class="desc fs-28 mt-20">￥100.00/SSD</view>
		</view>
		
		<view class="tip-info fs-28 mt-100">本次做单大约需要0(SSD)</view>
		<view class="btn-submit" @click="handleSubmit">确认让利</view>
		<u-keyboard class="passwrod-panel" @change="onChange" ref="uKeyboard" v-model="showKeyboard" @backspace="onBackspace" mode="number" :dot-enabled="false" :tooltip="false" default="">
			<view class="mt-40 mb-40 text-center" style="text-align: center;">
				请输入密码
			</view>
			<view class="close" @click="handleClose">
				<image src="../../../static/icons/close.png" mode=""></image>
			</view>
			<view class="mt-30 text-center fs-28">本次做单需要</view>
			<view class="mt-15 text-center">
				<text class="fs-48 font-weight-500" style="margin-right: 10rpx;">10</text>
				<text>SSD</text>
			</view>
			<u-message-input class="mt-30" mode="box" :maxlength="6" :dot-fill="true" v-model="form.password" :disabled-keyboard="true" @finish="finish"></u-message-input>
		</u-keyboard>
	</view>
</template>

<script>
	// import { getPointsData } from "@/api/members.js";
	// import { getMemberPointSum } from "@/api/members.js";
	export default {
		data() {
			return {
				discountIndex: 0,
				discountRatios: [1,2,3,4],
				discountRatioDescs: ['1成','2成','3成','4成'],
				shopIndex: 0,
				shops: [1,2,3,4],
				shopNames: ['店1','店2','店3','店4'],
				form: {
					price: 120,
					shopId: 0,
					discountRatio: "3折",
					discountPrice: 200,
					cellphone: 13311111111,
					password: ''
				},
				showKeyboard: false,
			};
		},
		watch: {
			discountIndex(oldVal, newVal) {
				this.form.discountRatio = this.discountRatios[newVal];
			},
			shopIndex(oldVal, newVal) {
				this.form.discountRatio = this.shops[newVal];
			}
		},
		onLoad() {
		},
		onReachBottom() {
			this.params.pageNumber++;
			this.getList();
		},
		onBackspace(e) {
			if (this.form.password.length > 0) {
				this.form.password = this.form.password.substring(0, this.form.password.length - 1);
			}
		},
		methods: {
			handleSubmit() {
				this.showKeyboard = true;
				this.form.password='';
			},
			bindPickerChange(e) {
				this.discountIndex = e.target.value
			},
			bindPickerShopChange(e) {
				this.shopIndex = e.target.value
			},
			onChange(val) {
				if (this.form.password.length < 6) {
					this.form.password += val;
				}
				if (this.form.password.length >= 6) {
					this.finish();
				}
			},
			finish() {
				this.showKeyboard = false;
			},
			handleClose() {
				this.showKeyboard = false;
			}
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		min-height: calc(100vh - 88rpx);
		background-color: #ffffff;
		
		.content {
			width: 100%;
			padding: 20rpx 40rpx;
		}
		
		.form-group {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			border-bottom: 1rpx $border-color-dark solid;
			
			.form-label {
				width: 180rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #000000;
			}
			
			.form-text {
				margin-left: 30rpx;
				width: 504rpx;
				height: 120rpx;
				border-radius: 15rpx;
				line-height: 120rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #000000;
				padding: 0 114rpx 0 24rpx;
			}
			
			.arrow-right {
				position: absolute;
				right: 10rpx;
				width: 30rpx;
				height: 30rpx;
				background-image: url("/static/icons/arrow-right.png");
				background-size: cover;
				background-repeat: no-repeat;
			}
		}
		
		
		.desc {
			text-align: right;
			color: $main-color;
		}
		
		.tip-info {
			text-align: center;
			color: $main-color;
		}
		
		.passwrod-panel {
			
			.close {
				position: absolute;
				left: 0;
				top: 10rpx;
				
				image {
					padding: 30rpx 20rpx;
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
		
		
		.btn-submit {
			margin-left: 30rpx;
			margin-top: 20rpx;
			width: calc(100vw - 60rpx);
			height: 100rpx;
			background: linear-gradient(91deg, $light-color 1%, $aider-light-color 99%);
			font-size: 40rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 100rpx;
			border-radius: 50rpx;
			text-align: center;
		}
		
		
	}
</style>
