<template>
	<view class="pay">
		<view class="order-index" ref="container">
			<view class="donating">
				<view class="flexBox">
					<view class="item">
						<view class="title">可转数量</view>
						<view class="number">{{limit || '0'}}</view>
					</view>
					<view class="item">
						<view class="title">冻结数量</view>
						<view class="number">{{frozen || '0'}}</view>
					</view>
				</view>
				<view class="donatBox">	
					<view class="item">
						<view class="title">接收地址</view>
						<view class="t-info">
							<input v-model="val1" class="it" type="text" placeholder="请输入接收账户"  placeholder-style="font-size:34rpx;color:#C7C7C7;"/>
						<image class="scan" src="../../../static/icons/scan.png" mode="" @click="scan"></image>
						</view>
					</view>
					<view class="item">
						<view class="title">验证码</view>
						<view class="t-info captcha">
							<input type="text" placeholder="填写验证码" class="it" v-model="captcha" placeholder-style="font-size:34rpx;color:#C7C7C7;"/>
						</view>
					 
						<button class="code" @click="code">{{ verificationText }}</button>
					</view>
					<view class="item">
						<view class="title">转出数量</view>
						<view class="t-info">
							<input class="it" type="number" v-model="count" />
							<text class="all" @click="handle_all()">转出全部</text>
						</view>
						<view class="td">
							<text>手续费 {{commssion}} SSD</text>
							<text>手续费 {{commssion}} SSD</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="send mt-30" @click="handleSubmit()">转出</view>
			
			<view class="detailed text-center fs-24 mt-20" @click="handleDetail">查看转入转出明细</view>
		</view>
		
		<u-keyboard class="passwrod-panel" @change="onChange" ref="uKeyboard" v-model="showKeyboard" @backspace="onBackspace" mode="number" :dot-enabled="false" :tooltip="false" default="">
			<view class="mt-40 mb-40 text-center" style="text-align: center;">
				请输入密码
			</view>
			<view class="close" @click="handleClose">
				<image src="../../../static/icons/close.png" mode=""></image>
			</view>
			<view class="mt-30 text-center fs-28">本次转出</view>
			<view class="mt-15 text-center">
				<text class="fs-48 font-weight-500" style="margin-right: 10rpx;">{{limit || '0'}}</text>
				<text>SSD</text>
			</view>
			<u-message-input class="mt-30" mode="box" :maxlength="6" :dot-fill="true" v-model="password" :disabled-keyboard="true" @finish="finish"></u-message-input>
		</u-keyboard>
		
	</view>
</template>

<script>
	
export default {
	name: 'donating',
	data() {
		return {
			captcha: "",
			val1: '',
			// val2: '',
			limit: '',
			count: 0,
			secondPassword: '',
			frozen: '',
			commssion:"",
			verificationText: '获取验证码',
			countdown: -1,
			addressCode: '',
			showKeyboard: false,
			password: ''
		};
	},
	mounted() {
		this.commNum()
	},
	watch: {
		countdown(newVal, oldVal) {
			if(newVal == -1) {
				this.verificationText = '获取验证码';
			}
			else if(newVal > 0) {
				this.verificationText = '剩余 '+ newVal +'s';
			}
			else {
				this.verificationText = '重新获取';
			}
		}
	},
	methods:{
		async code() {
			// tranferVerify()
			// 	.then(res => {
			// 	uni.showToast({
			// 		title: res.msg,
			// 		icon: "none",
			// 		duration: 2000
			// 	});
			// 	that.sendCode();
		 //    })
			// .catch(res => {
			// 	uni.showToast({
			// 		title: res.msg,
			// 		icon: "none",
			// 		duration: 2000
			// 	});
			// });
			this.countdown = 10;
			this.getCountdown();
		},
		getCountdown() {
			let self = this;
			setTimeout(() => {
				if(self.countdown > 0) {
					self.countdown--;
					self.getCountdown();
				}
			}, 1000)
		},
		scan() {
			console.log(111);
			uni.scanCode({
				success: (res) => {
					this.addressCode = res.result
				}
			})
		},
		getInputVerification(val) {
			var that = this;
			if(val.length == 6) {
				that.secondPassword = val
			}
		    console.log(val);
		},
		ok() {
			
		},
		getInputVerification(val) {
			var that = this;
			
			if(val.length == 6) {
				that.secondPassword = val
			}
		    console.log(val);
		},
		handle_all() {
			this.count = this.limit;
		},
	    //	手续费
		commNum(){
			// commission().then(res =>{
			// 	this.commssion =res.data
			// },err=> {
			// 	console.log(err)
			// })
		},
		checkStatus(){
			var that = this;
			
			if (!that.val1) {
				uni.showToast({
					title: '接受账户不能为空',
					icon: 'none',
					duration: 2000
				});
				return false
			}
			else if (!that.val1) {
				uni.showToast({
					title: '通行证不能为空',
					icon: 'none',
					duration: 2000
				});
				return false
			} else if (0 > +that.count) {
				uni.showToast({
					title: '数量需要大于0',
					icon: 'none',
					duration: 2000
				});
				return false
			} else if( +that.count > +that.limit ) {
				uni.showToast({
					title: '输入数量不超过可捐数量',
					icon: 'none',
					duration: 2000
				});
				return false
			} else {
				return true
			}
		},
		handleDetail() {
			console.log('跳转转入转出明细');
		},
		onChange(val) {
			if (this.password.length < 6) {
				this.password += val;
			}
			if (this.password.length >= 6) {
				this.finish();
			}
		},
		finish() {
			this.showKeyboard = false;
		},
		handleClose() {
			this.showKeyboard = false;
		},
		handleSubmit() {
			this.showKeyboard = true;
			this.form.password='';
		},
		
	}
};
</script>

