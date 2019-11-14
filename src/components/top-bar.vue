<template>
<div class='top-bar'>
    <van-nav-bar
        :title="title"
        left-arrow
        @click-left="onClickLeft"
    />
</div>
</template>

<script>

export default {
    name: 'Topbar',
    components: {},
    props: {
        title: {
            type: String,
            default: () => '',
        }
    },
    data() {
        return {
            
        };
    },
    methods: {
        onClickLeft() {
            if (window.plus) {
                var webview = plus.webview.currentWebview()
                webview.back()
            } else {
                this.$router.go(-1);
            }
        }
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.top-bar {
    height: 46px;
    width: 100%;
    .van-nav-bar {
        position: fixed;
        width: 100%;
    }
}
</style>