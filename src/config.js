
const options = {
    host: 'http://vueapi.kmfx1.com',
    wx: {
        // appid: "wx59179ad9d77ec74c",
        // secret: "51d9cabdab691c88568e36ca693bc892",
        appid: "wx5340a87208fd241f",
        secret: "b0d230de401ee1f0b5bd0e894377e9f2",
    }
}
const { host, wx } = options;

const getQueryString = (name) => {
    let queryStr = window.location.href.split('?')[1] || '';
    let query = queryStr.split('#')[0] || '';
    let vars = query.split('&');
    for (let i=0;i<vars.length;i++) {
        let pair = vars[i].split('=');
        if(pair[0] == name) return pair[1];
    }
    return(false);
}

const wxLogin = () => {
    let routerString = window.location.href.split('#')[1] || '';
    let realString = routerString.split('?')[0] || '';
    let href = encodeURIComponent(`${host}/#${realString}`);
    let wxLink = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wx.appid}&redirect_uri=${href}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
    window.location.href = wxLink;
}

export default {
    getQueryString, wxLogin
};