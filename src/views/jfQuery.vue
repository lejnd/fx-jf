<template>
    <div class="jf-query">
        <div class="banner">
            <img src="../assets/img/integral_img.jpg">
        </div>
        <div class="container">
            <van-cell-group>
                <van-field v-model="phone" size="large" type="number" placeholder="请输入手机号"/>
                <van-field v-model="code" size="large" type="number" placeholder="请输入验证码">
                    <van-button
                        :disabled="!phone || codeTimerBool"
                        @click="getCode"
                        class="input-btn"
                        slot="button"
                        size="small"
                        :loading="codeBtnLoading"
                    >{{codeTimerBool ? `${codeTimer}s` : '获取验证码'}}</van-button>
                </van-field>
            </van-cell-group>
            <van-button class="jf-btn" size="large" type="warning" @click="query">积分查询</van-button>
            <van-button class="jf-btn gray" size="large" @click="jumpTo">跳过积分查询</van-button>
        </div>
    </div>
</template>

<script>
import common from "../components/common";
const tip = {
    "0": "请输入手机号",
    "1": "请输入正确手机号",
    "2": "请输入验证码"
};

export default {
    name: 'JfQuery',
    components: {},
    data() {
        return {
            phone: '',
            code: '',
            codeTimer: 0,
            codeBtnLoading: false,
        };
    },
    computed: {
        codeTimerBool() {
            return this.codeTimer == 0 ? false : true;
        }
    },
    methods: {
        getCode() {
            if (!common.isVerificationNumber(this.phone)) {
                this.$notify(tip[1]);
                return false;
            } else {
                this.codeBtnLoading = true;
                this.$fly.post('/apimall/send_code', common.obj2formdata({ mobile: this.phone }))
                .then((res) => {
                    let { errmsg, errcode } = res;
                    this.$toast(errmsg);
                    if (errcode == 0) {
                        this.setTimer();                        
                    }
                }).catch(() => {
                    this.$toast('发送验证码接口错误');
                }).finally(() => {
                    this.codeBtnLoading = false;
                })
            }
        },
        setTimer() {
            this.codeTimer = 120;
            let timer = setInterval(() => {
                this.codeTimer--;
                if (this.codeTimer == 0) {
                    clearInterval(timer);
                }
            }, 1000);
        },
        query() {
            if (!this.phone) {
                this.$notify(tip[0]);
                return false;
            }
            if (!common.isVerificationNumber(this.phone)) {
                this.$notify(tip[1]);
                return false;
            }
            if (!this.code) {
                this.$notify(tip[2]);
                return false;
            }
            const loading = this.$toast.loading({
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                mask: true,
                loadingType: 'spinner',
                message: '查询中...'
            });
            let req = { mobile: this.phone, code: this.code }
            this.$fly.post('/apimall/get_sore', common.obj2formdata(req))
            .then((res) => {
                let { errmsg, errcode, data } = res;
                if (errcode == 0) {
                    this.$router.push(`/info?integral=${data.integral}&mobile=${this.phone}`)
                    loading.clear();
                } else {
                    loading.message = errmsg;
                    setTimeout(() => {
                        loading.clear();
                    }, 2000)
                }
            }).catch(() => {
                loading.message = '积分查询错误';
                setTimeout(() => {
                    loading.clear();
                }, 2000)
            })
        },
        jumpTo() {
            this.$router.push(`/info`)
        },
        save_jfuser() {
            let req = {
                openid: window.$openid, 
                nickname: window.$nickname, 
                mobile: window.$mobile, 
                avatar_wechat: window.$avatar_wechat, 
                nickname_wechat: window.$nickname_wechat,
                bopenid: window.$bopenid,
            }
            this.$fly.post('/apimall/save_jfuser', common.obj2formdata(req))
        }
    },
    mounted() {
        this.save_jfuser()
    }
};
</script>

<style lang="less">
.jf-query {
    height: 100vh;
    background-color: #ffdf2d;
    .container {
        padding: 10/11rem 20/11rem;
        .van-cell-group {
            background-color: unset;
        }
        .van-cell {
            margin-bottom: 20/11rem;
            border-radius: 4px;
            font-size: 16px;
            &.van-cell--large {
                padding-top: 14/11rem;
                padding-bottom: 14/11rem;
            }
            .van-field__button {
                padding-left: 15px;
                border-left: 1px solid #ddd;
            }
            .input-btn {
                font-size: 16px;
                border: 0;
                color: #eb5c32;
            }
        }
        .jf-btn {
            margin-bottom: 20px;
            &.gray {
                background-color: #828282;
                color: #fff;
                border-color: #828282;
            }
        }
    }
}
</style>
