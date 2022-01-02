const cardRequest = (url, callback) => {
  wx.cloud.downloadFile({
    fileID: url,
    success: res => {
      callback(res);
    },
    fail: console.error
  });
  // callBack(url)
};

const heroText = hero => {
  let heroMap = {
    demonhunter: '恶魔猎手',
    druid: '德鲁伊',
    hunter: '猎人',
    mage: '法师',
    paladin: '圣骑士',
    priest: '牧师',
    rogue: '盗贼',
    shaman: '萨满',
    warlock: '术士',
    neutral: '中立'
  };
  return heroMap[hero];
};

module.exports = {
  cardRequest,
  heroText
};
