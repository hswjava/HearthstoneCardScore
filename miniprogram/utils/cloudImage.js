function cardRequest(url, callback) {
  wx.cloud.downloadFile({
    fileID: url,
    success: res => {
      callback(res)
    },
    fail: console.error
  })
  // callBack(url)
}

function heroText(hero) {
  let heroText = '';
  switch (hero) {
    case 'demonhunter':
      heroText = '恶魔猎手';
      break;
    case 'druid':
      heroText = '德鲁伊';
      break;
    case 'hunter':
      heroText = '猎人';
      break;
    case 'mage':
      heroText = '法师';
      break;
    case 'paladin':
      heroText = '圣骑士';
      break;
    case 'priest':
      heroText = '牧师';
      break;
    case 'rogue':
      heroText = '盗贼';
      break;
    case 'shaman':
      heroText = '萨满';
      break;
    case 'warlock':
      heroText = '术士';
      break;
    case 'warrior':
      heroText = '战士';
      break;
    case 'neutral':
      heroText = '中立';
      break;
    default:
      return null;
  }
  return heroText;
}

module.exports = {
  cardRequest: cardRequest,
  heroText:heroText
}