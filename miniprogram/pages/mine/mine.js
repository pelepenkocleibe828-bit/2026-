const app = getApp();

Page({
  data: {
    isAdmin: false,
    joinDays: 1, // 陪伴天数，目前演示写死为1
    checkinCount: 0,
    badgeCount: 0,
    allBadges: []
  },

  onShow() {
    this.checkAdmin();
    this.loadUserData();
  },

  checkAdmin() {
    // 检查是否为管理员
    this.setData({ isAdmin: app.globalData.isAdmin });
  },

  // 👇 这里是我们刚才对接了云端的完整获取数据逻辑
  loadUserData() {
    const db = wx.cloud.database();
    
    // 如果还没获取到 openid，延迟 0.5 秒后再试
    if (!app.globalData.openid) {
       setTimeout(() => this.loadUserData(), 500);
       return;
    }

    // 1. 获取真实累计打卡天数
    db.collection('checkins').where({
      _openid: app.globalData.openid
    }).count().then(res => {
      this.setData({ checkinCount: res.total });
    }).catch(err => console.error("获取打卡天数失败", err));

    // 2. 调用刚刚部署的云函数获取真实徽章
    wx.cloud.callFunction({
      name: 'getMyBadges'
    }).then(res => {
      const myBadges = res.result.data || [];
      this.setData({ badgeCount: myBadges.length });
      
      // 我们定义好所有的 3 枚徽章框架
      let allBadgesData = [
        { id: 'b1', name: '初见AI', emoji: '🌟', owned: false },
        { id: 'b2', name: '坚持达人', emoji: '🔥', owned: false },
        { id: 'b3', name: '科技之星', emoji: '🔭', owned: false }
      ];

      // 遍历比对，如果你有这个徽章，就把 owned 变成 true，让它在界面上亮起来
      allBadgesData = allBadgesData.map(badge => {
        const hasIt = myBadges.some(b => b.name === badge.name);
        return { ...badge, owned: hasIt };
      });

      this.setData({ allBadges: allBadgesData });

    }).catch(err => console.error("获取徽章失败", err));
  },

  goToAdmin() {
    wx.navigateTo({
      url: '/pages/admin/admin',
    });
  }
});