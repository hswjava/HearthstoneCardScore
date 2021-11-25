// miniprogram/editonChoose/editonChoose.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // editionClass:[{id:'Barrens',name:'贫瘠之地'},{id:'BarrensMini',name:'贫瘠之地迷你'}],
   
    editionClass:[{id:'Barrens',name:'贫瘠之地'},{id:'BarrensMini',name:'贫瘠之地迷你'},{id:'stormwind',name:'暴风城下的集结'},{id:'stormwindMini',name:'暴风城下的集结迷你'},{id:'Alterac',name:'奥特兰克的决裂'}],

  },

  typeClick:function(e){
    let {chooseHero} = this.data
    let selectedition=e.currentTarget.dataset.selectid
    console.log(chooseHero,selectedition)
    wx.navigateTo({
      url: '../heroChoose/heroChoose?selectedition=' + selectedition ,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    // let defaultList = ['demonhunter', 'druid', 'hunter', 'mage', 'paladin', 'priest', 'rogue', 'shaman', 'warlock', 'warrior', 'neutral']
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