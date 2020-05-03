Component({
  properties: {},
  methods: {
    confirm() {
      this.triggerEvent('confirm',this.data.value);
    },
    cancel() {
      this.triggerEvent('cancel')
    }
  }
})
