Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleSrc:'',
    backImg:'',
  },

  JumpClick: function (e) {
    wx.navigateTo({
      url: '../../heroChoose/heroChoose',
      // url: '../cooperation/cooperation?text=' + this.data.chooseData+'$' ,
    })
  },

  testCloud:function(e){
    console.log(e);
    console.log('测试')
    let test='logo';
    wx.cloud.downloadFile({
      // fileID: 'cloud://heartstone-score-7fotud45b9264af.6865-heartstone-score-7fotud45b9264af-1305170786/testCard/logo.png', // 文件 ID
      fileID:'cloud://heartstone-score-7fotud45b9264af.6865-heartstone-score-7fotud45b9264af-1305170786/testCard/'+test+'.png',
      success: res => {
        // 返回临时文件路径
        console.log(res)
      },
      fail: console.error
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.downloadFile({
      fileID:'cloud://heartstone-score-7fotud45b9264af.6865-heartstone-score-7fotud45b9264af-1305170786/testCard/logo.png',
      success: res => {
        // 返回临时文件路径
        this.setData({titleSrc:res.tempFilePath})
      },
      fail: console.error
    })
    wx.cloud.downloadFile({
      fileID:'cloud://heartstone-score-7fotud45b9264af.6865-heartstone-score-7fotud45b9264af-1305170786/background.jpg',
      success: res => {
        // 返回临时文件路径
        this.setData({backImg:res.tempFilePath})
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