<template>
    <div class="jf-info">
        <topbar title="积分兑换"></topbar>
        <div class="myJF" :style="{ justifyContent: kyjf ? 'space-between' : 'center' }">
            <div class="binding" v-if="kyjf">
                <h3>手机号{{phone}}</h3>
                <h3 class="value">可用积分：<span>{{kyjf}}</span></h3>
            </div>
        </div>
        <!-- <div class="jf-wrapper">{{kyjf}}</div>
        <div class="phone-wrapper">
            <h2 class="van-doc-demo-block__title">兑换号码</h2>
            <van-cell-group>
                <van-field v-model="phone" size="large" type="number" placeholder="请输入手机号码" />
            </van-cell-group>
        </div> -->
        <div class="container">
            <div class="item">
                <van-button
                    v-for="(item, index) in btns"
                    :key="index"
                    type="info"
                    :plain="checked != index"
                    :disabled="item.isDisabled"
                    class="jfBtns"
                    @click="checkHandle(index, item)"
                >{{item.score}}分</van-button>
            </div>
            <van-button
                :disabled="!channel"
                class="sumbit"
                size="large"
                :loading="confirmCheckLoading" loading-type="spinner" type="warning"
                @click="confirmCheck">提交兑换
            </van-button>
        </div>
        <!-- 发送短信兑换 -->
        <!-- <van-dialog
            class="example-dialog"
            v-model="showCopy"
            confirm-button-text="一键复制"
            :before-close="copyText"
            :data-clipboard-text="phoneUserName + '#' + phone + '#' + 'xc087105520256' + '#'"
        >
            <div class="sms">
                <p>{{phoneUserName + '#' + phone + '#' + 'xc087105520256' + '#'}}</p>
            </div>
        </van-dialog>
        <van-dialog
            v-model="showSms"
            title=""
            :show-confirm-button="false">
            <div class="sms no-left-right-bottom">
                <p>请用当前号码编辑短信内容</p>
                <p><span>{{channel.message}}</span>发送到<span>{{SMS_NUM}}</span></p>
                <p>完成确认</p>
                <a class="sms_href" id="sms_href" :href="smsHref" @click="showSms=false">一键发送</a>
            </div>
        </van-dialog> -->

        <!-- 移动 外呼兑换 -->
        <van-dialog
            v-model="submitDialog"
            title="确认兑换"
            show-cancel-button
            :before-close="beforeCloseSubmit"
        >
            <div class="dialog-content">
                <div class="form-wp">
                    <!-- <van-cell-group>
                        <van-field v-model="servicepassword" type="password" placeholder="输入服务密码">
                        </van-field>
                    </van-cell-group> -->
                    <van-cell-group class="flex-box">
                        <van-field
                            v-model="confirmcode"
                            type="number"
                            placeholder="短信确认码"
                        />
                        <smscode-btn ref="getConfirmcode" plain class="code" :mobile="phone" @getCode="getConfirmcode" :delayed="60"></smscode-btn>
                    </van-cell-group>
                    <p class="tip">提示：<span>确认码有效时间为60秒</span></p>
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import SmscodeBtn from '@/components/smscode-button.vue';
import Topbar from '@/components/top-bar.vue';
import common from "../components/common";
export default {
    name: "JfInfo",
    components: { Topbar, SmscodeBtn },
    data() {
        return {
            isQuery: false,
            kyjf: 0,
            channels: [],
            checked: null,
            channel: '',
            phone: '',
            showSms: false,
            smsHref: '',
            showCopy: false,
            // phoneUserName: '',
            merchid: '',
            openid: '',

            confirmCheckLoading: false,
            submitDialog: false,
            confirmcode: '',
        };
    },
    computed: {
        btns() {
            return this.channels ? this.channels.map(item => Object.assign({}, item, {
                score: parseInt(item.score),
                isDisabled: this.isQuery ? parseInt(this.kyjf) < parseInt(item.score) : false
            })) : [];
        }
    },
    methods: {
        checkHandle(index, item) {
            this.checked = index;
            this.channel = item;
        },
        createSubmit2(status) {
            // if (!this.isQuery && !this.phone) {
            //     this.$notify('请输入手机号');
            //     return false;
            // }
            // if (!this.isQuery && !common.isVerificationNumber(this.phone)) {
            //     this.$notify('请输入正确手机号');
            //     return false;
            // }
            this.$fly.post(`/app/index.php?i=3&c=entry&m=ewei_shopv2&do=mobile&r=order.create.submit2&score=${this.channel.score}&mobile=${this.phone}&merchid=${this.merchid}&openid=${this.openid}&status=${status}`)
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                console.log(res);
                // let { status, result } = res;
                // if (status == 1) {
                    // this.phoneUserName = result.message;
                    // this.showCopy = true;
                // } else {
                    // this.$notify('操作失败');
                // }
            })
        },
        // 兑换积分产品之前获取手机确认码
        getConfirmcode(mobile) {
            this.$fly.post('/test_kmfx1_api/ydjf/sendconfirmcode', common.obj2formdata({ mobile }))
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { d, m, s } = res;
                this.$toast(m);
            })
        },
        // 确认选择积分包
        confirmCheck() {
            let data = {
                wareid: this.channel.ware_id,
                score: this.channel.score,
                mobile: this.phone,
            }
            this.confirmCheckLoading = true;
            this.$fly.post('/test_kmfx1_api/ydjf/order', common.obj2formdata(data))
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { d, m, s } = res;
                if (s == 1) {
                    this.submitDialog = true;                    
                } else {
                    this.$notify(m);
                }
            }).finally(() => {
                this.confirmCheckLoading = false;
            })
        },
        // 兑换积分产品
        beforeCloseSubmit(action, done) {
            if (action === 'confirm') {
                if (!this.confirmcode) {
                    this.$notify('请输入确认码')
                    done(false)
                    return false
                }
                let data = {
                    mobile: this.phone,
                    code: this.confirmcode,
                    servicepassword: '000000',
                    // scoreid: this.channel.id,
                    orderid: '00',
                    score: parseInt(this.kyjf) - parseInt(this.channel.score),
                    adminid: '459',     // mall admin
                }
                this.$fly.post('/test_kmfx1_api/ydjf/exchange', common.obj2formdata(data))
                .then((res) => {
                    if (typeof res === 'string') res = JSON.parse(res);
                    let { d, m, s } = res;
                    this.createSubmit2(s);
                    if (s == 1) {
                        this.$toast(m);
                        this.kyjf = parseInt(this.kyjf) - parseInt(this.channel.score);
                        done();
                        this.$router.push(`/info?kyjf=${this.kyjf}&mobile=${this.phone}&merchid=${this.merchid}&openid=${this.openid}`)
                    } else {
                        this.$notify(m);
                        done(false);
                    }
                }).catch(() => {
                    this.$toast('登录失效或系统错误');
                    done(false);
                })
            } else {
                done();
            }
        },
        getPackage() {
            this.$fly.get('/app/index.php?i=3&c=entry&m=ewei_shopv2&do=mobile&r=order.create.getscore')
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                console.log(res);
                this.channels = res;
            })
        },
        // showSmsHandler() {
        //     let t = common.isIOS() ? '&' : '?';
        //     this.smsHref = "sms:" + SMS_NUM + "" + t + "body=" + this.channel.message;
        //     this.showSms = true;
        //     // setTimeout(() => {
        //     //     document.getElementById('sms_href').click();
        //     // }, 100)
        // },
        // copyText(action, done) {
        //     if (action === 'confirm') {
        //         let clipboard = new this.clipboard(".example-dialog");
        //         clipboard.on('success', () => {
        //             this.$toast('复制成功');
        //             done();
        //             this.showSmsHandler();
        //         });
        //         clipboard.on('error', () => {
        //             this.$toast('复制失败');
        //             done(false);
        //         });
        //     } else {
        //         done();
        //     }
        // }
    },
    mounted() {
        this.isQuery = this.$route.query.kyjf ? true : false;
        this.kyjf = this.$route.query.kyjf;
        this.phone = this.$route.query.mobile;
        this.merchid = this.$route.query.merchid;
        this.openid = this.$route.query.openid;
        this.getPackage();
    }
};
</script>

