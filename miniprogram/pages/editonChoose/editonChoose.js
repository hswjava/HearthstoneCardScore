// miniprogram/editonChoose/editonChoose.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // editionClass:[{id:'Barrens',name:'贫瘠之地'},{id:'BarrensMini',name:'贫瘠之地迷你'}],
    editionClass: [
      { id: 'Barrens', name: '贫瘠之地' },
      { id: 'BarrensMini', name: '贫瘠之地迷你' },
      { id: 'stormwind', name: '暴风城下的集结' },
      { id: 'stormwindMini', name: '暴风城下的集结迷你' },
      { id: 'Alterac', name: '奥特兰克的决裂' }
    ]
  },

  typeClick(e) {
    let { selectid: selectedition } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../heroChoose/heroChoose?selectedition=${selectedition}`
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // let defaultList = ['demonhunter', 'druid', 'hunter', 'mage', 'paladin', 'priest', 'rogue', 'shaman', 'warlock', 'warrior', 'neutral']
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
