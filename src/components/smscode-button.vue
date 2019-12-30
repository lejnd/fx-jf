<template>
<van-button
    slot="button"
    :style="btnStyle"
    :size="size"
    :type="type"
    :plain="plain"
    :hairline="hairline"
    :round="round"
    :disabled="smsDisable"
    @click="getSmsCode">{{text}}
</van-button>
</template>

<script>
import common from '@/components/common';
export default {
    name: 'SmscodeBtn',
    props: {
        mobile: {
            type: String,
            default: () => '',
        },
        btnStyle: {
            type: Object,
            default: () => {},
        },
        size: {
            type: String,
            default: () => 'normal',
        },
        type: {
            type: String,
            default: () => 'info',
        },
        plain: {
            type: Boolean,
            default: () => false,
        },
        hairline: {
            type: Boolean,
            default: () => false,
        },
        round: {
            type: Boolean,
            default: () => false,
        },
        delayed: {
            type: Number,
            default: () => 30,
        }
    },
    data() {
        return {
            timer: -1,
            smsDisable: false,
            text: '获取验证码',
            count: 0,
        };
    },
    methods: {
        getSmsCode() {
            if (!this.mobile) {
                this.$notify('请输入手机号')
                return false
            }
            if (!common.isVerificationNumber(this.mobile)) {
                this.$notify('手机号码格式不正确')
                return false
            }
            this.smsInterval();
            this.$emit('getCode', this.mobile);
        },
        smsInterval() {
            this.count = this.delayed;
            this.text = this.count + 's后重发';
            this.smsDisable = true;
            this.timer = setInterval(() => {
                this.count--;
                this.text = this.count + 's后重发';
                if (this.count <= 0) {
                    this.clearTimer();
                }
            }, 1000)
        },
        clearTimer() {
            console.log('clearTimer');
            clearInterval(this.timer);
            this.text = '获取验证码';
            this.count = this.delayed;
            this.smsDisable = false;
        }
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.smscode-btn {

}
</style>