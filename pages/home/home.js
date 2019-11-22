import { http } from "../../lib/http.js";

Page({
  data: {
    visibile: false,
    textareaValue: ""
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