//app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'hsw-8g74af8d6fd4dabd',
        traceUser: true
      });
    }

    this.globalData = {
      cloudUrl:
        'cloud://hsw-8g74af8d6fd4dabd.6873-hsw-8g74af8d6fd4dabd-1306472987/',
      openId: '',
      userExist: false,
      userInfo: null,
      firstLogin: false,
      Barrens: {},
      BarrensMini: {},
      stormwind: {},
      stormwindMini: {},
      Alterac: {},
      // 职业
      classList: [
        'demonhunter',
        'druid',
        'hunter',
        'mage',
        'paladin',
        'priest',
        'rogue',
        'shaman',
        'warlock',
        'warrior',
        'neutral'
      ]
    };
  }
});
