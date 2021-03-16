// miniprogram/cardJudge/cardJudge.js
let app=getApp()
let cloudImage = require('../utils/cloudImage.js')
var db=wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    'maskModal':false,
    'markModal':false,
    'pageFixed':false,
    'markImg':'../assets/testPhoto/DH2.png',
    'markText':'',
    'changeNum': 0,
    'changeAct': 'star_choosed',
    'starChoosed':'',
    'star':'',
    'items':[{}],
    'hero':''
  },

  catchImg: function (e) {
    // console.log(e)
    // console.log(e.currentTarget.id)
    let that = this;
    let selectIndex = e.currentTarget.id;
    let { changeAct, changeNum, items } = that.data
    console.log(changeAct, changeNum, selectIndex)
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
  
  cardshortTap:function(e){
    console.log(e)
    console.log('这是用来放大图片')
  },

  cardlongTap:function(e){
    let that=this;
    let {items} = that.data
    console.log(e)
    console.log('长按出评论框')
    console.log(e.currentTarget.dataset)
    var selectIndex = e.currentTarget.dataset.index;
    that.setData({markImg:items[selectIndex]['imageUrl'],markText:items[selectIndex]['name']})
    that.setData({pageFixed:true,maskModal:true,markModal:true})
  },

  starChange: function (e) {
    // console.log(e)
    console.log(e.currentTarget.dataset)
    var act = e.currentTarget.dataset.act;
    var selectNum = e.currentTarget.dataset.selectnum;
    this.setData({ changeNum: selectNum, changeAct: act })
    // var one_2;
    // if (in_xin === 'add_star'){
    //   one_2 = Number(e.currentTarget.dataset.selectnum);
    // } 
    // console.log(one_2)
  },

  onCancel:function(e){
    console.log('取消评论')
    this.setData({pageFixed:false,maskModal:false,markModal:false})
  },
  
  onConfirm:function(e){
    console.log('保存评论')
    let {markText}=this.data;
    this.setData({pageFixed:false,maskModal:false,markModal:false})
    wx.showToast({
      title: "评论成功",
      icon: 'none',
      duration: 2000
    })
  },
  setCloudData:function(e){
    let{hero,items}=this.data;
    // console.log(hero,items)
    db.collection('userScore').where({
      _openid: 'oDKMN5BzAHOXGTg3UtDDu8Z1IKmA',
    }).update({
      data: {
        [hero]:items
        // description: "learn cloud database",
        // due: new Date("2018-09-01"),
        // tags: [
        //   "cloud",
        //   "database"
        // ],
        // style: {
        //   color: "skyblue"
        // },
        // // 位置（113°E，23°N）
        // location: new db.Geo.Point(113, 23),
        // done: false
      },
      success: function(res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    console.log(options)
    let cloudUrl=app.globalData.cloudUrl
    let url=cloudUrl+'stars/star_choosed.png'
    cloudImage.cardRequest(url,starChoosedFun)
    function starChoosedFun(res) {
     that.setData({starChoosed:res.tempFilePath});
    // that.data.starChoosed=res.tempFilePath
    };
    let starurl=cloudUrl+'stars/star.png'
    cloudImage.cardRequest(starurl,starFun)
    function starFun(res){
     that.setData({star:res.tempFilePath});
    // that.data.star=res.tempFilePath
    }
    that.setData({hero:options.hero})
    //要先增加个判断，先看score表里有没有该用户数据
    db.collection("cardlist").get({
      success: res => {
        let index=options.selectIndex;
        let hero=options.hero;
        let cardList=[]
        console.log(res.data[index][hero])
        let cardDir=res.data[index][hero];
        for(let i=0;i<cardDir.length;i++){
          cardList.push({})
          wx.cloud.downloadFile({
            fileID:cloudUrl+'testCard/'+hero+'/'+cardDir[i]+'.png',
            success: res => {
                cardList[i].id=i;
                cardList[i].name=cardDir[i];
                cardList[i].imageUrl=res.tempFilePath;
                cardList[i].stars='0';
        that.setData({items:cardList})

            },
            fail: console.error
          })
        }
        console.log(cardList)
        // this.setData({items:res.data[index][hero]})
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