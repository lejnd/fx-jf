<template>
    <div class="jf-query">
        <div class="banner">
            <img src="../assets/img/integral_img.jpg">
        </div>
        <div class="container">
            <van-cell-group>
                <van-field v-model="phone" size="large" type="tel" :disabled="isDisabled" clearable placeholder="请输入手机号"/>
                <van-field v-model="code" size="large" type="number" :disabled="isDisabled" placeholder="请输入验证码">
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
            <van-button class="jf-btn" size="large" type="warning" :disabled="isDisabled" @click="query">积分查询</van-button>
            <van-button v-if="showBtn" class="jf-btn gray" size="large" :disabled="isDisabled" @click="jumpTo">跳过积分查询</van-button>
            <div class="qr-wp">
                <div ref="qrcode"></div>
                <!-- <p class="deco">{{openid}}</p> -->
            </div>
        </div>
    </div>
</template>

<script>
import common from "../components/common";
import QRCode from 'qrcodejs2';

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
            qrcode: null,
            merchid: '',
            showBtn: false,
            isDisabled: true,
            openid: '',
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
                this.$fly.post('/app/index.php?i=3&c=entry&m=ewei_shopv2&do=mobile&r=goods.send_mobile_code', common.obj2formdata({ mobile: this.phone }))
                .then((res) => {
                    if (typeof res === 'string') res = JSON.parse(res);
                    let { m, s, d } = res;
                    this.$toast(m);
                    if (s == 1) {
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
            this.$fly.post('/app/index.php?i=3&c=entry&m=ewei_shopv2&do=mobile&r=goods.getScore', common.obj2formdata(req))
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { m, s, d } = res;
                if (s == 1) {
                    this.$router.push(`/info?integral=${d}&mobile=${this.phone}&merchid=${this.merchid}&openid=${this.openid}`)
                    loading.clear();
                } else {
                    loading.message = m;
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
            this.$router.push(`/info?mobile=${this.phone}&merchid=${this.merchid}&openid=${this.openid}`)
        },
        // save_jfuser() {
        //     let req = {
        //         openid: window.$openid, 
        //         nickname: window.$nickname, 
        //         mobile: window.$mobile, 
        //         avatar_wechat: window.$avatar_wechat, 
        //         nickname_wechat: window.$nickname_wechat,
        //         bopenid: window.$bopenid,
        //     }
        //     this.$fly.post('/apimall/save_jfuser', common.obj2formdata(req))
        // },
        createQrcode() {
            /*
            * 获取到我自己的的openid，其他人扫我的码可以植入我的openid
            */
            this.$fly.post('/app/index.php?i=3&c=entry&m=ewei_shopv2&do=mobile&r=order.create.ismerch')
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { status, merchid, openid } = res;
                this.showBtn = true;
                // 扫码进入的链接，植入上级的openid
                console.log(this.getQueryString('bopenid'));
                this.openid = this.getQueryString('bopenid') || openid;
                this.allowScore(this.openid);
                if (status == 1) {
                    this.merchid = merchid || '';
                    if (!this.qrcode) {
                        this.qrcode = new QRCode(this.$refs.qrcode, {
                            width: 180,
                            height: 180,
                            colorDark: '#000000',
                            colorLight: '#ffffff',
                            correctLevel: QRCode.CorrectLevel.H
                        })
                        this.qrcode.makeCode(encodeURI(`http://rrcloud.kmfx1.com/app/index.php?i=3&c=entry&m=ewei_shopv2&do=mobile&bopenid=${openid}&r=score#/`))
                    }
                }
            })
        },
        allowScore(id) {
            this.$fly.post('/app/index.php?i=3&c=entry&m=ewei_shopv2&do=mobile&r=order.create.allow_score', common.obj2formdata({
                openid: id
            })).then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { status } = res;
                if (status == 1) {
                    this.isDisabled = false;
                }
            })
        },
        getQueryString(name) { 
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
            var r = window.location.search.substr(1).match(reg); 
            if (r != null) return unescape(r[2]); 
            return null; 
        }
    },
    mounted() {
        // this.save_jfuser()
        this.createQrcode();
    }
};
</script>

<style lang="less">
.jf-query {
    min-height: 100vh;
    padding-bottom: 40px;
    background-color: #ffdf2d;
    .container {
        padding: 10/11rem 20/11rem;
        padding-top: 0;
        .van-cell-group {
            background-color: unset;
        }
        .van-cell {
            margin-bottom: 15/11rem;
            border-radius: 4px;
            font-size: 16px;
            &.van-cell--large {
                padding-top: 12/11rem;
                padding-bottom: 12/11rem;
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
            margin-bottom: 15/11rem;
            &.gray {
                background-color: #828282;
                color: #fff;
                border-color: #828282;
            }
        }
        .qr-wp {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .deco {
                // color: #fff;
                font-size: 14/11rem;
                margin-top: 8/11rem;
            }
        }
    }
}
</style>
