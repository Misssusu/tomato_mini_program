const app = getApp();
const { host, app_id, app_secret, t_app_id, t_app_secret} = app.globalData;

let _http = function(method,url,data) {
  const header = {
    "t-app-id": t_app_id,
    "t-app-secret": t_app_secret
  }
  if (wx.getStorageSync('X-token')) {
    header["Authorization"] = `Bearer ${wx.getStorageSync('X-token')}`
  }
  return new Promise((resolve,reject)=>{
    wx.request({
      method,
      url: `${host}${url}`,
      data,
      header,
      success(response){
        let statusCode = response.statusCode;
        if(statusCode >= 400){
          if(statusCode === 401) {
            wx.redirectTo({ url: "pages/login/login" })
          }
          reject({statusCode,response})
        }else {
          resolve(response)
        }
      },
      fail(error) {
        wx.showToast({
          title: "请求失败"
        })
        reject(error)
      }
    })
  })
}
let http = {
  post(url,data){ return _http('POST',url,data)},
  get(url,data){ return _http('GET',url,data)},
  put(url,data){ return _http('PUT',url,data)},
  delete(url,data){ return _http('DELETE',url,data)}
}
export { http }
