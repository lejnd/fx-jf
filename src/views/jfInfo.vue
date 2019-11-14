<template>
    <div class="jf-info">
        <topbar title="积分兑换"></topbar>
        <div v-if="isQuery" class="jf-wrapper">{{integral}}</div>
        <div v-else class="phone-wrapper">
            <h2 class="van-doc-demo-block__title">兑换号码</h2>
            <van-cell-group>
                <van-field v-model="phone" size="large" type="number" placeholder="请输入手机号码" />
            </van-cell-group>
        </div>
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
            <van-button :disabled="!channel" class="sumbit" size="large" type="warning" @click="exchange">提交兑换</van-button>
        </div>
        <van-dialog
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
        </van-dialog>
    </div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from "../components/common";
const SMS_NUM = '10658999';
export default {
    name: "JfInfo",
    components: { Topbar },
    data() {
        return {
            SMS_NUM,
            isQuery: false,
            integral: 0,
            channels: [],
            checked: null,
            channel: '',
            phone: '',
            showSms: false,
            smsHref: '',
            showCopy: false,
            phoneUserName: '',
            merchid: '',
            openid: '',
        };
    },
    computed: {
        btns() {
            return this.channels ? this.channels.map(item => Object.assign({}, item, {
                score: parseInt(item.score),
                isDisabled: this.isQuery ? parseInt(this.integral) < parseInt(item.score) : false
            })) : [];
        }
    },
    methods: {
        checkHandle(index, item) {
            this.checked = index;
            this.channel = item;
        },
        exchange() {
            let item = this.channel;
            if (!this.isQuery && !this.phone) {
                this.$notify('请输入手机号');
                return false;
            }
            if (!this.isQuery && !common.isVerificationNumber(this.phone)) {
                this.$notify('请输入正确手机号');
                return false;
            }
            // if (item.channel_id == '8') {
            //     this.$dialog.alert({
            //         message: '请前往“云南移动和生活”完成兑换',
            //     });
            //     return false;
            // }
            // let data = {
            //     mobile: this.$route.query.mobile || this.phone,
            //     channel_id: item.channel_id,
            //     package_id: item.id,
            //     openid: window.$openid,
            //     seller_id: item.seller_id,
            //     bopenid: window.$bopenid,
            // }
            this.$fly.post(`/app/index.php?i=3&c=entry&m=ewei_shopv2&do=mobile&r=order.create.submit2&score=${this.channel.score}&mobile=${this.phone}&merchid=${this.merchid}&openid=${this.openid}`)
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { status, result } = res;
                if (status == 1) {
                    this.phoneUserName = result.message;
                    this.showCopy = true;
                } else {
                    this.$notify('操作失败');
                }
            })
        },
        getPackage() {
            this.$fly.get('/app/index.php?i=3&c=entry&m=ewei_shopv2&do=mobile&r=order.create.getscore')
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                console.log(res);
                this.channels = res;
            })
        },
        showSmsHandler() {
            let t = common.isIOS() ? '&' : '?';
            this.smsHref = "sms:" + SMS_NUM + "" + t + "body=" + this.channel.message;
            this.showSms = true;
            // setTimeout(() => {
            //     document.getElementById('sms_href').click();
            // }, 100)
        },
        copyText(action, done) {
            if (action === 'confirm') {
                let clipboard = new this.clipboard(".example-dialog");
                clipboard.on('success', () => {
                    this.$toast('复制成功');
                    done();
                    this.showSmsHandler();
                });
                clipboard.on('error', () => {
                    this.$toast('复制失败');
                    done(false);
                });
            } else {
                done();
            }
        }
    },
    mounted() {
        this.isQuery = this.$route.query.integral ? true : false;
        this.integral = this.$route.query.integral;
        this.phone = this.$route.query.mobile;
        this.merchid = this.$route.query.merchid;
        this.openid = this.$route.query.openid;
        this.getPackage();
    }
};
</script>

<style lang='less'>
.jf-info {
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
}
</style>