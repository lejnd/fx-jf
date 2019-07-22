<template>
    <div class="jf-info">
        <div v-if="isQuery" class="jf-wrapper">{{integral}}</div>
        <div v-else class="phone-wrapper">
            <h2 class="van-doc-demo-block__title">兑换号码</h2>
            <van-cell-group>
                <van-field v-model="phone" size="large" type="number" placeholder="请输入手机号码" />
            </van-cell-group>
        </div>
        <div class="container">
            <van-button
                v-for="(item, index) in btns"
                :key="index"
                :type="checked == index ? 'info' : 'default'"
                :disabled="item.isDisabled"
                class="jfBtns"
                @click="checkHandle(index, item)"
            >{{item.score}}分</van-button>
            <van-button :disabled="!channel" class="sumbit" size="large" type="warning" @click="exchange">提交兑换</van-button>
        </div>
        <van-dialog
            v-model="showSms"
            title=""
            cancel-button-text="返回"
            confirm-button-text="一键发送"
            show-cancel-button
            @confirm="confirm2sms">
            <div class="sms">
                <p>请用当前号码编辑短信内容</p>
                <p><span>{{channel.sms_content}}</span>发送到<span>{{channel.sms_number}}</span></p>
                <p>完成确认</p>
            </div>
        </van-dialog>
        <a id="sms_href" :href="smsHref"></a>
    </div>
</template>

<script>
import common from "../components/common";

export default {
    name: "JfInfo",
    components: {},
    data() {
        return {
            isQuery: false,
            integral: 1250,
            channels: [],
            checked: null,
            channel: '',
            phone: '',
            showSms: false,
            smsHref: ''
        };
    },
    computed: {
        btns() {
            return this.channels ? this.channels.map(item => Object.assign({}, item, {
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
            if (item.channel_id == '8') {
                this.$dialog.alert({
                    message: '请前往“云南移动和生活”完成兑换',
                });
                return false;
            }
            let data = {
                mobile: this.$route.query.mobile || this.phone,
                channel_id: item.channel_id,
                package_id: item.id,
                openid: window.$openid,
                seller_id: item.seller_id,
                bopenid: window.$bopenid,
            }
            this.$fly.post('/apimall/post_exchange', common.obj2formdata(data))
            .then((res) => {
                let { errcode, errmsg } = res;
                if (errcode == 1) {
                    this.showSms = true;
                } else {
                    this.$notify(errmsg || '操作失败');
                }
            })
        },
        getPackage() {
            let openid = window.$openid;
            let bopenid = window.$bopenid;
            this.$fly.get('/apimall/GetPackageList', { openid, bopenid }).then((res) => {
                let { data } = res;
                this.channels = data;
            })
        },
        confirm2sms() {
            this.smsHref = `sms:${this.channel.sms_number}?body=${this.channel.sms_content}`;
            setTimeout(() => {
                document.getElementById('sms_href').click();
            }, 0)
        }
    },
    mounted() {
        this.isQuery = this.$route.query.integral ? true : false;
        this.integral = this.$route.query.integral
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
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .jfBtns {
            width: 30%;
            margin-bottom: 15/11rem;
            font-size: 14/11rem;
            &.van-button--info {
                background-color: #409eff;
                border-color: #409eff;
            }
        }
        .sumbit {
            margin-top: 10/11rem;
        }
    }
    .sms {
        text-align: center;
        padding: 25/11rem 0;
        color: #333;
        p {
            line-height: 1.6;
            span {
                color: #ff976a;
                margin: 0 3px;
            }
        }
        
    }
}
</style>