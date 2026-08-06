Page({
  data: {
    todayCard: null,
    isFlipped: false,
    isLoading: true
  },

  onShow() {
    this.loadTodayFlashcard();
    // 每次切回页面时重置翻转状态
    this.setData({ isFlipped: false });
  },

  loadTodayFlashcard() {
    if (!wx.cloud) return;
    const db = wx.cloud.database();
    
    // 获取严格的 YYYY-MM-DD 格式，与任务区保持一致
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`; 

    this.setData({ isLoading: true });

    db.collection('flashcards').where({
      date: dateStr
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({ todayCard: res.data[0], isLoading: false });
      } else {
        this.setData({ todayCard: null, isLoading: false });
      }
    }).catch(err => {
      console.error("加载闪卡失败", err);
      this.setData({ isLoading: false });
    });
  },

  flipCard() {
    if (!this.data.todayCard) return;
    this.setData({
      isFlipped: !this.data.isFlipped
    });
  }
});