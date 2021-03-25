// miniprogram/cardJudge/cardJudge.js
let app = getApp()
let cloudImage = require('../utils/cloudImage.js')
var db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    'maskModal': false,
    'markModal': false,
    'pageFixed': false,
    'markImg': '../assets/testPhoto/DH2.png',
    'markText': '',
    'markIndex': '',
    'contentShow': '',
    'uploadMark': '',
    'changeNum': 0,
    'changeAct': 'star_choosed',
    'starChoosed': '',
    'star': '',
    'items': [{}],
    'hero': '',
    'showTitle': '',
    'scrollItems':'',
    'cardifScroll':'0'
  },

  catchImg: function (e) {
    // console.log(e)
    // console.log(e.currentTarget.id)
    let that = this;
    let selectIndex = e.currentTarget.id;
    let { changeAct, changeNum, items } = that.data
    // console.log(changeAct, changeNum, selectIndex)
    let starNum = Number(items[selectIndex]['stars'])
    if (changeAct === 'star_choosed') {
      if (items[selectIndex]['stars'] === Number(changeNum)) {
        items[selectIndex]['stars'] = Number(changeNum) - 1
      }
      else {
        items[selectIndex]['stars'] = Number(changeNum)
      }
    }
    else if (changeAct === 'star_not') {
      // items[selectIndex]['stars']=Number(changeNum)
      items[selectIndex]['stars'] = Number(changeNum) + starNum

    }
    console.log(items[selectIndex]['stars'])
    that.setData({ items, changeNum: 0, changeAct: '' })
  },

  cardshortTap: function (e) {
    let { items, markIndex } = this.data
    var selectIndex = e.currentTarget.dataset.index;

    // console.log(items)
    wx.previewImage({
      urls: [items[selectIndex]['imageUrl']],
    })
  },

  cardlongTap: function (e) {
    let that = this;
    let { items,scrollItems } = that.data
    // console.log(e)
    // console.log('长按出评论框')
    // console.log(e.currentTarget.dataset)
    var selectIndex = e.currentTarget.dataset.index;
    if (items[selectIndex]['comment']) {
      that.setData({ contentShow: items[selectIndex]['comment'] })
      // console.log('非空')
    }
    else {
      that.setData({ contentShow: '' })
      // console.log('空')
    }
    // console.log(items,typeof items[selectIndex]['childItem'])
    if (typeof items[selectIndex]['childItem']==='object') {
      scrollItems=[items[selectIndex]]
      that.setData({scrollItems:scrollItems})
      that.setData({markText: items[selectIndex]['name'], markIndex: selectIndex,cardifScroll:'1' })
      // console.log(scrollItems,that.data.items)
    }
    else {
      // console.log('else')

      that.setData({ markImg: items[selectIndex]['imageUrl'], markText: items[selectIndex]['name'], markIndex: selectIndex,cardifScroll:'0' })
    }
    that.setData({ pageFixed: true, maskModal: true, markModal: true })
  },

  starChange: function (e) {
    var act = e.currentTarget.dataset.act;
    var selectNum = e.currentTarget.dataset.selectnum;
    this.setData({ changeNum: selectNum, changeAct: act })
  },

  onCancel: function (e) {
    // console.log('取消评论')
    this.setData({ pageFixed: false, maskModal: false, markModal: false })
    //调用数据库评论

  },

  onConfirm: function (e) {
    // console.log('保存评论')
    let that = this;
    let { hero, markIndex, uploadMark, items } = this.data;
    // console.log(items[markIndex])
    items[markIndex]['comment'] = uploadMark
    that.setData({ items })
    // console.log(hero, markIndex)
    // db.collection('userScore').where({
    //   openId: app.globalData.openId,
    // }).get({
    //   success:res=>{
    //     console.log(res.data[0][hero][markIndex]['comment'])
    //   }
    // })
    db.collection('userScore').where({
      openId: app.globalData.openId,
    }).update({
      data: {
        [hero[markIndex].comment]: uploadMark
      },
      success: function (res) {
        // console.log(res)
        wx.showToast({
          title: "评论成功",
          icon: 'none',
          duration: 2000
        })
      },

      fail: function (res) {
        wx.showToast({
          title: "评论失败",
          icon: 'none',
          duration: 2000
        })
      }
    })
    that.setData({ pageFixed: false, maskModal: false, markModal: false })

  },

  bindTextAreaBlur: function (e) {
    let inputValue = '';
    let that = this;
    inputValue = e.detail.value;
    that.setData({ uploadMark: inputValue })
  },

  setCloudData: function (e) {
    let { hero, items } = this.data;
    // console.log(hero,items)
    db.collection('userScore').where({
      openId: app.globalData.openId,
    }).update({
      data: {
        [hero]: items
      },
      success: function (res) {
        wx.showToast({
          title: hero + '提交成功',
          icon: 'none',
          duration: 2000
        })

        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 1500)

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let cloudUrl = app.globalData.cloudUrl
    let url = cloudUrl + 'stars/star_choosed.png'
    cloudImage.cardRequest(url, starChoosedFun)
    function starChoosedFun(res) {
      that.setData({ starChoosed: res.tempFilePath });
      // that.data.starChoosed=res.tempFilePath
    };
    let starurl = cloudUrl + 'stars/star.png'
    cloudImage.cardRequest(starurl, starFun)
    function starFun(res) {
      that.setData({ star: res.tempFilePath });
      // that.data.star=res.tempFilePath
    }
    that.setData({ hero: options.hero })
    that.setData({ showTitle: cloudImage.heroText(options.hero) })
    //要先增加个判断，先看score表里有没有该用户数据
    db.collection('userScore').where({
      openId: app.globalData.openId,
    }).get({
      success: res => {
        // console.log(options.hero, res.data[0], typeof res.data[0][options.hero])
        if (typeof res.data[0][options.hero] !== 'undefined') {
          that.setData({ items: res.data[0][options.hero] })
        }
        else {
          db.collection("cardlist").get({
            success: res2 => {
              // let index = options.selectIndex;
              let hero = options.hero;
              let cardList = []
              let cardDir = res2.data[0][hero];
              for (let i = 0; i < cardDir.length; i++) {
                cardList.push({})
                wx.cloud.downloadFile({
                  fileID: cloudUrl + 'testCard/' + hero + '/' + cardDir[i]['name'] + '.png',
                  success: res3 => {
                    cardList[i].id = i;
                    cardList[i].name = cardDir[i]['name'];
                    cardList[i].imageUrl = res3.tempFilePath;
                    cardList[i].stars = '0';
                    cardList[i].comment = '';
                    cardList[i].childItem=[]
                    cardList[i].childItem.push({'imageUrl':res3.tempFilePath})
                    if(typeof cardDir[i].childCard ==='object'){
                      // for(let j=0;j<cardDir[i].childCard.length;j++)
                      for(let j=cardDir[i].childCard.length-1;j>=0;j--){
                        wx.cloud.downloadFile({
                          fileID: cloudUrl + 'testCard/' + hero + '/' + cardDir[i].childCard[j] + '.png',
                          success:res4=>{
                            // cardList[i].childItem[j]={'imageUrl':res4.tempFilePath} 
                            // cardList[i].childItem=[{}]
                            // cardList[i].childItem[0]={'imageUrl':res3.tempFilePath}
                            // cardList[i].childItem[j]={'imageUrl':res4.tempFilePath}
                            cardList[i].childItem.push({'imageUrl':res4.tempFilePath})
                            // that.setData({ items: cardList })
                            // cardList[i].childItem.push({'imageUrl':res4.tempFilePath})
                          },
                          fail:console.error
                        })
                      }
                    }
                    that.setData({ items: cardList })
                  },
                  fail: console.error
                })
              }
              // console.log(cardList)
              // this.setData({items:res.data[index][hero]})
            },
            fail: console.error
          })
        }
        // this.setData({heroClass:res.data})
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