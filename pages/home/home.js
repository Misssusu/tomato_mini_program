import { http } from '../../lib/http.js';

const app = getApp();
const { transMit } = app.globalData;

Page({
  timer: null,
  updateId: '',
  data: {
    lists: [],
    visibile: false,
    selectTab: '',
    loading: false,
    tipMessage: '',
    updateVisible: false,
    newsTodo: '',
  },
  onShow() {
    this.getLists();
    this.setData({ tipMessage: this.data.tipMessage });
  },
  getLists() {
    http.get('/todos?completed = false')
      .then((response) => {
        if (response.data.resources.length > 0) {
          this.data.lists = response.data.resources;
          this.setData({ lists: this.data.lists });
        }
      });
  },
  confirm(event) {
    let value = event.detail;
    if (value) {
      this.setData({ loading: true });
      http.post('/todos', {
        completed: false,
        description: value
      })
        .then((response) => {
          let todo = [response.data.resource];
          this.data.lists = todo.concat(this.data.lists);
          this.setData({ lists: this.data.lists, loading: false });
          this.hidePopup();
        });
    }
  },
  //删除
  completedTodo(event) {
    let { id, index } = event.currentTarget.dataset;
    this.setData({ selectTab: id });
    setTimeout(() => {
      http.put(`/todos/${id}`, {
        completed: true
      }).then(res => {
        // console.log(res.data.resource);
        let updateTodo = res.data.resource;
        this.data.lists[index] = updateTodo;
        this.setData({ lists: this.data.lists });
        this.setData({ selectTab: '' });
        wx.showToast({
          title: '确认完成',
          icon: 'success',
          duration: 1000
        });
      });
    }, 1000);
  },
  //更新
  updateTodo(event) {
    this.data.updateVisible = true;
    let { id, index } = event.currentTarget.dataset;
    this.updateId = id;
    let description = this.data.lists[index].description;
    console.log(description);
    this.setData({ updateVisible: true, newsTodo: description });
    console.log(this.data.updateVisible);
  },
  confirmUpdate(event) {
    console.log(event);
    let description = event.detail;
    if (description) {
      let description = event.detail;
      http.put(`/todos/${this.updateId}`, {
        description: description
      }).then(res => {
        this.getLists();
        this.setData({ updateVisible: false });
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        });
      });
    }
    this.setData({ updateVisible: false });
  },
  updateCancel() {
    this.setData({ updateVisible: false });
  },
  hidePopup() {
    this.setData({ visibile: false });
  },
  showPopup() {
    this.setData({ visibile: true });
  },
  startWork() {
    wx.navigateTo({
      url: '/pages/works/works'
    });
  },
  onShareAppMessage() {
    return transMit;
  }
});