<style lang="scss" scoped>
.pay {
	background-color: #5F9DFF;
	height: calc(100vh - 80rpx);
	padding: 50rpx 30rpx;
	
}

.donating {
	padding-bottom: 30rpx;
	background: url("/static/img/account_bg.png") no-repeat;
	background-size: 100% 100%;
	padding-top:20rpx;
	border-radius: 10rpx;
	z-index: 2;
	
	.flexBox{
		display: flex;
		padding: 0 60rpx;
		
		.item{
			flex:1;
			text-align: center;
			padding:  12rpx 16rpx;
			
			.title{
				text-align: center;
				color:#808080;
				font-size: 36rpx;
			}
			
			.number{
				text-align: center;
				color:#0069FF;
				font-size:56rpx;
			}
		}
	}
	
	.donatBox{
	  margin-top: 40rpx;
	}
	
	.item {
		padding:  40rpx;
		
		.td {
			display: flex;
			justify-content: space-between;
			font-size: 32rpx;
			color: #EB5659;
			padding-bottom: 20rpx;
			margin-top: 10px;
		}
		
		.title {
			font-size: 40rpx;
			padding-bottom: 20rpx;
			text-align: left;
			color: #222;
		}
		
		.t-info {
			display: flex;
			align-items: center;

			.it {
				border-bottom: 1px solid #d1d1d1;
				padding: 6rpx 20rpx;
				height: 70rpx;
				font-size: 34rpx;
				flex: 1;
				color: #000000;
				text-align: left;
			}
		}
		
		.captcha{
			width: calc(100% - 130px);
			display: inline-block;
			margin-right: 5px;
		}
		
		.all {
			font-size: 34rpx;
			color: #fff;
			width: 100px;
			height: 70rpx;
			border-radius: 3px;
			background-image: -webkit-linear-gradient(left, #409eff 0%, #409eff 100%);
			background-image: linear-gradient(to right, #409eff 0%, #409eff 100%);
			background-image: -webkit-linear-gradient(to right, #409eff 0%, #409eff 100%);
			background-image: -moz-linear-gradient(to right, #409eff 0%, #409eff 100%);
			text-align: center;
			line-height: 70rpx;
			margin-left: 10px;
		}
	}
	
	.notice {
		padding: 15rpx;
		background-color: #eee;
		font-size: 12px;
		margin: 7px;
		border-radius: 10rpx;
	}
	
	.btn {
		padding-bottom: 30rpx;
		justify-content: center;
		text-align: center;
		margin: 0 7px; 
		
	}
	
	.second-wrapper {
		background-color: #fff;
		height: 90rpx;
		border-top-right-radius: 10rpx;
		border-top-left-radius: 10rpx;
		padding-top: 20rpx;
		width: 520rpx;
		
		.p-title {
			text-align: center;
			font-size: 14px;
			font-weight: bold;
			// margin: 20rpx 0;
			display: block;
			border-radius: 0;
			// padding-top: 40rpx;
		}
		
		.content {
			background-color: #fff;
			padding-left: 20rpx;
		}
		
		.p-btns {
			display: flex;
			background-color: #fff;
			padding: 20rpx 0;
			border-bottom-right-radius: 10rpx;
			border-bottom-left-radius: 10rpx;
			
			.cancel {
				font-size: 12px;
				height: 25px;
				text-align: center;
				border-radius: 25rpx;
				line-height: 25px;
				background-color: #eb3729;
				color: #fff;
				display: inline-block;
				flex: 1;
				margin: 0 40rpx;
			}
			
			.ok {
				font-size: 12px;
				height: 25px;
				text-align: center;
				border-radius: 25rpx;
				line-height: 25px;
				background-color: #2291F8;
				color: #fff;
				display: inline-block;
				flex: 1;
				margin: 0 40rpx;
			}
		}
	}
	
	 
}
.send {
	width: calc(100% - 30px);
	font-size: 38rpx;
	color: #0069FF;
	height: 100rpx;
	border-radius: 56rpx;
	text-align: center;
	text-align: center;
	line-height: 100rpx;
	background-color: #fff;
	margin-left: auto;
	margin-right: auto;
}

.code {
    width: 125px;
	display: inline-block;
	height: 35px;
	background-image: -webkit-linear-gradient(left, #409eff 0%, #409eff 100%);
	background-image: linear-gradient(to right, #409eff 0%, #409eff 100%);
	background-image: -webkit-linear-gradient(to right, #409eff 0%, #409eff 100%);
	background-image: -moz-linear-gradient(to right, #409eff 0%, #409eff 100%);
	border-radius: 3px;
	color: #fff;
	line-height: 35px;
	text-align: center;
	font-size: 34rpx;
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

.scan {
	margin-bottom: 10rpx;
	width: 50rpx;
	height: 50rpx;
}

	
.detailed {
	color: #F3F4F6;
	text-decoration:underline;
}
</style>
