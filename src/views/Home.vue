<template>
    <div class="home">
        <div class="block">
            <router-link to="query">积分查询</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Home',
        data() {
            return {
                
            }
        }
    }
</script>

<style lang="less">
    .home {
        .block {
            text-align: center;
            padding: 20px;
        }
    }
</style>