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
    'scrollItems': '',
    'cardifScroll': '0',
    'selectEdition': ''
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
    // console.log(items[selectIndex]['stars'])
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

  childCardShortTap: function (e) {
    let { scrollItems, markIndex } = this.data
    // console.log(this.data)
    var i = e.currentTarget.offsetLeft/320
  // console.log(i)
  wx.previewImage({
    urls: [scrollItems[0].childItem[i]['imageUrl']],
  })

  },

  cardlongTap: function (e) {
    let that = this;
    // console.log(that.data)
    let { items, scrollItems } = that.data
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
    if (typeof items[selectIndex]['childItem'] === 'object') {
      scrollItems = [items[selectIndex]]
      that.setData({ scrollItems: scrollItems })
      that.setData({ markText: items[selectIndex]['name'], markIndex: selectIndex, cardifScroll: '1' })
      // console.log(scrollItems,that.data.items)
    }
    else {
      // console.log('else')

      that.setData({ markImg: items[selectIndex]['imageUrl'], markText: items[selectIndex]['name'], markIndex: selectIndex, cardifScroll: '0' })
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

  // getOpenid(e) {
  //   let that = this;
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     success: res => {
  //       var openid = res.result.openid;
  //       app.globalData.openId = openid
  //       console.log(openid)
  //       db.collection('userScore').where({
  //         openId: app.globalData.openId,
  //       }).get(
  //         {
  //           success: res => {
  //             console.log(res.data.length)
  //             if (res.data.length > 0) {
  //               app.globalData.userExist = true;
  //               // wx.navigateBack({
  //               //   delta: 1,
  //               // })
  //             }
  //             else {
  //               db.collection('userScore').add({
  //                 data: {
  //                   openId: openid,
  //                   nickName: app.globalData.userInfo.nickName,
  //                 },
  //                 success: function (res) {
  //                   // wx.navigateBack({
  //                   //   delta: 1,
  //                   // })
  //                 }
  //               })

  //             }
  //           },
  //           fail: console.error
  //         }
  //       )

  //     },
  //     fail: res => {
  //       console.log('登录失败', res)
  //     }
  //   })
  // },


  uploadData(selectEdition, data, hero) {
    db.collection('userScore').where({
      openId: app.globalData.openId,
    }).update({
      data: {
        [selectEdition]: data
        // [selectEdition[hero]]: items
      },
      success: function (res) {
        console.log(res1)
        wx.showToast({
          title: cloudImage.heroText(hero) + '提交成功',
          icon: 'none',
          duration: 2000
        })

        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 1500)

      },
      fail: console.error
    })
  },

  setCloudData: function (e) {
    let that = this
    let { hero, items, selectEdition } = this.data;
    console.log(hero, items, selectEdition)
    let upDateData = { [hero]: items }
    console.log(app.globalData[selectEdition][hero])
    // app.globalData['selectEdition'][hero]=items
    app.globalData[selectEdition][hero] = items
    console.log(app.globalData['Barrens'])
    if (!app.globalData.openId) {
      wx.getUserProfile({
        desc: '正在获取',//不写不弹提示框
        success: function (res) {

          app.globalData.userInfo = res.userInfo
          wx.cloud.callFunction({
            name: 'login',
            success: res2 => {
              var openid = res2.result.openid;
              app.globalData.openId = openid
              db.collection('userScore').where({
                openId: app.globalData.openId,
              }).get({
                success: function (res2) {
                  // res.data 包含该记录的数据
                  console.log(res2.data[0]['openId'])
                  if (
                    !res2.data[0]['openId']
                  ) {
                    db.collection('userScore').add({
                      data: {
                        openId: app.globalData.openId,
                        nickName: app.globalData.userInfo.nickName,
                      },
                      success: function (res) {
                        db.collection('userScore').where({
                          openId: app.globalData.openId,
                        }).update({
                          data: {
                            [selectEdition]: upDateData
                            // [selectEdition[hero]]: items
                          },
                          success: function (res) {
                            console.log(res)
                            wx.showToast({
                              title: cloudImage.heroText(hero) + '提交成功',
                              icon: 'none',
                              duration: 2000
                            })

                            setTimeout(function () {
                              wx.navigateBack({
                                delta: 1,
                              })
                            }, 1500)

                          },
                          fail: console.error
                        })
                      }
                    })
                  }
                  else {
                    db.collection('userScore').where({
                      openId: app.globalData.openId,
                    }).update({
                      data: {
                        [selectEdition]: upDateData
                        // [selectEdition[hero]]: items
                      },
                      success: function (res) {
                        console.log(res)
                        wx.showToast({
                          title: cloudImage.heroText(hero) + '提交成功',
                          icon: 'none',
                          duration: 2000
                        })

                        setTimeout(function () {
                          wx.navigateBack({
                            delta: 1,
                          })
                        }, 1500)

                      },
                      fail: console.error
                    })
                  }
                },
                fail: console.error
              })

            },
            fail: res => {
              console.log('登录失败', res)
            }
          })
        },
        fail: function (err) {
          wx.showToast({
            title: '你的评分将在你退出小程序时删除，感谢你对本程序的使用',
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
    }
    else {



      db.collection('userScore').where({
        openId: app.globalData.openId,
      }).update({
        data: {
          [selectEdition]: upDateData
          // [selectEdition[hero]]: items
        },
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: cloudImage.heroText(hero) + '提交成功',
            icon: 'none',
            duration: 2000
          })

          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)

        },
        fail: console.error
      })
    }

    // console.log(upDateData,selectEdition)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
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
    // console.log(options.chooseEdition)
    let selectEdition = options.chooseEdition
    that.setData({ selectEdition: options.chooseEdition })
    that.setData({ hero: options.hero })
    that.setData({ showTitle: cloudImage.heroText(options.hero) })
    // 要先增加个判断，先看score表里有没有该用户数据
    if (app.globalData.openId) {
      db.collection('userScore').where({
        openId: app.globalData.openId,
      }).get({
        success: res => {
          if (typeof res.data[0][selectEdition] !== 'undefined' && typeof res.data[0][selectEdition][options.hero] !== 'undefined') {
            that.setData({ items: res.data[0][selectEdition][options.hero] })
          }
          else {
            db.collection("cardlist").get({
              success: res2 => {
                let hero = options.hero;
                let cardList = []
                let cardDir = res2.data[0][selectEdition][hero];
                console.log(cardDir);
                for (let i = 0; i < cardDir.length; i++) {
                  cardList.push({})
                  // console.log(cloudUrl + selectEdition + '/' + hero + '/' + cardDir[i]['name'] + '.png')
                  wx.cloud.downloadFile({
                    fileID: cloudUrl + selectEdition + '/' + hero + '/' + cardDir[i]['name'] + '.png',
                    success: res3 => {

                      cardList[i].id = i;
                      cardList[i].name = cardDir[i]['name'];
                      cardList[i].imageUrl = res3.tempFilePath;
                      cardList[i].stars = '0';
                      cardList[i].comment = '';
                      cardList[i].childItem = []
                      cardList[i].childItem.push({ 'imageUrl': res3.tempFilePath })
                      if (typeof cardDir[i].childCard === 'object') {
                        for (let j = 0; j <= cardDir[i].childCard.length - 1; j++) {
                          let img_url = cloudUrl + selectEdition + '/' + hero + '/' + cardDir[i].childCard[j] + '.png'
                          cardList[i].childItem.push({ 'imageUrl':  img_url})
                          wx.cloud.downloadFile({
                            fileID: img_url,
                            fail: res4=>{
                              cardList[i].childItem.remove({ 'imageUrl': res4.tempFilePath })
                              console.error
                            }
                          })
                        }
                      }
                      // console.log(cardList)
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
    }//if 判断
    else if (app.globalData[selectEdition][options.hero]) {
      // console.log('426')
      that.setData({ items: app.globalData[selectEdition][options.hero] })
    }
    else {
      // console.log('430')
      db.collection("cardlist").get({
        success: res2 => {
          let hero = options.hero;
          let cardList = []
          let cardDir = res2.data[0][selectEdition][hero];
          // console.log(cardDir)
          for (let i = 0; i < cardDir.length; i++) {
            cardList.push({})

            wx.cloud.downloadFile({
              fileID: cloudUrl + selectEdition + '/' + hero + '/' + cardDir[i]['name'] + '.png',
              success: res3 => {
                cardList[i].id = i;
                cardList[i].name = cardDir[i]['name'];
                cardList[i].imageUrl = res3.tempFilePath;
                cardList[i].stars = '0';
                cardList[i].comment = '';
                cardList[i].childItem = []
                cardList[i].childItem.push({ 'imageUrl': res3.tempFilePath })
                if (typeof cardDir[i].childCard === 'object') {
                  for (let j = 0; j <= cardDir[i].childCard.length - 1; j++) {
                    let img_url = cloudUrl + selectEdition + '/' + hero + '/' + cardDir[i].childCard[j] + '.png'
                    cardList[i].childItem.push({ 'imageUrl':  img_url})
                    wx.cloud.downloadFile({
                      fileID: img_url,
                      // success: res7=>{
                      //   cardList[i].childItem.push({ 'imageUrl':  res7.tempFilePath})
                      // },
                      fail: res4=>{
                        cardList[i].childItem.remove({ 'imageUrl': res4.tempFilePath })
                        console.error
                      }
                    })
                  }
                }
                // console.log(cardList)
                that.setData({ items: cardList })
                app.globalData[selectEdition][hero] = cardList
              },
              fail: console.error
            })
          }
        },
        fail: console.error
      })
    }

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