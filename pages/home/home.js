import { http } from "../../lib/http.js";

Page({
  data: {
    visibile: false,
    textareaValue: "",
    selectTab: ''
  },
  onShow() {
    this.getLists();
  },
  getLists() {
    http.get('/todos?completed = false')
      .then((response)=>{
        console.log(response.data.resources);
        if(response.data.resources.length > 0){
          this.data.lists = response.data.resources;
          this.setData({lists: this.data.lists})
        }
      })
  },
  confirm(event) {
    console.log(event.detail);
    let value = event.detail;
    console.log(value);
    if(value) {
      http.post('/todos',{
          completed: false,
          description: value
      })
        .then((response)=>{
          console.log(response);
          let todo = [response.data.resource]
          this.data.lists = todo.concat(this.data.lists)
          this.setData({ lists: this.data.lists })
          this.hidePopup()
        })
    }
  },
  //删除
  completedTodo(event){
    let { id, index } = event.currentTarget.dataset;
    this.setData({ selectTab : id});
    http.put(`/todos/${id}`, {
      completed: true
    }).then(res => {
      let updateTodo = res.data.resource
      this.data.lists[index] = updateTodo
      this.setData({ lists: this.data.lists })
      this.setData({selectTab : ''})
      wx.showToast({
        title: '确认完成',
        icon: 'success',
        duration: 1000
      })
    })
  },
  hidePopup() {
    this.setData({ visibile: false })
  },
  showPopup() {
    this.setData({ visibile: true})
  },
  startWork() {
    wx.navigateTo({
      url: "/pages/works/works"
    })
  }
})
