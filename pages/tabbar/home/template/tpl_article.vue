<template>
	<div class="layout">
		<u-sticky>
			<div class="title">
				<image class="ico-article" src="../../../../static/icons/ico_article.png"></image>
				<view class="article-title fs-28 ml-10" style="">联德头条</view>
				
				<div
				  @click="liangdeClick"
				  class="more-btn"
				>
				  更多资讯 >
				</div>
			</div>
		</u-sticky>
		<div>
			2342342
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	@import "./tpl.scss";
	$w_94: 94%;

	.layout {
		padding: 8px 0;
		background: #f9f9f9;
	}
.ico-article {
	width: 30rpx;
	height: 30rpx;
	margin-left: 10rpx;
	display: inline-block;
	vertical-align: middle;
}

.title{
	display: inline-block;
	vertical-align: middle;
	height: 50rpx;
	width: 100%;
}

.article-title {
	display: inline-block;
	vertical-align: middle;
}

.more-btn {
		float: right;
		width: 150rpx;
		height: 40rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		text-align: center;
		margin-top: 5px;
		margin-right: 30px;
	display: inline-block;
}

</style>
