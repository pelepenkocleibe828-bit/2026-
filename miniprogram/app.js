App({
  onLaunch() {
    wx.cloud.init({
      env: 'cloud1-d2g29vmhce6c05fd1', // 确保这是你真实的云环境ID
      traceUser: true
    });
    this.getOpenId();
  },
  getOpenId() {
    wx.cloud.callFunction({
      name: 'getOpenId',
      success: res => {
        this.globalData.openid = res.result.openid;
        this.globalData.isAdmin = false;
        wx.cloud.callFunction({
          name: 'adminCheck',
          success: checkRes => {
            this.globalData.isAdmin = checkRes.result.isAdmin;
          }
        });
      },
      fail: err => {
        console.error('获取OpenId失败', err);
      }
    });
  },
  globalData: {
    openid: '',
    isAdmin: false
  }
});