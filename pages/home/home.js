Page({
  data: {
    visibile: false,
    textareaValue: "",
    lists: [
      { id: 1, text: "这是第一条", finished: true },
      { id: 2, text: "这是第二条", finished: false },
      { id: 3, text: "这是第三条", finished: true },
      { id: 4, text: "这是第四条", finished: false },
      { id: 5, text: "这是第五条", finished: false }
    ]
  },
  onShow() {
    // this.getLists();
  },
  getLists() {
    wx.request({
      url: "https://gp-server.hunger-valley.com/todos?completed = false",
      method: 'GET',
      header: {
        "t-app-id": "wx002c39c0187e860e",
        "t-app-secret": "490f0375bea23fe0dcbf787f27c2c904"
      },
      dataType:'json',
      success(response) {
        console.log(response);

      }
    })
  },
  confirm(event) {
    console.log(event.detail);
    let value = event.detail;
    if(value) {
      let newItem = { id: this.data.lists.length+1, text: value, finished: false};
      this.data.lists.push(newItem);
      this.setData(({ lists: this.data.lists }))
    }
    this.setData({ visibile: false })
  },
  cancel() {
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