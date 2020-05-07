import { http } from "../../lib/http.js";
let app = getApp();
const { transMit } = app.globalData;

Page({
  timer: null,
  data: {
    time: "",
    tomato: {},
    defaultTime: 1500,
    timerStatus: "暂停",
    visible: false,
    completed: false,
    loading: false
  },
  onShow() {
    http.post('/tomatoes').then(response => {
      this.data.tomato = response.data.resource;
    })
    if(this.data.defaultTime){
      wx.vibrateLong({});
      this.startTimer()
    }
  },
  startTimer() {
    this.changeTimer();
    this.timer = setInterval(() => {
      if (this.data.defaultTime <= 0) {
        wx.vibrateLong({});
        this.setData({completed: true})
        this.stopTimer();
        return
      }
      this.changeTimer();
    }, 1000);
  },
  changeTimer() {
    this.data.defaultTime = this.data.defaultTime - 1;
    let minute = Math.floor(this.data.defaultTime / 60);
    let seconds = Math.floor(this.data.defaultTime % 60);
    if ((seconds + '').length === 1) {
      seconds = '0' + seconds;
    }
    if ((minute + '').length === 1) {
      minute = '0' + minute;
    }
    this.data.time = `${minute}:${seconds}`;
    this.setData({ time: this.data.time });
  },
  changeStatus() {
    console.log(this.data.timerStatus);
    if(this.data.timerStatus === "暂停") {
      this.setData({timerStatus: "开始"})
      this.stopTimer()
    }else if(this.data.timerStatus === "开始") {
      this.setData({timerStatus: "暂停"})
      this.startTimer()
    }
  },
  stopTimer() {
    clearInterval(this.timer);
  },
  showPopup() {
    this.stopTimer();
    this.setData({visible: true})
  },
  confirm(event) {
    let content = event.detail;
    if(content) {
      this.setData({ loading: true });
      http.put(`/tomatoes/${this.data.tomato.id}`, {
        description: content,
        aborted: true
      })
        .then(response => {
          wx.reLaunch({ url : '/pages/home/home'})
        }).catch((err)=>{
        this.setData({ loading: false });
      })
    }
  },
  cancel() {
    this.setData({ visible: false })
    if(this.data.type === 'abandon'){
      this.startTimer();
    }
  },
  backToHomePage() {
    wx.navigateBack({})
  },
  onHide() {
    console.log(this.data.tomato);
    if (this.data.defaultTime) {
      this.stopTimer()
      http.put(`/tomatoes/${this.data.tomato.id}`, {
        description: "退出放弃",
        aborted: true
      })
    }
  },
  onUnload() {
    if (this.data.defaultTime) {
      this.stopTimer()
      http.put(`/tomatoes/${this.data.tomato.id}`, {
        description: "退出放弃",
        aborted: true
      })
    }
  },
  onShareAppMessage(){
    return transMit;
  }
});
