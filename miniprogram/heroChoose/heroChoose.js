// miniprogram/heroChoose/heroChoose.js
var db = wx.cloud.database()
const app = getApp()
let cloudImage = require('../utils/cloudImage.js')

Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    heroClass: [],
    chooseedition:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getData: function (e) {
    // db.collection("demohero").get({
    //   success: res => {
    //     console.log(res)
    //     this.setData({heroClass:res.data})
    //   },
    //   fail: console.error
    // })
  },

  finishUpload: function (e) {
    let {chooseedition} = this.data
    db.collection('userScore').where({
      openId: app.globalData.openId,
    }).get({
      success: res => {
        let defaultList = ['demonhunter', 'druid', 'hunter', 'mage', 'paladin', 'priest', 'rogue', 'shaman', 'warlock', 'warrior', 'neutral']
        for (var key in res.data[0][chooseedition]) {
          for (let j = 0; j < defaultList.length; j++) {
            if (key === defaultList[j]) {
              defaultList.splice(j, 1);
            }
          }
        }
        if (defaultList.length === 0) {
          wx.showModal({
            title: '完成评分',
            content: '感谢你对贫瘠之地的锤炼版本的评分，本次评分不用做商业用途，仅作交流，请放心提交。',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../pages/index/index',
                  });
              }
            }
          })
        }
        else {
          let newList = []
       
          defaultList.forEach(function (element) {
            newList.push(cloudImage.heroText(element))
          });
          let jumpHero=defaultList[0]
          let contentPlus =newList.toString()
          wx.showModal({
            title: '评分未完成',
            confirmText:'跳转',
            content: '您还有' + contentPlus+'未完成评分。',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  // url: '../cardJudge/cardJudge?hero=' + jumpHero,
                  url: '../cardJudge/cardJudge?hero=' + jumpHero+'&chooseEdition='+chooseedition,
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },



    onLoad: function (options) {
      if (app.globalData.firstLogin) {
        this.setData({chooseedition:options.selectedition})

        wx.showModal({
          title: '评分提示',
          content: '1.本次评分采用5分制，最低1分，最高5分（因技术原因，本次评分不支持小数）\r\n2.短按图片放大，长按卡图则评论。若该卡有衍生卡，左右滑动评论里的卡片查看衍生卡。\r\n3.因数据流量原因，评分以职业区分，评完该职业卡后请在该页面确认提交。',
          showCancel: false,
        })
      }
      else {
        this.setData({chooseedition:options.selectedition})
      }
      db.collection("demohero").get({
        success: res => {
          // console.log(res)
          this.setData({ heroClass: res.data })
        },
        fail: console.error
      })
    },

    typeClick: function (e) {
      let chooseIndex = e.currentTarget.dataset.index
      let chooseHero = e.currentTarget.dataset.hero
      let {chooseedition} = this.data
      wx.navigateTo({
        url: '../cardJudge/cardJudge?selectIndex=' + chooseIndex + '&hero=' + chooseHero+'&chooseEdition='+chooseedition,
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