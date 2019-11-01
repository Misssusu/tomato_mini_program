Page({
  data: {
    visibile: false,
    textareaValue: ""
  },
  confirm(event) {
    console.log(event.detail)
    this.setData({ visibile: false })
  },
  cancel() {
    this.setData({ visibile: false })
  }
})