const app = getApp();

Page({
  data: {
    todayTask: null,
    passwordInput: '',
    myBadges: [],
    isCheckingIn: false // 用于控制打卡按钮的防抖和加载状态
  },

  onShow() {
    this.loadTodayTask();
    this.loadMyBadges();
  },

  // 1. 加载今日任务（强制补零，保证日期格式严丝合缝）
  loadTodayTask() {
    if (!wx.cloud) return;
    const db = wx.cloud.database();
    
    // 获取今天准确的 YYYY-MM-DD 格式
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`; 

    db.collection('tasks').where({
      date: dateStr
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({ todayTask: res.data[0] });
      } else {
        this.setData({ todayTask: null });
      }
    }).catch(err => console.error("加载任务失败", err));
  },

  // 2. 加载徽章逻辑（引入比对点亮机制）
  loadMyBadges() {
    if (!wx.cloud) return;
    wx.cloud.callFunction({
      name: 'getMyBadges'
    }).then(res => {
      const acquiredBadges = res.result.data || [];
      
      // 定义好所有的 3 枚徽章框架
      let allBadgesData = [
        { id: 'b1', name: '初见AI', emoji: '🌟', owned: false },
        { id: 'b2', name: '坚持达人', emoji: '🔥', owned: false },
        { id: 'b3', name: '科技之星', emoji: '🔭', owned: false }
      ];

      // 遍历比对，如果你有这个徽章，就把 owned 变成 true
      allBadgesData = allBadgesData.map(badge => {
        const hasIt = acquiredBadges.some(b => b.name === badge.name);
        return { ...badge, owned: hasIt };
      });

      this.setData({ myBadges: allBadgesData });
    }).catch(err => console.error("获取徽章失败", err));
  },

  // 3. 监听口令输入
  onInput(e) {
    this.setData({
      passwordInput: e.detail.value
    });
  },

  // 4. 提交打卡
  submitCheckin() {
    if (!this.data.todayTask) {
      wx.showToast({ title: '今日暂无任务', icon: 'none' });
      return;
    }
    if (!this.data.passwordInput) {
      wx.showToast({ title: '请输入口令', icon: 'none' });
      return;
    }

    // 开启按钮 loading 状态，防止连点
    this.setData({ isCheckingIn: true });

    wx.cloud.callFunction({
      name: 'checkin',
      data: {
        taskId: this.data.todayTask._id,
        password: this.data.passwordInput
      }
    }).then(res => {
      this.setData({ isCheckingIn: false });
      
      if (res.result.code === 0) {
        // 打卡成功
        wx.showToast({ title: '打卡成功！', icon: 'success' });
        
        // 清空输入框
        this.setData({ passwordInput: '' });

        // 如果云端下发了新徽章，弹出巨大的惊喜提示！
        if (res.result.newBadge) {
          wx.showModal({
            title: '🎉 恭喜获得新徽章',
            content: `您获得了「${res.result.newBadge.name}」徽章！`,
            showCancel: false
          });
          // 刷新本地的徽章列表让它亮起来
          this.loadMyBadges();
        }
      } else {
        // 报错提示（例如口令错误、已打过卡）
        wx.showToast({ title: res.result.msg, icon: 'none', duration: 2000 });
      }
    }).catch(err => {
      this.setData({ isCheckingIn: false });
      wx.showToast({ title: '网络异常，请重试', icon: 'none' });
      console.error("打卡异常", err);
    });
  }
});