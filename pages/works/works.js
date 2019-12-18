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
    again: false,
    reasons: "",
    type: ""

  },
  onShow() {
    http.post('/tomatoes').then(response => {
      this.data.tomato = response.data.resource;
      console.log(this.data.tomato);
    })
    if(this.data.defaultTime){
      this.startTimer()
    }
  },
  startTimer() {
    this.changeTimer();
    this.timer = setInterval(() => {
      if (this.data.defaultTime <= 0) {
        wx.vibrateLong({});
        this.setData({again: true})
        this.stopTimer();
        this.showPopup('event','finished');
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
  showPopup(event,type) {
    console.log(type);
    if(type){
      this.data.type = type;
    }else {
      console.log(event);
      this.data.type = event.currentTarget.dataset.type;
    }
    switch (this.data.type) {
      case "abandon":
        this.data.reasons = "放弃理由";
        this.setData({reasons: this.data.reasons})
        break
      case "finished":
        this.data.reasons = "完成了什么";
        this.setData({reasons: this.data.reasons})
        break
    }
    this.setData({visible: true})
  },
  confirm(event) {
    let content = event.detail;
    let aborted;
    if(this.data.type === "abandon"){
      aborted = true;
    }else if(this.data.type === "finished"){
      aborted = false;
    }
    debugger

    http.put(`/tomatoes/${this.data.tomato.id}`, {
      description: content,
      aborted: aborted
    })
      .then(response => {
        wx.reLaunch({ url : '/pages/home/home'})
      })
  },
  cancel() {
    this.setData({ visible: false })
    if(this.data.type === 'abandon'){
      this.startTimer();
    }
  },
  startAgain() {
    this.data.defaultTime = 1500;
    this.startTimer();
    this.setData({again: false})
  },
  onHide() {
    if (this.data.defaultTime) {
      this.stopTimer()
      http.put(`/tomatoes/${this.tomato.id}`, {
        description: "退出放弃",
        aborted: true
      })
    }
  },
  onUnload() {
    if (this.data.defaultTime) {
      this.stopTimer()
      http.put(`/tomatoes/${this.tomato.id}`, {
        description: "退出放弃",
        aborted: true
      })
    }
  },
  onShareAppMessage(){
    return transMit;
  }
});
