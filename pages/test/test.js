// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [1,2,3,4],
    obj: {
      text: '我是text1'
    },
    targ: false
  },
  addItem() {
    this.data.arr.push(this.data.arr[this.data.arr.length-1]+1)
    this.setData({arr: this.data.arr})
    console.log(this.data.arr)
  },
  changeObjText() {
    this.setData({"obj.text1": "我是信息2"})
  },
  changeClass() {
    this.setData({targ: !this.data.targ})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})