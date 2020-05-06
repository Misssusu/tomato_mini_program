import { http } from "../../lib/http.js";
let app = getApp();
const { transMit } = app.globalData;

Page({
  data: {
    historyActive: true,
    tab: 0,
    tomatoes: {},
    todos: {},
    showLogin: false,
    Login: false
  },
  onShow: function () {
    if (wx.getStorageSync('X-token')) {
      this.setData({ Login: true });
    }else {
      this.setData({ Login: false});
    }
    this.fetchTodos()
  },
  login() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  cancelLogin() {
    this.setData({ showLogin: false});
  },
  showPopupMessage() {
    this.setData({ showLogin: true});
  },
  fetchTodos() {//番茄历史
    http.get('/todos',{
      is_group: 'yes'
    })
      .then(response => {
        this.setData({ todos: response.data.resources })
      })
  },
  changeTab(event){
    let type = event.currentTarget.dataset.type;
    switch (type) {
      case '0':
        this.data.tab = 0;
        this.setData({tab: 0});
        break;
      case '1':
        this.data.tab = 1;
        this.setData({tab: 1});
    }
  },
  swiperChange(event){
    let tab = event.detail.current;
    this.setData({tab : tab });
    switch (tab) {
      case 0:
        this.data.tab = 0;
        this.setData({tab: 0});
        break
      case 1:
        this.data.tab = 1;
        this.setData({tab: 1});
        break
    }
  },
  onShareAppMessage(){
    return transMit;
  }
})
