const app = getApp();
var db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    titleSrc: '',
    backImg: '',
    hasUserInfo: false
  },
  GetUserInfo(e) {
    wx.navigateTo({
      url: '../editonChoose/editonChoose'
      // url: '../cooperation/cooperation?text=' + this.data.chooseData+'$' ,
    });
    app.globalData.firstLogin = true;
  },
  JumpClick(e) {
    this.getOpenid();
  },

  getOpenid(e) {
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        var openid = res.result.openid;
        app.globalData.openId = openid;
        console.log(openid);
        db.collection('userScore')
          .where({
            openId: app.globalData.openId
          })
          .get({
            success: res => {
              console.log(res.data.length);
              if (res.data.length > 0) {
                app.globalData.userExist = true;
                wx.navigateTo({
                  url: '../../editonChoose/editonChoose'
                });
              } else {
                db.collection('userScore').add({
                  data: {
                    openId: openid,
                    nickName: app.globalData.userInfo.nickName
                  },
                  success: function (res) {
                    // console.log(res)
                  }
                });
                wx.navigateTo({
                  url: '../editonChoose/editonChoose'
                  // url: '../cooperation/cooperation?text=' + this.data.chooseData+'$' ,
                });
              }
              // this.setData({heroClass:res.data})
            },
            fail: console.error
          });
      },
      fail: res => {
        console.log('登录失败', res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.downloadFile({
      fileID:
        'cloud://hsw-8g74af8d6fd4dabd.6873-hsw-8g74af8d6fd4dabd-1306472987/Alterac/logo_fractured-in-av_enus.png',
      success: res => {
        // 返回临时文件路径
        this.setData({ titleSrc: res.tempFilePath });
      },
      fail: console.error
    });
    wx.cloud.downloadFile({
      fileID:
        'cloud://hsw-8g74af8d6fd4dabd.6873-hsw-8g74af8d6fd4dabd-1306472987/background.jpg',

      success: res => {
        // 返回临时文件路径
        this.setData({ backImg: res.tempFilePath });
      },
      fail: console.error
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
});
