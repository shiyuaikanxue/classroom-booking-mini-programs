<template>
	<view class="page-container">
		{{title}}
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	const onLaunch = () => {
		console.log('App Launch')
	}
	const title = ref('hello')
</script>

<style>

</style>