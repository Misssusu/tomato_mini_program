Component({
  properties: {
    text: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'default'
    },
    size: {
      type: String,
      value: ''
    }
  },
  methods: {
    showPopup() {
      console.log('click clock');
      this.triggerEvent('showPopup');
    }
  }
});