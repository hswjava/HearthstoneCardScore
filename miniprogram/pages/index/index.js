const app = getApp()
var db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleSrc: '',
    backImg: '',
    hasUserInfo:false,
  },
  GetUserInfo:function(e) {
    let that=this
    wx.getUserProfile({
      desc:'正在获取',//不写不弹提示框
      success:function(res){
        // console.log('获取成功: ',res)
        app.globalData.userInfo = res.userInfo
        app.globalData.firstLogin= true
        that.setData({hasUserInfo:true})
        that.JumpClick()
      },
      fail:function(err){
        that.setData({hasUserInfo:false})
        wx.showToast({
          title: '获得你的授权后才能开始评分',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  JumpClick: function (e) {
    this.getOpenid()
    // wx.navigateTo({
    //   url: '../../heroChoose/heroChoose',
    //   // url: '../cooperation/cooperation?text=' + this.data.chooseData+'$' ,
    // })
  },

  getOpenid(e) {
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        // console.log('云函数获取到的openid:', res.result.openid)
        var openid = res.result.openid;
        // that.setData({
        //   openid: openid
        // })
        app.globalData.openId = openid
        console.log(openid)
        db.collection('userScore').where({
          openId: app.globalData.openId,
        }).get(
          {
            success: res => {
              console.log(res.data.length)
              if (res.data.length > 0) {
                app.globalData.userExist=true;
                wx.navigateTo({
                  url: '../../editonChoose/editonChoose',
                })
              }
              else {
                db.collection('userScore').add({
                  data: {
                    openId: openid,
                    nickName:app.globalData.userInfo.nickName,
                  },
                  success: function (res) {
                    // console.log(res)
                  }
                })
                wx.navigateTo({
                  url: '../../editonChoose/editonChoose',
                  // url: '../cooperation/cooperation?text=' + this.data.chooseData+'$' ,
                })
              }
              // this.setData({heroClass:res.data})
            },
            fail: console.error
          }
        )

      },
      fail: res => {
        console.log('登录失败', res)
      }
    })
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.downloadFile({
      fileID: 'cloud://hsw-8g74af8d6fd4dabd.6873-hsw-8g74af8d6fd4dabd-1306472987/Barrens/logo.png',
      success: res => {
        // 返回临时文件路径
        this.setData({ titleSrc: res.tempFilePath })
      },
      fail: console.error
    })
    wx.cloud.downloadFile({
      fileID: 'cloud://hsw-8g74af8d6fd4dabd.6873-hsw-8g74af8d6fd4dabd-1306472987/backgroud.jpg',
      
      success: res => {
        // 返回临时文件路径
        this.setData({ backImg: res.tempFilePath })
      },
      fail: console.error
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})