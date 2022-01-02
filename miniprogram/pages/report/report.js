// report/report.js
var db = wx.cloud.database();
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chooseedition: '',
    fiveList: [],
    oneList: [],
    commentList: [],
    avergeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({ chooseEdition: options.chooseEdition });
    this.getData();
  },
  /**
   * 方法
   */
  getData() {
    let { chooseEdition } = this.data;
    db.collection('userScore')
      .where({
        openId: app.globalData.openId
      })
      .get()
      .then(res => {
        if (res.data.length > 0) {
          let map = res.data[0][chooseEdition];
          let arr = [];
          let avergeList = [];
          for (const key in map) {
            const classArr = map[key].map(v => {
              v.src = `cloud://hsw-8g74af8d6fd4dabd.6873-hsw-8g74af8d6fd4dabd-1306472987/${chooseEdition}/${key}/${v.name}.png`;
              v.name += `(${key})`;
              return v;
            });
            const totalScore = map[key].reduce((total, v) => {
              return total + Number(v.stars);
            }, 0);
            avergeList.push({
              name: key,
              averge: Number(totalScore / map[key].length).toFixed(2)
            });
            arr.push(...classArr);
          }
          const totalScore = arr.reduce((total, v) => {
            return total + Number(v.stars);
          }, 0);
          avergeList.push({
            name: '所有职业',
            averge: Number(totalScore / arr.length, 2).toFixed(2)
          });
          const fiveList = this.getList(arr, v => {
            return v.stars === 5;
          });
          const oneList = this.getList(arr, v => {
            return v.stars === 1;
          });
          const commentOrign = this.getList(arr, v => {
            return v.comment;
          }).map(v => {
            v.comment = v.comment.replace(/↵/g, '\n');
            return v;
          });
          console.log('commentOrign', commentOrign, arr);
          const commentList = this.getCommentList(commentOrign, 5);
          this.setData({ fiveList, oneList, commentList, avergeList });
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
      })
      .catch(err => {
        console.log(err);
      });
  },
  getList(arr, condition) {
    return arr.filter(condition);
  },
  // 从n条评论中抽取指定数目评论
  getCommentList(arr, num) {
    if (arr.length <= num) {
      return arr;
    } else {
      //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
      let temp_array = [];
      for (let index in arr) {
        temp_array.push(arr[index]);
      }
      //取出的数值项,保存在此数组
      let return_array = [];
      for (let i = 0; i < num; i++) {
        //判断如果数组还有可以取出的元素,以防下标越界
        if (temp_array.length > 0) {
          //在数组中产生一个随机索引
          let arrIndex = Math.floor(Math.random() * temp_array.length);
          //将此随机索引的对应的数组元素值复制出来
          return_array[i] = temp_array[arrIndex];
          //然后删掉此索引的数组元素,这时候temp_array变为新的数组
          temp_array.splice(arrIndex, 1);
        } else {
          //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
          break;
        }
      }
      return return_array;
    }
  }
});
