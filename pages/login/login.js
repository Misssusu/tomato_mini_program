import { http } from "../../lib/http.js";
const { app_id, app_secret } = getApp().globalData

Page({
  data:{
    imgsrc: "",
    loading: false,
    errorTip: false
  },
  login(event){
    this.setData({loading: true, errorTip: false});
    let encrypted_data = event.detail.encryptedData
    let iv = event.detail.iv
    this.wxLogin(encrypted_data, iv)
  },
  wxLogin(encrypted_data, iv){
    wx.login({
      success: (res) => {
        this.loginMe(res.code, iv, encrypted_data)}
    })
  },
  loginMe(code, iv, encrypted_data){
    //登录
    http.post('/sign_in/mini_program_user',{
      code,
      iv,
      encrypted_data,
      app_id,
      app_secret
    })
      .then((response)=>{
        this.saveMessage(response)
        this.setData({loading: false})
        wx.reLaunch({ url: "/pages/home/home" })
      })
      .catch(error=>{
        console.log(error);
        this.setData({errorTip: true,loading: false});
      })
  },
  saveMessage(response){
    wx.setStorageSync('me', response.data.detail )
    wx.setStorageSync('X-token', response.header["X-token"])
  },
  onShareAppMessage(){
    return {
      title: 'Focus土豆是一个结合番茄工作法的训练专注力的应用，快来加入吧！',
      path: 'pages/login/login',
      imageUrl: '../../images/focus.jpg'
    }
  }
})
