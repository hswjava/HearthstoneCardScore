function cardRequest(url,callback){
  wx.cloud.downloadFile({
    fileID:url,
    success: res => {
      callback(res)
    },
    fail: console.error
  })
  // callBack(url)
}

module.exports={
  cardRequest:cardRequest
}