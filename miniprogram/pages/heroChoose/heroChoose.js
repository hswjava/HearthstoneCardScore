// miniprogram/heroChoose/heroChoose.js
var db = wx.cloud.database();
const app = getApp();
let cloudImage = require('../../utils/cloudImage');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    heroClass: [],
    chooseedition: ''
  },

  getData(e) {},

  finishUpload(e) {
    let { chooseedition } = this.data;
    if (app.globalData.openId) {
      db.collection('userScore')
        .where({
          openId: app.globalData.openId
        })
        .get({
          success: res => {
            let defaultList = [
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
            ];
            for (let key in res.data[0][chooseedition]) {
              for (let j = 0; j < defaultList.length; j++) {
                if (key === defaultList[j]) {
                  defaultList.splice(j, 1);
                }
              }
            }
            if (defaultList.length === 0) {
              wx.showModal({
                title: '完成评分',
                content:
                  '感谢你对暴风城下的集结的评分，本次评分不用做商业用途，仅作交流，请放心提交。',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../pages/index/index'
                    });
                  }
                }
              });
            } else {
              let newList = [];

              defaultList.forEach(element => {
                newList.push(cloudImage.heroText(element));
              });
              let jumpHero = defaultList[0];
              let contentPlus = newList.toString();
              wx.showModal({
                title: '评分未完成',
                confirmText: '跳转',
                content: '您还有' + contentPlus + '未完成评分。',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      // url: '../cardJudge/cardJudge?hero=' + jumpHero,
                      url: `../cardJudge/cardJudge?hero=${jumpHero}&chooseEdition=${chooseedition}`
                    });
                  } else if (res.cancel) {
                    console.log('用户点击取消');
                  }
                }
              });
            }
          }
        });
    } else {
      wx.showToast({
        title: '请完成任意卡的评分上传再点击此按钮',
        icon: 'none',
        duration: 2000
      });
    }
  },
  viewReport() {
    let { chooseedition } = this.data;
    if (app.globalData.openId.length === 0) {
      wx.getUserProfile({
        desc: '正在获取',
        success: res => {
          app.globalData.userInfo = res.userInfo;
          wx.cloud
            .callFunction({ name: 'login' })
            .then(res => {
              let openid = res.result.openid;

              app.globalData.openId = openid;
              wx.navigateTo({
                url: `../report/report?chooseEdition=${chooseedition}`
              });
            })
            .catch(err => {
              console.log('登录失败', err);
            });
        },
        fail: err => console.error(err)
      });
    } else {
      wx.navigateTo({
        url: `../report/report?chooseEdition=${chooseedition}`
      });
    }
  },
  getOpenid(e) {
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        // console.log('云函数获取到的openid:', res.result.openid)
        let openid = res.result.openid;
        // that.setData({
        //   openid: openid
        // })
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
                wx.showToast({
                  title: '数据获取成功',
                  icon: 'none',
                  duration: 2000
                });
              } else {
                db.collection('userScore').add({
                  data: {
                    openId: openid,
                    nickName: app.globalData.userInfo.nickName
                  },
                  success: res => {
                    // console.log(res)
                    wx.showToast({
                      title: '没有找到您的历史评分数据',
                      icon: 'none',
                      duration: 2000
                    });
                  }
                });
              }
            },
            fail: console.error
          });
      },
      fail: res => {
        console.log('登录失败', res);
      }
    });
  },

  historyGet(e) {
    if (app.globalData.openId.length === 0) {
      wx.getUserProfile({
        desc: '正在获取', //不写不弹提示框
        success: res => {
          // console.log('获取成功: ',res)
          app.globalData.userInfo = res.userInfo;
          wx.cloud.callFunction({
            name: 'login',
            success: res => {
              let openid = res.result.openid;
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
                      wx.showToast({
                        title: '数据获取成功',
                        icon: 'none',
                        duration: 2000
                      });
                    } else {
                      db.collection('userScore').add({
                        data: {
                          openId: openid,
                          nickName: app.globalData.userInfo.nickName
                        },
                        success: function (res) {
                          // console.log(res)
                          wx.showToast({
                            title: '没有找到您的历史评分数据',
                            icon: 'none',
                            duration: 2000
                          });
                        }
                      });
                    }
                  },
                  fail: console.error
                });
            },
            fail: res => {
              console.log('登录失败', res);
            }
          });
          // app.globalData.firstLogin= true
          // that.setData({hasUserInfo:true})
        },
        fail: function (err) {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    } else {
      wx.showToast({
        title: '已进行过数据更新',
        icon: 'none',
        duration: 2000
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    if (app.globalData.firstLogin) {
      this.setData({ chooseedition: options.selectedition });

      wx.showModal({
        title: '评分提示',
        content:
          '1.本次评分仅考虑标准环境，采用5分制，最低1分，最高5分（因技术原因，本次评分不支持小数）\r\n2.短按图片放大，长按卡图则评论。若该卡有衍生卡，左右滑动评论里的卡片查看衍生卡（单机放大）。\r\n3.因数据流量原因，评分以职业区分，评完该职业卡后请在该页面确认提交。\r\n4.若使用过本小程序请点击获取历史获取过去的评分信息，若不点，重新评分会覆盖旧数据。（有意见或建议微博私信@一缕v秋凉）',
        showCancel: false
      });
    } else {
      this.setData({ chooseedition: options.selectedition });
    }
    db.collection('demohero').get({
      success: res => {
        console.log(res);
        this.setData({ heroClass: res.data });
        console.log(res.data);
      },
      fail: console.error
    });
  },

  typeClick(e) {
    let chooseIndex = e.currentTarget.dataset.index;
    let chooseHero = e.currentTarget.dataset.hero;
    let { chooseedition } = this.data;
    wx.navigateTo({
      url: `../cardJudge/cardJudge?selectIndex=${chooseIndex}&hero=${chooseHero}&chooseEdition=${chooseedition}`
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
