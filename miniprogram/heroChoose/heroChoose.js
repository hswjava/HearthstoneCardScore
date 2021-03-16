// miniprogram/heroChoose/heroChoose.js
var db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    heroClass:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getData:function(e){
    // db.collection("demohero").get({
    //   success: res => {
    //     console.log(res)
    //     this.setData({heroClass:res.data})
    //   },
    //   fail: console.error
    // })
  },
  onLoad: function (options) {
    db.collection("demohero").get({
      success: res => {
        console.log(res)
        this.setData({heroClass:res.data})
      },
      fail: console.error
    })
  },

  typeClick:function(e){
    let chooseIndex = e.currentTarget.dataset.index
    let chooseHero = e.currentTarget.dataset.hero
    console.log(e.currentTarget.dataset.index,e)
    wx.navigateTo({
      url: '../cardJudge/cardJudge?selectIndex=' + chooseIndex +'&hero=' + chooseHero ,
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