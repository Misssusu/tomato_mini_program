Component({
  properties: {
    popUpMessage: {
      type: String,
      value: ""
    },
    placeholder: {
      type: String,
      value: ""
    }
  },
  data: {
    value: ""
  },
  methods: {
    confirm() {
      this.triggerEvent('confirm',this.data.value)
    },
    cancel() {
      this.triggerEvent('cancel')
    },
    changeValue(event) {
      this.data.value = event.detail.value;
    }
  }
})