<style lang='less'>
.jf-info {
    .myJF {
        padding: 25px 15px;
        background-color: #409eff;
        color: #fff;
        display: flex;
        // flex-direction: column;
        // align-items: center;
        // justify-content: space-between;
        .binding {
            font-size: 14/11rem;
            // width: 100%;
            .value {
                margin-top: 10px;
                span {
                    font-size: 16/11rem;
                    font-weight: 700;
                }
            }
        }
        .btn {
            height: 36px;
            padding: 0 20px;
            font-size: 13/11rem;
            border-radius: 6px;
            box-shadow: 0 0 6px #2f86e0;
            // margin-bottom: 15px;
        }
    }
    .jf-wrapper {
        height: 80/11rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #409eff;
        color: #fff;
        font-size: 20/11rem;
    }
    .phone-wrapper {
        .van-doc-demo-block__title {
            margin: 0;
            font-weight: 400;
            font-size: 14px;
            color: rgba(69,90,100,.6);
            padding: 35px 20px 15px;
        }
        .van-cell--large {
            padding: 13/11rem 20/11rem;
            font-size: 16/11rem;
        }
    }
    .container {
        padding: 20/11rem;
        .item {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            &:after { 
                content: ""; 
                width: 30%;
            } 
            .jfBtns {
                width: 30%;
                margin-bottom: 15/11rem;
                font-size: 15/11rem;
                font-weight: 800;
                // &.van-button--info {
                //     background-color: #409eff;
                //     border-color: #409eff;
                // }
            }
            .van-button--disabled {
                opacity: .4;
            }
        }
        .sumbit {
            margin-top: 10/11rem;
        }
    }
    .sms {
        text-align: center;
        padding: 25/11rem 10/11rem;
        color: #333;
        p {
            line-height: 1.6;
            word-break: break-word;
            span {
                color: #ff976a;
                margin: 0 3px;
            }
        }
        .sms_href {
            display: block;
            padding: 15px;
            background-color: #409eff;
            color: #fff;
            // border-radius: 6px;
            margin-top: 20px;
        }
        &.no-left-right-bottom {
            padding-bottom: 0;
            padding-left: 0;
            padding-right: 0;
        }
    }
    .dialog-content {
        padding: 15px 10px;
        .form-wp {
            width: 100%;
            .van-cell-group {
                margin-bottom: 15/11rem;
                // background-color: #f5f5f5;
                // border-color: #f5f5f5;
                &.flex-box {
                    display: flex;
                    align-items: center;
                    .img-code {
                        width: 120px;
                        margin-left: 10px;
                        height: 46px;
                    }
                }
                .van-cell {
                    border-radius: 10px;
                    padding: 13px 15px;
                    font-size: 15/11rem;
                    background-color: #f5f5f5;
                }
            }
            .flex-box {
                display: flex;
                align-items: center;
                .code {
                    width: 150px;
                    margin-left: 5px;
                    height: 50px;
                    line-height: 50px;
                    border-radius: 10px;
                    font-size: 12/11rem;
                    padding: 0;
                    border: 1px solid #409eff;
                }
            }
            .tip {
                color: #f30;
                font-size: 13/11rem;
                padding: 0 5px;
            }
            .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
                border: 0;
            }
        }
    }
    .van-dialog__confirm, .van-dialog__confirm:active {
        background-color: #409eff;
        color: #fff;
        // .van-button__loading {
        //     width: 100%;
        //     background: #eee;
        //     padding: 1px 0;
        //     opacity: .6;
        // }
        // .van-loading__spinner {
        //     opacity: 0;            
        // }
    }
}
</style>