<template>
	<div class="layout">
		
		<!-- 顶部栏 -->
		<u-navbar back-text="" title="TOP商家"></u-navbar>
		
		<qiun-data-charts class="charts" type="column"
		 background="none"
		 :chartData="chartData" :style="{height:screenHeight+'px'}"
		 :opts="{enableScroll: true, xAxis: { scrollShow: true, itemCount: 6, disableGrid: true }}"
		 :ontouch="true"></qiun-data-charts>

	</div>
</template>

<script>
	import { getStoreStatisticsTop } from "@/api/store.js";
	export default {
		title: "TOP商家",
		data() {
			return {
				params: {
					searchType: '',
					timeType: '',
				},
				pages: 1,
				storeList: [],
				chartData:{},
				screenHeight:"460",
			};
		},
		onLoad(params) {
			this.screenHeight = uni.getSystemInfoSync().windowHeight - 130;
		},
		mounted() {
			this.getStoreList();
		},
		methods: {
			getStoreList() {
				let that = this;
				getStoreStatisticsTop(that.params).then((res) => {
	
					const dataList = res.data.result;
					let arr = [], arr1=[], arr2=[];
					
					dataList.forEach((value, _index) => {
						arr.push(value.storeName);
					  arr1.push(parseFloat(value.num));
					  arr2.push(value.price);
					});
					
					let data1 = {
						categories: arr,
						series: [
							{
								name: "销售金额",
								data: arr1,
							},
							{
								name: "让利金额",
								data: arr2,
							}
						]
					};
					
					this.chartData = JSON.parse(JSON.stringify(data1));
					
				
					console.log(this.chartData)
					
				});
			},
			// handleClick(item) {
			// 	uni.navigateTo({
			// 		url: `/pages/product/shopPage?id=` + item.id,
			// 	});
			// },
		},
	};
</script>
<style lang="scss" scoped>
	.charts {
		margin-top: 50rpx;
		width: 100%;
	}
</style>