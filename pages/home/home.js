import { http } from '../../lib/http.js';
import { encourageMessage } from '../../lib/encourage';

const app = getApp();
const { transMit } = app.globalData;

Page({
  timer: null,
  updateId: '',
  data: {
    lists: [],
    visibile: false,
    textareaValue: '',
    selectTab: '',
    loading: false,
    tipMessage: '',
    updateVisible: false,
    newsTodo: '',
  },
  onShow() {
    console.log('list');
    this.getLists();
    let num = Math.floor(Math.random() * 10);
    console.log(num);
    this.data.tipMessage = encourageMessage[num];
    this.setData({ tipMessage: this.data.tipMessage });
  },
  getLists() {
    http.get('/todos?completed = false')
      .then((response) => {
        console.log(response.data.resources);
        if (response.data.resources.length > 0) {
          this.data.lists = response.data.resources;
          this.setData({ lists: this.data.lists });
        }
      });
  },
  confirm(event) {
    let value = event.detail;
    console.log(value);
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
    setTimeout(()=>{
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
    },1000)
  },
  //更新
  updateTodo(event) {
    console.log(event);
    this.data.updateVisible = true;
    let { id, index } = event.currentTarget.dataset;
    this.updateId =id;
    let description = this.data.lists[index].description;
    console.log(description);
    this.setData({ updateVisible: true, newsTodo: description});
    console.log(this.data.updateVisible);
  },
  confirmUpdate(event) {
    console.log(event);
    let description = event.detail;
    if (description){
      let description = event.detail;
      http.put(`/todos/${this.updateId}`, {
        description: description
      }).then(res => {
        this.getLists();
        this.setData({ updateVisible: false});
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        })
      })
    }
    this.setData({ updateVisible: false});
  },
  updateCancel() {
    this.setData({ updateVisible: false});
  },
  hidePopup() {
    this.setData({ visibile: false });
  },
  showPopup() {
    this.setData({ visibile: true });
  },
  startWork() {
    wx.navigateTo({
      url: "/pages/works/works"
    })
  },
  onShareAppMessage() {
    return transMit;
  },


  startTimer() {
    this.changeTimer();
    this.timer = setInterval(() => {
      if (this.data.defaultTime <= 0) {
        wx.vibrateLong({});
        this.data.time = '已完成';
        this.setData({ again: true, time: this.data.time });
        this.stopTimer();
        // this.showPopup('event', 'finished');
        return;
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
  // changeStatus() {
  //   console.log(this.data.timerStatus);
  //   if (this.data.timerStatus === '暂停') {
  //     this.setData({ timerStatus: '开始' });
  //     this.stopTimer();
  //   } else if (this.data.timerStatus === '开始') {
  //     this.setData({ timerStatus: '暂停' });
  //     this.startTimer();
  //   }
  // },
  stopTimer() {
    clearInterval(this.timer);
  },
  showAbandonPopup(event, type) {
    console.log(type);
    if (type) {
      this.data.type = type;
    } else {
      console.log(event);
      this.data.type = event.currentTarget.dataset.type;
    }
    this.stopTimer();
    this.data.reasons = '放弃理由';
    this.setData({ reasons: this.data.reasons });
    // switch (this.data.type) {
    //   case 'abandon':
    //     this.stopTimer();
    //     this.data.reasons = '放弃理由';
    //     this.setData({ reasons: this.data.reasons });
    //     break;
    //   case 'finished':
    //     this.data.reasons = '完成了什么';
    //     this.setData({ reasons: this.data.reasons });
    //     break;
    // }
    // this.setData({ visible: true });
  },
  workConfirm(event) {
    let content = event.detail;
    let aborted;
    if (this.data.type === 'abandon') {
      aborted = true;
    } else if (this.data.type === 'finished') {
      aborted = false;
    }

    http.put(`/tomatoes/${this.data.tomato.id}`, {
      description: content,
      aborted: aborted
    })
      .then(response => {
        wx.reLaunch({ url: '/pages/home/home' });
      });
  },
  cancel() {
    this.setData({ visible: false });
    if (this.data.type === 'abandon') {
      this.startTimer();
    }
  }
});
