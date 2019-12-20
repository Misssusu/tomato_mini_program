import { http } from "../../lib/http.js";
let app = getApp();
const { transMit } = app.globalData;

Page({
  data: {
    historyActive: true,
    tab: 0,
    tomatoes: {},
    todos: {},
    refreshing: false,
    loadingMore: false
  },
  onShow: function () {
    this.fetchTomatoes()
    this.fetchTodos()
  },
  fetchTomatoes() { //完成的任务
    http.get('/tomatoes', { is_group: "yes" })
      .then(response => {
        console.log(response);
        this.setData({ tomatoes: response.data.resources,refreshing: false,loadingMore: false });
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      })
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
  refreshData(){
    wx.startPullDownRefresh();
    wx.showNavigationBarLoading();
    this.setData({refreshing: true});
    console.log('下拉刷新');
    this.fetchTomatoes();
  },
  // loadMoreData(){
  //   wx.showNavigationBarLoading();
  //   this.setData({loadingMore: true});
  //   console.log('上拉加载');
  //   this.fetchTomatoes();
  // },
  onShareAppMessage(){
    return transMit;
  }
})
