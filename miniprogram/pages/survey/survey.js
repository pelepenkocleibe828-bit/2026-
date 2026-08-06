Page({
  data: {
    showModal: false,
    modalTitle: '',
    qrCodeUrl: ''
  },

  showStudentQR() {
    this.setData({
      showModal: true,
      modalTitle: '📝 学生问卷',
      // 直接指向你刚放进去的本地图片
      qrCodeUrl: '/images/student-qr.jpg' 
    });
  },

  showParentQR() {
    this.setData({
      showModal: true,
      modalTitle: '👨‍👩‍👧 家长问卷',
      // 直接指向你刚放进去的本地图片
      qrCodeUrl: '/images/parent-qr.jpg'
    });
  },

  closeModal() {
    this.setData({
      showModal: false
    });
  },

  preventClose() {
    // 阻止事件冒泡
  }
});